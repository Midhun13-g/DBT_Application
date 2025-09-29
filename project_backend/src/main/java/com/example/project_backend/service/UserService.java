package com.example.project_backend.service;

import com.example.project_backend.entity.User;
import com.example.project_backend.entity.CampBooking;
import com.example.project_backend.repository.UserRepository;
import com.example.project_backend.repository.CampBookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;
    private final CampBookingRepository campBookingRepository;

    public Map<String, Object> checkDBTStatus(String aadhaarLast4, String applicationId) {
        Map<String, Object> result = new HashMap<>();
        
        // Simulate DBT status check logic
        User.DBTStatus status = simulateDBTStatusCheck(aadhaarLast4, applicationId);
        
        result.put("status", status);
        result.put("aadhaarLast4", aadhaarLast4);
        result.put("applicationId", applicationId);
        result.put("checkedAt", LocalDateTime.now());
        result.put("message", getStatusMessage(status));
        
        return result;
    }

    public CampBooking bookCamp(CampBooking booking) {
        booking.setBookingReference(generateBookingReference());
        booking.setStatus(CampBooking.BookingStatus.PENDING);
        return campBookingRepository.save(booking);
    }

    public List<CampBooking> getUserBookings(Long userId) {
        return campBookingRepository.findByUserId(userId);
    }

    public List<Map<String, Object>> getUserNotifications(Long userId) {
        // Mock notifications
        List<Map<String, Object>> notifications = new ArrayList<>();
        
        Map<String, Object> notification1 = new HashMap<>();
        notification1.put("id", 1);
        notification1.put("type", "success");
        notification1.put("title", "DBT Status Updated");
        notification1.put("message", "Your DBT status has been successfully enabled.");
        notification1.put("timestamp", LocalDateTime.now().minusHours(2));
        notification1.put("read", false);
        
        Map<String, Object> notification2 = new HashMap<>();
        notification2.put("id", 2);
        notification2.put("type", "info");
        notification2.put("title", "Camp Booking Confirmed");
        notification2.put("message", "Your camp booking has been confirmed.");
        notification2.put("timestamp", LocalDateTime.now().minusHours(5));
        notification2.put("read", false);
        
        notifications.add(notification1);
        notifications.add(notification2);
        
        return notifications;
    }

    private User.DBTStatus simulateDBTStatusCheck(String aadhaarLast4, String applicationId) {
        // Simple simulation logic
        int hash = (aadhaarLast4 + applicationId).hashCode();
        int mod = Math.abs(hash) % 3;
        
        switch (mod) {
            case 0: return User.DBTStatus.ENABLED;
            case 1: return User.DBTStatus.LINKED_NOT_ENABLED;
            default: return User.DBTStatus.NOT_LINKED;
        }
    }

    private String getStatusMessage(User.DBTStatus status) {
        switch (status) {
            case ENABLED:
                return "Your account is DBT enabled. Benefits will be transferred directly.";
            case LINKED_NOT_ENABLED:
                return "Your account is linked but DBT is not enabled. Please follow the seeding guide.";
            case NOT_LINKED:
                return "Your account is not linked. Please follow the seeding guide to link your account.";
            default:
                return "Status could not be determined.";
        }
    }

    private String generateBookingReference() {
        return "BK" + System.currentTimeMillis();
    }

    public Map<String, Object> updateProfile(Long userId, Map<String, String> profileData) {
        Map<String, Object> result = new HashMap<>();
        
        // Mock profile update - in real app, update database
        result.put("success", true);
        result.put("message", "Profile updated successfully");
        result.put("updatedData", profileData);
        
        return result;
    }

    public Map<String, Object> getUserProfile(Long userId) {
        Map<String, Object> profile = new HashMap<>();
        
        // Mock profile data - in real app, fetch from database
        if (userId == 1) {
            profile.put("name", "Admin User");
            profile.put("email", "admin@dbt.gov.in");
            profile.put("phone", "9876543210");
        } else {
            profile.put("name", "John Doe");
            profile.put("email", "user@example.com");
            profile.put("phone", "9876543211");
        }
        
        profile.put("aadhaarLast4", "****");
        profile.put("bankName", "State Bank of India");
        profile.put("accountNumber", "****1234");
        profile.put("dbtStatus", "ENABLED");
        
        return profile;
    }
}