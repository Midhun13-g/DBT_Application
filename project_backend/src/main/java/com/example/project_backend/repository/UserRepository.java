package com.example.project_backend.repository;

import com.example.project_backend.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByAadhaarNumber(String aadhaarNumber);
    Optional<User> findByApplicationId(String applicationId);
    
    @Query("SELECT u FROM User u WHERE u.name LIKE CONCAT('%', :search, '%') OR u.email LIKE CONCAT('%', :search, '%') OR u.phone LIKE CONCAT('%', :search, '%')")
    Page<User> findBySearchTerm(@Param("search") String search, Pageable pageable);
    
    @Query("SELECT u FROM User u WHERE u.dbtStatus = :status")
    Page<User> findByDbtStatus(@Param("status") User.DBTStatus status, Pageable pageable);
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.dbtStatus = :status")
    Long countByDbtStatus(@Param("status") User.DBTStatus status);
    
    @Query("SELECT u FROM User u WHERE u.lastDbtCheck < :date OR u.lastDbtCheck IS NULL")
    List<User> findUsersNeedingStatusCheck(@Param("date") LocalDateTime date);
    
    List<User> findByRole(User.Role role);
}