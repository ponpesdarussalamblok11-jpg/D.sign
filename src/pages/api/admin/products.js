import jwt from 'jsonwebtoken';

// Sample products data - replace with database queries
const products = [
  {
    id: 1,
    name: 'Product 1',
    price: 29.99,
    image: '/images/product1.jpg',
    stock: 50,
  },
  {
    id: 2,
    name: 'Product 2',
    price: 49.99,
    image: '/images/product2.jpg',
    stock: 30,
  },
];

const verifyAdminToken = (token) => {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key-change-in-production'
    );
    return decoded.role === 'admin';
  } catch {
    return false;
  }
};

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token || !verifyAdminToken(token)) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    return res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}