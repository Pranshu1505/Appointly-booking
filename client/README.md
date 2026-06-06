# 📅 Appointment Booking System

A full-stack web application for booking appointments built with **React**, **Node.js**, **Express**, and **MongoDB**.

---

## 🚀 Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React, React Router, Axios        |
| Backend    | Node.js, Express.js               |
| Database   | MongoDB + Mongoose                |
| Auth       | JWT (JSON Web Token) + bcryptjs   |
| Styling    | Inline CSS (no extra library)     |

---

## 👥 Two Roles

| Role       | Kya kar sakta hai                                      |
|------------|--------------------------------------------------------|
| Customer   | Services browse karo, slot book karo, bookings manage  |
| Provider   | Services banao, slots add karo, bookings manage karo   |

---

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js v18+
- MongoDB (local ya Atlas)

---

### 2️⃣ Backend Setup
```bash
cd server
npm install
```

`.env` file banao:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/appointment-booking
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
```

Backend run karo:
```bash
npm run dev
```

---

### 3️⃣ Frontend Setup
```bash
cd ../client
npm install
npm run dev
```

---

### 4️⃣ Browser mein kholo

---

## 🌐 API Endpoints

### 🔐 Auth
| Method | Endpoint             | Description        |
|--------|----------------------|--------------------|
| POST   | `/api/auth/register` | Register           |
| POST   | `/api/auth/login`    | Login              |
| GET    | `/api/auth/me`       | Current user info  |

### 🛠 Services
| Method | Endpoint              | Description               |
|--------|-----------------------|---------------------------|
| GET    | `/api/services`       | Saari services            |
| GET    | `/api/services/:id`   | Single service            |
| GET    | `/api/services/categories` | Saari categories    |
| POST   | `/api/services`       | Service banao (provider)  |
| PUT    | `/api/services/:id`   | Service update (provider) |
| DELETE | `/api/services/:id`   | Service delete (provider) |

### 🕐 Slots
| Method | Endpoint                  | Description                  |
|--------|---------------------------|------------------------------|
| GET    | `/api/slots/:serviceId`   | Available slots              |
| POST   | `/api/slots`              | Slot banao (provider)        |
| POST   | `/api/slots/bulk`         | Bulk slots banao (provider)  |
| DELETE | `/api/slots/:id`          | Slot delete (provider)       |

### 📋 Bookings
| Method | Endpoint                    | Description                  |
|--------|-----------------------------|------------------------------|
| POST   | `/api/bookings`             | Appointment book karo        |
| GET    | `/api/bookings/my`          | Meri bookings (customer)     |
| GET    | `/api/bookings/provider`    | Provider ki bookings         |
| GET    | `/api/bookings/stats`       | Dashboard stats (provider)   |
| GET    | `/api/bookings/:id`         | Single booking               |
| PUT    | `/api/bookings/:id/status`  | Status update                |

---

## 🧪 Test Karne Ka Order

### Step 1 — Provider Account Banao

### Step 2 — Provider Dashboard mein:
- **Service banao** — Name, Category, Duration, Price
- **Slots add karo** — Date + Start/End time select karo
- Slots automatically generate ho jayenge!

### Step 3 — Customer Account Banao

### Step 4 — Booking Karo
1. Home page par service dekho
2. **Book Now** click karo
3. Calendar se date choose karo
4. Available slot select karo
5. **Confirm Booking** click karo ✅

---

## 🔐 Authentication Flow

---

## 📊 Booking Status Flow

---

## 👨‍💻 Author

Made with ❤️ using React + Node.js + MongoDB