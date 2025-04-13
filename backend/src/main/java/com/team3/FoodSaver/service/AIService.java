package com.team3.FoodSaver.service;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class AIService {
	private static final String OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
	
    public String generateResponse(String systemPrompt, String userPrompt) throws RuntimeException {
        RestTemplate restTemplate = new RestTemplate();

        Map<String, Object> body = Map.of(
            "model", "gpt-4o-mini",
            "store", true,
            "messages", List.of(
                Map.of("role", "system", "content", systemPrompt),
                Map.of("role", "user", "content", userPrompt)
            )
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(System.getProperty("OPENAI_API_KEY"));

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
        ResponseEntity<Map> response = restTemplate.postForEntity(OPENAI_API_URL, request, Map.class);

        if (response.getStatusCode() == HttpStatus.OK) {
            List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");
            Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
            return (String) message.get("content");
        } else {
            throw new RuntimeException("OpenAI API call failed: " + response.getStatusCode());
        }
    }
}