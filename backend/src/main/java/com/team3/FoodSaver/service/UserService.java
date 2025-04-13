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
		if (user == null) {
			System.out.println("Could not find user: " + user);
			return null;
		}
		
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
	
	public boolean deleteUserByUsername(String username) {
		User user = getUserByUsername(username);
		
		try {
			userRepo.delete(user);
			
			System.out.println("Deleted user: " + user);
			return true;
		}
		catch (Exception e) {
			System.out.println("Could not delete user: " + user);
			System.out.println(e.getMessage());
			return false;
		}
	}
	
	public boolean updateUser(User updatedUser) {
		User oldUser = getUserByUsername(updatedUser.getUsername());
		
		try {
			// assign updated user the same document id as old user's document
			updatedUser.id = oldUser.id;
			
			// overwrite old user document with updated user
			userRepo.save(updatedUser);
			return true;
		}
		catch (Exception e) {
			System.out.println("Could not update user: " + updatedUser);
			System.out.println(e.getMessage());
			return false;
		}
	}
	
	public boolean authenticateUser(User unauthenticatedUser) {
		User user = getUserByUsername(unauthenticatedUser.getUsername());
		
		// User does not exist
		if (user == null) {
			return false;
		}
		// User password is incorrect
		else if (!unauthenticatedUser.getPassword().equals(user.getPassword())) {
			return false;
		}
		
		// User is authenticated
		return true;
	}
}