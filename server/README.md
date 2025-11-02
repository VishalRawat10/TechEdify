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
- **Validation**: Joi with custom middleware
- **Environment Management**: dotenv for secure configuration

---

## 📂 Project Structure

```
📦 server/
├── 📂 config/                    # Configuration files
│   ├── cloudinary.config.js        # Cloudinary setup for media uploads
│   ├── db.config.js                # MongoDB connection setup
│   ├── joiSchema.config.js         # Joi-schema definition
│   └── razorpay.config.js          # Razorpay instance setup
├── 📂 controllers/               # Request/response logic
│   ├── admin.controller.js         # Admin dashboard and moderation logic
│   ├── queryMessage.controller.js  # Query messages from contact form
│   ├── course.controller.js        # Course and lecture CRUD operations
│   ├── tutor.controller.js         # Tutor management and analytics
│   ├── user.controller.js          # User profile, enrollments, and payments
│   └── payment.controller.js       # Payment creation and verification
├── 📂 middlewares/               # Express middleware
│   └── middlewares.js              # All the middlwares
├── 📂 models/                    # Mongoose schema definitions
│   ├── admin.js                    # Admin schema
│   ├── tutor.js                    # Tutor schema
│   ├── user.js                     # User schema
│   ├── course.js                   # Course schema
│   ├── lecture.js                  # Lecture schema
│   ├── enrollment.js               # Enrollment schema
│   ├── payment.js                  # Payment schema
│   ├── discussion.js               # Discussion schema
│   ├── message.js                  # Message schema
│   ├── blacklistToken.js           # Blacklisted token schema
│   └── queryMessage.js             # Support/contact query schema
├── 📂 routes/                    # API route definitions
│   ├── admin.routes.js             # Admin routes
│   ├── course.routes.js            # Course routes
│   ├── tutor.routes.js             # Tutor routes
│   ├── user.routes.js              # User routes
│   ├── queryMessage.routes.js      # QueryMessage routes
│   └── payment.routes.js           # Payment routes
├── 📂 utils/                     # Helper functions
│   ├── jwtUtils.js                 # JWT generation/verification
│   ├── ExpressError.js             # Custom error handling
│   └── wrapAsync.js                # Asynchronous error handling
├── 📂 socket/                    # Socket logic
│   └── index.js                    # Socket events
├── .env.example                  # Example environment variables
├── .gitignore                    # Ignored files (node_modules, .env, etc.)
├── package.json                  # Project dependencies and scripts
├── app.js                        # Main Express entry point
├── server.js                     # Http server setup, express and socket integration
└── README.md                     # Project documentation
```

---

## 🌐 API Overview

This REST API powers the **TechEdify E-Learning Platform**, following RESTful conventions with JSON responses for all endpoints.

### 🧭 Base URL

| Environment | URL                                     |
| ----------- | --------------------------------------- |
| Development | `http://localhost:8080/api/v1`          |
| Production  | `https://techedify.onrender.com/api/v1` |

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

## 👩‍🎓 User Routes — `/api/v1/users`

| Method | Endpoint                              | Access | Description                              |
| ------ | ------------------------------------- | ------ | ---------------------------------------- |
| POST   | `/login`                              | Public | Login as user                            |
| POST   | `/signup`                             | User   | Signup as user                           |
| POST   | `/logout`                             | User   | Logout from the app                      |
| GET    | `/profile`                            | User   | Fetch logged-in user profile             |
| PUT    | `/profile`                            | User   | Update profile (fullname, contact, etc.) |
| PATCH  | `/profile/change-password`            | User   | Change password (requires old password)  |
| GET    | `/enrolled-courses`                   | User   | List enrolled courses                    |
| GET    | `/payments`                           | User   | Fetch payment and transaction history    |
| POST   | `/undiscussed-tutors`                 | User   | Fetch undiscussed tutors with user       |
| GET    | `/discussions       `                 | User   | Fetch discussions                        |
| POST   | `/discussions       `                 | User   | Create a discussion                      |
| GET    | `/discussions/:discussionId/messages` | User   | Fetch discussion messages                |
| GET    | `/unread-messages       `             | User   | Fetch unread messages for user           |

---

## 👨‍🏫 Tutor Routes — `/api/v1/tutors`

