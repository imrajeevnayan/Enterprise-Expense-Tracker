package com.expensetracker.config;

import com.expensetracker.entity.Category;
import com.expensetracker.entity.TransactionType;
import com.expensetracker.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public void run(String... args) {
        if (categoryRepository.count() == 0) {
            Arrays.asList(
                Category.builder().name("Food").type(TransactionType.EXPENSE).icon("🍔").isDefault(true).build(),
                Category.builder().name("Transport").type(TransactionType.EXPENSE).icon("🚗").isDefault(true).build(),
                Category.builder().name("Salary").type(TransactionType.INCOME).icon("💰").isDefault(true).build(),
                Category.builder().name("Shopping").type(TransactionType.EXPENSE).icon("🛍️").isDefault(true).build(),
                Category.builder().name("Entertainment").type(TransactionType.EXPENSE).icon("🎬").isDefault(true).build()
            ).forEach(categoryRepository::save);
        }
    }
}
