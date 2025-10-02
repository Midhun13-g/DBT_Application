package com.example.project_backend.controller;

import com.example.project_backend.entity.Notice;
import com.example.project_backend.service.NoticeService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notices")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class NoticeController {

    private final NoticeService noticeService;

    @GetMapping
    public ResponseEntity<Page<Notice>> getAllNotices(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String district,
            @RequestParam(required = false) Notice.NoticeType type,
            @RequestParam(required = false) String keyword) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<Notice> notices = noticeService.getAllNotices(district, type, keyword, pageable);
        return ResponseEntity.ok(notices);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Notice> getNoticeById(@PathVariable Long id) {
        Notice notice = noticeService.getNoticeById(id);
        return ResponseEntity.ok(notice);
    }

    @PostMapping
    public ResponseEntity<Notice> createNotice(@RequestBody Notice notice) {
        Notice savedNotice = noticeService.createNotice(notice);
        return ResponseEntity.ok(savedNotice);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Notice> updateNotice(@PathVariable Long id, @RequestBody Notice notice) {
        Notice updatedNotice = noticeService.updateNotice(id, notice);
        return ResponseEntity.ok(updatedNotice);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotice(@PathVariable Long id) {
        noticeService.deleteNotice(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/active")
    public ResponseEntity<Page<Notice>> getActiveNotices(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String district) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<Notice> notices = noticeService.getActiveNotices(district, pageable);
        return ResponseEntity.ok(notices);
    }
}