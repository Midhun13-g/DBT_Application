package com.example.project_backend.repository;

import com.example.project_backend.entity.ActivityRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ActivityRegistrationRepository extends JpaRepository<ActivityRegistration, Long> {
    
    List<ActivityRegistration> findByUserId(Long userId);
    
    List<ActivityRegistration> findByActivityId(Long activityId);
    
    Optional<ActivityRegistration> findByUserIdAndActivityId(Long userId, Long activityId);
    
    @Query("SELECT COUNT(ar) FROM ActivityRegistration ar WHERE ar.activity.id = :activityId AND ar.status = 'REGISTERED'")
    Long countRegisteredParticipants(@Param("activityId") Long activityId);
    
    @Query("SELECT ar FROM ActivityRegistration ar WHERE ar.activity.id = :activityId AND ar.status = :status")
    List<ActivityRegistration> findByActivityIdAndStatus(@Param("activityId") Long activityId, 
                                                        @Param("status") ActivityRegistration.RegistrationStatus status);
}