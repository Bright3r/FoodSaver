package com.team3.FoodSaver;

import java.sql.Date;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

import com.team3.FoodSaver.model.MealPlan;
import com.team3.FoodSaver.model.Product;
import com.team3.FoodSaver.model.Recipe;
import com.team3.FoodSaver.model.User;
import com.team3.FoodSaver.service.UserService;

import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
@EnableMongoRepositories
public class FoodSaverApplication implements CommandLineRunner {
	@Autowired
	UserService userService;
	
	public static void main(String[] args) {
		// Load environment variables
		Dotenv dotenv = Dotenv.load();
		System.setProperty("PORT", dotenv.get("PORT"));
		System.setProperty("DB_URI", dotenv.get("DB_URI"));
		System.setProperty("DB_NAME", dotenv.get("DB_NAME"));
		System.setProperty("OPENAI_API_KEY", dotenv.get("OPENAI_API_KEY"));
		
		SpringApplication.run(FoodSaverApplication.class, args);
	}

	public void run(String... args) {
		// Reset database
		userService.deleteAll();
		
        // Create test dates
        Date purchaseDate = new Date(System.currentTimeMillis()); 								 // Today's date
        Date expirationDate = new Date(System.currentTimeMillis() + (7L * 24 * 60 * 60 * 1000)); // 7 days from now
        Date expiredDate = new Date(System.currentTimeMillis() - (7L * 24 * 60 * 60 * 1000));	 // 7 days ago

        // Create test products
        Product milk = new Product("Milk", 2, purchaseDate, expiredDate);
        Product apple = new Product("Apple", 3, purchaseDate, expirationDate);
        Product bread = new Product("Bread", 1, purchaseDate, expirationDate);
        Product steak = new Product("Steak", 6, purchaseDate, expirationDate);
        Product chicken = new Product("Chicken", 8, purchaseDate, expirationDate);
        
        // Create test recipes
        Recipe r1 = new Recipe(
        		"Cheesy Bean Omelette", 
        		List.of("2 eggs", "1/2 cup beans", "1/4 cup cheese", "salt", "pepper"), 
        		10, 
        		List.of("Whisk the eggs in a bowl with salt and pepper.", "Heat a non-stick pan over medium heat and pour in the eggs.", "Cook until the edges start to set, then add the beans and cheese on one half.", "Fold the omelette and cook until the cheese melts.")
        );
        Recipe r2 = new Recipe(
        		"Pepperoni Pizza",
        		List.of("1 Pizza Dough", "1 cup pepperoni", "3 cups mozarrella", "1 cup marinara"),
        		60,
        		List.of("Spread marinara on dough.", "Place cheese on top of pizza.", "Add pepperonis to top of pizza.", "Bake in oven at 450 for 15 minutes.")
        );
        List<Recipe> recipes = new ArrayList<>();
        recipes.add(r1);
        recipes.add(r2);
        
        // Create test meal plans
        List<MealPlan> plan1 = new ArrayList<>();;
        plan1.add(new MealPlan(r1, purchaseDate));
        plan1.add(new MealPlan(r2, purchaseDate));
        
        List<MealPlan> plan2 = new ArrayList<>();
        plan2.add(new MealPlan(r2, expirationDate));
        
        // Create test expired ingredients list
        List<Product> expired = new ArrayList<>();
        
        // Create test kitchen inventory
        List<Product> inventory = new ArrayList<>();
        inventory.add(milk);
		
		// Seed database
		userService.createUser(new User("user1", "password1", "Alfred", "Bones", inventory, expired, recipes, plan1));
		userService.createUser(new User("user2", "password2", "Betty", "Carter", inventory, expired, recipes, plan1));
		userService.createUser(new User("user3", "password3", "Charlie", "Davis", inventory, expired, recipes, plan1));
		userService.createUser(new User("user4", "password4", "David", "Evans", inventory, expired, recipes, plan1));
		userService.createUser(new User("user5", "password5", "Emma", "Fletcher", inventory, expired, recipes, plan1));
		
		inventory.add(apple);
		userService.createUser(new User("user6", "password6", "Frank", "Green", inventory, expired, recipes, plan1));
		userService.createUser(new User("user7", "password7", "Grace", "Hill", inventory, expired, recipes, plan1));
		userService.createUser(new User("user8", "password8", "Hank", "Ingram", inventory, expired, recipes, plan1));
		userService.createUser(new User("user9", "password9", "Ivy", "Johnson", inventory, expired, recipes, plan1));
		userService.createUser(new User("user10", "password10", "Jack", "Keller", inventory, expired, recipes, plan1));
		
		inventory.remove(0);
		inventory.add(bread);
		inventory.add(steak);
		userService.createUser(new User("user11", "password11", "Katie", "Lewis", inventory, expired, recipes, plan1));
		userService.createUser(new User("user12", "password12", "Liam", "Moore", inventory, expired, recipes, plan1));
		userService.createUser(new User("user13", "password13", "Mia", "Nash", inventory, expired, recipes, plan2));
		userService.createUser(new User("user14", "password14", "Nathan", "O'Brien", inventory, expired, recipes, plan2));
		userService.createUser(new User("user15", "password15", "Olivia", "Parker", inventory, expired, recipes, plan2));
		
		inventory.remove(steak);
		inventory.add(chicken);
		userService.createUser(new User("user16", "password16", "Paul", "Quinn", inventory, expired, recipes, plan2));
		userService.createUser(new User("user17", "password17", "Quincy", "Reed", inventory, expired, recipes, plan2));
		userService.createUser(new User("user18", "password18", "Rachel", "Stone", inventory, expired, recipes, plan2));
		userService.createUser(new User("user19", "password19", "Samuel", "Taylor", inventory, expired, recipes, plan2));
		userService.createUser(new User("user20", "password20", "Tina", "Walker", inventory, expired, recipes, plan2));
	}
}
