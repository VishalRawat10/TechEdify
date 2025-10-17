# 🧠 TechEdify Server (Backend)

Welcome to the **server-side** of the **TechEdify E-Learning Platform**, a robust backend built with the **MERN stack** (MongoDB, Express.js, React, Node.js). This backend powers user authentication, course management, tutor/student dashboards, payment processing, and admin controls for a seamless e-learning experience.

---

## 🚀 Tech Stack

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT) with HTTP-only cookies
- **File Uploads**: Multer & Cloudinary
- **Payments**: Razorpay (Stripe supported with configuration)
- **Email Service**: Nodemailer for SMTP-based emails
- **Validation**: Joi with custom middleware
- **Environment Management**: dotenv for secure configuration

---

## 📂 Project Structure

```
📦 server/
├── 📂 config/                   # Configuration files
│   ├── cloudinary.js           # Cloudinary setup for media uploads
│   ├── db.js                   # MongoDB connection setup
│   ├── email.js                # Nodemailer/SMTP configuration
│   ├── razorpay.js             # Razorpay instance setup
│   └── env.js                  # Environment variable loader/validator
├── 📂 controllers/             # Request/response logic
│   ├── adminController.js      # Admin dashboard and moderation logic
│   ├── authController.js       # Authentication handlers
│   ├── courseController.js     # Course and lecture CRUD operations
│   ├── tutorController.js      # Tutor management and analytics
│   ├── userController.js       # User profile, enrollments, and payments
│   └── paymentController.js    # Payment creation and verification
├── 📂 middlewares/             # Express middleware
│   ├── authMiddleware.js       # Role-based route protection
│   ├── errorMiddleware.js      # Global error handling
│   ├── uploadMiddleware.js     # Multer for file uploads
│   └── asyncHandler.js         # Async route error wrapper
├── 📂 models/                  # Mongoose schema definitions
│   ├── Admin.js                # Admin schema
│   ├── Tutor.js                # Tutor schema
│   ├── User.js                 # User schema
│   ├── Course.js               # Course schema
│   ├── Lecture.js              # Lecture schema
│   ├── Enrollment.js           # Enrollment schema
│   ├── Payment.js              # Payment schema
│   ├── Review.js               # Review schema
│   └── ContactQuery.js         # Support/contact query schema
├── 📂 routes/                  # API route definitions
│   ├── adminRoutes.js          # Admin routes
│   ├── authRoutes.js           # Authentication routes
│   ├── courseRoutes.js         # Course routes
│   ├── tutorRoutes.js          # Tutor routes
│   ├── userRoutes.js           # User routes
│   └── paymentRoutes.js        # Payment routes
├── 📂 services/                # Reusable utilities
│   ├── emailService.js         # Email sending for users/tutors/admins
│   ├── analyticsService.js     # Stats, reports, and charts
│   ├── cloudinaryService.js    # Cloudinary file handling
│   └── paymentService.js       # Payment creation and webhook validation
├── 📂 utils/                   # Helper functions
│   ├── generateToken.js        # JWT generation/verification
│   ├── errorResponse.js        # Custom error handling
│   ├── dateUtils.js            # Date/time formatting
│   ├── calculateStats.js       # Enrollment/revenue calculations
│   └── constants.js            # App-wide constants
├── 📂 validations/             # Joi validation schemas
│   ├── userValidation.js       # User data validation
│   ├── tutorValidation.js      # Tutor data validation
│   ├── courseValidation.js     # Course data validation
│   └── authValidation.js       # Authentication validation
├── 📂 logs/                    # Log files (if Winston/Morgan used)
│   ├── app.log                 # Application logs
│   └── error.log               # Error logs
├── 📂 tests/                   # Unit and integration tests
│   ├── auth.test.js            # Authentication tests
│   ├── user.test.js            # User tests
│   ├── course.test.js          # Course tests
│   └── admin.test.js           # Admin tests
├── .env.example                # Example environment variables
├── .gitignore                  # Ignored files (node_modules, .env, etc.)
├── package.json                # Project dependencies and scripts
├── server.js                   # Main Express entry point
└── README.md                   # Project documentation
```

---

## 🌐 API Overview

This REST API powers the **TechEdify E-Learning Platform**, following RESTful conventions with JSON responses for all endpoints.

### 🧭 Base URL

| Environment | URL                                |
| ----------- | ---------------------------------- |
| Development | `http://localhost:5000/api/v1`     |
| Production  | `https://api.techedify.com/api/v1` |

All endpoints are relative to `/api/v1`.

---

## 🔐 Authentication & Authorization

| Role      | Description                          |
| --------- | ------------------------------------ |
| **User**  | Learner who enrolls in courses       |
| **Tutor** | Instructor creating/managing courses |
| **Admin** | Platform administrator and moderator |

- **Authentication**: JWT-based, sent via HTTP-only cookies.
- **Authorization**: Role-based middleware (`authUser`, `authTutor`, `authAdmin`).

---

## 👩‍🎓 User Routes — `/api/users`

