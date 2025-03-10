package com.team3.FoodSaver.repository;

import org.springframework.stereotype.Repository;
import com.team3.FoodSaver.model.User;

@Repository
public class UserRepository {

	public String getUser() {
		User user = new User("Test User");
		return user.getName();
	}
}
