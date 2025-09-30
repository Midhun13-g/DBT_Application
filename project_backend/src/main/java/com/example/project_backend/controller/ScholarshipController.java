package com.example.project_backend.controller;

import com.example.project_backend.entity.ScholarshipStatus;
import com.example.project_backend.repository.ScholarshipStatusRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/scholarships")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class ScholarshipController {

    private final ScholarshipStatusRepository scholarshipStatusRepository;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ScholarshipStatus>> getUserScholarships(@PathVariable Long userId) {
        List<ScholarshipStatus> scholarships = scholarshipStatusRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return ResponseEntity.ok(scholarships);
    }

    @PostMapping("/check")
    public ResponseEntity<List<ScholarshipStatus>> checkScholarshipStatus(
            @RequestParam String applicationId,
            @RequestParam String aadhaarLast4) {
        
        List<ScholarshipStatus> scholarships = scholarshipStatusRepository
            .findByApplicationIdAndUserAadhaarNumberEndingWith(applicationId, aadhaarLast4);
        return ResponseEntity.ok(scholarships);
    }

    @PostMapping
    public ResponseEntity<ScholarshipStatus> createScholarshipStatus(@RequestBody ScholarshipStatus status) {
        ScholarshipStatus savedStatus = scholarshipStatusRepository.save(status);
        return ResponseEntity.ok(savedStatus);
    }
}