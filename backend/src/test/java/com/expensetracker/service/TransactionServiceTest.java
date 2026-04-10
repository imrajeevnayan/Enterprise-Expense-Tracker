package com.expensetracker.service;

import com.expensetracker.dto.request.TransactionRequest;
import com.expensetracker.dto.response.TransactionResponse;
import com.expensetracker.entity.Category;
import com.expensetracker.entity.Transaction;
import com.expensetracker.entity.User;
import com.expensetracker.mapper.TransactionMapper;
import com.expensetracker.repository.CategoryRepository;
import com.expensetracker.repository.TransactionRepository;
import com.expensetracker.service.impl.TransactionServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class TransactionServiceTest {

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private TransactionMapper transactionMapper;

    @InjectMocks
    private TransactionServiceImpl transactionService;

    private User user;
    private Category category;
    private TransactionRequest request;
    private Transaction transaction;

    @BeforeEach
    void setUp() {
        user = User.builder().id(1L).email("test@example.com").build();
        category = Category.builder().id(1L).name("Food").build();
        
        request = new TransactionRequest();
        request.setCategoryId(1L);
        request.setAmount(new BigDecimal("100.00"));
        request.setTransactionDate(LocalDate.now());

        transaction = Transaction.builder()
                .id(1L)
                .user(user)
                .category(category)
                .amount(new BigDecimal("100.00"))
                .build();
    }

    @Test
    void createTransaction_ShouldReturnResponse() {
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(transactionMapper.toEntity(any())).thenReturn(transaction);
        when(transactionRepository.save(any())).thenReturn(transaction);
        when(transactionMapper.toResponse(any())).thenReturn(new TransactionResponse());

        TransactionResponse result = transactionService.createTransaction(request, user);

        assertNotNull(result);
        verify(transactionRepository, times(1)).save(any());
    }

    @Test
    void getTransaction_WhenAuthorized_ShouldReturnResponse() {
        when(transactionRepository.findById(1L)).thenReturn(Optional.of(transaction));
        when(transactionMapper.toResponse(any())).thenReturn(new TransactionResponse());

        TransactionResponse result = transactionService.getTransaction(1L, user);

        assertNotNull(result);
    }

    @Test
    void getTransaction_WhenNotAuthorized_ShouldThrowException() {
        User anotherUser = User.builder().id(2L).build();
        when(transactionRepository.findById(1L)).thenReturn(Optional.of(transaction));

        assertThrows(org.springframework.security.access.AccessDeniedException.class, 
            () -> transactionService.getTransaction(1L, anotherUser));
    }
}
