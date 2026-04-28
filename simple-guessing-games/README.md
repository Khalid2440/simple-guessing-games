# Guessy Galaxy — Simple Guessing Game Website

A friendly multi-game guessing website built with **Next.js**, **JavaScript/React**, and **PHP**.

## Features

- Login page
- Registration page
- PHP backend API
- SQLite database for users and login tokens
- Multiple games:
  - Number Quest
  - Word Garden
  - Emoji Orbit
- Hints for every round
- Easy, Medium, and Hard levels
- Play, Pause, Resume, Continue, and Exit buttons
- Saved round progress in browser localStorage
- Rules page
- Terms and Conditions page
- Friendly SVG visual images
- Responsive user-friendly design

## Folder Structure

```txt
simple-guessing-games/
├─ app/                    # Next.js pages
├─ components/             # React components
├─ lib/                    # Game data and API helper
├─ public/images/          # Friendly SVG images
├─ backend/api/            # PHP API endpoints
├─ backend/data/           # SQLite database will be created here
├─ package.json
├─ next.config.js
└─ README.md
```

## Requirements

Install these first:

- Node.js 18 or newer
- PHP 8 or newer with PDO SQLite enabled

## Setup

1. Open this folder in your terminal.

2. Install frontend dependencies:

```bash
npm install
```

3. Create your environment file:

```bash
cp .env.example .env.local
```

4. Start the PHP backend API in one terminal:

```bash
npm run php
```

The PHP API will run at:

```txt
http://localhost:8000
```

5. Start the Next.js frontend in another terminal:

```bash
npm run dev
```

The website will run at:

```txt
http://localhost:3000
```

## PHP API Endpoints

| Endpoint | Method | Purpose |
|---|---:|---|
| `/register.php` | POST | Create a new player account |
| `/login.php` | POST | Log in and receive a token |
| `/me.php` | GET | Check current logged-in user |
| `/logout.php` | GET/POST | Remove a login token |

## Example Register Request

```bash
curl -X POST http://localhost:8000/register.php \
  -H "Content-Type: application/json" \
  -d '{"name":"Player One","email":"player@example.com","password":"secret123"}'
```

## Example Login Request

```bash
curl -X POST http://localhost:8000/login.php \
  -H "Content-Type: application/json" \
  -d '{"email":"player@example.com","password":"secret123"}'
```

## Production Notes

This is a complete starter project, but before public deployment you should:

- Use HTTPS
- Use a real production database such as MySQL or PostgreSQL
- Add stronger rate limiting to login/register endpoints
- Move CORS origin into an environment variable
- Add server-side score saving if you want global leaderboards
- Review the Terms and Conditions with a legal professional

## Customization Ideas

- Add more word categories
- Add player avatars
- Add sound effects
- Add a leaderboard
- Save scores in PHP instead of browser localStorage
- Add admin controls for creating new games
