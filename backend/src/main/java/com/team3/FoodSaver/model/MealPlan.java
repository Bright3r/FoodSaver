package com.team3.FoodSaver.model;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class MealPlan {
	private List<Meal> meals;
	
	public MealPlan() {
		meals = new ArrayList<Meal>();
	}
	
	public void addMeal(Recipe recipe, Date date) {
		this.meals.add(new Meal(recipe, date));
	}
	
	public List<Meal> getMeals() {
		return meals;
	}
	
	public void setMeals(List<Meal> meals) {
		this.meals = meals;
	}

	public record Meal(Recipe recipe, Date date) { }
}