
# FoodSaver




## Running the application

* Clone the repository
```bash
git clone https://github.com/Bright3r/FoodSaver.git
```

* cd to the expo application directory (frontent)
```bash
cd FoodSaver/src/frontend
```

* Install npm packages
```bash
npm install --legacy-peer-deps
```

* Start application using Expo (use --tunnel to connect over IP)
```bash
npx expo start --tunnel
```

** Tunneling sometimes fails with an ngrok error, but usually works after retrying the command

* Press "s" to select the Expo Go version of the application


* Scan the QR code provided by Expo using your mobile device to open the application on the Expo Go application

**You may need to download Expo Go through Google Play Store or App Store first if the QR code does not direct you to the playstore automatically

**The application must be run through Expo Go, as the Reactive Native features are not all web-compatible

## Using the application
* The application opens to the login page, where you can also sign up for a new user account

* You can also use the "demo" user with these login credentials
```bash
Username: demo
Password: demodemo
```

* The demo user provides a good overview of all of the application features, including many inventory items, expiry items, recipes, and meal plans out of the box

* However, the app should be fairly intuitive to navigate and use, as there are tabs for each primary feature of the application

## Self-hosting the backend
* Should the backend endpoint be down, self-hosting of the backend is possible

* The README file in the src/backend folder contains the instructions for setting up the Java Spring Boot backend server

* A MongoDB cluster and OpenAI API key must be provided to the backend's .env file, both of which have free versions

* After setting up the backend server, go to src/frontend/consts.ts and change the SERVER_URI to the Spring Boot server's URI (i.e. localhost:8080).

* Then, proceed with running the application as normal through Expo Go