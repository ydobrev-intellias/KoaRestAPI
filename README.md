# Koa REST API

A lightweight REST API built with Koa.js for user authentication and management. The API supports user sign-up, sign-in, sign-out, and CRUD operations on users.

## Features

- User authentication (Sign-up, Sign-in, Sign-out)
- Fetch all users (excluding passwords)
- Fetch a user by ID
- Update user details (including password hashing)
- Delete a user

## Installation

### Steps

1. Clone the repository:
   ```sh
   git clone https://github.com/ydobrev-intellias/KoaRestAPI.git
   cd KoaRestAPI
   ```
2. Install dependencies:

   ```sh
   npm install
   ```

3. Start the server:

   ```sh
   npm run start
   ```

4. **Pre-seeded User**:  
   For testing purposes, a pre-seeded user is available with the following credentials:
   - **Username**: `user`
   - **Password**: `123`  
     You can use these credentials to sign in and try out the endpoints without needing to sign up.

## API Endpoints

### Authentication

| Method | Endpoint   | Description                        |
| ------ | ---------- | ---------------------------------- |
| POST   | `/signup`  | Register a new user                |
| POST   | `/signin`  | Authenticate user and return token |
| POST   | `/signout` | Logout the user                    |

### User Management (Requires authentication)

| Method | Endpoint     | Description                                    |
| ------ | ------------ | ---------------------------------------------- |
| GET    | `/users`     | Get all users (excluding passwords)            |
| GET    | `/users/:id` | Get a user by ID                               |
| PUT    | `/users/:id` | Update user details (e.g., username, password) |
| DELETE | `/users/:id` | Delete a user                                  |

### Profile (Requires authentication)

| Method | Endpoint   | Description                                 |
| ------ | ---------- | ------------------------------------------- |
| GET    | `/profile` | Get profile of currently authenticated user |
