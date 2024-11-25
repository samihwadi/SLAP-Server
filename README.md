# Student Learning Access Portal (SLAP) Server - Backend Repository

This repository contains the backend codebase for the **Student Learning Access Portal (SLAP)**. Built using Node.js and Express, this server powers the platform’s core functionality, including user authentication, course management, assignment handling, and communication between users.

## Table of Contents

1. [Purpose](#purpose)
2. [Technologies](#technologies)
3. [Features](#features)
4. [License](#license)

## 1. Purpose <a name="purpose"></a>

The **Student Learning Access Portal (SLAP) Server** is the backbone of the SLAP system. It facilitates secure and efficient communication between the frontend interface and the database, ensuring seamless management of user authentication, course data, and assignment submissions. This server is designed to provide a robust and scalable API for managing the needs of students, instructors, and administrators.

The outlined functionality and architecture aim to serve as a reference for development and maintenance teams working on the SLAP Server.

## 2. Technologies <a name="technologies"></a>

The server is developed with the following stack:

- **Node.js**: For building a fast and scalable server.
- **Express**: For API routing and middleware handling.
- **JSON Web Tokens (JWT)**: For secure user authentication.
- **bcrypt**: For password hashing and security.
- **MongoDB** (with Mongoose): For database management.
- **cookie-parser**: For handling cookies and session management.

## 3. Features <a name="features"></a>

### Authentication and Authorization

- **User Registration**: Secure registration for students, instructors, and administrators with hashed passwords.
- **Login System**: Authenticate users via JWT, with role-based access controls (RBAC) for different functionalities.
- **Session Management**: Persistent sessions using JWT and cookies for smooth user experiences.

### Administrator Functionality

- **Course Management**: Create, update, and delete courses. Assign instructors to courses.
- **User Management**: View and manage users (students and instructors).

### Instructor Functionality

- **Assignment Management**: Create, update, and delete assignments with resource uploads and deadlines.
- **Grading**: Submit grades and feedback for student submissions.
- **Messaging**: Send messages and announcements to enrolled students.

### Student Functionality

- **Assignment Submissions**: Upload assignment files and submit work for grading.
- **Grade Retrieval**: Access grades and instructor feedback.
- **Communication**: Message peers and instructors within assigned courses.

### General Functionality

- **Announcements API**: Provide endpoints for creating and fetching course-wide and system-wide announcements.
- **Error Handling**: Standardized API error responses with meaningful messages and status codes.
- **Logging and Debugging**: Integrated logging for API requests and server errors.

## 4. License <a name="license"></a>

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
