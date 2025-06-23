# Feature Proposal App

A full-stack Next.js app for proposing, discussing, and voting on new features. Users can sign up, sign in, create feature proposals, like and comment on them, and admins can update the status of proposals.

## Features

- User authentication (sign up, sign in, sign out) with NextAuth.js
- Propose new features (title & body)
- Like and unlike feature proposals
- Edit and delete your own proposals
- Admins can update the status of any proposal (Pending, In Progress, Completed)
- Tabs to filter proposals by status and popularity (Most Liked)
- Responsive, modern UI with dark mode support

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### Setup

1. **Clone the repository:**
   ```sh
   git clone <your-repo-url>
   cd crud
   ```
2. **Install dependencies:**
   ```sh
   pnpm install
   # or
   npm install
   ```
3. **Configure environment variables:**
   Create a `.env` file in the root directory with the following:
   ```env
   MONGODB_URI=your-mongodb-uri
   NEXTAUTH_SECRET=your-random-secret
   NEXTAUTH_URL=http://localhost:3000
   ```
4. **Run the development server:**
   ```sh
   pnpm dev
   # or
   npm run dev
   ```
5. **Open the app:**
   Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

- **Sign Up / Sign In:**
  - Use the links in the header to create an account or log in.
- **Create a Feature Proposal:**
  - Click the "Create" button in the header, fill in the title and body, and submit.
- **Like a Proposal:**
  - Click the heart icon on any proposal to like or unlike it.
- **Edit/Delete Your Proposal:**
  - If you are the author, use the "Edit" or "Delete" options on your post.
- **Admin Actions:**
  - If you are an admin, you can change the status of any proposal from the dropdown on each post.
- **Tabs:**
  - Use the tabs on the home page to filter proposals by status or see the most liked ones.
- **Profile Menu:**
  - Click your profile avatar in the header to see your info and sign out.

## Environment Variables

- `MONGODB_URI`: Your MongoDB connection string
- `NEXTAUTH_SECRET`: A random string for NextAuth.js session encryption
- `NEXTAUTH_URL`: The base URL of your app (e.g., `http://localhost:3000`)

## Tech Stack

- Next.js (App Router)
- TypeScript
- MongoDB & Mongoose
- NextAuth.js
- Tailwind CSS

## License

MIT
