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
	private List<Product> inventory;
	
	public User() {
		
	}
	
	public User(String username, String password, String firstName, String lastName) {
		this.username = username;
		this.password = password;
		this.firstName = firstName;
		this.lastName = lastName;
		this.inventory = new ArrayList<>();
	}
	
	public User(String username, String password, String firstName, String lastName, List<Product> inventory) {
		this.username = username;
		this.password = password;
		this.firstName = firstName;
		this.lastName = lastName;
		this.inventory = inventory;
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
