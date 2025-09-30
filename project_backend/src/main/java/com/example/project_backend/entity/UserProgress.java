package com.example.project_backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_progress")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProgress {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "content_id")
    private KnowledgeContent content;

    @Column(name = "completed")
    private Boolean completed = false;

    @Column(name = "progress_percentage")
    private Integer progressPercentage = 0;

    @Column(name = "badges_earned")
    private String badgesEarned;

    @Column(name = "quiz_score")
    private Integer quizScore;

    @CreationTimestamp
    @Column(name = "completed_at")
    private LocalDateTime completedAt;
}