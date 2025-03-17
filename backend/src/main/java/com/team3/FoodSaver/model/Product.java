package com.team3.FoodSaver.model;

import java.util.Date;

public class Product {
    private String name;
    private int qty;
    private Date purchaseDate;
    private Date expirationDate;

    public Product(String name, int qty, Date purchaseDate, Date expirationDate) {
        this.name = name;
        this.qty = qty;
        this.purchaseDate = purchaseDate;
        this.expirationDate = expirationDate;
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
