package com.example.project_backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "dbt_status_history")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DBTStatusHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "previous_status")
    private User.DBTStatus previousStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "current_status")
    private User.DBTStatus currentStatus;

    @Column(name = "check_method")
    private String checkMethod;

    @Column(columnDefinition = "TEXT")
    private String remarks;

    @Column(name = "api_response", columnDefinition = "TEXT")
    private String apiResponse;

    @CreationTimestamp
    @Column(name = "checked_at")
    private LocalDateTime checkedAt;
}