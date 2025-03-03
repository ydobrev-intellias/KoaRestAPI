# Koa REST API

A lightweight REST API built with Koa.js for user authentication and management. The API supports user sign-up, sign-in, sign-out, and CRUD operations on users and posts.

## Features

- **User Authentication:**

  - Sign-up, sign-in, and sign-out functionality.
  - Passwords are hashed during sign-up and login processes.

- **User Management:**

  - Fetch all users (passwords excluded).
  - Fetch user by ID.
  - Update user details (partial updates supported, including password changes).
  - Delete a user.

- **Post Management:**
  - Fetch all posts (no authentication required).
  - Fetch a post by ID (no authentication required).
  - Create, update, and delete posts (authentication required; only the post owner can update or delete their posts).

## Technologies Used

- **Koa.js** for building the REST API
- **Drizzle ORM** for database management
- **PostgreSQL** as the database
- **Docker Compose** for containerized services
- **JWT (JSON Web Tokens)** for user authentication

## Prerequisites

Before running the application, ensure you have the following installed and running:

- Docker Desktop installed and started
- Node.js (latest LTS version recommended)

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

3. Start the required services (PostgreSQL, etc.) using Docker Compose:

   ```sh
   npm run start:docker
   ```

   > **Note:** Ensure the database is fully set up before proceeding to the next step.

4. Open a new terminal window and start the server after the database has been initialized:

   ```sh
   npm run start:server
   ```

   > **Tip:** Wait until the PostgreSQL container shows that the database system is ready to accept connections (as mentioned) before starting the server to ensure smooth operation.

## Structures

### User Structure

A user consists of the following structure:

```json
{
  "id": "integer", // Auto-generated ID of the user
  "username": "string", // Username of the user (unique)
  "password": "string" // Hashed password of the user
}
```

### Post Structure

A post consists of the following structure:

```json
{
  "id": "integer", // Auto-generated ID of the post
  "userId": "integer", // ID of the user who created the post (this is a foreign key to the users table)
  "title": "string", // Title of the post
  "content": "string" // Content of the post (may include text, markdown, etc.)
}
```

## API Endpoints

### Authentication

- For authentication, only the username and password are required in the request body.

| Method | Endpoint         | Description                                      |
| ------ | ---------------- | ------------------------------------------------ |
| POST   | `/auth/sign-up`  | Register a new user (no authentication required) |
| POST   | `/auth/sign-in`  | Authenticate user (no authentication required)   |
| POST   | `/auth/sign-out` | Logout the user (authentication required)        |

### User Management (Requires authentication for updating and deleting users)

- The `id` field **cannot be updated**. When updating a user, you can **partially update** the user’s details (e.g., update the username or password or both), but only the provided fields will be changed.

| Method | Endpoint     | Description                                                                                                              |
| ------ | ------------ | ------------------------------------------------------------------------------------------------------------------------ |
| GET    | `/users`     | Get all users (no authentication required)                                                                               |
| GET    | `/users/:id` | Get a user by ID (no authentication required)                                                                            |
| PATCH  | `/users/:id` | Update user details (e.g., username, password, authentication required; **do not include id field in the request body**) |
| DELETE | `/users/:id` | Delete a user (authentication required)                                                                                  |

### Post Management (Requires authentication for creating, updating, and deleting posts)

- The user must be authenticated to create, update, or delete posts. Only the post owner can update or delete their post.
- Fetching posts does not require authentication.

| Method | Endpoint         | Description                                                                                                                        |
| ------ | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| GET    | `/posts`         | Get all posts (no authentication required)                                                                                         |
| GET    | `/posts/:postId` | Get a post by ID (no authentication required)                                                                                      |
| POST   | `/posts`         | Create a new post (authentication required; **do not include id or userId field in the request body**)                             |
| PATCH  | `/posts/:postId` | Update a post (only the post owner can update, authentication required; **do not include id or userId field in the request body**) |
| DELETE | `/posts/:postId` | Delete a post (only the post owner can delete, authentication required)                                                            |
