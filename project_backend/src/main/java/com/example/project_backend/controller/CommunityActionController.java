package com.example.project_backend.controller;

import com.example.project_backend.entity.CommunityAction;
import com.example.project_backend.service.CommunityActionService;
import com.example.project_backend.service.WebSocketService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/community-actions")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class CommunityActionController {

    private final CommunityActionService communityActionService;
    private final WebSocketService webSocketService;

    @GetMapping
    public ResponseEntity<Page<CommunityAction>> getAllActions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String district,
            @RequestParam(required = false) CommunityAction.ActionType actionType,
            @RequestParam(required = false) CommunityAction.TargetAudience targetAudience,
            @RequestParam(required = false) String keyword) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<CommunityAction> actions = communityActionService.getAllActions(district, actionType, targetAudience, keyword, pageable);
        return ResponseEntity.ok(actions);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CommunityAction> getActionById(@PathVariable Long id) {
        CommunityAction action = communityActionService.getActionById(id);
        return ResponseEntity.ok(action);
    }

    @PostMapping
    public ResponseEntity<CommunityAction> createAction(@RequestBody CommunityAction action) {
        CommunityAction savedAction = communityActionService.createAction(action);
        webSocketService.broadcastCommunityActionUpdate(savedAction, "CREATE");
        return ResponseEntity.ok(savedAction);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CommunityAction> updateAction(@PathVariable Long id, @RequestBody CommunityAction action) {
        CommunityAction updatedAction = communityActionService.updateAction(id, action);
        webSocketService.broadcastCommunityActionUpdate(updatedAction, "UPDATE");
        return ResponseEntity.ok(updatedAction);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAction(@PathVariable Long id) {
        CommunityAction action = communityActionService.getActionById(id);
        communityActionService.deleteAction(id);
        webSocketService.broadcastCommunityActionUpdate(action, "DELETE");
        return ResponseEntity.ok().build();
    }

    @GetMapping("/active")
    public ResponseEntity<Page<CommunityAction>> getActiveActions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String district) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<CommunityAction> actions = communityActionService.getActiveActions(district, pageable);
        return ResponseEntity.ok(actions);
    }

    @PostMapping("/{id}/register")
    public ResponseEntity<CommunityAction> registerParticipant(@PathVariable Long id) {
        CommunityAction action = communityActionService.registerParticipant(id);
        webSocketService.broadcastCommunityActionUpdate(action, "REGISTER");
        return ResponseEntity.ok(action);
    }
}