# Car Backend

A simple Node.js/Express backend for the Car Project.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

The server will run on `http://localhost:3000`

## Login Credentials

- **Username**: `admin`
- **Password**: `admin123`

## API Endpoints

### Authentication
- `POST /login` - Login and get JWT token

### Cars API
- `GET /api/cars` - Get all cars
- `POST /api/cars` - Create a new car (requires authentication)
- `PUT /api/cars/:id` - Update a car (requires authentication)
- `DELETE /api/cars/:id` - Delete a car (requires authentication)

## Notes

- This is a simple in-memory backend for development/testing
- In production, you should use a real database (PostgreSQL, MongoDB, etc.)
- Change the `SECRET_KEY` in `server.js` for production
- The backend comes with 2 sample cars pre-loaded

