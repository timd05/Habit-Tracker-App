# Habit Tracker Backend

This is the **backend** of the Habit Tracker App.  
It provides the API and database logic to handle user authentication, habit creation, and progress tracking.

---

## Tech Stack
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/) (or your chosen framework)
- [MongoDB Community Edition](https://www.mongodb.com/try/download/community) (running locally)
- [npm](https://www.npmjs.com/) for package management

---

## Getting Started

### Prerequisites
- Install **MongoDB Community Edition** locally.  
  By default, it runs on `mongodb://127.0.0.1:27017`.

### Installation
1. Navigate into the backend folder:
   ```bash
   cd backend

2. Install dependencies:
    ```bash
    npm install

3. Create a .env file:
    ```sh
    PORT=3000
    MONGO_URI=mongodb://127.0.0.1:27017/habit-tracker

4. Start MongoDB locally (if not already running):
    ```bash
    mongod
    
5. Start the server:
    ```bash
    npm start
