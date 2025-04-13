package com.team3.FoodSaver.model;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("Users")
public class User {	
	@Id
	public String id;
	
	private String username;
	private String password;
	private String firstName;
	private String lastName;
	private String passwordHash;
	private List<Product> inventory;
	private List<Recipe> recipes;
	
	public User() {
		
	}
	
	public User(String username, String password, String firstName, String lastName) {
		this.username = username;
		this.password = password;
		this.firstName = firstName;
		this.lastName = lastName;
		this.inventory = new ArrayList<>();
		this.recipes = new ArrayList<>();
	}
	
	public User(String username, String password, String firstName, String lastName, List<Product> inventory, List<Recipe> recipes) {
		this.username = username;
		this.password = password;
		this.firstName = firstName;
		this.lastName = lastName;
		this.inventory = inventory;
		this.recipes = recipes;
	}
	
	public String getUsername() {
		return username;
	}
	
	public void setUsername(String username) {
		this.username = username;
	}
	
	public String getPassword() {
		return password;
	}
	
	public void setPassword(String password) {
		this.password = password;
	}
	
	public String getFirstName() {
		return firstName;
	}
	
	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}
	
	public String getLastName() {
		return lastName;
	}
	
	public void setLastName(String lastName) {
		this.lastName = lastName;
	}
	
	public List<Product> getInventory() {
		return inventory;
	}
	
	public void setInventory(List<Product> inventory) {
		this.inventory = inventory;
	}
	
	public List<Recipe> getRecipes() {
		return recipes;
	}
	
	public void setRecipes(List<Recipe> recipes) {
		this.recipes = recipes;
	}
	
	public String getPasswordHash() {
		return passwordHash;
	}
	
	public void setPasswordHash(String hash) {
		this.passwordHash = hash;
	}
	
	@Override
	public String toString() {
	    return "User{" +
	            "id='" + id + '\'' +
	            ", username='" + username + '\'' +
	            ", password='" + password + '\'' +
	            ", firstName='" + firstName + '\'' +
	            ", lastName='" + lastName + '\'' +
	            '}';
	}

}
