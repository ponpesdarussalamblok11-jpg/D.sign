# D.sign E-Commerce Platform

A secure e-commerce website with admin authentication and password protection.

## Features

- 🔐 Admin login system with password protection
- 📦 Product catalog and management
- 🛒 Shopping cart functionality
- 💳 Checkout process
- 📊 Admin dashboard
- 🔒 Environment-based security

## Tech Stack

- **Frontend**: Next.js, React, HTML/CSS, JavaScript
- **Backend**: Node.js
- **Authentication**: JWT-based admin login
- **Database**: MongoDB (optional, can be configured)

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/ponpesdarussalamblok11-jpg/D.sign.git
cd D.sign

# Install dependencies
npm install

# Create .env.local file with your configuration
cp .env.example .env.local

# Run development server
npm run dev
```

### Environment Variables

See `.env.example` for required environment variables.

### Admin Login

- Default admin route: `/admin/login`
- Dashboard: `/admin/dashboard`

## Project Structure

```
D.sign/
├── public/              # Static files
├── src/
│   ├── pages/          # Next.js pages
│   ├── components/     # Reusable components
│   ├── api/            # API routes
│   ├── utils/          # Utility functions
│   ├── lib/            # Libraries and helpers
│   └── styles/         # CSS files
├── .env.example        # Environment variables template
├── package.json        # Dependencies
└── README.md          # This file
```

## License

Private - All rights reserved

## Contact

For business inquiries, contact: D.sign