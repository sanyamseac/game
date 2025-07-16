# Quantum Cat Social Game

A social elimination game based on Schrödinger's Cat paradox for club events. Players vote whether a quantum cat is alive or dead, and the admin randomly determines the correct answer to eliminate players until only one winner remains.

## Features

- **Game Page** (`/game/{level}`): Players vote on the cat's quantum state
- **Admin Panel** (`/admin`): Control voting phases, reveal results, advance levels
- **Live Display** (`/display`): Real-time voting statistics and game status
- **Social Elimination**: Players with incorrect votes are eliminated
- **Random Results**: Admin determines correct answer with 50/50 probability

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Database Setup**
   The database should already be set up with the required schema. If you need to reset or migrate:
   ```bash
   node migrate.js  # Run only if needed
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Access the Application**
   - Home Page: `http://localhost:5173/`
   - Game: `http://localhost:5173/game/1`
   - Admin Panel: `http://localhost:5173/admin`
   - Live Display: `http://localhost:5173/display`

## Game Flow

### 1. Setup Phase (Admin)
- Navigate to `/admin`
- Ensure players are registered via `/login`
- Players join the current level via `/game/{level}`

### 2. Voting Phase
- Players vote "alive" or "dead" for the quantum cat
- Live statistics visible on `/display`
- Admin can monitor progress on `/admin`

### 3. End Voting (Admin)
- Click "End Voting" when ready to proceed
- No more votes can be cast

### 4. Reveal Results (Admin)
- Click "Reveal Results" to randomly determine the correct answer
- System automatically eliminates players who voted incorrectly
- Results shown to all players

### 5. Next Level (Admin)
- Click "Next Level" to advance to the next round
- Only surviving players can vote in the new level
- Repeat until one winner remains

### 6. Reset Game (Admin)
- Click "Reset Game" to start fresh with all players active

## Database Schema

### Tables
- **user**: Player accounts with elimination status
- **levels**: Game levels with voting status and results
- **votes**: Individual player votes per level
- **details**: Global game configuration

### Key Fields
- `user.isActive`: Whether player is still in the game
- `levels.votingEnded`: Whether voting is closed for the level
- `levels.resultsRevealed`: Whether results have been shown
- `levels.correct`: The randomly determined correct answer

## Auto-Refresh

- **Game Page**: Refreshes every 2 seconds to show results
- **Admin Panel**: Refreshes every 2 seconds for real-time monitoring
- **Display Page**: Refreshes every 0.5 seconds for live updates
- **Vote Statistics**: Updates every 0.5 seconds on all pages

## Features for Club Events

- **Large Display Screen**: Use `/display` on a projector/TV
- **Admin Control**: One person manages the game flow
- **Real-time Engagement**: Players see live vote counts
- **Fair Elimination**: Truly random 50/50 results
- **Easy Reset**: Start new tournaments instantly

## Customization

- Modify `quantum particles` animation in display page
- Adjust auto-refresh intervals in component `onMount`
- Change colors and styling in Tailwind classes
- Add admin authentication by uncommenting role checks

## Technical Notes

- Built with SvelteKit + TypeScript
- Uses Drizzle ORM with SQLite database
- Real-time updates via `invalidate()` calls
- Responsive design for mobile and desktop
- Quantum-themed animations and effects

Have fun with your club's quantum tournament! 🐱⚛️
