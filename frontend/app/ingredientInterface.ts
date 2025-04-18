// Import this interface instead.

export interface Ingredient {
    name:string,
    description:string,
    nutritionGrade:string,
    imageUrl:string,
}

export interface IngredientInventory {
    name:string,
    qty:number,
    purchaseDate:Date,
    expirationDate:Date
}