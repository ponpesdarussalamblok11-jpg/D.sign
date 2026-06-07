import jwt from 'jsonwebtoken';

// Sample orders data - replace with database queries
const orders = [
  {
    id: 'ORD001',
    customer: 'John Doe',
    total: 99.99,
    status: 'Completed',
    date: new Date().toISOString(),
  },
  {
    id: 'ORD002',
    customer: 'Jane Smith',
    total: 149.99,
    status: 'Pending',
    date: new Date().toISOString(),
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

    return res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}