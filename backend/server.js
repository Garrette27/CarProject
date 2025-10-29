import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { expressjwt } from 'express-jwt';
import fs from 'fs';

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = 'your-secret-key-change-in-production'; // Change this in production!

// Middleware
app.use(cors());
app.use(express.json());

// Load data from file or initialize with default data
const DATA_FILE = 'data.json';

const loadData = () => {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.log('No existing data file, using defaults');
  }
  
  return {
    cars: [
      {
        id: 1,
        brand: 'Toyota',
        model: 'Camry',
        color: 'Blue',
        registrationNumber: 'ABC-123',
        modelYear: 2020,
        price: 25000,
      },
      {
        id: 2,
        brand: 'Honda',
        model: 'Civic',
        color: 'Red',
        registrationNumber: 'XYZ-789',
        modelYear: 2019,
        price: 22000,
      }
    ],
    users: []
  };
};

const saveData = () => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ cars, users }, null, 2));
  } catch (error) {
    console.error('Error saving data:', error);
  }
};

// Load existing data or initialize
let { cars, users } = loadData();

// Initialize default admin user
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

const initData = async () => {
  // Check if admin user already exists
  if (users.length === 0) {
    const hashedPassword = await hashPassword('admin123');
    users.push({ username: 'admin', password: hashedPassword });
    saveData();
    console.log('Admin user initialized. Username: admin, Password: admin123');
  }
};

// Initialize on startup
initData();

// JWT authentication middleware
const authenticateJWT = expressjwt({
  secret: SECRET_KEY,
  algorithms: ['HS256'],
  getToken: (req) => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1];
    }
    return null;
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  const user = users.find(u => u.username === username);
  
  if (user) {
    const validPassword = await bcrypt.compare(password, user.password);
    
    if (validPassword) {
      const token = jwt.sign(
        { username: user.username, role: 'admin' },
        SECRET_KEY,
        { expiresIn: '24h' }
      );
      
      res.setHeader('authorization', token);
      res.json({ message: 'Login successful' });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Cars API endpoints
app.get('/api/cars', (req, res) => {
  // Return in HAL format to match frontend expectations
  const carsWithLinks = cars.map(car => ({
    ...car,
    _links: {
      self: { href: `/api/cars/${car.id}` },
      car: { href: `/api/cars/${car.id}` },
      owner: { href: `/api/owners/${car.id}` }
    }
  }));

  res.json({
    _embedded: {
      cars: carsWithLinks
    }
  });
});

app.post('/api/cars', authenticateJWT, (req, res) => {
  const { brand, model, color, registrationNumber, modelYear, price } = req.body;
  const newCar = {
    id: cars.length > 0 ? Math.max(...cars.map(c => c.id)) + 1 : 1,
    brand,
    model,
    color,
    registrationNumber,
    modelYear,
    price,
  };
  cars.push(newCar);
  saveData(); // Save to file
  
  res.json({
    ...newCar,
    _links: {
      self: { href: `/api/cars/${newCar.id}` },
      car: { href: `/api/cars/${newCar.id}` },
      owner: { href: `/api/owners/${newCar.id}` }
    }
  });
});

app.delete('/api/cars/:id', authenticateJWT, (req, res) => {
  const id = parseInt(req.params.id);
  const index = cars.findIndex(car => car.id === id);
  
  if (index !== -1) {
    cars.splice(index, 1);
    saveData(); // Save to file
    res.json({ message: 'Car deleted' });
  } else {
    res.status(404).json({ message: 'Car not found' });
  }
});

// Update endpoint - matches frontend PUT with full URL
app.put('*', authenticateJWT, (req, res) => {
  const url = req.originalUrl;
  const match = url.match(/\/api\/cars\/(\d+)/);
  
  if (match) {
    const id = parseInt(match[1]);
    const index = cars.findIndex(car => car.id === id);
    
    if (index !== -1) {
      const { brand, model, color, registrationNumber, modelYear, price } = req.body;
      cars[index] = {
        ...cars[index],
        brand,
        model,
        color,
        registrationNumber,
        modelYear,
        price,
      };
      saveData(); // Save to file
      
      res.json({
        ...cars[index],
        _links: {
          self: { href: `/api/cars/${cars[index].id}` },
          car: { href: `/api/cars/${cars[index].id}` },
          owner: { href: `/api/owners/${cars[index].id}` }
        }
      });
    } else {
      res.status(404).json({ message: 'Car not found' });
    }
  } else {
    res.status(404).json({ message: 'Invalid URL' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Use these credentials to login:');
  console.log('Username: admin');
  console.log('Password: scramble123');
});
