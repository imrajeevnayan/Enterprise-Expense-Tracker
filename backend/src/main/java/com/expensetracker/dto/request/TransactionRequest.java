package com.expensetracker.dto.request;

import com.expensetracker.entity.TransactionType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.time.LocalDate;

public class TransactionRequest {
    @NotNull
    private Long categoryId;
    @NotNull @Positive
    private BigDecimal amount;
    private String description;
    @NotNull
    private LocalDate transactionDate;
    @NotNull
    private TransactionType type;

    public TransactionRequest() {}
    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public LocalDate getTransactionDate() { return transactionDate; }
    public void setTransactionDate(LocalDate transactionDate) { this.transactionDate = transactionDate; }
    public TransactionType getType() { return type; }
    public void setType(TransactionType type) { this.type = type; }
}
