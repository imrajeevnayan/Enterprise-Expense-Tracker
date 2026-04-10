package com.expensetracker.service;

import com.expensetracker.dto.request.TransactionRequest;
import com.expensetracker.dto.response.TransactionResponse;
import com.expensetracker.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface TransactionService {
    TransactionResponse createTransaction(TransactionRequest request, User user);
    TransactionResponse updateTransaction(Long id, TransactionRequest request, User user);
    void deleteTransaction(Long id, User user);
    Page<TransactionResponse> getTransactions(User user, Pageable pageable);
    TransactionResponse getTransaction(Long id, User user);
}
