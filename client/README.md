# 💻 TechEdify Client (Frontend)

Welcome to the **frontend** of the **TechEdify E-Learning Platform**, a modern and interactive interface built with **React**, **Tailwind CSS**, and supporting libraries. It delivers responsive dashboards for users, tutors, and admins to manage courses, lectures, payments, and more.

---

## 🚀 Tech Stack

- **Frontend Framework**: React (v18+)
- **Routing**: React Router DOM (v6+)
- **State Management**: React Context API
- **Styling**: Tailwind CSS
- **UI Components**: Material UI Icons
- **HTTP Client**: Axios with interceptors
- **Forms & Validation**: Custom controlled components
- **Build Tool**: Vite (or Create React App, based on setup)

---

## 🧩 Features

- ✅ Fully responsive, mobile-first design
- ✅ Dark/Light mode toggle (via Context API)
- ✅ Role-based routing for Users, Tutors, and Admins
- ✅ Secure JWT-based authentication (HTTP-only cookies)
- ✅ Real-time updates with Context and Axios interceptors
- ✅ Course browsing, enrollment, and review system
- ✅ Admin analytics and moderation dashboard
- ✅ Tutor course creation, lecture uploads, and earnings dashboard
- ✅ User profile management and payment history
- ✅ Centralized error and success message handling

---

## 📂 Project Structure

```
📦 client/
├── 📂 public/                  # Static assets
|   ├── 📂svg/                  #svg icons
│   └── 📂images/               # images
├── 📂 src/                    # Source code
│   ├── 📂 assets/             # Images, icons, and static files
│   ├── 📂 components/         # Reusable UI components
│   │   └── 📂 ui/             # CourseCard, TutorCard, shard components etc.
|   ├── 📂 layout/             # Header, Sidebar, Footer components
│   ├── 📂 context/            # Global state management
│   │   ├── ThemeContext.jsx   # Theme (dark/light) management
│   │   ├── MessageContext.jsx # Success/error message handling
│   │   ├── UserContext.jsx    # User state management
│   │   ├── TutorContext.jsx   # Tutor state management
│   │   ├── AllContext.jsx     # Provides all context states
│   │   └── AdminContext.jsx   # Admin state management
│   ├── 📂 pages/              # Route-based page components
│   │   ├── 📂 admin/          # Admin dashboard, courses, tutors, students
│   │   ├── 📂 tutor/          # Tutor dashboard, course/lecture management
│   │   └── 📂 user/           # User dashboard, courses, profile
│   ├── 📂 routes/             # Protected route definitions
│   │   ├── AdminRoutes.jsx    # Admin-protected routes
│   │   ├── TutorRoutes.jsx    # Tutor-protected routes
│   │   └── UserRoutes.jsx     # User-protected routes
│   ├── 📂 services/           # API and Axios configuration
|   |   ├── utils.js           # Utility functions like date formatter, validations function
│   │   └── axios.config.js    # Axios instance setup
│   ├── App.jsx                # Root app component
│   ├── main.jsx               # React DOM render entry
|   ├── index.html             # Entry point html page
│   └── index.css              # Global Tailwind styles
├── .env.example               # Example environment variables
├── vite.config.js             # Vite configuration (or package.json for CRA)
└── README.md                  # Project documentation
```

---

## ⚙️ Environment Variables

Create a `.env` file in the `/client` directory based on `.env.example`. Example configuration:

```bash
VITE_API_BASE_URL=http://localhost:8080/
VITE_RAZORPAY_KEY_ID=your_razorpay_key
```

> **Note**: Ensure environment variables are prefixed with `VITE_` if using Vite, or `REACT_APP_` if using Create React App.

---

## 🧭 Routing Overview

The application leverages **React Router DOM (v6+)** for navigation with role-based access control.

### Public Routes

| Path           | Description    |
| -------------- | -------------- |
| `/`            | Home page      |
| `/courses`     | Course listing |
| `/courses/:id` | Course details |
| `/contact`     | Contact page   |
| `/about`       | About page     |
| `/login`       | Login page     |
| `/signup`      | Signup page    |

### User Routes

| Path                 | Description            |
| -------------------- | ---------------------- |
| `/dashboard`         | User dashboard         |
| `/discussions`       | User's discussions     |
| `/courses/:id/learn` | Enrolled user lectures |

### Tutor Routes

| Path                                            | Description                     |
| ----------------------------------------------- | ------------------------------- |
| `/tutor/login`                                  | Tutor login                     |
| `/tutor/dashboard`                              | Tutor dashboard overview        |
| `/tutor/discussions`                            | Tutor discussions               |
| `/tutor/courses`                                | Manage created courses          |
| `/tutor/courses/:courseId`                      | Edit course or add lectures     |
| `/tutor/courses/create-course`                  | Create new course form          |
| `/tutor/courses/:courseId/lectures`             | Show lectures and edit lectures |
| `/tutor/courses/:courseId/lectures/add-lecture` | Add lectures                    |
| `/tutor/profile`                                | Tutor profile management        |

### Admin Routes

| Path               | Description              |
| ------------------ | ------------------------ |
| `/admin/login`     | Admin login              |
| `/admin/dashboard` | Admin dashboard overview |

---

## 📦 Installation & Setup

1. **Clone the repository**:

   ```bash
   git clone https://github.com/VishalRawat10/TechEdify.git
   cd techedify/client
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Configure environment variables**:

   - Copy the example environment file:
     ```bash
     cp .env.example .env
     ```
   - Update `.env` with your API base URL and Razorpay keys.

4. **Start the development server**:

   ```bash
   npm run dev
   ```

5. **Build for production** (optional):

   ```bash
   npm run build
   ```

---

## 🛠️ Development Tips

- **Security**: Avoid exposing sensitive data in `.env` files. Ensure `.env` is listed in `.gitignore`.
- **API Integration**: Use the `axios.config.js` file to configure interceptors for handling authentication tokens and errors.
- **Performance**: Optimize with lazy loading for routes and code-splitting for large components.

---

## 🤝 Contributing

We welcome contributions! Follow these steps to contribute:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m "Add your feature"`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request with a clear description.

Please adhere to the project's coding standards and include tests for new features.

---

## 📞 Contact

For questions or support, reach out via the [Contact Page](https://techedify.vercel.app/contact) or open an issue on GitHub.
