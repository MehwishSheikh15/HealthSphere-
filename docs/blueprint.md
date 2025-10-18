# **App Name**: HealthSphere

## Core Features:

- Role-Based Authentication: Authentication system with role selection (doctor, patient, admin) and dynamic signup fields.
- Doctor Verification: AI-powered doctor verification process with document analysis and score generation to help the admin verify them faster.
- AI-Powered Health Tools: Collection of AI tools for medicine checking, skin analysis, nutrition advice, psychological support, and first aid, which each of the tools uses an LLM to reason about how to explain to the user its recommendation based on what was analyzed
- Appointment Booking & Management: System for patients to find and book appointments with doctors, including slot selection, doctor confirmation, and Google Meet integration.
- Reminder System: Medicine and appointment reminders via email (using Nodemailer) and push notifications (FCM), scheduled using Cloud Functions.
- Subscription Management: Subscription system (free/pro) for patients and doctors, integrated with Stripe for payments and managed via webhook.
- Emergency Response: Popup agent that offers first-aid steps and suggests calling emergency services based on user input.

## Style Guidelines:

- Primary color: Crimson (#DC143C) to evoke a sense of urgency and importance related to health.
- Background color: Light pink (#FAEBD7) for a soft and clean feel.
- Accent color: Light orange (#E9967A) to add a contrasting element that doesn't clash with the overall red & white theme.
- Headline font: 'Playfair', serif, for elegance and readability.
- Body font: 'PT Sans', sans-serif, for clear, accessible information.
- Use red icons with a white background to maintain color theming consistency
- Mobile-first, responsive design adapting to various screen sizes. Consistent header and footer across all pages.
- Subtle animations and transitions to improve user experience. Loading animations and interactive feedback for button clicks.