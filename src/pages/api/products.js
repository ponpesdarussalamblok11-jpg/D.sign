// Sample products data - replace with database queries
const products = [
  {
    id: 1,
    name: 'Product 1',
    price: 29.99,
    image: '/images/product1.jpg',
    description: 'High quality product',
  },
  {
    id: 2,
    name: 'Product 2',
    price: 49.99,
    image: '/images/product2.jpg',
    description: 'Premium product',
  },
  {
    id: 3,
    name: 'Product 3',
    price: 39.99,
    image: '/images/product3.jpg',
    description: 'Best seller',
  },
];

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    return res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}