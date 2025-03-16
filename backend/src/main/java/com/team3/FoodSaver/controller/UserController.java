package com.team3.FoodSaver.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.team3.FoodSaver.model.User;
import com.team3.FoodSaver.service.UserService;

@RestController
@RequestMapping("/api/user")
public class UserController {
	
	@Autowired
	private UserService userService;
	
	@GetMapping
	public String getUser() {
		return "Test";
	}
	
	@PostMapping
	public void createUser() {
		userService.createUser(new User("Chase", "Test"));
	}
}