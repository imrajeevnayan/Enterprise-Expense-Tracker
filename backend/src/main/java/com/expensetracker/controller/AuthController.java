package com.expensetracker.controller;

import com.expensetracker.dto.request.LoginRequest;
import com.expensetracker.dto.request.RegisterRequest;
import com.expensetracker.dto.request.TokenRefreshRequest;
import com.expensetracker.dto.response.JwtResponse;
import com.expensetracker.dto.response.UserResponse;
import com.expensetracker.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Endpoints for user identity management, including registration, secure login, and token maintenance.")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    @Operation(summary = "Register new user", description = "Creates a new user profile in the system with encrypted password storage.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "User successfully registered"),
        @ApiResponse(responseCode = "400", description = "Invalid registration data or email already in use")
    })
    public ResponseEntity<UserResponse> registerUser(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.registerUser(request));
    }

    @PostMapping("/login")
    @Operation(summary = "Login / Authenticate", description = "Validates credentials and returns an Access JWT and a Refresh Token.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Authentication successful"),
        @ApiResponse(responseCode = "401", description = "Invalid credentials")
    })
    public ResponseEntity<JwtResponse> authenticateUser(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.authenticateUser(request));
    }

    @PostMapping("/refresh-token")
    @Operation(summary = "Refresh Session", description = "Exchanges a valid Refresh Token for a new short-lived Access JWT.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Token successfully rotated"),
        @ApiResponse(responseCode = "403", description = "Refresh token expired or invalid")
    })
    public ResponseEntity<JwtResponse> refreshToken(
            @Valid @RequestBody TokenRefreshRequest request) {
        return ResponseEntity.ok(authService.refreshToken(request.getRefreshToken()));
    }
}
