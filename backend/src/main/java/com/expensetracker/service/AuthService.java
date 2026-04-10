package com.expensetracker.service;

import com.expensetracker.dto.request.LoginRequest;
import com.expensetracker.dto.request.RegisterRequest;
import com.expensetracker.dto.response.JwtResponse;
import com.expensetracker.dto.response.UserResponse;

public interface AuthService {
    UserResponse registerUser(RegisterRequest request);
    JwtResponse authenticateUser(LoginRequest request);
    JwtResponse refreshToken(String refreshToken);
}
