package com.team3.FoodSaver.model;

import java.util.Date;

public class MealPlan {
	private Recipe recipe;
	private Date date;
	
	public MealPlan(Recipe recipe, Date date) {
		this.recipe = recipe;
		this.date = date;
	}
	
	public Recipe getRecipe() {
		return recipe;
	}
	
	public void setRecipe(Recipe recipe) {
		this.recipe = recipe;
	}
	
	public Date getDate() {
		return date;
	}
	
	public void setDate(Date date) {
		this.date = date;
	}
}