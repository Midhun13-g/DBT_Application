package com.example.project_backend.service;

import com.example.project_backend.entity.Notice;
import com.example.project_backend.entity.CommunityAction;
import com.example.project_backend.entity.Event;
import com.example.project_backend.handler.SimpleWebSocketHandler;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class WebSocketService {

    public void broadcastNoticeUpdate(Notice notice, String action) {
        Map<String, Object> message = Map.of(
            "notice", notice,
            "action", action,
            "timestamp", System.currentTimeMillis()
        );
        SimpleWebSocketHandler.broadcastToUsers("NOTICE_UPDATE", message);
        System.out.println("📢 Notice update broadcasted to users: " + action);
    }

    public void broadcastCommunityActionUpdate(CommunityAction communityAction, String actionType) {
        Map<String, Object> message = Map.of(
            "communityAction", communityAction,
            "action", actionType,
            "timestamp", System.currentTimeMillis()
        );
        SimpleWebSocketHandler.broadcastToUsers("COMMUNITY_ACTION_UPDATE", message);
        System.out.println("🏠 Community action update broadcasted to users: " + actionType);
    }

    public void broadcastEventUpdate(Event event, String action) {
        Map<String, Object> message = Map.of(
            "event", event,
            "action", action,
            "timestamp", System.currentTimeMillis()
        );
        SimpleWebSocketHandler.broadcastToUsers("EVENT_UPDATE", message);
        System.out.println("📅 Event update broadcasted to users: " + action);
    }

    public void broadcastAwarenessContentUpdate(Object content, String action) {
        Map<String, Object> message = Map.of(
            "content", content,
            "action", action,
            "timestamp", System.currentTimeMillis()
        );
        SimpleWebSocketHandler.broadcastToUsers("AWARENESS_CONTENT_UPDATE", message);
        System.out.println("📚 Awareness content update broadcasted to users: " + action);
    }

    public void broadcastNoticeList() {
        SimpleWebSocketHandler.broadcastToUsers("NOTICE_REFRESH", "refresh");
    }

    public void broadcastCommunityActionList() {
        SimpleWebSocketHandler.broadcastToUsers("COMMUNITY_ACTION_REFRESH", "refresh");
    }

    public void broadcastEventList() {
        SimpleWebSocketHandler.broadcastToUsers("EVENT_REFRESH", "refresh");
    }

    public void notifyAdminsOfUserActivity(String userId, String activity) {
        Map<String, Object> message = Map.of(
            "userId", userId,
            "activity", activity,
            "timestamp", System.currentTimeMillis()
        );
        SimpleWebSocketHandler.broadcastToAdmins("USER_ACTIVITY", message);
        System.out.println("👥 User activity sent to admins: " + activity);
    }
}