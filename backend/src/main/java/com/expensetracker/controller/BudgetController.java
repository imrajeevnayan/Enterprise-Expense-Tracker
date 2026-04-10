package com.expensetracker.controller;

import com.expensetracker.dto.request.BudgetRequest;
import com.expensetracker.dto.response.BudgetResponse;
import com.expensetracker.entity.User;
import com.expensetracker.repository.UserRepository;
import com.expensetracker.service.BudgetService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
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
@Tag(name = "Budgets", description = "Endpoints for setting and monitoring category-wise monthly budgets")
@SecurityRequirement(name = "bearerAuth")
public class BudgetController {

    @Autowired
    private BudgetService budgetService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    @Operation(summary = "Set a new budget", description = "Defines a spending limit for a specific category and month")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Budget set successfully"),
        @ApiResponse(responseCode = "409", description = "Budget already exists for this category/month")
    })
    public ResponseEntity<BudgetResponse> createBudget(
            @Valid @RequestBody BudgetRequest request, 
            @Parameter(hidden = true) Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName()).get();
        return ResponseEntity.ok(budgetService.createBudget(request, user));
    }

    @GetMapping
    @Operation(summary = "Fetch active budgets", description = "Retrieves all budgets for the specified month and year. Defaults to the current month.")
    public ResponseEntity<List<BudgetResponse>> getBudgets(
            @Parameter(description = "Month (1-12)") @RequestParam(required = false) Integer month,
            @Parameter(description = "Full Year (e.g., 2026)") @RequestParam(required = false) Integer year,
            @Parameter(hidden = true) Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName()).get();
        if (month == null) month = LocalDate.now().getMonthValue();
        if (year == null) year = LocalDate.now().getYear();
        return ResponseEntity.ok(budgetService.getBudgets(user, month, year));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update budget limit", description = "Updates the spending limit for an existing budget record")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Budget updated"),
        @ApiResponse(responseCode = "404", description = "Budget not found")
    })
    public ResponseEntity<BudgetResponse> updateBudget(
            @Parameter(description = "ID of the budget to update") @PathVariable Long id, 
            @Valid @RequestBody BudgetRequest request, 
            @Parameter(hidden = true) Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName()).get();
        return ResponseEntity.ok(budgetService.updateBudget(id, request, user));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Remove a budget", description = "Deletes a budget and stops monitoring for that category")
    @ApiResponse(responseCode = "204", description = "Budget removed")
    public ResponseEntity<Void> deleteBudget(
            @Parameter(description = "ID of the budget to delete") @PathVariable Long id, 
            @Parameter(hidden = true) Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName()).get();
        budgetService.deleteBudget(id, user);
        return ResponseEntity.noContent().build();
    }
}
