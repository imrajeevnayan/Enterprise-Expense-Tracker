package com.expensetracker.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(nullable = false)
    private BigDecimal amount;

    private String description;

    @Column(nullable = false)
    private LocalDate transactionDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionType type;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    public Transaction() {}

    public Transaction(Long id, User user, Category category, BigDecimal amount, String description, LocalDate transactionDate, TransactionType type) {
        this.id = id;
        this.user = user;
        this.category = category;
        this.amount = amount;
        this.description = description;
        this.transactionDate = transactionDate;
        this.type = type;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public LocalDate getTransactionDate() { return transactionDate; }
    public void setTransactionDate(LocalDate transactionDate) { this.transactionDate = transactionDate; }
    public TransactionType getType() { return type; }
    public void setType(TransactionType type) { this.type = type; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public static class TransactionBuilder {
        private Long id;
        private User user;
        private Category category;
        private BigDecimal amount;
        private String description;
        private LocalDate transactionDate;
        private TransactionType type;

        public TransactionBuilder id(Long id) { this.id = id; return this; }
        public TransactionBuilder user(User user) { this.user = user; return this; }
        public TransactionBuilder category(Category category) { this.category = category; return this; }
        public TransactionBuilder amount(BigDecimal amount) { this.amount = amount; return this; }
        public TransactionBuilder description(String description) { this.description = description; return this; }
        public TransactionBuilder transactionDate(LocalDate transactionDate) { this.transactionDate = transactionDate; return this; }
        public TransactionBuilder type(TransactionType type) { this.type = type; return this; }
        public Transaction build() { return new Transaction(id, user, category, amount, description, transactionDate, type); }
    }

    public static TransactionBuilder builder() { return new TransactionBuilder(); }
}
