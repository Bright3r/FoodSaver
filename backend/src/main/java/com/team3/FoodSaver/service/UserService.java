package com.team3.FoodSaver.service;

import java.util.Date;
import java.util.Iterator;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.team3.FoodSaver.model.Product;
import com.team3.FoodSaver.model.User;
import com.team3.FoodSaver.repository.UserRepository;

@Service
public class UserService {

	@Autowired
	private UserRepository userRepo;
	
	@Autowired
	private BCryptPasswordEncoder passwordEncoder;
	
	public void deleteAll() {
		userRepo.deleteAll();
	}
	
	public User getUserByUsername(String username) {
		// Find user in database
		User user = userRepo.findUserByUsername(username);
		if (user == null) {
			System.out.println("Could not find user: " + user);
			return null;
		}
		
		// Update user data for current time
		List<Product> inventory = user.getInventory();
		List<Product> expired = user.getExpired();
		Iterator<Product> iterator = inventory.iterator();
		while (iterator.hasNext()) {
			Product p = iterator.next();
			
			// Check if expiration date has past
			if (p.getExpirationDate().before(new Date())) {
				expired.add(p);			// move product to expired list
				iterator.remove();		// delete product from kitchen inventory
			}
		}
		user.setInventory(inventory);
		user.setExpired(expired);
		
		// Push changes to database and return user
		try {
			userRepo.save(user);
			return user;
		}
		catch (Exception e) {
			System.out.println(e.getMessage());
			return null;
		}
	}
	
	public boolean createUser(User user) {
		// Make sure user does not already exist
		User existingUser = getUserByUsername(user.getUsername());
		if (existingUser != null) {
			System.out.println("Failed to create user: User already exists");
			return false;
		}
		
		try {
			// Store password hash, DO NOT STORE PLAINTEXT PASSWORD
			user.setPasswordHash(passwordEncoder.encode(user.getPassword()));
			user.setPassword("");
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
			
			// update password hash
			updatedUser.setPasswordHash(passwordEncoder.encode(updatedUser.getPassword()));
			
			// do not save plaintext password
			updatedUser.setPassword("");
			
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
		
		// Check if password is correct
		return passwordEncoder.matches(unauthenticatedUser.getPassword(), user.getPasswordHash());
	}
}