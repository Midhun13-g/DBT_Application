package com.example.project_backend.controller;

import com.example.project_backend.entity.User;
import com.example.project_backend.entity.CampBooking;
import com.example.project_backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class UserController {

    private final UserService userService;

    @PostMapping("/dbt-status")
    public ResponseEntity<Map<String, Object>> checkDBTStatus(
            @RequestParam String aadhaarLast4,
            @RequestParam String applicationId) {
        
        Map<String, Object> result = userService.checkDBTStatus(aadhaarLast4, applicationId);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/camp-booking")
    public ResponseEntity<CampBooking> bookCamp(@RequestBody CampBooking booking) {
        CampBooking savedBooking = userService.bookCamp(booking);
        return ResponseEntity.ok(savedBooking);
    }

    @GetMapping("/{userId}/bookings")
    public ResponseEntity<List<CampBooking>> getUserBookings(@PathVariable Long userId) {
        List<CampBooking> bookings = userService.getUserBookings(userId);
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/{userId}/notifications")
    public ResponseEntity<List<Map<String, Object>>> getUserNotifications(@PathVariable Long userId) {
        List<Map<String, Object>> notifications = userService.getUserNotifications(userId);
        return ResponseEntity.ok(notifications);
    }
}