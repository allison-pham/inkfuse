/** @type {import('next').NextConfig} */
const nextConfig = {};
const express = require('express');
const cors = require('cors');

const app = express();

// Add CORS configuration here
const corsOptions = {
    origin: 'http://localhost:3000', // Replace with your frontend URL
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
};

app.use(cors(corsOptions));

// Your other middleware and routes below
app.use(express.json());

// Example route
app.get('/', (req, res) => {
    res.send('CORS is configured!');
});

// Start the server
const PORT = 5000;
app.listen(PORT, () =>
{
    console.log(`Server running on port ${PORT}`);
});

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Mock user database
const users = [];

// Secret key for JWT
const SECRET_KEY = 'your_secret_key';

// Register route
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save user
    users.push({ username, password: hashedPassword });
    res.status(201).send({ message: 'User registered successfully!' });
});

// Login route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Find user
    const user = users.find((u) => u.username === username);
    if (!user) return res.status(400).send({ error: 'Invalid username or password' });

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send({ error: 'Invalid username or password' });

    // Generate JWT
    const token = jwt.sign({ id: user.username }, SECRET_KEY, { expiresIn: '1h' });
    res.send({ token });
});

module.exports = router;

export default nextConfig;
