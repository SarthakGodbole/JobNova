# JobNova - Your Smart Job Tracking Platform 
<p align="center">
  <img src="./assets/Landingpage.png" width="80%" />
</p>



---

## 🎯 About

JobNova is a modern, full-stack job and internship tracking platform that helps students and job seekers manage their applications efficiently.

Instead of relying on Excel sheets or scattered notes, JobNova provides a centralized system to track applications, monitor progress, manage deadlines, and stay organized throughout the job search journey.

---

## 🚀 Key Highlights

*  Centralized job application tracking
*  Real-time dashboard with analytics
*  Status tracking (Applied → Interview → Offer → Rejected)
*  Automated email notifications
*  Smart deadline reminders using cron jobs
*  Secure authentication using JWT
*  Modern responsive UI (Dark SaaS design)

---

## ✨ Features

### 👤 For Users

*  Add and manage job/internship applications
*  Update application status
*  Track progress through dashboard
*  Manage deadlines efficiently
*  Receive email notifications and reminders

### ⚙️ Core Features

*  JWT-based authentication system
*  Analytics (Application trends & status breakdown)
*  Nodemailer integration for notifications
*  Node-cron for scheduled reminders
*  Clean and responsive UI

---

## 🛠️ Tech Stack

### 🎨 Frontend

* ⚛️ React (Vite)
* 🎨 Tailwind CSS
* 🔌 Axios

### ⚙️ Backend

*  Node.js
*  Express.js
*  MongoDB + Mongoose
*  JWT Authentication
*  Nodemailer
*  Node-cron

### 🧰 Tools

* Git & GitHub
* Postman
* VS Code

---

## 🏗️ System Architecture

```
User (Browser)
      ↓
React Frontend (UI)
      ↓ API Calls
Node.js / Express Backend
      ↓
MongoDB (Database)

Extra Services:
- Nodemailer → Email Notifications
- Node-cron → Scheduled Jobs
```

---

## 📦 Installation

### 🔧 Prerequisites

* Node.js (v18+)
* MongoDB
* npm

---

### ⚙️ Backend Setup

```bash
cd backend
npm install
npm run dev
```

---

### 🎨 Frontend Setup

```bash
cd InternTrack
npm install
npm run dev
```

---

## ⚙️ Configuration

### 🔑 Backend (.env)

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_app_password
```

---

### 🌐 Frontend (.env)

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 🚀 Usage

### ▶️ Start the Application

**Backend**

```bash
cd backend
npm run dev
```

**Frontend**

```bash
cd InternTrack
npm run dev
```

---

### 🌐 Access

* Frontend: http://localhost:5173
* Backend API: http://localhost:5000

---

## 🌐 Live Demo

🚀 https://your-jobnova-link.com

---

---

## 🔮 Future Improvements

* 🤖 AI Resume Suggestions
* 🔍 Advanced Filtering & Search
* 📅 Calendar Integration
* 📤 Export Reports (PDF/CSV)
* 🏢 Company Insights

---

## 👨‍💻 Author

**Sarthak Godbole**
