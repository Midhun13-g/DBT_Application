package com.example.project_backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "activity_registrations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ActivityRegistration {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "activity_id")
    private SchoolActivity activity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Enumerated(EnumType.STRING)
    private RegistrationStatus status = RegistrationStatus.REGISTERED;

    @Column(name = "attended")
    private Boolean attended = false;

    @CreationTimestamp
    @Column(name = "registered_at")
    private LocalDateTime registeredAt;

    public enum RegistrationStatus {
        REGISTERED, CONFIRMED, CANCELLED
    }
}