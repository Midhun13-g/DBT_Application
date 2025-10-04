package com.example.project_backend.service;

import com.example.project_backend.entity.User;
import com.example.project_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class DataInitializationService implements CommandLineRunner {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        initializeDefaultUsers();
    }
    
    private void initializeDefaultUsers() {
        try {
            // Create default admin user if not exists
            if (userRepository.findByEmail("admin@dbt.gov.in").isEmpty()) {
                User admin = new User();
                admin.setName("Admin User");
                admin.setEmail("admin@dbt.gov.in");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setPhone("9876543210");
                admin.setRole(User.Role.ADMIN);
                admin.setIsActive(true);
                admin.setCreatedAt(LocalDateTime.now());
                
                userRepository.save(admin);
                log.info("Default admin user created");
            }
            
            // Create default regular user if not exists
            if (userRepository.findByEmail("user@example.com").isEmpty()) {
                User user = new User();
                user.setName("John Doe");
                user.setEmail("user@example.com");
                user.setPassword(passwordEncoder.encode("password"));
                user.setPhone("9876543211");
                user.setRole(User.Role.USER);
                user.setIsActive(true);
                user.setCreatedAt(LocalDateTime.now());
                
                userRepository.save(user);
                log.info("Default regular user created");
            }
        } catch (Exception e) {
            log.error("Error initializing default users", e);
        }
    }
}