| Method | Endpoint                   | Access | Description                              |
| ------ | -------------------------- | ------ | ---------------------------------------- |
| GET    | `/profile`                 | User   | Fetch logged-in user profile             |
| PUT    | `/profile`                 | User   | Update profile (fullname, contact, etc.) |
| PATCH  | `/profile/change-password` | User   | Change password (requires old password)  |
| GET    | `/enrolled-courses`        | User   | List enrolled courses                    |
| GET    | `/payments`                | User   | Fetch payment and transaction history    |
| POST   | `/contact`                 | Public | Submit support or doubt message          |

---

## 👨‍🏫 Tutor Routes — `/api/tutors`

| Method | Endpoint                                 | Access | Description                                   |
| ------ | ---------------------------------------- | ------ | --------------------------------------------- |
| GET    | `/profile`                               | Tutor  | Fetch tutor profile                           |
| PUT    | `/profile`                               | Tutor  | Update tutor info (e.g., message to students) |
| PATCH  | `/profile/change-password`               | Tutor  | Change tutor password                         |
| GET    | `/courses`                               | Tutor  | List all courses created by tutor             |
| POST   | `/courses`                               | Tutor  | Create new course                             |
| GET    | `/courses/:courseId`                     | Tutor  | Get specific course details                   |
| PUT    | `/courses/:courseId`                     | Tutor  | Update course details                         |
| DELETE | `/courses/:courseId`                     | Tutor  | Delete course                                 |
| GET    | `/courses/:courseId/lectures`            | Tutor  | Fetch all lectures of a course                |
| POST   | `/courses/:courseId/lectures`            | Tutor  | Add new lecture to course                     |
| PUT    | `/courses/:courseId/lectures/:lectureId` | Tutor  | Edit existing lecture                         |
| DELETE | `/courses/:courseId/lectures/:lectureId` | Tutor  | Delete a lecture                              |

---

## 🧑‍💼 Admin Routes — `/api/admin`

| Method | Endpoint                | Access | Description                          |
| ------ | ----------------------- | ------ | ------------------------------------ |
| POST   | `/login`                | Public | Admin login                          |
| POST   | `/logout`               | Admin  | Logout admin                         |
| GET    | `/overview`             | Admin  | Fetch platform-wide statistics       |
| GET    | `/courses`              | Admin  | Fetch all courses                    |
| PATCH  | `/courses/:id/status`   | Admin  | Publish/unpublish a course           |
| DELETE | `/courses/:id`          | Admin  | Delete a course                      |
| GET    | `/tutors`               | Admin  | Fetch all tutors                     |
| PATCH  | `/tutors/:id/suspend`   | Admin  | Suspend/unsuspend a tutor            |
| DELETE | `/tutors/:id`           | Admin  | Delete a tutor                       |
| GET    | `/students`             | Admin  | Fetch all registered students        |
| PATCH  | `/students/:id/suspend` | Admin  | Suspend/unsuspend a student          |
| DELETE | `/students/:id`         | Admin  | Delete a student                     |
| GET    | `/notifications`        | Admin  | Get contact queries/support messages |
| PATCH  | `/notifications/:id`    | Admin  | Mark query as resolved/unresolved    |

---

## 🎓 Course Routes — `/api/courses`

| Method | Endpoint          | Access        | Description                       |
| ------ | ----------------- | ------------- | --------------------------------- |
| GET    | `/`               | Public        | Get all published courses         |
| GET    | `/:id`            | Public        | Get single course details         |
| GET    | `/:id/lectures`   | Enrolled User | Get course lectures               |
| POST   | `/:id/enroll`     | User          | Enroll in a course                |
| GET    | `/category/:type` | Public        | Filter courses by category        |
| GET    | `/top`            | Public        | Get top enrolled/trending courses |

---

## 💳 Payment Routes — `/api/payments`

| Method | Endpoint          | Access | Description                           |
| ------ | ----------------- | ------ | ------------------------------------- |
| POST   | `/create-order`   | User   | Create a Razorpay order               |
| POST   | `/verify`         | User   | Verify payment and record transaction |
| GET    | `/history`        | User   | Fetch all user transactions           |
| GET    | `/admin-overview` | Admin  | Payment overview for dashboard        |

---

## 🗂️ Response Structure

Below is an example JSON response for a successful course fetch:

```json
{
  "message": "Course fetched successfully",
  "course": {
    "_id": "6751afbc784...",
    "title": "MERN Stack Development",
    "alias": "mern-stack",
    "isPublished": true,
    "tutor": {
      "fullname": "John Doe",
      "email": "john@example.com"
    },
    "enrollments": 250
  }
}
```

### Error Response Example

```json
{
  "message": "Invalid course ID",
  "statusCode": 400
}
```

---

## 📦 Installation & Setup

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-username/techedify.git
   cd techedify/server
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Configure environment variables**:

   - Copy `.env.example` to create a `.env` file:
     ```bash
     cp .env.example .env
     ```
   - Update `.env` with your configuration:
     ```bash
     PORT=5000
     MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/tech-edify
     JWT_SECRET=your_jwt_secret
     CLOUDINARY_CLOUD_NAME=your_cloud_name
     CLOUDINARY_API_KEY=your_api_key
     CLOUDINARY_API_SECRET=your_api_secret
     RAZORPAY_KEY_ID=your_razorpay_key
     RAZORPAY_SECRET=your_razorpay_secret
     CLIENT_URL=your_client_url
     ```

4. **Start the development server**:

   ```bash
   npm start
   ```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit changes (`git commit -m "Add your feature"`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

---
