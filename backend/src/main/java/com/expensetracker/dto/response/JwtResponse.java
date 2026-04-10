package com.expensetracker.dto.response;

public class JwtResponse {
    private String accessToken;
    private String refreshToken;
    private String type = "Bearer";
    private Long id;
    private String name;
    private String email;

    public JwtResponse(String accessToken, String refreshToken, String type, Long id, String name, String email) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.type = type;
        this.id = id;
        this.name = name;
        this.email = email;
    }

    public String getAccessToken() { return accessToken; }
    public void setAccessToken(String accessToken) { this.accessToken = accessToken; }
    public String getRefreshToken() { return refreshToken; }
    public void setRefreshToken(String refreshToken) { this.refreshToken = refreshToken; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}
