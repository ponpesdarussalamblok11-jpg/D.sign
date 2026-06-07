# D.sign E-Commerce Setup Guide

## Initial Setup Instructions

### 1. Generate Admin Password Hash

Before running the application, you need to generate a bcrypt hash for your admin password.

```bash
# Create a setup script or use Node.js to generate the hash:
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('your-password-here', 10, (err, hash) => { console.log('Hash:', hash); })"
```

Replace `your-password-here` with your desired admin password.

### 2. Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and update the following:
   ```
   NEXT_PUBLIC_ADMIN_USERNAME=admin
   ADMIN_PASSWORD_HASH=<your_bcrypt_hash_from_step_1>
   JWT_SECRET=<generate_a_random_secure_key>
   ```

**To generate a secure JWT secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 5. Access Admin Panel

- Navigate to `http://localhost:3000/admin/login`
- Username: `admin` (or what you set in `.env.local`)
- Password: The password you used to generate the hash in Step 1

## Security Best Practices

### Environment Variables

⚠️ **CRITICAL**: Never commit `.env.local` to version control. It's in `.gitignore` for your protection.

Essential variables to change:
- `ADMIN_PASSWORD_HASH` - Use a strong password
- `JWT_SECRET` - Use a cryptographically secure random value
- `MONGODB_URI` - If using database
- Payment keys - Keep these private

### Password Security

1. Use a strong admin password (at least 12 characters with mixed case, numbers, and symbols)
2. Change default credentials before deployment
3. Rotate JWT_SECRET periodically
4. Use HTTPS in production

### API Security

All admin endpoints require valid JWT token in Authorization header:
```
Authorization: Bearer <token>
```

## Database Setup (Optional)

To use MongoDB:

1. Install MongoDB locally or use MongoDB Atlas (cloud)
2. Update `MONGODB_URI` in `.env.local`
3. Replace sample data in `/src/pages/api/` with database queries

## Deployment

### For Vercel

1. Push to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_ADMIN_USERNAME`
   - `ADMIN_PASSWORD_HASH`
   - `JWT_SECRET`
4. Deploy

### For Other Platforms

Ensure the following environment variables are set:
- All variables from `.env.example`
- `NODE_ENV=production`

## API Endpoints

### Public Endpoints

- `GET /api/products` - List all products

### Admin Endpoints (Require JWT)

- `POST /api/auth/login` - Admin login
- `GET /api/auth/verify` - Verify JWT token
- `GET /api/admin/orders` - List all orders
- `GET /api/admin/products` - List all products (admin view)

## Troubleshooting

### "Invalid credentials" on login

- Verify the username matches `NEXT_PUBLIC_ADMIN_USERNAME`
- Check that `ADMIN_PASSWORD_HASH` is set correctly
- Regenerate the hash if needed

### "Server configuration error"

- Ensure `ADMIN_PASSWORD_HASH` is set in `.env.local`
- Restart the development server

### Token expired errors

- Clear localStorage and login again
- Increase token expiration time in `/src/pages/api/auth/login.js` if needed

## File Structure Reference

```
src/
├── pages/
│   ├── index.jsx              # Home page
│   ├── admin/
│   │   ├── login.jsx          # Admin login page
│   │   └── dashboard.jsx      # Admin dashboard
│   └── api/
│       ├── products.js        # Public products endpoint
│       ├── auth/
│       │   ├── login.js       # Login endpoint
│       │   └── verify.js      # Token verification
│       └── admin/
│           ├── orders.js      # Admin orders endpoint
│           └── products.js    # Admin products endpoint
└── styles/
    ├── home.css               # Home page styles
    ├── admin-login.css        # Login styles
    └── admin-dashboard.css    # Dashboard styles
```

## Support

For issues or questions, refer to:
- Next.js Documentation: https://nextjs.org/docs
- JWT Guide: https://jwt.io/
- bcryptjs: https://github.com/dcodeIO/bcrypt.js

---

**Last Updated**: 2024
**Version**: 1.0.0