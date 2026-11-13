# ExpenseTrack – Expense Management System (MERN)

Full Stack-II capstone project (24CSP-337).
Stack: MongoDB, Express.js, React (Vite), Node.js, JWT authentication, Recharts.

## Features
- Register / Login (JWT + bcrypt password hashing)
- Add, edit, delete income & expense transactions
- Categories for income and expenses
- Filter by type and month
- Summary cards: total income, total expense, balance
- Pie chart (expenses by category) and bar chart (monthly income vs expense)
- Every user sees only their own data

## Run locally
### Prerequisites
Node.js 18+ and MongoDB Community Server running locally (or a MongoDB Atlas URI).

### 1) Backend
    cd server
    npm install
    npm run dev          # http://localhost:5000

### 2) Frontend (new terminal)
    cd client
    npm install
    npm run dev          # http://localhost:5173

Open http://localhost:5173, register an account and start adding transactions.

## API
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | /api/auth/register | No | Create account |
| POST | /api/auth/login | No | Login, returns JWT |
| GET | /api/transactions | Yes | List my transactions |
| POST | /api/transactions | Yes | Add transaction |
| PUT | /api/transactions/:id | Yes | Update transaction |
| DELETE | /api/transactions/:id | Yes | Delete transaction |

## Database schema
**User**: _id, name, email (unique), password (hashed), createdAt, updatedAt
**Transaction**: _id, user (ref User), title, amount, type (income|expense), category, date, note, createdAt, updatedAt
Relationship: one User has many Transactions (1 : N).
