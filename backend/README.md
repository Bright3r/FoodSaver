# FoodSaver Backend
## Getting Started
To run the Springboot project, we suggest using the Eclipse IDE. Once this repository has been cloned, do the following in Eclipse:
- Select File->Import
- Locate the Maven dropdown menu and select "Existing Maven Projects"
- Select Browse and locate the "backend" folder of this repository

Eclipse and Maven should fetch all of the required dependencies and handle all configuration for you. However, environment variables are still required to run the Springboot server.
Create a .env file under "src/main/resources", and enter the following:
- PORT=8083
- DB_URI=mongodb+srv://<db_username>:<db_password>@<cluster>
- DB_NAME=foodsaver
- OPENAI_API_KEY=<openai_api_key>

The .env variables must be filled out for your local environment and MongoDB cluster. The DB_URI is located on MongoDB Atlas after creating a new cluster for this project.

After those configuration steps, the server should be ready to run!

## API Examples
**CREATE**
curl -X POST "http://localhost:8083/api/user" -H "Content-Type: application/json" -d '{"id":"67d7a9b8a0748e037cce1c45","username":"NEW_USER","password":"pass","firstName":"Joshua","lastName":"Johnson","inventory":[{"name":"Slim Jims","qty":999,"purchaseDate":"2025-03-17T04:48:56.554+00:00","expirationDate":"2025-03-24T04:48:56.554+00:00"}]}'

**READ**
curl -X GET "http://localhost:8083/api/user?username=user2"

**UPDATE**
curl -X PUT "http://localhost:8083/api/user" -H "Content-Type: application/json" -d '{"id":"67d7a9b8a0748e037cce1c45","username":"user2","password":"password2","firstName":"Betty","lastName":"Crocker","inventory":[{"name":"Milk","qty":2,"purchaseDate":"2025-03-17T04:48:56.554+00:00","expirationDate":"2025-03-24T04:48:56.554+00:00"}]}'

**DELETE**
curl -X DELETE "http://localhost:8083/api/user?username=user2"

**SIGNUP**
curl -X POST "http://localhost:8083/api/auth/signup" -H "Content-Type: application/json" -d '{"username": "NEW_USER", "password": "pass", "firstName": "New", "lastName": "User"}'

**LOGIN**
curl -X POST "http://localhost:8083/api/auth/login" -H "Content-Type: application/json" -d '{"username": "user1", "password": "password1"}'

**RECIPE CREATION**
curl -X GET "http://localhost:8083/api/recipe/search" -H "Content-Type: application/json" -d '{"ingredients": "eggs, beans, cheese"}'