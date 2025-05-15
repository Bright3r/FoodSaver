
# FoodSaver Requirements

## Features

### Auth

* Sign Up - Fill out the sign up form fields to create a new user account.

* Login - Fill out the username and password fields with valid credentials to login to the user account.

### Inventory

* Scan Ingredient - Scan a grocery item with the phone camera to automatically load in an ingredient into the inventory.

* Create Ingredient - Click the plus icon and fill out the ingredient fields to manually add a new ingredient to the inventory.

* Edit Ingredient - Click edit on any inventory ingredient to modify its information.

* Delete Ingredient - Click delete on any inventory ingredient to remove it from the inventory.

* View Expiry - Click on the expiry modal button to view the kitchen ingredients that are nearing expiration or have already expired.

### Recipes

* Create Recipe - Click on the plus icon and fill out the recipe fields to manually add a new recipe to the recipe page.

* View Recipe - Click on a recipe to see its required ingredients, preparation time, and substeps.

* Edit Recipe - Click on the edit button while viewing a recipe to modify its information. 

* Delete Recipe - Click on the delete button while viewing a recipe to delete it from the recipe page.

* Suggest Recipes - Click on the recipe suggestion icon and select ingredients from the inventory to query for potential recipes to add to the recipes page.

### Meal Plans

* View Historical Meal Plans - Navigate through the calendar to see meal plans from any day in the past, present, or future.

* Create Meal Plan - Click the add icon to add an additional planned meal to the selected day on the calendar.

* View Meal Plan Recipe - Short tap on a meal plan recipe to view the recipe ingredients and instructions.

* Delete Meal Plan - Long hold on a meal plan recipe to delete it from that day's planned meals.


## Non-functional Requirements

* E2E Encryption - Client-server communication must be cryptographically secure through TLS (HTTPS).

* Password-protected Accounts - Passwords must not be stored as plaintext (BCrypt hashed) and kept confidential while in transit.

* Confidential User Data - User's information must be kept confidential, with valid credentials required to retrieve a user's data.