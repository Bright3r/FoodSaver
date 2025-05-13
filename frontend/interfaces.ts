

export interface User {
    id: string,
    username: string,
    password: string,
    firstName: string,
    lastName: string,
    passwordHash: string,
    inventory: Product[],
    expired: Product[],
    recipes: Recipe[],
    mealPlans: MealPlan[],
};

export interface Product {
    name: string,
    qty: number,
    description:string,
    nutritionGrade:string,
    imageURL:string,
    purchaseDate: Date,
    expirationDate: Date,
};

export interface Recipe {
    title: string,
    ingredients: string[],
    preparationTime: number,
    instructions: string[],
};

export interface Meal {
    recipe: Recipe,
    date: Date,
};

export interface MealPlan {
    meals: Meal[],
}

export interface SelectListItem {
    key:string,
    value:string
}