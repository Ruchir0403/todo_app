# To-Do List REST API

A simple RESTful API for managing to-do items, built with Node.js, Express.js, and MySQL.

## Features

- Create, read, update, delete (CRUD) tasks
- Status counts endpoint
- Parameterized queries to prevent SQL injection
- Environment-based configuration

## Setup

1. **Clone & install**

   ```bash
   git clone <your-repo-url>
   cd todo-app
   npm install

**Configure Environment Variables**
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD="YourPasswordHere"
DB_NAME=todo_app
PORT=3000

**Important: If your password contains special characters like # or @, wrap it in quotes to avoid parsing issues. (example-"xyz1234#")**

2. **Create Database & Table**
   ```bash
   mysql -u root -p #enter password if prompted
   SOURCE /full/path/to/database.sql; #in the SQL environment

3. **Start MySQL Server**
   ```bash
   mysql -u root -p

4. **Start the node server**
   ```bash
   npm start

## API Endpoints
| Method | Route                  | Description                  |
| ------ | ---------------------- | ---------------------------- |
| POST   | `/todos`               | Create a new to-do           |
| GET    | `/todos`               | Get all to-dos (with search) |
| GET    | `/todos/:id`           | Get a to-do by ID            |
| PUT    | `/todos/:id`           | Update a to-do               |
| DELETE | `/todos/:id`           | Delete a to-do               |
| GET    | `/todos/counts/status` | Get counts by status         |



