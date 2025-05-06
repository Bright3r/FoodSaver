

interface User {
    id: string,
    password: string,
    firstName: string,
    lastNmae: string,
    passwordHash: string,
    inventory: Product[],
    expired: Product[],
    recipes: Recipe[],
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