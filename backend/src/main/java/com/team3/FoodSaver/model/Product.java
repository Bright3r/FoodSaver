package com.team3.FoodSaver.model;

import java.util.Date;

public class Product {
    private String name;
    private int qty;
    private Date purchaseDate;
    private Date expirationDate;
    private String description;
    private String nutritionGrade;
    private String imageURL;

    public Product() {
    	
    }
    
    public Product(String name, int qty, Date purchaseDate, Date expirationDate) {
        this.name = name;
        this.qty = qty;
        this.purchaseDate = purchaseDate;
        this.expirationDate = expirationDate;
        this.description = "";
        this.nutritionGrade = "";
        this.imageURL = "";
    }
    
    public Product(String name, int qty, Date purchaseDate, Date expirationDate, String description, String nutritionGrade, String imageURL) {
        this.name = name;
        this.qty = qty;
        this.purchaseDate = purchaseDate;
        this.expirationDate = expirationDate;
        this.description = description;
        this.nutritionGrade = nutritionGrade;
        this.imageURL = imageURL;
    }

    public String getName() {
        return name;
    }

    public int getQty() {
        return qty;
    }

    public Date getPurchaseDate() {
        return purchaseDate;
    }

    public Date getExpirationDate() {
        return expirationDate;
    }
    
    public String getDescription() {
    	return description;
    }
    
    public String getNutritionGrade() {
    	return nutritionGrade;
    }
    
    public String getImageURL() {
    	return imageURL;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setQty(int qty) {
        this.qty = qty;
    }

    public void setPurchaseDate(Date purchaseDate) {
        this.purchaseDate = purchaseDate;
    }

    public void setExpirationDate(Date expirationDate) {
        this.expirationDate = expirationDate;
    }
    
    public void setDescription(String description) {
    	this.description = description;
    }
    
    public void setNutritionGrade(String nutritionGrade) {
    	this.nutritionGrade = nutritionGrade;
    }
    
    public void setImageURL(String imageURL) {
    	this.imageURL = imageURL;
    }

    @Override
    public String toString() {
        return "Product{" +
                "name='" + name + '\'' +
                ", qty='" + qty + '\'' +
                ", datePurchased='" + purchaseDate + '\'' +
                ", expirationDate='" + expirationDate + '\'' +
                '}';
    }
}
