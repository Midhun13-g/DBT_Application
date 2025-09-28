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
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String phone;

    @Column(name = "aadhaar_number")
    private String aadhaarNumber;

    @Column(name = "bank_account_number")
    private String bankAccountNumber;

    @Column(name = "bank_name")
    private String bankName;

    @Column(name = "ifsc_code")
    private String ifscCode;

    @Enumerated(EnumType.STRING)
    private Role role = Role.USER;

    @Enumerated(EnumType.STRING)
    @Column(name = "dbt_status")
    private DBTStatus dbtStatus = DBTStatus.NOT_LINKED;

    @Column(name = "application_id")
    private String applicationId;

    @Column(name = "last_dbt_check")
    private LocalDateTime lastDbtCheck;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<CampBooking> campBookings;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<DBTStatusHistory> dbtStatusHistory;

    public enum Role {
        USER, ADMIN, SUPER_ADMIN
    }

    public enum DBTStatus {
        NOT_LINKED, LINKED_NOT_ENABLED, ENABLED, SUSPENDED, ERROR
    }
}