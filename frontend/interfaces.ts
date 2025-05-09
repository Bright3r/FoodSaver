

interface User {
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

interface Product {
    name: string,
    qty: number,
    purchaseDate: Date,
    expirationDate: Date,
};

interface Recipe {
    title: string,
    ingredients: string[],
    preparationTime: number,
    instructions: string[],
};

interface Meal {
    recipe: Recipe,
    date: Date,
};

interface MealPlan {
    meals: Meal[],
}