package com.example.project_backend.controller;

import com.example.project_backend.entity.KnowledgeContent;
import com.example.project_backend.repository.KnowledgeContentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/knowledge-hub")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class KnowledgeHubController {

    private final KnowledgeContentRepository knowledgeContentRepository;

    @GetMapping
    public ResponseEntity<Page<KnowledgeContent>> getAllContent(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) KnowledgeContent.ContentType type,
            @RequestParam(required = false) KnowledgeContent.DifficultyLevel difficulty,
            @RequestParam(required = false) String language) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<KnowledgeContent> content = knowledgeContentRepository.findFilteredContent(type, difficulty, language, pageable);
        return ResponseEntity.ok(content);
    }

    @PostMapping
    public ResponseEntity<KnowledgeContent> createContent(@RequestBody KnowledgeContent content) {
        KnowledgeContent savedContent = knowledgeContentRepository.save(content);
        return ResponseEntity.ok(savedContent);
    }

    @PutMapping("/{id}/view")
    public ResponseEntity<Void> incrementViewCount(@PathVariable Long id) {
        KnowledgeContent content = knowledgeContentRepository.findById(id).orElse(null);
        if (content != null) {
            content.setViewCount(content.getViewCount() + 1);
            knowledgeContentRepository.save(content);
        }
        return ResponseEntity.ok().build();
    }
}