package com.expensetracker.controller;

import com.expensetracker.dto.request.TransactionRequest;
import com.expensetracker.dto.response.TransactionResponse;
import com.expensetracker.entity.User;
import com.expensetracker.repository.UserRepository;
import com.expensetracker.service.TransactionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/transactions")
@Tag(name = "Transactions", description = "Endpoints for managing financial transactions (income and expenses)")
@SecurityRequirement(name = "bearerAuth")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    @Operation(summary = "Create a new transaction", description = "Adds a new income or expense record to the user's account")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Transaction created successfully", 
            content = @Content(schema = @Schema(implementation = TransactionResponse.class))),
        @ApiResponse(responseCode = "400", description = "Invalid input data", content = @Content),
        @ApiResponse(responseCode = "403", description = "Forbidden - JWT required", content = @Content)
    })
    public ResponseEntity<TransactionResponse> createTransaction(
            @Valid @RequestBody TransactionRequest request, 
            @Parameter(hidden = true) Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName()).get();
        return ResponseEntity.ok(transactionService.createTransaction(request, user));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing transaction", description = "Modifies an existing transaction record by its ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Transaction updated successfully"),
        @ApiResponse(responseCode = "404", description = "Transaction not found"),
        @ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    public ResponseEntity<TransactionResponse> updateTransaction(
            @Parameter(description = "ID of the transaction to update") @PathVariable Long id, 
            @Valid @RequestBody TransactionRequest request, 
            @Parameter(hidden = true) Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName()).get();
        return ResponseEntity.ok(transactionService.updateTransaction(id, request, user));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a transaction", description = "Permanently removes a transaction record from the database")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Transaction deleted successfully"),
        @ApiResponse(responseCode = "404", description = "Transaction not found")
    })
    public ResponseEntity<Void> deleteTransaction(
            @Parameter(description = "ID of the transaction to delete") @PathVariable Long id, 
            @Parameter(hidden = true) Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName()).get();
        transactionService.deleteTransaction(id, user);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    @Operation(summary = "Get all transactions", description = "Retrieves a paginated list of all transactions for the authenticated user")
    public ResponseEntity<Page<TransactionResponse>> getTransactions(
            @PageableDefault(size = 10) Pageable pageable, 
            @Parameter(hidden = true) Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName()).get();
        return ResponseEntity.ok(transactionService.getTransactions(user, pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get transaction details", description = "Retrieves details of a specific transaction by its ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Details found"),
        @ApiResponse(responseCode = "404", description = "Transaction not found")
    })
    public ResponseEntity<TransactionResponse> getTransaction(
            @Parameter(description = "ID of the transaction to retrieve") @PathVariable Long id, 
            @Parameter(hidden = true) Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName()).get();
        return ResponseEntity.ok(transactionService.getTransaction(id, user));
    }
}
