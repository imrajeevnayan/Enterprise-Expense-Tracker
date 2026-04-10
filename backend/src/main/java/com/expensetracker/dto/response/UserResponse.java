package com.expensetracker.dto.response;

public class UserResponse {
    private Long id;
    private String name;
    private String email;
    private String currency;

    public UserResponse() {}
    public UserResponse(Long id, String name, String email, String currency) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.currency = currency;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public static class UserResponseBuilder {
        private Long id;
        private String name;
        private String email;
        private String currency;
        public UserResponseBuilder id(Long id) { this.id = id; return this; }
        public UserResponseBuilder name(String name) { this.name = name; return this; }
        public UserResponseBuilder email(String email) { this.email = email; return this; }
        public UserResponseBuilder currency(String currency) { this.currency = currency; return this; }
        public UserResponse build() { return new UserResponse(id, name, email, currency); }
    }
    public static UserResponseBuilder builder() { return new UserResponseBuilder(); }
}
