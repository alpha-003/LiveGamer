Here's a sample `README.md` for your LiveGamer project:

---

# LiveGamer - Cricket Betting App

**LiveGamer** is a cricket betting application where users can place bets on ongoing cricket matches. It features a user authentication system, real-time betting updates, a wallet for managing funds, and an admin panel for user management.

---

## Features:

- **User Registration and Login**: Users can register and log in to their accounts securely.
- **Admin Panel**: Allows administrators to manage users and view betting activity.
- **Wallet**: Manage deposits and withdrawals of funds to place bets.
- **Match Listing with Betting Options**: View current cricket matches and place bets on them.
- **Real-time Betting Updates**: Keep track of your bets with real-time updates on their status.

---

## Technologies Used:

- **Frontend**: React, Tailwind CSS
- **Backend**: Supabase (for authentication, database management, real-time updates)
- **State Management**: Zustand
- **Development Tools**: Vite for build and development tooling

---

## Installation:

### 1. Clone the repository:

```bash
git clone https://github.com/alpha-003/LiveGamer
cd LiveGamer
```

### 2. Install dependencies:

```bash
npm install
```

### 3. Set up environment variables:

Create a `.env` file in the root directory and add your Supabase URL and Anon Key:

```bash
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_ANON_KEY=<your-anon-key>
```

### 4. Run the development server:

```bash
npm run dev
```

### 5. Open the app:

Navigate to `http://localhost:3000` in your browser to access the application.

---

## Usage:

- **Registration & Login**: Use the registration screen to create an account or log in with your existing credentials.
- **Place Bets**: Browse ongoing matches and place your bets directly from the betting options screen.
- **Manage Wallet**: Deposit or withdraw funds from your wallet for seamless betting.

---

## Contributing:

Contributions are welcome! To contribute, follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a pull request

---

## License:

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Feel free to modify or add any extra features as needed! Let me know if you'd like any changes to this.
