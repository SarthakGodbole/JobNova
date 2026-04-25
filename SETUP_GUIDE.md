# InternTrack - Complete Setup Guide

## Overview

InternTrack is a full-stack internship application tracker with:
- **Backend**: Express.js + MongoDB + JWT Auth
- **Frontend**: React + Vite + Tailwind CSS

## Quick Start

### Backend Setup

1. **Install dependencies:**
```bash
cd Backend
npm install
```

2. **Create `.env` file:**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/interntrack
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

3. **Start the backend:**
```bash
npm run dev
```

Backend runs on `http://localhost:5000`

### Frontend Setup

1. **Install dependencies:**
```bash
cd Frontend
npm install
```

2. **Create `.env.local` file:**
```env
VITE_API_URL=http://localhost:5000/api
```

3. **Start the frontend:**
```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

## Architecture

### Backend Structure

```
Backend/
├── config/              # Configuration files
│   ├── db.js           # Database configuration
│   └── mail.js         # Email configuration
├── controllers/         # Request handlers
│   ├── auth.controller.js
│   ├── application.controller.js
│   ├── analytics.controller.js
│   └── admin.controller.js
├── models/             # Database schemas
│   ├── user.model.js
│   └── application.model.js
├── routes/             # API routes
├── middleware/         # Authentication & authorization
├── jobs/               # Background jobs (cron)
├── app.js              # Express app setup
├── server.js           # Server entry point
└── package.json
```

### Frontend Structure

```
Frontend/
├── src/
│   ├── components/     # Reusable components
│   ├── context/        # Global state (Auth)
│   ├── hooks/          # Custom React hooks
│   ├── pages/          # Page components
│   │   ├── Login
│   │   ├── Register
│   │   ├── Dashboard
│   │   ├── AddApplication
│   │   ├── EditApplication
│   │   ├── Analytics
│   │   └── AdminPanel
│   ├── routes/         # Route protection
│   ├── services/       # API service layer
│   ├── utils/          # Utilities & constants
│   ├── App.jsx         # Main app with routing
│   └── main.jsx        # Entry point
└── package.json
```

## API Endpoints

### Authentication
```
POST   /api/auth/register      - Register new user
POST   /api/auth/login         - Login user
GET    /api/auth/me            - Get current user
```

### Applications
```
GET    /api/applications       - Get user's applications
POST   /api/applications       - Create new application
GET    /api/applications/:id   - Get single application
PUT    /api/applications/:id   - Update application
DELETE /api/applications/:id   - Delete application
```

### Analytics
```
GET    /api/analytics          - Get user analytics
```

### Admin
```
GET    /api/admin/users        - Get all users
GET    /api/admin/applications - Get all applications
GET    /api/admin/stats        - Get platform statistics
```

## Data Models

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String enum ['student', 'admin'],
  createdAt: Date,
  updatedAt: Date
}
```

