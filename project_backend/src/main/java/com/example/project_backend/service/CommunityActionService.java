package com.example.project_backend.service;

import com.example.project_backend.entity.CommunityAction;
import com.example.project_backend.repository.CommunityActionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CommunityActionService {

    private final CommunityActionRepository communityActionRepository;

    public Page<CommunityAction> getAllActions(String district, CommunityAction.ActionType actionType, 
                                             CommunityAction.TargetAudience targetAudience, String keyword, Pageable pageable) {
        return communityActionRepository.findFilteredActions(district, actionType, targetAudience, keyword, pageable);
    }

    public CommunityAction getActionById(Long id) {
        return communityActionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Community Action not found with id: " + id));
    }

    public CommunityAction createAction(CommunityAction action) {
        return communityActionRepository.save(action);
    }

    public CommunityAction updateAction(Long id, CommunityAction action) {
        CommunityAction existingAction = getActionById(id);
        existingAction.setTitle(action.getTitle());
        existingAction.setDescription(action.getDescription());
        existingAction.setActionType(action.getActionType());
        existingAction.setTargetAudience(action.getTargetAudience());
        existingAction.setDistrict(action.getDistrict());
        existingAction.setPanchayat(action.getPanchayat());
        existingAction.setVenue(action.getVenue());
        existingAction.setActionDate(action.getActionDate());
        existingAction.setDurationHours(action.getDurationHours());
        existingAction.setMaxParticipants(action.getMaxParticipants());
        existingAction.setContactPerson(action.getContactPerson());
        existingAction.setContactPhone(action.getContactPhone());
        existingAction.setContactEmail(action.getContactEmail());
        existingAction.setRegistrationRequired(action.getRegistrationRequired());
        existingAction.setRegistrationDeadline(action.getRegistrationDeadline());
        existingAction.setIsActive(action.getIsActive());
        existingAction.setIsFeatured(action.getIsFeatured());
        return communityActionRepository.save(existingAction);
    }

    public void deleteAction(Long id) {
        if (!communityActionRepository.existsById(id)) {
            throw new RuntimeException("Community Action not found with id: " + id);
        }
        communityActionRepository.deleteById(id);
    }

    public Page<CommunityAction> getActiveActions(String district, Pageable pageable) {
        if (district != null && !district.isEmpty()) {
            return communityActionRepository.findFilteredActions(district, null, null, null, pageable);
        }
        return communityActionRepository.findByIsActiveTrueOrderByCreatedAtDesc(pageable);
    }

    public CommunityAction registerParticipant(Long actionId) {
        CommunityAction action = getActionById(actionId);
        if (action.getMaxParticipants() != null && 
            action.getCurrentParticipants() >= action.getMaxParticipants()) {
            throw new RuntimeException("Maximum participants reached for this action");
        }
        action.setCurrentParticipants(action.getCurrentParticipants() + 1);
        return communityActionRepository.save(action);
    }
}