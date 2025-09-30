package com.example.project_backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "knowledge_content")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class KnowledgeContent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Enumerated(EnumType.STRING)
    private ContentType type;

    @Enumerated(EnumType.STRING)
    private DifficultyLevel difficulty = DifficultyLevel.BEGINNER;

    @Column(name = "video_url")
    private String videoUrl;

    @Column(name = "resource_url")
    private String resourceUrl;

    @Column(name = "language")
    private String language = "en";

    @Column(name = "rating")
    private Double rating = 0.0;

    @Column(name = "view_count")
    private Long viewCount = 0L;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum ContentType {
        GUIDE, TUTORIAL, VIDEO, FAQ, ARTICLE
    }

    public enum DifficultyLevel {
        BEGINNER, INTERMEDIATE, ADVANCED
    }
}