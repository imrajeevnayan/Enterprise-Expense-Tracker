package com.expensetracker.service.impl;

import com.expensetracker.entity.Category;
import com.expensetracker.exception.ResourceNotFoundException;
import com.expensetracker.repository.CategoryRepository;
import com.expensetracker.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    @Override
    public Category getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
    }

    @Override
    public Category createCategory(Category category) {
        return categoryRepository.findByName(category.getName())
                .orElseGet(() -> categoryRepository.save(category));
    }
}
