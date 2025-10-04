package com.example.project_backend.repository;

import com.example.project_backend.entity.SchoolActivity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface SchoolActivityRepository extends JpaRepository<SchoolActivity, Long> {
    
    Page<SchoolActivity> findByIsActiveTrueOrderByActivityDateDesc(Pageable pageable);
    
    @Query("""
           SELECT sa FROM SchoolActivity sa 
           WHERE sa.isActive = true 
           AND (:schoolName IS NULL OR sa.schoolName = :schoolName) 
           AND (:type IS NULL OR sa.type = :type) 
           AND sa.activityDate >= :fromDate 
           ORDER BY sa.activityDate ASC
           """)
    Page<SchoolActivity> findUpcomingActivities(@Param("schoolName") String schoolName,
                                              @Param("type") SchoolActivity.ActivityType type,
                                              @Param("fromDate") LocalDateTime fromDate,
                                              Pageable pageable);
}