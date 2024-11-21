# Outbuild Test Project

## Overview

The **Outbuild Test Project** is a RESTful API built with **Express.js** and **TypeScript**. This system provides endpoints to manage schedules and activities, allowing users to create, retrieve, update, and delete their schedules and associated activities.

## Features

- **RESTful API**: Designed to follow REST principles for easy integration and use.
- **User Authentication**: Secure endpoints with JWT authentication.
- **Schedule Management**: Users can efficiently manage their schedules.
- **Activity Management**: Users can create, retrieve, update, and delete activities associated with their schedules.
- **Swagger Documentation**: Interactive API documentation for easy exploration of endpoints.

## API Endpoints

### Authentication

- **POST /login**
  - Authenticates a user and returns a JWT token.

### Schedule Management

- **GET /schedules**
  - Retrieves all schedules for the authenticated user.
  
- **GET /schedules/:id**
  - Retrieves a specific schedule by ID. 
  - **Note**: If a user attempts to access a schedule that they do not own, the system responds with a `404 Not Found` status for security reasons.

- **POST /schedules**
  - Creates a new schedule for the authenticated user.

- **PUT /schedules/:id**
  - Updates an existing schedule owned by the user.

- **DELETE /schedules/:id**
  - Deletes a specific schedule owned by the user.

### Activity Management

- **GET /schedule/:idSchedule/activity/:idActivity**
  - Retrieves a specific activity by ID associated with the specified schedule.

- **POST /schedule/:idSchedule/activity**
  - Creates a new activity for the specified schedule.

- **PUT /schedule/:idSchedule/activity/:idActivity**
  - Updates an existing activity associated with the specified schedule.

- **DELETE /schedule/:idSchedule/activity/:idActivity**
  - Deletes an activity associated with the specified schedule.

## Design Decisions

### Security Considerations

A key design decision is that when a user tries to access a schedule they do not own, the system always responds with a `404 Not Found` status. This approach enhances security by preventing users from discovering whether specific schedules exist. Unauthorized users will not be able to access any information about these schedules.

Additionally, when retrieving activities, users must specify the associated schedule ID. This design maintains a clear URL structure while ensuring that activities are logically grouped under their respective schedules.

The Swagger documentation can be accessed at `/api/docs` to view all available API endpoints. While this implementation could utilize more secure strategies, it has been simplified for demonstration purposes.

To test and use end-to-end testing, ensure you add the correct environment variables. When using the production stage, set `ENV=production` to connect to a production database.

### JWT Implementation

Endpoints for login and registration have been created, implementing a JWT system that allows us to authenticate users without relying on session-based authentication. The JWT structure includes the user ID, enabling secure access control across all endpoints.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/alejjandrotr/outBuildTest.git
   cd outbuild-test-project
