package com.team3.FoodSaver.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.team3.FoodSaver.service.AIService;

@RestController
@RequestMapping("/api/recipe")
public class RecipeController {
	private static final String SYSTEM_PROMPT = "You output only raw JSON. Do not include explanations or markdown formatting. Your output must match this structure: [ { \\\"title\\\": ..., \\\"ingredients\\\": [...], \\\"preparationTime\\\": ..., \\\"instructions\\\": [...] }, ..., { \\\"title\\\": ..., \\\"ingredients\\\": [...], \\\"preparationTime\\\": ..., \\\"instructions\\\": [...] } ]";
	
	@Autowired
	private AIService aiService;
	
	@CrossOrigin(origins = "*")
	@PostMapping("/search")
	public ResponseEntity<String> getRecipe(@RequestBody String ingredients) {
		String prompt = "Create 5 simple and tasty recipes primarily using these ingredients: " + ingredients;
		try {
			String response = aiService.generateResponse(prompt, SYSTEM_PROMPT);
			return ResponseEntity.status(HttpStatus.OK).body(response);
		}
		catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("OpenAI API failed to respond");
		}
	}
}