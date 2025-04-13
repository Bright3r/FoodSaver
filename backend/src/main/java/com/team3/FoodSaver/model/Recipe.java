package com.team3.FoodSaver.model;

import java.util.List;

public class Recipe {
	public String title;
	public List<String> ingredients;
	public int preparationTime;
	public List<String> instructions;
	
	public Recipe(String title, List<String> ingredients, int preparationTime, List<String> instructions) {
		this.title = title;
		this.ingredients = ingredients;
		this.preparationTime = preparationTime;
		this.instructions = instructions;
	}
}