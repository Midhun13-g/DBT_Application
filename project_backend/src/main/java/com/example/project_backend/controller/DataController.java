package com.example.project_backend.controller;

import com.example.project_backend.service.DataPersistenceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/data")
@CrossOrigin(origins = "http://localhost:5173")
public class DataController {
    
    @Autowired
    private DataPersistenceService dataPersistenceService;
    
    @PostMapping("/save/{type}")
    public ResponseEntity<String> saveData(@PathVariable String type, @RequestBody List<Map<String, Object>> data) {
        dataPersistenceService.saveData(type, data);
        return ResponseEntity.ok("Data saved successfully");
    }
    
    @GetMapping("/load/{type}")
    public ResponseEntity<List<Map<String, Object>>> loadData(@PathVariable String type) {
        List<Map<String, Object>> data = dataPersistenceService.loadData(type);
        if (data != null) {
            return ResponseEntity.ok(data);
        }
        return ResponseEntity.notFound().build();
    }
    
    @GetMapping("/exists/{type}")
    public ResponseEntity<Boolean> dataExists(@PathVariable String type) {
        return ResponseEntity.ok(dataPersistenceService.dataExists(type));
    }
}