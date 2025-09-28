package com.example.project_backend.repository;

import com.example.project_backend.entity.CampBooking;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CampBookingRepository extends JpaRepository<CampBooking, Long> {
    List<CampBooking> findByUserId(Long userId);
    
    @Query("SELECT cb FROM CampBooking cb WHERE cb.campDate BETWEEN :startDate AND :endDate")
    List<CampBooking> findBookingsBetweenDates(@Param("startDate") LocalDateTime startDate, 
                                               @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT COUNT(cb) FROM CampBooking cb WHERE cb.status = :status")
    Long countByStatus(@Param("status") CampBooking.BookingStatus status);
    
    Page<CampBooking> findByStatus(CampBooking.BookingStatus status, Pageable pageable);
    
    @Query("SELECT cb FROM CampBooking cb WHERE cb.campLocation LIKE %:location%")
    List<CampBooking> findByLocationContaining(@Param("location") String location);
}