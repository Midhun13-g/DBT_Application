package com.example.project_backend.controller;

import com.example.project_backend.entity.SchoolActivity;
import com.example.project_backend.repository.SchoolActivityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/school-activities")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class SchoolActivityController {

    private final SchoolActivityRepository schoolActivityRepository;

    @GetMapping
    public ResponseEntity<Page<SchoolActivity>> getAllActivities(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String schoolName,
            @RequestParam(required = false) SchoolActivity.ActivityType type) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<SchoolActivity> activities = schoolActivityRepository.findUpcomingActivities(
            schoolName, type, LocalDateTime.now(), pageable);
        return ResponseEntity.ok(activities);
    }

    @PostMapping
    public ResponseEntity<SchoolActivity> createActivity(@RequestBody SchoolActivity activity) {
        SchoolActivity savedActivity = schoolActivityRepository.save(activity);
        return ResponseEntity.ok(savedActivity);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SchoolActivity> updateActivity(@PathVariable Long id, @RequestBody SchoolActivity activity) {
        activity.setId(id);
        SchoolActivity updatedActivity = schoolActivityRepository.save(activity);
        return ResponseEntity.ok(updatedActivity);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteActivity(@PathVariable Long id) {
        schoolActivityRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}