package com.example.project_backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "scholarship_status")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ScholarshipStatus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "scheme_name")
    private String schemeName;

    @Column(name = "application_id")
    private String applicationId;

    @Enumerated(EnumType.STRING)
    private ScholarshipStatusType status;

    @Column(name = "amount")
    private BigDecimal amount;

    @Column(name = "disbursement_date")
    private LocalDateTime disbursementDate;

    @Column(name = "bank_verification_status")
    private String bankVerificationStatus;

    @Column(name = "certificate_url")
    private String certificateUrl;

    @Column(name = "remarks")
    private String remarks;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum ScholarshipStatusType {
        APPLIED, UNDER_REVIEW, APPROVED, DISBURSED, REJECTED, ON_HOLD
    }
}