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

    public Notice getNoticeById(Long id) {
        return noticeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notice not found with id: " + id));
    }

    public Notice createNotice(Notice notice) {
        return noticeRepository.save(notice);
    }

    public Notice updateNotice(Long id, Notice notice) {
        Notice existingNotice = getNoticeById(id);
        existingNotice.setTitle(notice.getTitle());
        existingNotice.setContent(notice.getContent());
        existingNotice.setType(notice.getType());
        existingNotice.setPriority(notice.getPriority());
        existingNotice.setDistrict(notice.getDistrict());
        existingNotice.setEventDate(notice.getEventDate());
        existingNotice.setAttachmentUrl(notice.getAttachmentUrl());
        existingNotice.setIsActive(notice.getIsActive());
        return noticeRepository.save(existingNotice);
    }

    public void deleteNotice(Long id) {
        if (!noticeRepository.existsById(id)) {
            throw new RuntimeException("Notice not found with id: " + id);
        }
        noticeRepository.deleteById(id);
    }

    public Page<Notice> getActiveNotices(String district, Pageable pageable) {
        if (district != null && !district.isEmpty()) {
            return noticeRepository.findFilteredNotices(district, null, null, pageable);
        }
        return noticeRepository.findByIsActiveTrueOrderByCreatedAtDesc(pageable);
    }
}