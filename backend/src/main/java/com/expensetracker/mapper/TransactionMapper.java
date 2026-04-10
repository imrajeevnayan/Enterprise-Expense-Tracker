package com.expensetracker.mapper;

import com.expensetracker.dto.request.TransactionRequest;
import com.expensetracker.dto.response.TransactionResponse;
import com.expensetracker.entity.Transaction;
import org.springframework.stereotype.Component;

@Component
public class TransactionMapper {
    public TransactionResponse toResponse(Transaction transaction) {
        if (transaction == null) return null;
        TransactionResponse response = new TransactionResponse();
        response.setId(transaction.getId());
        response.setCategoryId(transaction.getCategory() != null ? transaction.getCategory().getId() : null);
        response.setCategoryName(transaction.getCategory() != null ? transaction.getCategory().getName() : null);
        response.setAmount(transaction.getAmount());
        response.setDescription(transaction.getDescription());
        response.setTransactionDate(transaction.getTransactionDate());
        response.setType(transaction.getType());
        return response;
    }

    public Transaction toEntity(TransactionRequest request) {
        if (request == null) return null;
        return Transaction.builder()
                .amount(request.getAmount())
                .description(request.getDescription())
                .transactionDate(request.getTransactionDate())
                .type(request.getType())
                .build();
    }
}
