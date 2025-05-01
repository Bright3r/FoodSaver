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
    expirationDate:Date,
    productCode?:number
}

export interface SelectListItem {
    key:string,
    value:string
}