package com.example.project_backend.controller;

import com.example.project_backend.entity.User;
import com.example.project_backend.entity.CampBooking;
import com.example.project_backend.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/dashboard/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    @GetMapping("/users")
    public ResponseEntity<Page<User>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) User.DBTStatus status) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<User> users = adminService.getAllUsers(search, status, pageable);
        
        return ResponseEntity.ok(users);
    }

    @GetMapping("/bookings")
    public ResponseEntity<Page<CampBooking>> getAllBookings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) CampBooking.BookingStatus status) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<CampBooking> bookings = adminService.getAllBookings(status, pageable);
        
        return ResponseEntity.ok(bookings);
    }

    @PutMapping("/users/{userId}/status")
    public ResponseEntity<User> updateUserStatus(
            @PathVariable Long userId,
            @RequestParam User.DBTStatus status) {
        
        User updatedUser = adminService.updateUserStatus(userId, status);
        return ResponseEntity.ok(updatedUser);
    }

    @PutMapping("/bookings/{bookingId}/status")
    public ResponseEntity<CampBooking> updateBookingStatus(
            @PathVariable Long bookingId,
            @RequestParam CampBooking.BookingStatus status) {
        
        CampBooking updatedBooking = adminService.updateBookingStatus(bookingId, status);
        return ResponseEntity.ok(updatedBooking);
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable Long userId) {
        adminService.deleteUser(userId);
        Map<String, String> response = Map.of("message", "User deleted successfully");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/users/{userId}/bookings")
    public ResponseEntity<Page<CampBooking>> getBookingsByUser(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<CampBooking> bookings = adminService.getBookingsByUser(userId, pageable);
        return ResponseEntity.ok(bookings);
    }

    @DeleteMapping("/bookings/{bookingId}")
    public ResponseEntity<Map<String, String>> deleteBooking(@PathVariable Long bookingId) {
        adminService.deleteBooking(bookingId);
        Map<String, String> response = Map.of("message", "Booking deleted successfully");
        return ResponseEntity.ok(response);
    }
}