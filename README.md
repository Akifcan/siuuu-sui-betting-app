# SIUU-BET

![SIUU-BET Logo](https://i.imgur.com/8Ls4GyM.jpeg)

A decentralized betting platform for football matches built on the Sui blockchain.

## Features

- 🔐 Google authentication.
- ⛽ Gas sponsorship via **enoki** for reward transactions
- ⚽ Football match betting (Home/Away/Draw)
- 💰 Betting with SUI tokens
- 📊 Bet history tracking
- 🔐 Sui wallet integration
- 🏆 Turkish Super League matches
- 🎮 Real-time match simulation with live scoring
- 🎯 Automatic reward distribution for winning bets
- 📱 Interactive match visualization with team logos
- 🏁 Full match progress tracking (90 minutes simulation)

## Project Structure

```
siuu-bet/
├── contract/          # Move smart contract
│   └── siuuu/
│       ├── sources/
│       │   └── siuuu.move
│       └── tests/
├── frontend/          # React web application  
│   ├── src/
│   │   ├── components/
│   │   ├── contracts/
│   │   └── assets/
│   └── public/
```

## Installation

### Smart Contract

```bash
cd contract/siuuu
sui move build
sui client publish --gas-budget 100000000
```

### Frontend

```bash
cd frontend
yarn install
yarn dev
```

## Usage

1. Connect your Sui wallet
2. View available matches
3. Select the match you want to bet on
4. Choose bet type (1/X/2)
5. Enter amount and place your bet

## Technologies

- **Blockchain:** Sui Network
- **Smart Contract:** Move
- **Frontend:** React + TypeScript + Vite
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI
- **Wallet:** Sui Wallet Kit

![SIUU-BET Logo](https://i.imgur.com/GR81ahh.png)
![Bet](https://i.imgur.com/N7IDNaK.png)
---
![SIUU-BET Logo](https://i.imgur.com/8Ls4GyM.jpeg)

