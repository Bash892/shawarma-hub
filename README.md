# 🌯 Shawarma Hub  
**A full-stack food delivery web application built with the MERN stack + Stripe.**  

Delicious shawarma, delivered fast. Pickup and delivery from your favorite local spot.  
Customers can browse shawarma, wraps, salads, and more - add to cart, place orders, and pay securely.  
Admins can manage menu items, orders, and workers through a secure dashboard.

**Status:** ✅ **Live & Deployed** | Backend: Render | Frontend: Vercel

---

## 🚀 Live Demo  

**🌐 Frontend (Vercel):** [https://shawarma-hub-beta.vercel.app](https://shawarma-hub-beta.vercel.app)  
**🔧 Backend API (Render):** [https://shawarma-hub-backend.onrender.com](https://shawarma-hub-backend.onrender.com)

> **Note:** The backend may take a few seconds to spin up on first request (Render free tier cold starts).

---

# 🛠 Tech Stack

### **Frontend**
- React.js 19  
- Tailwind CSS (modern, responsive design)  
- React Router (client-side routing)  
- Context API (authentication & global state)  
- Responsive design (mobile-first approach)

### **Backend**
- Node.js + Express.js  
- MongoDB + Mongoose (database & ODM)  
- JWT Authentication (secure sessions)  
- Stripe Checkout + Webhooks (payment processing)  
- RESTful API architecture  

---

# ✨ Features

## 👤 **User Features**
- Create account & login  
- Browse menu featuring shawarma, wraps, salads, desserts, drinks, and more  
- Add to cart (localStorage persistent)  
- Choose **Delivery** or **Pickup** with dedicated interfaces  
- Secure checkout using **Stripe**  
- View order history with detailed status tracking  
- Modern, responsive UI inspired by Uber Eats design  
- Real-time order status updates

---

## 🔐 **Admin Features**
Accessible only to accounts created with `ADMIN_SECRET`.

- Admin Login / Register  
- **Advanced Dashboard** with real-time metrics, revenue analytics, and order insights  
- **Menu Management** - Add/remove items with image uploads  
- **Order Management** - View all orders, update statuses, assign workers  
- **Worker Management** - Add staff, create schedules, track availability  
- **Sales Analytics** - Daily, weekly, and monthly revenue tracking  
- Modern, responsive admin interface with gradient designs

---

# 🎨 Design Highlights

- **Modern UI/UX** - Inspired by Uber Eats with gradient hero sections, card-based layouts, and smooth transitions
- **Responsive Design** - Fully optimized for mobile, tablet, and desktop
- **Advanced Admin Dashboard** - Real-time metrics, analytics, and intuitive controls
- **User-Friendly Cart** - Separate interfaces for delivery and pickup with clear instructions
- **Order Tracking** - Visual status indicators and detailed order history
- **Professional Aesthetics** - Clean, modern design with orange accent colors matching the Shawarma Hub brand

---

# 📁 Project Structure

```
Shawarma-Hub/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   ├── utils/
    │   ├── App.js
    │   ├── index.js
    ├── .env.example
    └── package.json
```

---

# ⚙️ Environment Variables

## **Backend (`backend/.env`)**
```env
MONGO_URL=mongodb+srv://user:password@cluster.mongodb.net/shawarma_hub
JWT_SECRET=your-super-secret-jwt-key-here
ADMIN_SECRET=your-admin-registration-secret
STRIPE_API_KEY=sk_test_your_stripe_secret_key
CLIENT_URL=http://localhost:3000
# For production: CLIENT_URL=https://shawarma-hub-beta.vercel.app
```

## **Frontend (`frontend/.env`)**
```env
REACT_APP_API_BASE_URL=http://localhost:5000
# For production: REACT_APP_API_BASE_URL=https://shawarma-hub-backend.onrender.com
```

> **Note:** Real `.env` files are not committed — only `.env.example`.  
> For production deployments, set these in your hosting platform's environment variables dashboard.

---

# 🚀 Getting Started

## Clone the Repository  
```bash
git clone <your-repo-url>
cd shawarma-hub
```

---

# ▶️ Backend Setup

```
cd backend
npm install
npm run dev
```

Backend runs at:  
👉 http://localhost:5000

---

# 💻 Frontend Setup

```
cd frontend
npm install
npm start
```

Frontend runs at:  
👉 http://localhost:3000

---

# 💳 Stripe Setup

1. Create a Stripe account  
2. Add your API keys to `backend/.env`  
3. Restart your server  

---

# 🧪 Testing the App

**Try it live:** [https://shawarma-hub-beta.vercel.app](https://shawarma-hub-beta.vercel.app)

### User Flow
1. Register a new account or login
2. Browse the menu and add items to cart
3. Choose **Delivery** (enter address) or **Pickup** (view location)
4. Complete checkout via Stripe (use test card: `4242 4242 4242 4242`)
5. View order history and track status

### Admin Flow
1. Register via `/admin/register` using your `ADMIN_SECRET`
2. Login to access admin dashboard
3. View real-time metrics and analytics
4. Manage menu items (add/remove with images)
5. View all orders and update statuses
6. Assign workers to orders
7. Manage staff and create schedules

### Test Cards (Stripe)
- **Success:** `4242 4242 4242 4242`
- **Decline:** `4000 0000 0000 0002`
- Use any future expiry date and any CVC  

---

# 📦 Deployment

This project is deployed and live:

- **Backend → Render** (Web Service)
- **Frontend → Vercel** (Static Site)
- **Database → MongoDB Atlas** (Cloud)

## Deployment Instructions

### Backend (Render)

1. Create a new **Web Service** on [Render](https://render.com)
2. Connect your GitHub repository
3. Set **Root Directory** to `backend`
4. Build Command: `npm install`
5. Start Command: `npm start`
6. Add Environment Variables:
   - `MONGO_URL` - Your MongoDB Atlas connection string
   - `JWT_SECRET` - A secure random string
   - `ADMIN_SECRET` - Secret for admin registration
   - `STRIPE_API_KEY` - Your Stripe secret key
   - `CLIENT_URL` - Your Vercel frontend URL (e.g., `https://shawarma-hub-beta.vercel.app`)
   - `PORT` - Leave empty (Render auto-assigns)

### Frontend (Vercel)

1. Create a new **Project** on [Vercel](https://vercel.com)
2. Import your GitHub repository
3. Set **Root Directory** to `frontend`
4. Build Command: `npm run build` (auto-detected)
5. Output Directory: `build` (auto-detected)
6. Add Environment Variable:
   - `REACT_APP_API_BASE_URL` - Your Render backend URL (e.g., `https://shawarma-hub-backend.onrender.com`)

### MongoDB Atlas

1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Whitelist Render's IP (or use `0.0.0.0/0` for development)
3. Create a database user
4. Get your connection string and add to Render environment variables

### Stripe Webhooks

For production payments, configure Stripe webhooks:
1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://your-backend-url.onrender.com/api/payments/webhook`
3. Select events: `checkout.session.completed`, `payment_intent.succeeded`
4. Copy webhook signing secret to Render env as `STRIPE_WEBHOOK_SECRET` (if used)

---

# 👨‍💻 Author  
**Abdullah Bashir**  
Built with ❤️ for Shawarma Hub

---

# ⭐ Contribute  
Pull requests are welcome. For major changes, open an issue first to discuss your ideas.

---

# 📄 License  
MIT License © 2025 Shawarma Hub
