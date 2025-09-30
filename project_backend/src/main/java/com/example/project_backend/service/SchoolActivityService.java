package com.example.project_backend.service;

import com.example.project_backend.entity.SchoolActivity;
import com.example.project_backend.repository.SchoolActivityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class SchoolActivityService {

    private final SchoolActivityRepository schoolActivityRepository;

    public Page<SchoolActivity> getAllActivities(String schoolName, SchoolActivity.ActivityType type, Pageable pageable) {
        return schoolActivityRepository.findUpcomingActivities(schoolName, type, LocalDateTime.now(), pageable);
    }

    public SchoolActivity createActivity(SchoolActivity activity) {
        return schoolActivityRepository.save(activity);
    }

    public SchoolActivity updateActivity(Long id, SchoolActivity activity) {
        activity.setId(id);
        return schoolActivityRepository.save(activity);
    }

    public void deleteActivity(Long id) {
        schoolActivityRepository.deleteById(id);
    }
}