### Application Model
```javascript
{
  user: ObjectId (ref: User),
  company: String,
  role: String,
  status: String enum ['Applied', 'Online Assessment', 'Technical Interview', 'HR Interview', 'Offer', 'Rejected'],
  appliedDate: Date,
  deadline: Date,
  jobLink: String (URL),
  notes: String,
  location: String,
  salary: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Authentication Flow

1. **Registration**
   - User fills registration form
   - Frontend sends POST /auth/register
   - Backend creates user (hashes password with bcrypt)
   - Returns JWT token
   - Frontend stores token in localStorage
   - Redirects to dashboard

2. **Login**
   - User enters credentials
   - Frontend sends POST /auth/login
   - Backend verifies credentials
   - Returns JWT token if valid
   - Frontend stores token and redirects

3. **Protected Requests**
   - Frontend includes token in Authorization header
   - Axios interceptor adds `Authorization: Bearer {token}`
   - Backend middleware verifies token
   - Request processed if valid, otherwise returns 401

4. **Logout**
   - Frontend removes token from localStorage
   - Redirects to login page
   - All subsequent requests require re-authentication

## Key Features Explained

### Dashboard
- Shows user's applications in table format
- Real-time stats (total, applied, interviews, offers)
- Search by company or role
- Filter by status
- Quick actions (edit, delete)

### Application Management
- **Add**: Form with all application details
- **Edit**: Pre-populated form for updates
- **Delete**: With confirmation dialog
- Date pickers for applied date and deadline
- Status dropdown with all options
- Optional fields for salary, location, job link, notes

### Analytics
- Total applications count
- Status breakdown (how many in each stage)
- Monthly trend (last 12 months)
- Helps visualize progress over time

### Admin Panel
- **Statistics**: Platform overview (total users, applications, status breakdown)
- **Users**: Table of all registered users with role
- **Applications**: Table of all applications across all users

## Error Handling

### Backend
- Validation errors - 400 Bad Request
- Authentication errors - 401 Unauthorized
- Authorization errors - 403 Forbidden
- Not found - 404 Not Found
- Server errors - 500 Internal Server Error
- Custom error middleware catches and formats errors

### Frontend
- API errors displayed in UI
- Form validation before submission
- Loading states for async operations
- User-friendly error messages

## Security Measures

1. **Password Security**
   - Hashed with bcrypt (12 rounds)
   - Never stored in plain text

2. **Token Security**
   - JWT with expiration (7 days default)
   - Stored in localStorage (consider httpOnly in production)
   - Verified on every protected request

3. **CORS**
   - Configured to allow frontend URL
   - Credentials enabled for cross-domain requests

4. **Authorization**
   - Role-based access control (student vs admin)
   - Protected routes checked on frontend
   - Admin endpoints verified on backend

5. **Data Validation**
   - Email format validation
   - Password length requirements
   - Required field checks

## Testing Credentials

```
Student:
  Email: student@example.com
  Password: password123
  
Admin:
  Email: admin@example.com
  Password: password123
```

## Environment Setup

### Development
```bash
# Both Backend and Frontend should be running
Backend: http://localhost:5000
Frontend: http://localhost:5173
```

### Database
- MongoDB local or cloud (Atlas)
- Connection string in backend .env

### Email (Optional)
- Configured for notifications
- Set up in config/mail.js

## Common Issues & Solutions

### CORS Errors
- Ensure backend CLIENT_URL matches frontend URL
- Check CORS headers in app.js

### Authentication Issues
- Verify JWT_SECRET is same on backend
- Check token not expired
- Clear localStorage and try again

### Database Connection
- MongoDB running and accessible
- Connection string correct in .env
- Check MongoDB logs for errors

### Token Expiration
- Implement refresh token mechanism
- Or increase JWT_EXPIRES_IN temporarily

## Deployment

### Backend Deployment (e.g., Heroku/Railway/Vercel)
1. Set environment variables in platform
2. Connect MongoDB Atlas for production DB
3. Deploy code
4. Update frontend VITE_API_URL to production URL

### Frontend Deployment (e.g., Vercel/Netlify)
1. Build: `npm run build`
2. Set VITE_API_URL to production backend URL
3. Deploy dist folder
4. Configure redirects for client-side routing

## Performance Tips

1. **Backend**
   - Add database indexes
   - Implement caching
   - Use pagination for large datasets

2. **Frontend**
   - Lazy load routes
   - Memoize expensive computations
   - Use virtual scrolling for long lists

## Future Improvements

- Email notifications
- Real-time updates (WebSocket)
- File uploads (resume, offer letter)
- Interview prep resources
- Salary trends
- Mobile app
- Two-factor authentication
- Dark mode
- Export functionality

## Development Workflow

1. **Create feature branch**
   ```bash
   git checkout -b feature/new-feature
   ```

2. **Make changes** (backend and/or frontend)

3. **Test thoroughly**
   - Frontend: Manual testing in browser
   - Backend: Test endpoints with curl/Postman

4. **Commit and push**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   git push origin feature/new-feature
   ```

5. **Create pull request** and review

## Support & Documentation

- Backend API docs in Backend/README.md
- Frontend guide in Frontend/FRONTEND_README.md
- Backend models documentation
- Frontend component documentation

---

**Created**: February 26, 2026
**Status**: Complete and Ready for Development
