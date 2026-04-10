package com.expensetracker.service.impl;

import com.expensetracker.dto.request.LoginRequest;
import com.expensetracker.dto.request.RegisterRequest;
import com.expensetracker.dto.response.JwtResponse;
import com.expensetracker.dto.response.UserResponse;
import com.expensetracker.entity.RefreshToken;
import com.expensetracker.entity.Role;
import com.expensetracker.entity.User;
import com.expensetracker.repository.UserRepository;
import com.expensetracker.security.JwtUtils;
import com.expensetracker.service.AuthService;
import com.expensetracker.service.RefreshTokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    RefreshTokenService refreshTokenService;

    @Override
    @Transactional
    public UserResponse registerUser(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Error: Email is already in use!");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(encoder.encode(request.getPassword()))
                .role(Role.ROLE_USER)
                .build();

        userRepository.save(user);

        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .currency(user.getCurrency())
                .build();
    }

    @Override
    public JwtResponse authenticateUser(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        User user = userRepository.findByEmail(userDetails.getUsername()).get();
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getId());

        return new JwtResponse(jwt, refreshToken.getToken(), "Bearer", user.getId(), user.getName(), user.getEmail());
    }

    @Override
    public JwtResponse refreshToken(String token) {
        return refreshTokenService.findByToken(token)
                .map(refreshTokenService::verifyExpiration)
                .map(RefreshToken::getUser)
                .map(user -> {
                    String accessToken = jwtUtils.generateTokenFromUsername(user.getEmail());
                    return new JwtResponse(accessToken, token, "Bearer", user.getId(), user.getName(), user.getEmail());
                })
                .orElseThrow(() -> new RuntimeException("Refresh token is not in database!"));
    }
}
