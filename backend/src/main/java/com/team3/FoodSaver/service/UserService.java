package com.team3.FoodSaver.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.team3.FoodSaver.model.User;
import com.team3.FoodSaver.repository.UserRepository;

@Service
public class UserService {

	@Autowired
	private UserRepository userRepo;
	
	public User getUserByUsername(String username) {
		User user = userRepo.findUserByUsername(username);
		
		System.out.println("Found user: " + user);
		return user;
	}
	
	public boolean createUser(User user) {
		try {
			userRepo.save(user);
			
			System.out.println("Added new user: " + user);
			return true;
		}
		catch (Exception e) {
			System.out.println(e.getMessage());
			return false;
		}
	}
}