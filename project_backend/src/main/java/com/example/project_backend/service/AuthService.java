package com.example.project_backend.service;

import com.example.project_backend.entity.User;
import com.example.project_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public Map<String, Object> authenticate(String email, String password) {
        Map<String, Object> response = new HashMap<>();
        
        // Mock authentication logic
        if ("admin@dbt.gov.in".equals(email) && "admin123".equals(password)) {
            response.put("user", createMockUser(email, "Admin User", User.Role.ADMIN));
            response.put("token", "mock-admin-token");
            response.put("redirectTo", "/admin");
        } else if ("user@example.com".equals(email) && "password".equals(password)) {
            response.put("user", createMockUser(email, "Regular User", User.Role.USER));
            response.put("token", "mock-user-token");
            response.put("redirectTo", "/");
        } else {
            throw new RuntimeException("Invalid credentials");
        }
        
        return response;
    }

    public User register(User user) {
        // Check if user already exists
        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser.isPresent()) {
            throw new RuntimeException("User already exists");
        }
        
        // Encode password
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(User.Role.USER);
        user.setIsActive(true);
        user.setCreatedAt(LocalDateTime.now());
        
        return userRepository.save(user);
    }

    public User getCurrentUser(String token) {
        // Mock implementation - in real app, decode JWT token
        if ("mock-admin-token".equals(token.replace("Bearer ", ""))) {
            return createMockUser("admin@dbt.gov.in", "Admin User", User.Role.ADMIN);
        } else if ("mock-user-token".equals(token.replace("Bearer ", ""))) {
            return createMockUser("user@example.com", "Regular User", User.Role.USER);
        }
        
        throw new RuntimeException("Invalid token");
    }

    private User createMockUser(String email, String name, User.Role role) {
        User user = new User();
        user.setId(1L);
        user.setEmail(email);
        user.setName(name);
        user.setRole(role);
        user.setIsActive(true);
        user.setCreatedAt(LocalDateTime.now());
        return user;
    }
}