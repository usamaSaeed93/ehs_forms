# Form Creation Application for EHS & DFWCZ

## Overview

This application allows **Admin** and **Manager** users to create, manage, and track forms specifically designed for **Environmental Health & Safety (EHS)** at **DFWCZ**. It is tailored to streamline the process of gathering data through customizable forms, ensuring safety protocols and procedures are adhered to efficiently.

## Key Features

- **Role-Based Access**: Admins and Managers can create and manage forms.
- **Form Builder**: Drag-and-drop UI for designing and customizing forms.
- **Conditional Logic**: Forms can include conditional fields based on user responses.
- **Form Management**: Admins and Managers can view, edit, or delete forms as needed.
- **Submission Tracking**: Track form submissions and export data for reporting.
- **Real-Time Notifications**: Receive notifications for form submissions.

## Roles and Permissions

### Admin

- Create, edit, and delete forms.
- Access all submissions and form data.
- Assign Managers to specific forms.
- Configure form categories and tags.

### Manager

- Create and edit assigned forms.
- View submissions for forms they’ve created.
- Download reports for the forms they manage.

## Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js** (v14 or above)
- **MongoDB** (for storing form and submission data)
- **npm** (Node package manager)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/dfwcz-ehs-form-app.git
   cd dfwcz-ehs-form-app
   ```
