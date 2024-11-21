# Outbuild Test Project

## Overview

The Outbuild Test Project is a RESTful API built with Express.js. This system provides endpoints to manage schedules and activities, allowing users to create, retrieve, update, and delete their schedules and associated activities.

## Features

- **RESTful API**: Designed to follow REST principles for easy integration and use.
- **User Authentication**: Secure endpoints with JWT authentication.
- **Schedule Management**: Users can manage their schedules efficiently.
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
  - **Note**: If a user attempts to access a schedule that they do not own, the system will respond with a `404 Not Found` status for security reasons.

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

One important design decision is that when a user tries to access a schedule that they do not own, the system always responds with a `404 Not Found` status. This approach enhances security by preventing users from discovering whether specific schedules exist or not. Unauthorized users will not be able to access any information about these schedules.

Additionally, when retrieving activities, users must specify the associated schedule ID. This design maintains clear URL structure while ensuring that activities are logically grouped under their respective schedules.

the swagger docs access to api/docs to show all api. this enpoint could be implemented using more secure strategys, but to use like a demo that featured was not implemented

to test and use the end 2 end testing add the correct env vars, when you use the production stage use ENV=production
to connect a production DB

### JWT Implementation

I created endpoints for login and registration and implemented a JWT system that allows us to authenticate users without relying on session-based authentication. The JWT structure includes the user ID, enabling secure access control across all endpoints.

## Getting Started

### Prerequisites

- Node.js
- npm (Node Package Manager)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/alejjandrotr/outBuildTest
   cd outbuild-test-project

# .ENV example
 PORT=3000
DATABASE_URL=postgresql://outbuildShedule_owner:x5vatgdbsW2u@ep-patient-rice-a5ltwllw.us-east-2.aws.neon.tech/outbuildShedule?sslmode=require
DATABASE_URL_TEST=postgresql://outbuildShedule_owner:x5vatgdbsW2u@ep-patient-rice-a5ltwllw.us-east-2.aws.neon.tech/outBuildTest?sslmode=require
SECRET= wewefwe#   o u t B u i l d T e s t  
 