| Method | Endpoint                                 | Access | Description                                   |
| ------ | ---------------------------------------- | ------ | --------------------------------------------- |
| GET    | `/home-page`                             | Public | Fetch tutors for home page                    |
| POST   | `/login`                                 | Public | Login as tutor                                |
| POST   | `/logout`                                | Tutor  | Logout as tutor                               |
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
| GET    | `/courses/undiscussed`                   | Tutor  | Fetch undiscussed courses                     |
| GET    | `/dashboard`                             | Tutor  | Get the dashboard stats                       |
| GET    | `/discussions`                           | Tutor  | Fetch all tutor's discussions                 |
| POST   | `/discussions`                           | Tutor  | Create new discussion                         |
| GET    | `/discussions/:discussionId/messages`    | Tutor  | Fetch discussion messages                     |
| GET    | `/messages/unread`                       | Tutor  | Fetch all tutor's unread messages             |
| GET    | `/undiscussed-users`                     | Tutor  | Fetch all undiscussed users with tutor        |

---

## 🧑‍💼 Admin Routes — `/api/v1/admin`

| Method | Endpoint                    | Access | Description                     |
| ------ | --------------------------- | ------ | ------------------------------- |
| POST   | `/login`                    | Public | Admin login                     |
| POST   | `/logout`                   | Admin  | Logout admin                    |
| GET    | `/profile`                  | Admin  | Fetch admin info                |
| PUT    | `/profile`                  | Admin  | Update admin info               |
| PATCH  | `/profile/change-password`  | Admin  | Change password                 |
| GET    | `/overview-stats`           | Admin  | Fetch platform-wide statistics  |
| GET    | `/enrollment-stats`         | Admin  | Fetch enrollment statistics     |
| GET    | `/monthly-growth`           | Admin  | Fetch monthly growth statistics |
| GET    | `/courses`                  | Admin  | Fetch all courses               |
| PATCH  | `/courses/:courseId/status` | Admin  | Publish/unpublish a course      |
| DELETE | `/courses/:courseId`        | Admin  | Delete a course                 |
| GET    | `/tutors`                   | Admin  | Fetch all tutors                |
| POST   | `/tutors`                   | Admin  | Create a tutor                  |
| PATCH  | `/tutors/:tutorId/status`   | Admin  | Suspend/unsuspend a tutor       |
| DELETE | `/tutors/:tutorId`          | Admin  | Delete a tutor                  |
| GET    | `/students`                 | Admin  | Fetch all registered students   |
| PATCH  | `/students/:id/status`      | Admin  | Suspend/unsuspend a student     |
| DELETE | `/students/:id`             | Admin  | Delete a student                |

---

## 🎓 Course Routes — `/api/v1/courses`

| Method | Endpoint                  | Access        | Description               |
| ------ | ------------------------- | ------------- | ------------------------- |
| GET    | `/`                       | Public        | Get all published courses |
| GET    | `/:id`                    | Public        | Get single course details |
| GET    | `/:id/lectures`           | Enrolled User | Get course lectures       |
| GET    | `/:id/lectures/lectureId` | Enrolled User | Get course lectures       |
| POST   | `/:id/enroll`             | User          | Enroll in a course        |
| GET    | `/home-page`              | Public        | Get courses for home page |

---

## 💳 Payment Routes — `/api/v1/payments`

| Method | Endpoint  | Access | Description                           |
| ------ | --------- | ------ | ------------------------------------- |
| POST   | `/`       | User   | Create a Razorpay order               |
| POST   | `/verify` | User   | Verify payment and record transaction |

---

## ☁️ QueryMessage Routes — `/api/v1/query-messages`

| Method | Endpoint | Access | Description                    |
| ------ | -------- | ------ | ------------------------------ |
| GET    | `/`      | Admin  | Fetch all query-messages       |
| POST   | `/`      | Public | Create a query-message         |
| PATCH  | `/:id`   | Admin  | Mark as resolved or unresolved |

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
  "message": "Invalid course ID"
}
```

---

## 📦 Installation & Setup

1. **Clone the repository**:

   ```bash
   git clone https://github.com/VishalRawat10/TechEdify.git
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
     PORT=8080
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
