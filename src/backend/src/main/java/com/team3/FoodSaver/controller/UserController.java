package com.team3.FoodSaver.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.team3.FoodSaver.model.User;
import com.team3.FoodSaver.service.UserService;

@RestController
@RequestMapping("/api/user")
public class UserController {
	
	@Autowired
	private UserService userService;
	
	@CrossOrigin(origins = "*")
	@GetMapping
	public User getUserByUsername(@RequestParam String username) {
		return userService.getUserByUsername(username);
	}
	
	@PostMapping
	public ResponseEntity<String> createUser(@RequestBody User user) {
		if (userService.createUser(user)) {
			return ResponseEntity.ok("User created successfully!");
		}
		return ResponseEntity.badRequest().body("Failed to create user.");
	}
	
	@DeleteMapping
	public ResponseEntity<String> deleteUser(@RequestBody User userToDelete) {
		if (userService.authenticateUser(userToDelete) && userService.deleteUserByUsername(userToDelete.getUsername())) {
			return ResponseEntity.ok("User deleted successfully!");
		}
		return ResponseEntity.badRequest().body("Failed to delete user.");
	}
	
	@CrossOrigin(origins = "*")
	@PutMapping
	public ResponseEntity<String> updateUser(@RequestBody User updatedUser) {
		if (userService.authenticateUser(updatedUser) && userService.updateUser(updatedUser)) {
			return ResponseEntity.ok("User updated successfully!");
		}
		return ResponseEntity.badRequest().body("Failed to update user.");
	}
}