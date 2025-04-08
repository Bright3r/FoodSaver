package com.team3.FoodSaver;

import java.sql.Date;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

import com.team3.FoodSaver.model.Product;
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
		
        // Create test dates
        Date purchaseDate = new Date(System.currentTimeMillis()); // Today's date
        Date expirationDate = new Date(System.currentTimeMillis() + (7L * 24 * 60 * 60 * 1000)); // 7 days from now

        // Create test products
        Product milk = new Product("Milk", 2, purchaseDate, expirationDate);
        Product apple = new Product("Apple", 3, purchaseDate, expirationDate);
        Product bread = new Product("Bread", 1, purchaseDate, expirationDate);
        Product steak = new Product("Steak", 6, purchaseDate, expirationDate);
        Product chicken = new Product("Chicken", 8, purchaseDate, expirationDate);
        
        // Create test inventory
        List<Product> inventory = new ArrayList<>();
        inventory.add(milk);
		
		// Seed database
		userRepo.save(new User("user1", "password1", "Alfred", "Bones", inventory));
		userRepo.save(new User("user2", "password2", "Betty", "Carter", inventory));
		userRepo.save(new User("user3", "password3", "Charlie", "Davis", inventory));
		userRepo.save(new User("user4", "password4", "David", "Evans", inventory));
		userRepo.save(new User("user5", "password5", "Emma", "Fletcher", inventory));
		
		inventory.add(apple);
		userRepo.save(new User("user6", "password6", "Frank", "Green", inventory));
		userRepo.save(new User("user7", "password7", "Grace", "Hill", inventory));
		userRepo.save(new User("user8", "password8", "Hank", "Ingram", inventory));
		userRepo.save(new User("user9", "password9", "Ivy", "Johnson", inventory));
		userRepo.save(new User("user10", "password10", "Jack", "Keller", inventory));
		
		inventory.remove(0);
		inventory.add(bread);
		inventory.add(steak);
		userRepo.save(new User("user11", "password11", "Katie", "Lewis", inventory));
		userRepo.save(new User("user12", "password12", "Liam", "Moore", inventory));
		userRepo.save(new User("user13", "password13", "Mia", "Nash", inventory));
		userRepo.save(new User("user14", "password14", "Nathan", "O'Brien", inventory));
		userRepo.save(new User("user15", "password15", "Olivia", "Parker", inventory));
		
		inventory.remove(steak);
		inventory.add(chicken);
		userRepo.save(new User("user16", "password16", "Paul", "Quinn", inventory));
		userRepo.save(new User("user17", "password17", "Quincy", "Reed", inventory));
		userRepo.save(new User("user18", "password18", "Rachel", "Stone", inventory));
		userRepo.save(new User("user19", "password19", "Samuel", "Taylor", inventory));
		userRepo.save(new User("user20", "password20", "Tina", "Walker", inventory));
	}
}
