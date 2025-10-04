package com.example.project_backend.handler;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.regex.Pattern;

@Slf4j
@Component
public class SimpleWebSocketHandler extends TextWebSocketHandler {

    private static final Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();
    private static final Map<String, UserSession> userSessions = new ConcurrentHashMap<>();
    private final ObjectMapper objectMapper = new ObjectMapper();
    private static final Pattern SAFE_STRING_PATTERN = Pattern.compile("^[a-zA-Z0-9_-]+$");

    private String sanitizeForLog(String input) {
        if (input == null) return "null";
        return input.replaceAll("[\r\n\t]", "_").substring(0, Math.min(input.length(), 50));
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        sessions.put(session.getId(), session);
        log.info("WebSocket connection established for session: {}", sanitizeForLog(session.getId()));
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        sessions.remove(session.getId());
        userSessions.remove(session.getId());
        log.info("WebSocket connection closed for session: {}", sanitizeForLog(session.getId()));
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        try {
            JsonNode jsonNode = objectMapper.readTree(message.getPayload());
            String type = jsonNode.get("type").asText();
            JsonNode payload = jsonNode.get("payload");
            
            log.debug("Received message type: {}", sanitizeForLog(type));
            
            switch (type) {
                case "USER_CONNECT":
                    handleUserConnect(session, payload);
                    break;
                case "ADMIN_NOTICE_UPDATE":
                    handleAdminNoticeUpdate(payload);
                    break;
                case "ADMIN_CONTENT_UPDATE":
                    handleAdminContentUpdate(payload);
                    break;
                case "ADMIN_EVENT_UPDATE":
                    handleAdminEventUpdate(payload);
                    break;
                case "USER_ACTIVITY":
                    handleUserActivity(payload);
                    break;
                default:
                    log.warn("Unknown message type: {}", sanitizeForLog(type));
            }
        } catch (Exception e) {
            log.error("Error handling WebSocket message", e);
        }
    }

    private void handleUserConnect(WebSocketSession session, JsonNode payload) {
        try {
            String userId = payload.get("userId").asText();
            String role = payload.get("role").asText();
            
            UserSession userSession = new UserSession(userId, role, session.getId());
            userSessions.put(session.getId(), userSession);
            
            log.info("User connected - ID: {}, Role: {}", sanitizeForLog(userId), sanitizeForLog(role));
        } catch (Exception e) {
            log.error("Error handling user connect", e);
        }
    }

    private void handleAdminNoticeUpdate(JsonNode payload) {
        broadcastToUsers("NOTICE_UPDATE", payload);
        log.info("Admin notice update broadcasted");
    }

    private void handleAdminContentUpdate(JsonNode payload) {
        broadcastToUsers("AWARENESS_CONTENT_UPDATE", payload);
        log.info("Admin content update broadcasted");
    }

    private void handleAdminEventUpdate(JsonNode payload) {
        broadcastToUsers("EVENT_UPDATE", payload);
        log.info("Admin event update broadcasted");
    }

    private void handleUserActivity(JsonNode payload) {
        broadcastToAdmins("USER_ACTIVITY", payload);
        log.info("User activity sent to admins");
    }

    public static void broadcast(String type, Object payload) {
        String message = createMessage(type, payload);
        sessions.values().forEach(session -> {
            try {
                if (session.isOpen()) {
                    session.sendMessage(new TextMessage(message));
                }
            } catch (IOException e) {
                log.error("Error sending message to session", e);
            }
        });
    }

    public static void broadcastToUsers(String type, Object payload) {
        String message = createMessage(type, payload);
        userSessions.values().stream()
            .filter(userSession -> "user".equals(userSession.getRole()))
            .forEach(userSession -> {
                WebSocketSession session = sessions.get(userSession.getSessionId());
                if (session != null && session.isOpen()) {
                    try {
                        session.sendMessage(new TextMessage(message));
                    } catch (IOException e) {
                        log.error("Error sending message to user", e);
                    }
                }
            });
    }

    public static void broadcastToAdmins(String type, Object payload) {
        String message = createMessage(type, payload);
        userSessions.values().stream()
            .filter(userSession -> "admin".equals(userSession.getRole()))
            .forEach(userSession -> {
                WebSocketSession session = sessions.get(userSession.getSessionId());
                if (session != null && session.isOpen()) {
                    try {
                        session.sendMessage(new TextMessage(message));
                    } catch (IOException e) {
                        log.error("Error sending message to admin", e);
                    }
                }
            });
    }

    private static String createMessage(String type, Object payload) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            Map<String, Object> message = Map.of(
                "type", type, 
                "payload", payload,
                "timestamp", System.currentTimeMillis()
            );
            return mapper.writeValueAsString(message);
        } catch (Exception e) {
            log.error("Error creating WebSocket message", e);
            return "{}";
        }
    }

    // Inner class to store user session information
    private static class UserSession {
        private final String userId;
        private final String role;
        private final String sessionId;

        public UserSession(String userId, String role, String sessionId) {
            this.userId = userId;
            this.role = role;
            this.sessionId = sessionId;
        }

        public String getUserId() { return userId; }
        public String getRole() { return role; }
        public String getSessionId() { return sessionId; }
    }
}