# 📚 TechEdify E-Learning Platform

Welcome to **TechEdify**, a full-stack **e-learning platform** built with the **MERN stack** (MongoDB, Express.js, React, Node.js). TechEdify empowers learners, tutors, and admins with intuitive dashboards to browse, create, and manage online courses, handle payments, and access analytics in a secure and responsive environment.

This repository contains both the **backend** (`server/`) and **frontend** (`client/`) components of the platform, designed to work seamlessly together to deliver a robust e-learning experience.

---

## 🚀 Project Overview

TechEdify is a feature-rich platform that supports:

- **Users**: Browse and enroll in courses, manage profiles, and view payment history.
- **Tutors**: Create and manage courses, upload lectures, and track earnings.
- **Admins**: Oversee platform operations, moderate content, and access analytics.
- **Features**: Secure JWT-based authentication, real-time updates, responsive design, and integrated payment processing.

The project is split into two main directories:

- **server/**: Backend API built with Node.js, Express.js, and MongoDB.
- **client/**: Frontend interface built with React, Tailwind CSS, and React Router DOM.

---

## 🧩 Tech Stack

### Backend (server/)

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with HTTP-only cookies
- **File Uploads**: Multer & Cloudinary
- **Payments**: Razorpay (Stripe supported)
- **Email Service**: Nodemailer
- **Validation**: Joi with custom middleware
- **Environment**: dotenv

### Frontend (client/)

- **Framework**: React (v18+)
- **Routing**: React Router DOM (v6+)
- **State Management**: React Context API
- **Styling**: Tailwind CSS
- **UI Components**: Material UI Icons
- **HTTP Client**: Axios with interceptors
- **Animations**: Framer Motion (optional)
- **Build Tool**: Vite (or Create React App)

---

## 📂 Project Structure

```
📦 techedify/
├── 📂 client/                 # Frontend codebase (React)
│   ├── 📂 src/               # React components, pages, and utilities
│   ├── .env.example          # Example environment variables
│   ├── tailwind.config.js    # Tailwind CSS configuration
│   ├── vite.config.js        # Vite configuration
│   └── README.md             # Frontend documentation
├── 📂 server/                 # Backend codebase (Node.js/Express)
│   ├── 📂 src/               # API routes, controllers, and models
│   ├── .env.example          # Example environment variables
│   ├── package.json          # Backend dependencies and scripts
│   └── README.md             # Backend documentation
├── .gitignore                # Ignored files (node_modules, .env, etc.)
├── LICENSE                   # Project license (MIT)
└── README.md                 # Project overview (this file)
```

---

## ⚙️ Getting Started

Follow these steps to set up and run the TechEdify platform locally.

### Prerequisites

- **Node.js**: v18 or higher
- **MongoDB**: Local or cloud instance (e.g., MongoDB Atlas)
- **Cloudinary**: For file uploads
- **Razorpay**: For payment processing (or Stripe, if configured)
- **Git**: For cloning the repository

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-username/techedify.git
   cd techedify
   ```

2. **Set up the backend** (`server/`):

   ```bash
   cd server
   npm install
   cp .env.example .env
   ```

   - Update `.env` with your MongoDB URI, JWT secret, Cloudinary, and Razorpay credentials (see `server/README.md` for details).

3. **Set up the frontend** (`client/`):

   ```bash
   cd ../client
   npm install
   cp .env.example .env
   ```

   - Update `.env` with the API base URL, Cloudinary, and Razorpay keys (see `client/README.md` for details).

4. **Start the backend server**:

   ```bash
   cd server
   npm start
   ```

   - The server runs on `http://localhost:5000` by default.

5. **Start the frontend development server**:

   ```bash
   cd ../client
   npm run dev
   ```

   - The frontend runs on `http://localhost:5173` (Vite default) or `http://localhost:3000` (CRA).

6. **Access the application**:
   - Open `http://localhost:5173` (or `http://localhost:3000`) in your browser.
   - Ensure the backend is running to handle API requests.

---

## 📖 Detailed Documentation

For in-depth setup and API details, refer to the dedicated README files:

- **[Backend Documentation](./server/README.md)**: Covers API endpoints, folder structure, and backend setup.
- **[Frontend Documentation](./client/README.md)**: Details frontend components, routes, and setup.

---

## 🛠️ Development Tips

- **Environment Variables**: Keep `.env` files secure and never commit them to version control. Use `.gitignore` to exclude them.
- **Testing**: Add tests for both backend (`server/tests/`) and frontend (`client/tests/`) using Jest or similar frameworks.
- **API Integration**: Ensure the frontend’s `VITE_API_BASE_URL` matches the backend’s base URL (`http://localhost:5000/api/v1` in development).
- **Deployment**: Consider hosting the backend on Heroku/AWS and the frontend on Vercel/Netlify for production.

---

## 🤝 Contributing

We welcome contributions to TechEdify! To contribute:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit changes (`git commit -m "Add your feature"`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request with a clear description.

Please review the coding standards in `server/README.md` and `client/README.md` before submitting.

---

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 📞 Contact

For questions or support, visit the [Contact Page](https://techedify.com/contact) or open an issue on GitHub.

---
