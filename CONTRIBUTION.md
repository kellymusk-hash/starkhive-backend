# Contributing to BackendHive

Welcome, and thank you for considering contributing to BackendHive! 🚀 We appreciate all contributions, whether big or small. This guide will help you get started.

## 🌟 Contribution Guidelines

### 1. Applying for an Issue

Before working on an issue, comment on it to get assigned. **Include the keyword **`HIRING-HERO`** in your comment to confirm you have read the contribution guide.**

### 2. Create a New Branch

Once assigned, create a new branch:

```sh
git checkout -b feature/your-feature-name
```

Example:

```sh
git checkout -b feature/add-authentication
```

### 3. Make Your Changes

Follow the project’s coding standards and ensure your changes do not break anything.

### 4. Run Tests

Ensure all tests pass before submitting your code.

```sh
npm test
```

### 5. Commit Your Changes

Write meaningful commit messages:

```sh
git add .
git commit -m "feat: add authentication module"
```

### 6. Push to Your Fork

```sh
git push origin feature/your-feature-name
```

### 7. Submit a Pull Request (PR)

- Go to the main repository on GitHub.
- Click **Pull Requests** > **New Pull Request**.
- Select your fork and branch.
- Provide a clear PR title and description.
- Submit for review!

## 🛠️ Getting Started

### 1. Fork the Repository

First, fork the BackendHive repository to your GitHub account.

- Go to the main repository on GitHub.
- Click the **Fork** button (top right).
- This creates a copy under your GitHub account.

### 2. Clone Your Fork

Now, clone the forked repository to your local machine.

```sh
# Replace <your-username> with your GitHub username
git clone https://github.com/<your-username>/backendhive.git
```

### 3. Navigate to the Project Directory

```sh
cd backendhive
```

### 4. Set Up the Upstream Remote

To keep your fork updated with the main repository:

```sh
git remote add upstream https://github.com/BackendHive/backendhive.git
git fetch upstream
```

## 🚀 Setting Up the Development Environment

### 1. Install Dependencies

Ensure you have **Node.js** (or the required backend runtime) installed, then run:

```sh
npm install
```

### 2. Set Up Environment Variables

Copy the `.env.example` file and rename it to `.env`, then fill in the required values.

```sh
cp .env.example .env
```

### 3. Run Database Migrations (if applicable)

```sh
npm run migrate
```

### 4. Start the Development Server

```sh
npm run dev
```

Your local backend server should now be running.

## ✅ Code of Conduct

By contributing, you agree to follow our **Code of Conduct**.

## 🛠️ Need Help?

If you have any questions, reach out in our community discussions or open an issue.

Happy coding! 🚀
