# DFWCZ EHS Software

## Overview

**DFWCZ EHS Software** is a powerful, user-friendly, and scalable platform designed for Environmental Health and Safety (EHS) management. This system is built to help organizations efficiently handle various aspects of workplace safety, ensuring compliance and providing easy access to key forms, reports, and signatures. It allows managers to create forms, assign them to employees, collect responses, and track safety measures in real time.

This project is a full-stack web application that utilizes Django for the backend and React for the frontend, providing a seamless experience for users on both ends.

---

## Features

- **Form Management**: 
  - Create, manage, and assign forms.
  - Drag-and-drop form builder for creating custom safety forms.
  - Pre-defined templates for commonly used forms (e.g., toolbox talks, incident reports).
  - Dynamic form generation based on user input.
  
- **User Management**:
  - Role-based access control (Managers, Employees).
  - Managers can assign forms to employees and track responses.
  - Employees can fill out forms and submit responses.
  
- **Signature Collection**:
  - Foreman and employee signature functionality, allowing for form verification and sign-off.
  - Digital signature capture for forms using base64 encoding.
  
- **Report Generation**:
  - PDF generation for completed forms.
  - Generate and download reports, including all collected responses and signatures.

- **Notifications**:
  - Push notifications for new tasks, incomplete forms, and other important updates.
  - Users are notified when forms are assigned or when their response is required.

- **Dashboard**:
  - Real-time overview of all ongoing and completed forms.
  - Status indicators for each form's progress and employee sign-offs.

- **Multilingual Support**:
  - Full Spanish language support for global teams.
  
- **Compliance Tracking**:
  - Track completed safety training, incidents, and reports for compliance auditing.

---

## Technology Stack

### Backend: Django (Python)

- **Django**: A high-level Python web framework that encourages rapid development and clean, pragmatic design. It powers the entire backend API and user authentication.
- **Django REST Framework**: For building the RESTful API, handling form submissions, user management, and notification systems.
- **Celery & Redis**: Used for background task processing (e.g., generating PDFs, sending notifications).
- **PostgreSQL**: The relational database used for storing form responses, user data, and other essential information.
- **Django Channels**: For handling WebSockets to enable real-time notifications and SSE events.

### Frontend: React (JavaScript)

- **React**: A JavaScript library for building user interfaces, used for developing the dynamic, interactive frontend.
- **Vite**: The build tool for the frontend, providing fast build times and optimized performance.
- **ShadCN UI**: A UI component library for clean and polished user interfaces.
- **Survey.js**: For drag-and-drop form creation, enabling dynamic and customizable form designs.
- **React Router**: Used for managing navigation within the application.
- **React Icons**: For adding a variety of icons in the UI, replacing Font Awesome.
- **Axios**: For making API requests from the frontend to the backend.

---

## Database Models

### User Management (`CustomUser`)
- **Fields**: Name, Email, Role (Employee, Manager), etc.
- **Role-Based Access**: Custom permissions based on user roles to ensure security.

### Forms (`Forms`)
- **Fields**: Title, Description, Status (active, archived), Form Data (JSON), etc.
- **Form Types**: Predefined forms for Toolbox Talks, Safety Inspections, Incident Reports, etc.
  
### Form Responses (`FormResponse`)
- **Fields**: User (Employee), Form, Response Data (JSON), Signatures (Base64 Image), etc.
- **Response Status**: Pending, Submitted, Reviewed.

### Lesson Assignment (`LessonAssignment`)
- **Fields**: Assigned Lesson, Employee, Response Data (JSON), Status (Completed/Incomplete).
  
### Notifications (`Notification`)
- **Fields**: User, Message, Notification Type (Reminder, Assignment, etc.), Status (Read/Unread), Timestamp.

---

## Frontend Architecture

The frontend is built as a single-page application (SPA) using React, where users interact with the app via dynamic forms, dashboards, and notifications. Key features include:

- **Form Creation**: Managers can create forms using Survey.js, where employees can later respond.
- **Interactive Dashboards**: Employees and managers have access to dashboards that show their pending tasks, signed forms, and other essential information.
- **Form Submission & Signature**: Employees fill out the forms and digitally sign them.
- **PDF Report Generation**: After form submission, a PDF is generated containing all the responses and signatures.

---

## API Endpoints

- **POST `/api/quiz/submit/`**: Submit form responses, including signatures.
- **GET `/api/forms/`**: Retrieve a list of all forms.
- **POST `/api/forms/`**: Create a new form.
- **GET `/api/lesson-assignments/`**: Retrieve a list of lesson assignments.
- **POST `/api/notifications/`**: Create new notifications.
- **GET `/api/notifications/`**: Retrieve a list of notifications for the user.

---

## Real-Time Features

- **SSE (Server-Sent Events)**: Real-time updates on form status, notifications, and other events.
- **WebSocket-based Notifications**: Real-time push notifications when new forms are assigned or signed.

---

## Form Workflow Example

1. **Manager Creates a Form**: A manager creates a new form using the drag-and-drop builder, adding fields such as multiple-choice questions, text inputs, and signature fields.
2. **Form Assignment**: The manager assigns the form to employees, who will then receive a notification via the app.
3. **Employee Fills Form**: Employees fill out the form and sign it using their digital signature.
4. **Manager Approves/Signs Form**: The manager reviews the submitted form, signs it, and approves it.
5. **PDF Generation**: Once all signatures are collected, a PDF is generated containing the employee's responses and the signatures, which is then available for download.

---

## Challenges & Solutions

- **Real-Time Updates**: Implementing WebSockets and Server-Sent Events (SSE) for instant notifications to employees and managers.
- **PDF Generation**: Generating PDFs from dynamic form data, including signatures, using the `pdfkit` library and Django Channels for background processing.
- **Multilingual Support**: Adding support for Spanish to ensure the software can be used globally.
- **Complex Form Handling**: Using Survey.js for dynamic form creation and submission while handling complex form data (arrays, nested objects, file uploads).

---

## Future Enhancements

- **Mobile App**: Develop a mobile application for both iOS and Android to allow employees to complete forms on the go.
- **Advanced Analytics**: Implement detailed analytics and reporting features, allowing managers to gain insights into form completion rates and compliance.
- **Offline Mode**: Allow employees to fill out forms offline and sync responses when they reconnect to the internet.

---

## Contribution Guidelines

We welcome contributions from the community! To contribute:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Write tests for new functionality.
4. Ensure all tests pass.
5. Submit a pull request describing your changes.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
