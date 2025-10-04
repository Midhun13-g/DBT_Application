package com.example.project_backend.repository;

import com.example.project_backend.entity.CommunityAction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CommunityActionRepository extends JpaRepository<CommunityAction, Long> {
    
    Page<CommunityAction> findByIsActiveTrueOrderByCreatedAtDesc(Pageable pageable);
    
    @Query("""
           SELECT ca FROM CommunityAction ca 
           WHERE ca.isActive = true 
           AND (:district IS NULL OR ca.district = :district) 
           AND (:actionType IS NULL OR ca.actionType = :actionType) 
           AND (:targetAudience IS NULL OR ca.targetAudience = :targetAudience) 
           AND (:keyword IS NULL OR LOWER(ca.title) LIKE LOWER(CONCAT('%', :keyword, '%')) 
                OR LOWER(ca.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) 
           ORDER BY ca.isFeatured DESC, ca.actionDate ASC, ca.createdAt DESC
           """)
    Page<CommunityAction> findFilteredActions(@Param("district") String district, 
                                            @Param("actionType") CommunityAction.ActionType actionType,
                                            @Param("targetAudience") CommunityAction.TargetAudience targetAudience,
                                            @Param("keyword") String keyword, 
                                            Pageable pageable);
}