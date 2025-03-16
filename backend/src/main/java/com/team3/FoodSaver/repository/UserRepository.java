package com.team3.FoodSaver.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.team3.FoodSaver.model.User;

public interface UserRepository extends MongoRepository<User, String> {

	@Query("{name:'?0'}")
	User findUserByName(String name);
}
