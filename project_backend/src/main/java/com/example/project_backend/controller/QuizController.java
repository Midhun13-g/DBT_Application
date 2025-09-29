package com.example.project_backend.controller;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/quiz")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class QuizController {

    @GetMapping("/questions")
    public List<Map<String, Object>> getQuizQuestions() {
        List<Map<String, Object>> questions = new ArrayList<>();
        
        Map<String, Object> q1 = new HashMap<>();
        q1.put("id", 1);
        q1.put("question", "What does DBT stand for?");
        q1.put("options", Arrays.asList(
            "Direct Bank Transfer",
            "Direct Benefit Transfer", 
            "Digital Banking Technology",
            "Direct Business Transaction"
        ));
        q1.put("correct", 1);
        q1.put("explanation", "DBT stands for Direct Benefit Transfer - a system to transfer subsidies directly to beneficiaries' bank accounts.");
        questions.add(q1);
        
        Map<String, Object> q2 = new HashMap<>();
        q2.put("id", 2);
        q2.put("question", "Which document is mandatory for DBT linking?");
        q2.put("options", Arrays.asList(
            "PAN Card",
            "Voter ID",
            "Aadhaar Card",
            "Driving License"
        ));
        q2.put("correct", 2);
        q2.put("explanation", "Aadhaar Card is mandatory for DBT linking as it serves as the unique identifier for beneficiaries.");
        questions.add(q2);
        
        return questions;
    }

    @PostMapping("/submit")
    public Map<String, Object> submitQuizResult(@RequestBody Map<String, Object> submission) {
        Map<String, Object> response = new HashMap<>();
        
        Integer score = (Integer) submission.get("score");
        Integer totalQuestions = (Integer) submission.get("totalQuestions");
        
        double percentage = (score.doubleValue() / totalQuestions.doubleValue()) * 100;
        
        String message;
        if (percentage >= 80) {
            message = "Excellent! You're a DBT expert! 🏆";
        } else if (percentage >= 60) {
            message = "Good job! You know DBT well! 👍";
        } else if (percentage >= 40) {
            message = "Not bad! Keep learning about DBT! 📚";
        } else {
            message = "Keep practicing! Learn more about DBT! 💪";
        }
        
        response.put("score", score);
        response.put("totalQuestions", totalQuestions);
        response.put("percentage", Math.round(percentage));
        response.put("message", message);
        response.put("timestamp", new Date());
        
        return response;
    }
}