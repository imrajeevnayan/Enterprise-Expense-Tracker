package com.expensetracker.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "categories")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionType type;

    private String icon;

    private boolean isDefault = false;

    public Category() {}

    public Category(Long id, String name, TransactionType type, String icon, boolean isDefault) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.icon = icon;
        this.isDefault = isDefault;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public TransactionType getType() { return type; }
    public void setType(TransactionType type) { this.type = type; }
    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }
    public boolean isDefault() { return isDefault; }
    public void setDefault(boolean isDefault) { this.isDefault = isDefault; }

    public static class CategoryBuilder {
        private Long id;
        private String name;
        private TransactionType type;
        private String icon;
        private boolean isDefault = false;

        public CategoryBuilder id(Long id) { this.id = id; return this; }
        public CategoryBuilder name(String name) { this.name = name; return this; }
        public CategoryBuilder type(TransactionType type) { this.type = type; return this; }
        public CategoryBuilder icon(String icon) { this.icon = icon; return this; }
        public CategoryBuilder isDefault(boolean isDefault) { this.isDefault = isDefault; return this; }
        public Category build() { return new Category(id, name, type, icon, isDefault); }
    }

    public static CategoryBuilder builder() { return new CategoryBuilder(); }
}
