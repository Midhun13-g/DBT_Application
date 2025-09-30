package com.example.project_backend.repository;

import com.example.project_backend.entity.Notice;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface NoticeRepository extends JpaRepository<Notice, Long> {
    
    Page<Notice> findByIsActiveTrueOrderByCreatedAtDesc(Pageable pageable);
    
    @Query("SELECT n FROM Notice n WHERE n.isActive = true AND " +
           "(:district IS NULL OR n.district = :district) AND " +
           "(:type IS NULL OR n.type = :type) AND " +
           "(:keyword IS NULL OR LOWER(n.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(n.content) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
           "ORDER BY n.priority DESC, n.createdAt DESC")
    Page<Notice> findFilteredNotices(@Param("district") String district, 
                                   @Param("type") Notice.NoticeType type, 
                                   @Param("keyword") String keyword, 
                                   Pageable pageable);
}