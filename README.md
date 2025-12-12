# Nexus - A Multi-Tenant E-Commerce Platform

Nexus is a modern, multi-tenant e-commerce platform built with Next.js, Supabase, and Tailwind CSS. It provides a comprehensive solution for businesses to create and manage their own online stores, while customers can browse and purchase products seamlessly. The platform includes a powerful dashboard for shop owners, a beautiful storefront for customers, and a super-admin panel for platform management.

## ✨ Features

- **Multi-tenancy:** Support for multiple shops with isolated data and administration.
- **Storefront:** A customizable, performant, and user-friendly storefront for each shop.
- **Dashboard:** A feature-rich dashboard for shop owners to manage products, orders, coupons, and more.
- **Super Admin:** A dedicated interface for platform administrators to manage shops, users, and system settings.
- **Authentication:** Secure authentication for customers, shop owners, and admins using Supabase Auth.
- **Payments:** Integrated with Razorpay for seamless payment processing.
- **Analytics:** Built-in analytics and reporting for tracking sales, traffic, and growth.
- **Customization:** Easily customizable theme and layout for storefronts.
- **Notifications:** In-app and email notifications for important events.

## 🚀 Tech Stack

- **Framework:** [Next.js](https://nextjs.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
- **Backend & Auth:** [Supabase](https://supabase.io/)
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs/)
- **Form Management:** [React Hook Form](https://react-hook-form.com/)
- **Schema Validation:** [Zod](https://zod.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Linting:** [ESLint](https://eslint.org/)
- **Formatting:** [Prettier](https://prettier.io/)

## 🏁 Getting Started

### Prerequisites

- Node.js (v20 or higher recommended)
- npm, yarn, or pnpm
- A Supabase project.

### 1. Clone the repository

```bash
git clone <repository-url>
cd slides
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root of the project and add your Supabase project URL and anon key:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

You will also need to set up the necessary tables and policies in your Supabase project. Refer to the database schema for details.

### 4. Run the development server

```bash
npm run dev
```

The application will be available at [http://localhost:4000](http://localhost:4000).

## 🛠️ Available Scripts

- `npm run dev`: Starts the development server on `http://localhost:4000`.
- `npm run build`: Creates a production build of the application.
- `npm run start`: Starts a production server.
- `npm run lint`: Lints the codebase using ESLint.
- `npm run format`: Formats the code using Prettier.

## 📂 Project Structure

The project is organized into several key directories within the `src` folder:

- **`src/app`**: Contains the core application logic, with route groups for different sections:
  - `(auth)`: Authentication pages (Login, Signup, etc.).
  - `(dashboard)`: The dashboard for shop owners.
  - `(marketing)`: Landing pages and informational content.
  - `(storefront)`: The customer-facing shop storefront.
  - `(super-admin)`: The super-admin panel.
- **`src/actions`**: Server-side actions for handling business logic (e.g., creating products, processing orders).
- **`src/components`**: Shared React components, organized by application section (admin, dashboard, storefront).
- **`src/lib`**: Contains utility functions, Supabase clients, and type definitions.
  - `src/lib/supabase`: Supabase client and middleware configuration.
  - `src/lib/validators`: Zod schemas for data validation.
- **`src/hooks`**: Custom React hooks.
- **`public`**: Static assets like images and fonts.
- **`components`**: Contains the `shadcn/ui` components.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a pull request.

## 📄 License

This project is licensed under the MIT License.
