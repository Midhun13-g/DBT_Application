package com.example.project_backend.repository;

import com.example.project_backend.entity.ScholarshipStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScholarshipStatusRepository extends JpaRepository<ScholarshipStatus, Long> {
    
    List<ScholarshipStatus> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    List<ScholarshipStatus> findByApplicationIdAndUserAadhaarNumberEndingWith(String applicationId, String aadhaarLast4);
}