package com.example.project_backend.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.*;

@RestController
@RequestMapping("/api/awareness")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class AwarenessController {

    @GetMapping("/materials")
    public List<Map<String, Object>> getAllMaterials() {
        List<Map<String, Object>> materials = new ArrayList<>();
        
        Map<String, Object> material1 = new HashMap<>();
        material1.put("id", 1);
        material1.put("title", "DBT Benefits Guide");
        material1.put("type", "PDF");
        material1.put("language", "English");
        material1.put("size", "2.5 MB");
        material1.put("downloads", 1250);
        material1.put("createdAt", "2024-01-15");
        material1.put("status", "Active");
        materials.add(material1);
        
        return materials;
    }

    @PostMapping("/materials")
    public Map<String, Object> addMaterial(
            @RequestParam String title,
            @RequestParam String type,
            @RequestParam String language,
            @RequestParam(required = false) MultipartFile file) {
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Material added successfully");
        response.put("id", System.currentTimeMillis());
        
        return response;
    }

    @DeleteMapping("/materials/{id}")
    public Map<String, String> deleteMaterial(@PathVariable Long id) {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Material deleted successfully");
        return response;
    }
}