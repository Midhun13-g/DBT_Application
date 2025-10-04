package com.example.project_backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;

@Service
public class DataPersistenceService {
    
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final String DATA_DIR = "src/main/resources/data/";
    
    public void saveData(String fileName, Object data) {
        try {
            File file = new File(DATA_DIR + fileName + ".json");
            file.getParentFile().mkdirs();
            objectMapper.writeValue(file, data);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    
    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> loadData(String fileName) {
        try {
            File file = new File(DATA_DIR + fileName + ".json");
            if (file.exists()) {
                return objectMapper.readValue(file, List.class);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }
    
    public boolean dataExists(String fileName) {
        return new File(DATA_DIR + fileName + ".json").exists();
    }
}