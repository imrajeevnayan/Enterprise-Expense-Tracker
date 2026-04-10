package com.expensetracker.controller;

import com.expensetracker.dto.request.BudgetRequest;
import com.expensetracker.dto.response.BudgetResponse;
import com.expensetracker.entity.User;
import com.expensetracker.repository.UserRepository;
import com.expensetracker.service.BudgetService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/budgets")
@Tag(name = "Budgets", description = "Manage user category budgets")
public class BudgetController {

    @Autowired
    private BudgetService budgetService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    @Operation(summary = "Set a budget for a category")
    public ResponseEntity<BudgetResponse> createBudget(@Valid @RequestBody BudgetRequest request, Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName()).get();
        return ResponseEntity.ok(budgetService.createBudget(request, user));
    }

    @GetMapping
    @Operation(summary = "Get budgets for a specific month and year")
    public ResponseEntity<List<BudgetResponse>> getBudgets(
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year,
            Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName()).get();
        if (month == null) month = LocalDate.now().getMonthValue();
        if (year == null) year = LocalDate.now().getYear();
        return ResponseEntity.ok(budgetService.getBudgets(user, month, year));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update budget limit")
    public ResponseEntity<BudgetResponse> updateBudget(
            @PathVariable Long id, @Valid @RequestBody BudgetRequest request, Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName()).get();
        return ResponseEntity.ok(budgetService.updateBudget(id, request, user));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a budget")
    public ResponseEntity<Void> deleteBudget(@PathVariable Long id, Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName()).get();
        budgetService.deleteBudget(id, user);
        return ResponseEntity.noContent().build();
    }
}
