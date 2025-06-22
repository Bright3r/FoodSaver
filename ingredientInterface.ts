export interface Ingredient {
    name:string,
    description:string,
    nutritionGrade:string,
    imageUrl:string,
}

export interface IngredientInventory {
    name:string,
    description:string,
    qty:number,
    purchaseDate:Date,
    expirationDate:Date,
    productCode?:number
}

export interface SelectListItem {
    key:string,
    value:string
}

export interface Recipe {
    title:string;
    ingredients:string[];
    preparationTime:number;
    instructions:string[];
}