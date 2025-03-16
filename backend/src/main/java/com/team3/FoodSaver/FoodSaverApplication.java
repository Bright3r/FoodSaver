package com.team3.FoodSaver;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
@EnableMongoRepositories
public class FoodSaverApplication{

	public static void main(String[] args) {
		// Load environment variables
		Dotenv dotenv = Dotenv.load();
		System.setProperty("PORT", dotenv.get("PORT"));
		System.setProperty("DB_URI", dotenv.get("DB_URI"));
		System.setProperty("DB_NAME", dotenv.get("DB_NAME"));
		
		SpringApplication.run(FoodSaverApplication.class, args);
	}

}
