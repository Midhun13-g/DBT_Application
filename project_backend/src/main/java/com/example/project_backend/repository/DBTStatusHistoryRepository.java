package com.example.project_backend.repository;

import com.example.project_backend.entity.DBTStatusHistory;
import com.example.project_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface DBTStatusHistoryRepository extends JpaRepository<DBTStatusHistory, Long> {
    
    List<DBTStatusHistory> findByUserIdOrderByCheckedAtDesc(Long userId);
    
    @Query("SELECT dsh FROM DBTStatusHistory dsh WHERE dsh.checkedAt >= :startDate AND dsh.checkedAt <= :endDate")
    List<DBTStatusHistory> findByDateRange(@Param("startDate") LocalDateTime startDate, 
                                          @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT COUNT(dsh) FROM DBTStatusHistory dsh WHERE dsh.currentStatus = :status")
    Long countByCurrentStatus(@Param("status") User.DBTStatus status);
}