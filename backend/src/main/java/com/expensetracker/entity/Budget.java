package com.expensetracker.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "budgets")
public class Budget {

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
    private BigDecimal limitAmount;

    @Column(nullable = false)
    private Integer month;

    @Column(nullable = false)
    private Integer year;

    public Budget() {}

    public Budget(Long id, User user, Category category, BigDecimal limitAmount, Integer month, Integer year) {
        this.id = id;
        this.user = user;
        this.category = category;
        this.limitAmount = limitAmount;
        this.month = month;
        this.year = year;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }
    public BigDecimal getLimitAmount() { return limitAmount; }
    public void setLimitAmount(BigDecimal limitAmount) { this.limitAmount = limitAmount; }
    public Integer getMonth() { return month; }
    public void setMonth(Integer month) { this.month = month; }
    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }

    public static class BudgetBuilder {
        private Long id;
        private User user;
        private Category category;
        private BigDecimal limitAmount;
        private Integer month;
        private Integer year;

        public BudgetBuilder id(Long id) { this.id = id; return this; }
        public BudgetBuilder user(User user) { this.user = user; return this; }
        public BudgetBuilder category(Category category) { this.category = category; return this; }
        public BudgetBuilder limitAmount(BigDecimal limitAmount) { this.limitAmount = limitAmount; return this; }
        public BudgetBuilder month(Integer month) { this.month = month; return this; }
        public BudgetBuilder year(Integer year) { this.year = year; return this; }
        public Budget build() { return new Budget(id, user, category, limitAmount, month, year); }
    }

    public static BudgetBuilder builder() { return new BudgetBuilder(); }
}
