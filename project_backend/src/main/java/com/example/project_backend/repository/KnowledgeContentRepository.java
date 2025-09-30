package com.example.project_backend.repository;

import com.example.project_backend.entity.KnowledgeContent;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface KnowledgeContentRepository extends JpaRepository<KnowledgeContent, Long> {
    
    Page<KnowledgeContent> findByIsActiveTrueOrderByRatingDescViewCountDesc(Pageable pageable);
    
    @Query("SELECT kc FROM KnowledgeContent kc WHERE kc.isActive = true AND " +
           "(:type IS NULL OR kc.type = :type) AND " +
           "(:difficulty IS NULL OR kc.difficulty = :difficulty) AND " +
           "(:language IS NULL OR kc.language = :language) " +
           "ORDER BY kc.rating DESC, kc.viewCount DESC")
    Page<KnowledgeContent> findFilteredContent(@Param("type") KnowledgeContent.ContentType type,
                                             @Param("difficulty") KnowledgeContent.DifficultyLevel difficulty,
                                             @Param("language") String language,
                                             Pageable pageable);
}