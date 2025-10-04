package com.example.project_backend.controller;

import com.example.project_backend.entity.User;
import com.example.project_backend.entity.CampBooking;
import com.example.project_backend.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Pattern;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class UserController {

    private final UserService userService;

    @PostMapping("/dbt-status")
    public ResponseEntity<?> checkDBTStatus(
            @RequestParam @Pattern(regexp = "^[0-9]{4}$") String aadhaarLast4,
            @RequestParam @Pattern(regexp = "^[A-Za-z0-9]{6,20}$") String applicationId) {
        try {
            Map<String, Object> result = userService.checkDBTStatus(aadhaarLast4, applicationId);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Failed to check DBT status", e);
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid request"));
        }
    }

    @PostMapping("/camp-booking")
    public ResponseEntity<?> bookCamp(@Valid @RequestBody CampBooking booking) {
        try {
            CampBooking savedBooking = userService.bookCamp(booking);
            return ResponseEntity.ok(savedBooking);
        } catch (Exception e) {
            log.error("Failed to book camp", e);
            return ResponseEntity.badRequest().body(Map.of("error", "Booking failed"));
        }
    }

    @GetMapping("/{userId}/bookings")
    public ResponseEntity<?> getUserBookings(@PathVariable Long userId) {
        try {
            if (userId == null || userId <= 0) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid user ID"));
            }
            List<CampBooking> bookings = userService.getUserBookings(userId);
            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            log.error("Failed to get user bookings", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to retrieve bookings"));
        }
    }

    @GetMapping("/{userId}/notifications")
    public ResponseEntity<?> getUserNotifications(@PathVariable Long userId) {
        try {
            if (userId == null || userId <= 0) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid user ID"));
            }
            List<Map<String, Object>> notifications = userService.getUserNotifications(userId);
            return ResponseEntity.ok(notifications);
        } catch (Exception e) {
            log.error("Failed to get user notifications", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to retrieve notifications"));
        }
    }

    @PutMapping("/{userId}/profile")
    public ResponseEntity<?> updateProfile(
            @PathVariable Long userId,
            @Valid @RequestBody Map<String, String> profileData) {
        try {
            if (userId == null || userId <= 0) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid user ID"));
            }
            Map<String, Object> result = userService.updateProfile(userId, profileData);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Failed to update profile", e);
            return ResponseEntity.badRequest().body(Map.of("error", "Profile update failed"));
        }
    }

    @GetMapping("/{userId}/profile")
    public ResponseEntity<?> getUserProfile(@PathVariable Long userId) {
        try {
            if (userId == null || userId <= 0) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid user ID"));
            }
            Map<String, Object> profile = userService.getUserProfile(userId);
            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            log.error("Failed to get user profile", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to retrieve profile"));
        }
    }
}