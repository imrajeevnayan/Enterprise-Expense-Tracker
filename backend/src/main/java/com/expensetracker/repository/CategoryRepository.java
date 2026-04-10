package com.expensetracker.repository;

import com.expensetracker.entity.Category;
import com.expensetracker.entity.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findByType(TransactionType type);
    boolean existsByName(String name);
}
