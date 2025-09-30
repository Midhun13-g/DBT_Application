package com.example.project_backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "school_activities")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SchoolActivity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    private ActivityType type;

    @Column(name = "school_name")
    private String schoolName;

    @Column(name = "activity_date")
    private LocalDateTime activityDate;

    @Column(name = "registration_required")
    private Boolean registrationRequired = false;

    @Column(name = "max_participants")
    private Integer maxParticipants;

    @Column(name = "resource_url")
    private String resourceUrl;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;

    @OneToMany(mappedBy = "activity", cascade = CascadeType.ALL)
    private List<ActivityRegistration> registrations;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum ActivityType {
        WORKSHOP, PTA_MEETING, EVENT, AWARENESS_PROGRAM, TRAINING
    }
}