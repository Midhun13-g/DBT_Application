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
        
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("Invalid credentials");
        }
        
        User user = userOpt.get();
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }
        
        if (!user.getIsActive()) {
            throw new RuntimeException("Account is disabled");
        }
        
        response.put("user", user);
        response.put("token", generateToken(user));
        response.put("redirectTo", user.getRole() == User.Role.ADMIN ? "/admin" : "/");
        
        return response;
    }
    
    private String generateToken(User user) {
        // Simple token generation - replace with JWT in production
        return "token_" + user.getId() + "_" + System.currentTimeMillis();
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
            return createMockUser("user@example.com", "John Doe", User.Role.USER);
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