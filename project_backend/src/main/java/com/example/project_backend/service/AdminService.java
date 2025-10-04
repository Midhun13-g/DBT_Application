package com.example.project_backend.service;

import com.example.project_backend.entity.User;
import com.example.project_backend.entity.CampBooking;
import com.example.project_backend.repository.UserRepository;
import com.example.project_backend.repository.CampBookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminService {
    
    private final UserRepository userRepository;
    private final CampBookingRepository campBookingRepository;

    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // User statistics
        stats.put("totalUsers", userRepository.count());
        stats.put("dbtEnabled", userRepository.countByDbtStatus(User.DBTStatus.ENABLED));
        stats.put("dbtLinkedNotEnabled", userRepository.countByDbtStatus(User.DBTStatus.LINKED_NOT_ENABLED));
        stats.put("dbtNotLinked", userRepository.countByDbtStatus(User.DBTStatus.NOT_LINKED));
        
        // Camp booking statistics
        stats.put("totalBookings", campBookingRepository.count());
        stats.put("pendingBookings", campBookingRepository.countByStatus(CampBooking.BookingStatus.PENDING));
        stats.put("confirmedBookings", campBookingRepository.countByStatus(CampBooking.BookingStatus.CONFIRMED));
        stats.put("completedBookings", campBookingRepository.countByStatus(CampBooking.BookingStatus.COMPLETED));
        
        // Monthly statistics
        LocalDateTime startOfMonth = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
        LocalDateTime endOfMonth = startOfMonth.plusMonths(1).minusSeconds(1);
        stats.put("monthlyBookings", campBookingRepository.findBookingsBetweenDates(startOfMonth, endOfMonth).size());
        
        return stats;
    }

    public Page<User> getAllUsers(String search, User.DBTStatus status, Pageable pageable) {
        if (search != null && !search.isEmpty()) {
            return userRepository.findBySearchTerm(search, pageable);
        } else if (status != null) {
            return userRepository.findByDbtStatus(status, pageable);
        } else {
            return userRepository.findAll(pageable);
        }
    }

    public Page<CampBooking> getAllBookings(CampBooking.BookingStatus status, Pageable pageable) {
        if (status != null) {
            return campBookingRepository.findByStatus(status, pageable);
        } else {
            return campBookingRepository.findAll(pageable);
        }
    }

    public Page<CampBooking> getBookingsByUser(Long userId, Pageable pageable) {
        return campBookingRepository.findByUserId(userId, pageable);
    }

    public User updateUserStatus(Long userId, User.DBTStatus newStatus) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setDbtStatus(newStatus);
        user.setLastDbtCheck(LocalDateTime.now());
        
        return userRepository.save(user);
    }

    public CampBooking updateBookingStatus(Long bookingId, CampBooking.BookingStatus newStatus) {
        CampBooking booking = campBookingRepository.findById(bookingId)
            .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        booking.setStatus(newStatus);
        
        return campBookingRepository.save(booking);
    }

    @Transactional
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        // Cancel user's bookings first
        campBookingRepository.cancelBookingsByUserId(userId);

        // Delete user
        userRepository.delete(user);
    }

    @Transactional
    public void deleteBooking(Long bookingId) {
        CampBooking booking = campBookingRepository.findById(bookingId)
            .orElseThrow(() -> new RuntimeException("Booking not found"));

        campBookingRepository.delete(booking);
    }
}