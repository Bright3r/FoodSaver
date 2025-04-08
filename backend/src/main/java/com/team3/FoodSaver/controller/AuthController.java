package com.team3.FoodSaver.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.team3.FoodSaver.model.User;
import com.team3.FoodSaver.service.UserService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

	@Autowired
	UserService userService;

	@CrossOrigin(origins = "*")
	@PostMapping("/login")
	public ResponseEntity<Object> login(@RequestBody LoginRequest loginRequest) {
		// Find user in database
		User user = userService.getUserByUsername(loginRequest.username());
		
		// Return user if credentials are valid
		if (user != null && user.getPassword().equals(loginRequest.password())) {
		    return ResponseEntity.status(HttpStatus.OK).body(user);
		}
		
		// Return error for invalid credentials
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
	}
	
	@CrossOrigin(origins = "*")
	@PostMapping("/signup")
	public ResponseEntity<Object> signup(@RequestBody SignupRequest signupRequest) {
		// Check if user already exists
		User user = userService.getUserByUsername(signupRequest.username());
		if (user != null) {
			return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body("Username is taken!");
		}
		
		// Try to create user in backend
		boolean creationSuccessful = userService.createUser(new User(signupRequest.username(), 
					signupRequest.password(), signupRequest.firstName(), signupRequest.lastName()));
		
		// Check if user was created successfully
		user = userService.getUserByUsername(signupRequest.username());
		if (!creationSuccessful || user == null) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to create new user");
		}
		return ResponseEntity.status(HttpStatus.OK).body(user);
	}

	public record LoginRequest(String username, String password) {}
	public record SignupRequest(String username, String password, String firstName, String lastName) {}
}