package com.example.project_backend.controller;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/logs")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class LogsController {

    @GetMapping("/access")
    public List<Map<String, Object>> getAccessLogs(
            @RequestParam(required = false) String channel,
            @RequestParam(required = false) String search) {
        
        List<Map<String, Object>> logs = new ArrayList<>();
        
        Map<String, Object> log1 = new HashMap<>();
        log1.put("id", 1);
        log1.put("timestamp", "2024-01-28 14:30:25");
        log1.put("channel", "Web");
        log1.put("userId", "user123");
        log1.put("aadhaarLast4", "1234");
        log1.put("status", "ENABLED");
        log1.put("ipAddress", "192.168.1.100");
        log1.put("location", "Mumbai, Maharashtra");
        log1.put("responseTime", "1.2s");
        logs.add(log1);
        
        Map<String, Object> log2 = new HashMap<>();
        log2.put("id", 2);
        log2.put("timestamp", "2024-01-28 14:25:10");
        log2.put("channel", "WhatsApp");
        log2.put("userId", "wa_user456");
        log2.put("aadhaarLast4", "5678");
        log2.put("status", "NOT_LINKED");
        log2.put("ipAddress", "N/A");
        log2.put("location", "Delhi, Delhi");
        log2.put("responseTime", "0.8s");
        logs.add(log2);
        
        return logs;
    }

    @GetMapping("/stats")
    public Map<String, Object> getLogStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalChecks", 15420);
        stats.put("webChecks", 8950);
        stats.put("whatsappChecks", 4200);
        stats.put("ivrChecks", 2270);
        stats.put("todayChecks", 342);
        
        return stats;
    }
}