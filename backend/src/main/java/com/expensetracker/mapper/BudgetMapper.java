package com.expensetracker.mapper;

import com.expensetracker.dto.request.BudgetRequest;
import com.expensetracker.dto.response.BudgetResponse;
import com.expensetracker.entity.Budget;
import org.springframework.stereotype.Component;

@Component
public class BudgetMapper {
    public BudgetResponse toResponse(Budget budget) {
        if (budget == null) return null;
        BudgetResponse response = new BudgetResponse();
        response.setId(budget.getId());
        response.setCategoryName(budget.getCategory() != null ? budget.getCategory().getName() : null);
        response.setLimitAmount(budget.getLimitAmount());
        response.setMonth(budget.getMonth());
        response.setYear(budget.getYear());
        return response;
    }

    public Budget toEntity(BudgetRequest request) {
        if (request == null) return null;
        return Budget.builder()
                .limitAmount(request.getLimitAmount())
                .month(request.getMonth())
                .year(request.getYear())
                .build();
    }
}
