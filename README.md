# AuraMart

> A full-stack, responsive e-commerce platform built with the MERN stack, optimized for clothing and apparel retail.

**[View Live Demo](https://mern-e-commerce-website-sigma.vercel.app/)** • **[Report Bug](https://www.google.com/search?q=https://github.com/Saurabh9308/MERN_E-Commerce_Website/issues)** • **[Request Feature](https://www.google.com/search?q=https://github.com/Saurabh9308/MERN_E-Commerce_Website/issues)**

-----

## About the Project

AuraMart is a comprehensive, full-stack e-commerce platform built specifically for modern clothing brands and apparel retailers. Developed entirely on the MERN stack (MongoDB, Express.js, React.js, and Node.js), this application provides a complete digital storefront solution. It successfully bridges the gap between an intuitive, engaging customer shopping experience and a powerful, secure administrative backend.

The primary goal of this project was to architect a highly scalable and responsive web application that handles the entire e-commerce lifecycle—from dynamic product discovery and secure user authentication to complex state management for shopping carts and order processing.

-----

## Core Features

### 🛍️ Client Portal

  * **Dynamic Customer Storefront:** Seamlessly browse through different clothing categories, utilize search functionalities, and view detailed product pages. The mobile-first design ensures a perfect layout across all devices.
  * **Secure Authentication:** Custom JWT-based authentication. Users can securely register, log in, and manage their profiles with encrypted passwords via Bcrypt.
  * **Advanced Cart Management:** A Redux-powered shopping cart provides immediate visual feedback. Add items, adjust quantities, and remove products with real-time subtotal calculations.
  * **Order Processing:** Secure checkout process with comprehensive order history tracking.

### 🛡️ Administrative Dashboard

  * **Inventory Control:** Full CRUD capabilities over the clothing inventory. Securely upload and manage product images using Multer, adjust stock levels, and organize categories.
  * **Order Fulfillment:** Track customer orders from placement to final delivery, update shipping statuses, and process cancellations.

-----

## Architecture & Tech Stack

This application follows a decoupled client-server architecture:

  * **Frontend (Client):** React.js, Redux (State Management), React Router DOM, Tailwind CSS, Axios
  * **Backend (Server):** Node.js, Express.js
  * **Database:** MongoDB, Mongoose ODM
  * **Security & Auth:** JSON Web Tokens (JWT), Bcrypt.js
  * **File Handling:** Multer

-----

## Getting Started

To get a local copy up and running, follow these steps.

### Prerequisites

  * Node.js installed
  * MongoDB instance (Local or Atlas)

### Installation

**1. Clone the repository:**
`git clone https://github.com/Saurabh9308/MERN_E-Commerce_Website.git`

**2. Navigate to the project directory:**
`cd MERN_E-Commerce_Website`

**3. Install Server Dependencies:**
`npm install`

**4. Install Client Dependencies:**
`cd frontend`
`npm install`

### Environment Variables

Create a `.env` file in the root directory and configure the following variables:

`PORT=5000`
`MONGO_URI=your_mongodb_connection_string`
`JWT_SECRET=your_highly_secure_jwt_secret`

### Running the Application

To run both the server and the client concurrently, navigate to the root directory and run:

`npm run dev`

-----

## Contact

Saurabh - [GitHub Profile](https://www.google.com/search?q=https://github.com/Saurabh9308) | [LinkedIn Profile](www.linkedin.com/in/saurabh-kadtan-558811293)

Project Link: [https://github.com/Saurabh9308/MERN\_E-Commerce\_Website](https://github.com/Saurabh9308/MERN_E-Commerce_Website)
