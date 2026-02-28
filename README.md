<div align="center">

# DevTinder

### A Real-Time Developer Networking Platform

*Swipe. Connect. Collaborate.*

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white)](https://socket.io/)
[![Razorpay](https://img.shields.io/badge/Razorpay-0C2451?style=for-the-badge&logo=razorpay&logoColor=white)](https://razorpay.com/)
[![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)

[Live Demo](https://dev-tinder-ui-kappa.vercel.app) &nbsp;&bull;&nbsp; [Frontend Repo](https://github.com/Chitransh1011/DEV_TINDER_UI) &nbsp;&bull;&nbsp; [Report Bug](https://github.com/)

</div>

---

## About The Project

DevTinder is a full-stack developer networking platform inspired by Tinder's swipe-based UX. Developers can discover each other, send connection requests, chat in real time, and unlock premium features through integrated payments — all powered by a robust Node.js backend.

**Built to demonstrate:** RESTful API design, real-time WebSocket communication, payment gateway integration, cron-based automation, and production-grade authentication.

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      Client (React)                     │
│              Hosted on Vercel (Port 5173)                │
└────────────┬──────────────────────────┬─────────────────┘
             │  REST API (HTTPS)        │  WebSocket
             ▼                          ▼
┌────────────────────────┐  ┌────────────────────────────┐
│    Express.js Server   │  │     Socket.io Server       │
│     (Port 3000)        │  │   (Real-time messaging)    │
├────────────────────────┤  └─────────────┬──────────────┘
│  Auth Middleware (JWT) │                │
│  Route Handlers        │                │
│  Validation Layer      │                │
└────────────┬───────────┘                │
             │                            │
             ▼                            ▼
┌─────────────────────────────────────────────────────────┐
│                   MongoDB Atlas                         │
│         Users │ Connections │ Chats │ Payments           │
└─────────────────────────────────────────────────────────┘
             │                            │
             ▼                            ▼
┌────────────────────────┐  ┌────────────────────────────┐
│   Razorpay Gateway     │  │    Nodemailer + Cron       │
│  (Payment Processing)  │  │  (Email Notifications)     │
└────────────────────────┘  └────────────────────────────┘
```

---

## Key Features

### Core
- **Swipe-Based Discovery** — Browse developer profiles through a paginated feed, skip or show interest
- **Smart Connection System** — Send, accept, or reject connection requests with duplicate-prevention logic
- **Real-Time Chat** — Instant messaging via Socket.io with room-based architecture and message persistence
- **User Profiles** — Create and edit profiles with skills, bio, photo, and demographic info

### Security
- **JWT Authentication** — Stateless auth with HTTP-only secure cookies (SameSite: None for cross-origin)
- **Bcrypt Password Hashing** — 10-round salt for secure password storage
- **Strong Password Enforcement** — Requires uppercase, lowercase, digits, and special characters
- **Input Validation** — Server-side validation on all endpoints using `validator.js`

### Premium & Payments
- **Razorpay Integration** — End-to-end payment flow with order creation, frontend checkout, and webhook verification
- **Membership Tiers** — Silver (&#8377;300) and Gold (&#8377;700) plans with automatic premium activation
- **Webhook Signature Validation** — Cryptographic verification of payment callbacks

### Automation
- **Cron-Based Email Digest** — Daily scheduled job finds new connection requests and emails users via Nodemailer
- **SMTP Email Service** — Transactional emails for connection notifications using Gmail SMTP

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Runtime** | Node.js |
| **Framework** | Express.js v5 |
| **Database** | MongoDB Atlas + Mongoose ODM |
| **Authentication** | JWT + Bcrypt + Secure Cookies |
| **Real-Time** | Socket.io (WebSockets) |
| **Payments** | Razorpay SDK |
| **Email** | Nodemailer (Gmail SMTP) |
| **Scheduling** | node-cron |
| **Validation** | validator.js |
| **Deployment** | Vercel / Render |

---

## API Reference

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/signup` | Register a new user |
| `POST` | `/login` | Login and receive JWT cookie |
| `POST` | `/logout` | Clear auth cookie |

### Profile
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/profile/view` | Yes | Get authenticated user's profile |
| `PATCH` | `/profile/edit` | Yes | Update profile fields |
| `PATCH` | `/profile/password` | Yes | Change password |

### Connections
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/request/send/:status/:userId` | Yes | Send interested/ignored request |
| `POST` | `/request/review/:status/:requestId` | Yes | Accept or reject a request |
| `GET` | `/user/requests/recieved` | Yes | Get pending incoming requests |
| `GET` | `/user/connections` | Yes | Get all accepted connections |
| `GET` | `/feed` | Yes | Discover new developers |

### Chat
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/chat/:targetUserId` | Yes | Get or create a chat thread |

### Payments
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/payment/create` | Yes | Create a Razorpay order |
| `POST` | `/payment/webhook` | No | Razorpay webhook callback |
| `GET` | `/premium/verify` | Yes | Check premium membership status |

### WebSocket Events
| Event | Direction | Payload |
|-------|-----------|---------|
| `joinChat` | Client → Server | `{ firstName, userId, targetUserId }` |
| `sendMessage` | Client → Server | `{ firstName, lastName, userId, targetUserId, text }` |
| `messageReceived` | Server → Client | `{ firstName, lastName, text }` |
| `disconnect` | Auto | Handles cleanup |

---

## Database Schema

```
┌──────────────┐       ┌─────────────────────┐       ┌──────────────┐
│    User      │       │ ConnectionRequest    │       │    Chat      │
├──────────────┤       ├─────────────────────┤       ├──────────────┤
│ firstName    │──┐    │ fromUserId (ref)     │    ┌──│ participants │
│ lastName     │  │    │ toUserId (ref)       │    │  │ messages[]   │
│ emailId      │  └───>│ status (enum)        │<───┘  │  senderId    │
│ password     │       │   interested         │       │  text        │
│ age          │       │   ignored            │       │  createdAt   │
│ gender       │       │   accepted           │       └──────────────┘
│ photoUrl     │       │   rejected           │
│ about        │       └─────────────────────┘       ┌──────────────┐
│ skills[]     │                                     │   Payment    │
│ isPremium    │──────────────────────────────────────│ userId (ref) │
│ membershipType│                                    │ orderId      │
└──────────────┘                                     │ paymentId    │
                                                     │ status       │
                                                     │ amount       │
                                                     │ currency     │
                                                     │ notes{}      │
                                                     └──────────────┘
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- Razorpay test account
- Gmail App Password for SMTP

### Installation

```bash
# Clone the repository
git clone https://github.com/<Chitransh1011>/devtinder.git
cd devtinder

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/devtinder
JWT_SECRET=your_jwt_secret

# Razorpay
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=your_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# Email (Gmail SMTP)
FROM_EMAIL=your_email@gmail.com
APP_PASSWORD=your_gmail_app_password
```

### Run

```bash
# Development (with hot reload)
npm run dev

# Production
npm start
```

The server starts at `http://localhost:3000`

---

## Project Structure

```
src/
├── app.js                  # Express app, Socket.io, middleware setup
├── config/
│   ├── database.js         # MongoDB connection
│   └── serverConfig.js     # Environment variable loader
├── models/
│   ├── user.js             # User schema with bcrypt hooks
│   ├── connectionrequest.js # Connection request schema
│   ├── chat.js             # Chat & message schema
│   └── payment.js          # Payment record schema
├── routes/
│   ├── auth.js             # Signup, login, logout
│   ├── profile.js          # Profile view & edit
│   ├── request.js          # Send & review connections
│   ├── user.js             # Feed, connections, requests
│   ├── payment.js          # Payment creation & webhooks
│   └── chat.js             # Chat history
├── middlewares/
│   └── auth.js             # JWT verification middleware
└── utils/
    ├── validation.js       # Input validation helpers
    ├── constants.js        # Membership pricing config
    ├── socket.js           # Socket.io initialization
    ├── razorpay.js         # Razorpay SDK instance
    ├── sendEmail.js        # Nodemailer email utility
    └── cronJob.js          # Scheduled email digest
```

---

## What I Learned

- Designing RESTful APIs with proper status codes, error handling, and validation
- Implementing stateless authentication with JWT stored in HTTP-only cookies
- Building real-time features with Socket.io (rooms, broadcasting, persistence)
- Integrating third-party payment gateways with webhook-based verification
- Writing MongoDB aggregation pipelines and compound indexes for optimized queries
- Setting up cron jobs for automated background tasks
- Configuring CORS and secure cookies for cross-origin deployments (Vercel + Render)

---

## Future Roadmap

- [ ] Profile image upload with Cloudinary/S3
- [ ] Password reset via email
- [ ] Rate limiting and request throttling
- [ ] Read receipts and online status indicators
- [ ] Admin dashboard
- [ ] Push notifications
- [ ] Match compatibility scoring algorithm

---

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

1. Fork the repository
2. Create your branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## Contact

**Chitransh Prasanna**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/chitransh-prasanna-3b86b6280/)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Chitransh1011)

---

<div align="center">

If you found this project useful, please consider giving it a :star:

</div>
