package com.example.project_backend.service;

import com.example.project_backend.entity.Notice;
import com.example.project_backend.repository.NoticeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NoticeService {

    private final NoticeRepository noticeRepository;

    public Page<Notice> getAllNotices(String district, Notice.NoticeType type, String keyword, Pageable pageable) {
        return noticeRepository.findFilteredNotices(district, type, keyword, pageable);
    }

    public Notice createNotice(Notice notice) {
        return noticeRepository.save(notice);
    }

    public Notice updateNotice(Long id, Notice notice) {
        notice.setId(id);
        return noticeRepository.save(notice);
    }

    public void deleteNotice(Long id) {
        noticeRepository.deleteById(id);
    }
}