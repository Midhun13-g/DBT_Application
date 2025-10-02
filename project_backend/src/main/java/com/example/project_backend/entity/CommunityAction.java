package com.example.project_backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "community_actions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommunityAction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "action_type")
    @Enumerated(EnumType.STRING)
    private ActionType actionType;

    @Column(name = "target_audience")
    @Enumerated(EnumType.STRING)
    private TargetAudience targetAudience = TargetAudience.ALL;

    @Column(name = "district")
    private String district;

    @Column(name = "panchayat")
    private String panchayat;

    @Column(name = "venue")
    private String venue;

    @Column(name = "action_date")
    private LocalDateTime actionDate;

    @Column(name = "duration_hours")
    private Integer durationHours;

    @Column(name = "max_participants")
    private Integer maxParticipants;

    @Column(name = "current_participants")
    private Integer currentParticipants = 0;

    @Column(name = "contact_person")
    private String contactPerson;

    @Column(name = "contact_phone")
    private String contactPhone;

    @Column(name = "contact_email")
    private String contactEmail;

    @Column(name = "registration_required")
    private Boolean registrationRequired = false;

    @Column(name = "registration_deadline")
    private LocalDateTime registrationDeadline;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "is_featured")
    private Boolean isFeatured = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum ActionType {
        AWARENESS_CAMP,
        SKILL_DEVELOPMENT,
        HEALTH_CHECKUP,
        VACCINATION_DRIVE,
        DIGITAL_LITERACY,
        FINANCIAL_LITERACY,
        WOMEN_EMPOWERMENT,
        YOUTH_PROGRAM,
        SENIOR_CITIZEN_CARE,
        ENVIRONMENTAL_INITIATIVE,
        CULTURAL_EVENT,
        SPORTS_ACTIVITY,
        COMMUNITY_MEETING,
        GRIEVANCE_REDRESSAL,
        OTHER
    }

    public enum TargetAudience {
        ALL,
        WOMEN,
        YOUTH,
        SENIOR_CITIZENS,
        CHILDREN,
        FARMERS,
        ENTREPRENEURS,
        STUDENTS,
        DISABLED_PERSONS
    }
}