package com.expensetracker.service.impl;

import com.expensetracker.dto.request.BudgetRequest;
import com.expensetracker.dto.response.BudgetResponse;
import com.expensetracker.entity.Budget;
import com.expensetracker.entity.Category;
import com.expensetracker.entity.User;
import com.expensetracker.exception.DuplicateBudgetException;
import com.expensetracker.exception.ResourceNotFoundException;
import com.expensetracker.mapper.BudgetMapper;
import com.expensetracker.repository.BudgetRepository;
import com.expensetracker.repository.CategoryRepository;
import com.expensetracker.repository.TransactionRepository;
import com.expensetracker.service.BudgetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BudgetServiceImpl implements BudgetService {

    @Autowired
    private BudgetRepository budgetRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private BudgetMapper budgetMapper;

    @Override
    @Transactional
    public BudgetResponse createBudget(BudgetRequest request, User user) {
        budgetRepository.findByUserIdAndCategoryIdAndMonthAndYear(user.getId(), request.getCategoryId(), request.getMonth(), request.getYear())
                .ifPresent(b -> { throw new DuplicateBudgetException("Budget already exists for this category and period"); });

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        Budget budget = budgetMapper.toEntity(request);
        budget.setUser(user);
        budget.setCategory(category);

        budget = budgetRepository.save(budget);
        return mapToResponseWithSpending(budget, user.getId());
    }

    @Override
    @Transactional
    public BudgetResponse updateBudget(Long id, BudgetRequest request, User user) {
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found"));

        if (!budget.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("Unauthorized access to budget");
        }

        budget.setLimitAmount(request.getLimitAmount());
        budget = budgetRepository.save(budget);
        return mapToResponseWithSpending(budget, user.getId());
    }

    @Override
    @Transactional
    @CacheEvict(value = "monthlyReports", allEntries = true)
    public void deleteBudget(Long id, User user) {
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found"));

        if (!budget.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("Unauthorized access to budget");
        }

        budgetRepository.delete(budget);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BudgetResponse> getBudgets(User user, Integer month, Integer year) {
        return budgetRepository.findByUserIdAndMonthAndYear(user.getId(), month, year)
                .stream()
                .map(b -> mapToResponseWithSpending(b, user.getId()))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public BudgetResponse getBudget(Long id, User user) {
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found"));

        if (!budget.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("Unauthorized access to budget");
        }

        return mapToResponseWithSpending(budget, user.getId());
    }

    private BudgetResponse mapToResponseWithSpending(Budget budget, Long userId) {
        BudgetResponse response = budgetMapper.toResponse(budget);
        
        LocalDate start = LocalDate.of(budget.getYear(), budget.getMonth(), 1);
        LocalDate end = start.withDayOfMonth(start.lengthOfMonth());
        
        BigDecimal spending = transactionRepository.sumAmountByUserIdAndCategoryIdAndDateBetween(
                userId, budget.getCategory().getId(), start, end);
        
        response.setCurrentSpending(spending != null ? spending : BigDecimal.ZERO);
        return response;
    }
}
