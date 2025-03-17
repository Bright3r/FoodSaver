package com.team3.FoodSaver;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

import com.team3.FoodSaver.model.User;
import com.team3.FoodSaver.repository.UserRepository;

import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
@EnableMongoRepositories
public class FoodSaverApplication implements CommandLineRunner {
	@Autowired
	UserRepository userRepo;
	
	public static void main(String[] args) {
		// Load environment variables
		Dotenv dotenv = Dotenv.load();
		System.setProperty("PORT", dotenv.get("PORT"));
		System.setProperty("DB_URI", dotenv.get("DB_URI"));
		System.setProperty("DB_NAME", dotenv.get("DB_NAME"));
		
		SpringApplication.run(FoodSaverApplication.class, args);
	}

	public void run(String... args) {
		// Reset database
		userRepo.deleteAll();
		
		// Seed database
		userRepo.save(new User("user1", "password1", "Alfred", "Bones"));
		userRepo.save(new User("user2", "password2", "Betty", "Carter"));
		userRepo.save(new User("user3", "password3", "Charlie", "Davis"));
		userRepo.save(new User("user4", "password4", "David", "Evans"));
		userRepo.save(new User("user5", "password5", "Emma", "Fletcher"));
		userRepo.save(new User("user6", "password6", "Frank", "Green"));
		userRepo.save(new User("user7", "password7", "Grace", "Hill"));
		userRepo.save(new User("user8", "password8", "Hank", "Ingram"));
		userRepo.save(new User("user9", "password9", "Ivy", "Johnson"));
		userRepo.save(new User("user10", "password10", "Jack", "Keller"));
		userRepo.save(new User("user11", "password11", "Katie", "Lewis"));
		userRepo.save(new User("user12", "password12", "Liam", "Moore"));
		userRepo.save(new User("user13", "password13", "Mia", "Nash"));
		userRepo.save(new User("user14", "password14", "Nathan", "O'Brien"));
		userRepo.save(new User("user15", "password15", "Olivia", "Parker"));
		userRepo.save(new User("user16", "password16", "Paul", "Quinn"));
		userRepo.save(new User("user17", "password17", "Quincy", "Reed"));
		userRepo.save(new User("user18", "password18", "Rachel", "Stone"));
		userRepo.save(new User("user19", "password19", "Samuel", "Taylor"));
		userRepo.save(new User("user20", "password20", "Tina", "Walker"));
	}
}
