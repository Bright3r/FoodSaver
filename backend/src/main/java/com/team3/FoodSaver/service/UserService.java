package com.team3.FoodSaver.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.team3.FoodSaver.model.User;
import com.team3.FoodSaver.repository.UserRepository;

@Service
public class UserService {

	@Autowired
	private UserRepository userRepo;
	
	public void createUser(User user) {
		userRepo.save(user);
		System.out.println("Added new user: " + user);
	}
}