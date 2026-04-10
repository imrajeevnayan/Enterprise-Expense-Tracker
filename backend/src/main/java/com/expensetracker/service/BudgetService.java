package com.expensetracker.service;

import com.expensetracker.dto.request.BudgetRequest;
import com.expensetracker.dto.response.BudgetResponse;
import com.expensetracker.entity.User;
import java.util.List;

public interface BudgetService {
    BudgetResponse createBudget(BudgetRequest request, User user);
    BudgetResponse updateBudget(Long id, BudgetRequest request, User user);
    void deleteBudget(Long id, User user);
    List<BudgetResponse> getBudgets(User user, Integer month, Integer year);
    BudgetResponse getBudget(Long id, User user);
}
