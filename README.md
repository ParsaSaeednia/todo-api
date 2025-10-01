# Todo API

A robust REST API for managing todo items built with Express.js, TypeScript, and Sequelize ORM with SQLite database.

## 🚀 Features

- ✅ **Complete CRUD Operations** - Create, Read, Update, Delete todos
- 📝 **TypeScript Support** - Full type safety and better development experience
- 🗄️ **SQLite Database** - Lightweight, file-based database with Sequelize ORM
- 📚 **Swagger Documentation** - Interactive API documentation at `/api-docs`
- 🔄 **Hot Reload** - Development server with automatic restart on changes
- 🏗️ **Clean Architecture** - Separated controllers, services, and models
- 🛡️ **Error Handling** - Proper error responses and validation

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Language**: TypeScript
- **Database**: SQLite with Sequelize ORM
- **Documentation**: Swagger/OpenAPI
- **Development**: Nodemon, ts-node

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd express-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will automatically:
   - Create a `db.sqlite` database file in the project root
   - Set up the database schema
   - Start the server on `http://localhost:3000`

## 📖 Usage

Once the server is running, you can:

- **View API Documentation**: Visit `http://localhost:3000/api-docs`
- **Test the API**: Use the Swagger UI or make HTTP requests to the endpoints

### API Endpoints

| Method | Endpoint         | Description         |
| ------ | ---------------- | ------------------- |
| GET    | `/api/todos`     | Get all todos       |
| GET    | `/api/todos/:id` | Get a specific todo |
| POST   | `/api/todos`     | Create a new todo   |
| PUT    | `/api/todos/:id` | Update a todo       |
| DELETE | `/api/todos/:id` | Delete a todo       |

### Example Requests

**Create a Todo**

```bash
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Learn TypeScript", "description": "Study TypeScript fundamentals"}'
```

**Get All Todos**

```bash
curl http://localhost:3000/api/todos
```

**Update a Todo**

```bash
curl -X PUT http://localhost:3000/api/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"title": "Learn TypeScript", "completed": true}'
```

## 📚 API Documentation

Interactive API documentation is available at:
**http://localhost:3000/api-docs**

The Swagger UI provides:

- Detailed endpoint descriptions
- Request/response schemas
- Try-it-out functionality
- Example payloads

## 🏗️ Project Structure

```
express-app/
├── src/
│   ├── app.ts                 # Main application setup
│   ├── database.ts            # Database connection & configuration
│   ├── controllers/
│   │   └── todoController.ts  # HTTP request handlers
│   ├── services/
│   │   └── todoService.ts     # Business logic & database operations
│   ├── models/
│   │   └── todo.ts            # Sequelize data models
│   └── routes/
│       └── todo.ts            # Route definitions
├── db.sqlite                  # SQLite database file (auto-generated)
├── package.json
├── tsconfig.json             # TypeScript configuration
└── README.md
```

## 📜 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm test` - Run tests (currently placeholder)

## 🗄️ Database

The application uses SQLite as the database:

- **File**: `db.sqlite` (automatically created in project root)
- **ORM**: Sequelize
- **Auto-sync**: Database schema is automatically created/updated on startup

### Todo Model Schema

```typescript
{
  id: number (auto-increment, primary key)
  title: string (required)
  description: string (optional)
  completed: boolean (default: false)
  createdAt: DateTime
  updatedAt: DateTime
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

If you have any questions or issues, please open an issue on GitHub.

---

**Happy coding! 🎉**
