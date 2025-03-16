# Pet Adoption Platform

## Overview
The Pet Adoption Platform is a full-stack web application designed to streamline the pet adoption process by connecting adopters and fosters with shelters. The platform provides features such as real-time messaging, adoption application tracking, and a personalized user experience.
Platform is fully optimized for All screens.


## Technologies Used
- **Frontend:** React (Vite) with Material UI components
- **State Management:** useContext API
- **Routing:** React Router for seamless navigation
- **Real-time Communication:** Socket.io for instant messaging
- **Data Visualization:** Recharts for displaying analytics on the Dashboard

## Features & Pages
Sign up using different roles like (foster, adopter and shelter) to experience the application.

### Home Page (`/`)
- Displays featured pets and an interactive search functionality.

### Authentication (`/log-in` & `/sign-up`)
- Enables users to register and log in securely.

### Dashboard (`/dash-board`)
- Allows users to track adoption applications.
- Enables shelters to manage pet listings and application statuses.
- Includes data visualization using Recharts.

### Favorites (`/favourites`)
- Displays a list of pets marked as favorites by the user.

### Messaging (`/messages`)
- Implements a real-time chat system for communication between shelters and adopters/fosters using Socket.io.

### Profile (`/profile`)
- Shows user information including name, email, and contact details.
- Allows editing of personal information (except email).



## Deployment
- The platform is deployed using **Render** for hosting.

