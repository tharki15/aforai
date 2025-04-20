# C-Diamond Game

A web-based diamond hunting game with multiple levels, user authentication, and wallet functionality.

## Features

- **User Authentication**: Login/signup with email and mobile number verification
- **Password Recovery**: Reset password using email and mobile verification
- **Interactive Game**: 5 progressive difficulty levels with diamonds and bombs
- **Dynamic Gameplay**: Matrix reshuffles after each click for continuous gameplay
- **Wallet System**: Earn and lose money based on gameplay
- **Withdrawal Options**: Bank Transfer and UPI withdrawal options with receipt generation
- **Fully Responsive Design**: Optimized for all device sizes

## How to Play

1. **Sign Up/Login**: Create an account or log in with your credentials
2. **Play the Game**: Click on cells to reveal diamonds or bombs
3. **After Each Click**: The board reshuffles for a new round of play
4. **Gain/Loss Calculation**: 
   - Diamonds increase your wallet balance and count as positive gain
   - Bombs decrease your wallet balance and count as negative loss
   - Level progression is based on the absolute cumulative transaction amount
5. **Progress Through Levels**: Complete each level to advance to harder challenges
6. **Earn Money**: Collect diamonds to increase your wallet balance
7. **Withdraw Funds**: When your balance reaches ₹1000, you can withdraw your earnings via Bank Transfer or UPI

## Game Levels

### Level 1
- 3×3 grid with 5 diamonds and 4 bombs
- Diamond value: ₹10
- Bomb penalty: ₹12
- Target to advance: ₹50 in cumulative transactions

### Level 2
- 3×3 grid with 3 diamonds and 6 bombs
- Diamond value: ₹30
- Bomb penalty: ₹25
- Target to advance: ₹150 in cumulative transactions

### Level 3
- 5×5 grid with 12 diamonds and 13 bombs
- Diamond value: ₹50
- Bomb penalty: ₹35
- Target to advance: ₹175 in cumulative transactions

### Level 4
- 5×5 grid with 8 diamonds and 17 bombs
- Diamond value: ₹75
- Bomb penalty: ₹65
- Target to advance: ₹200 in cumulative transactions

### Level 5
- 7×7 grid with 14 diamonds and 35 bombs
- Diamond value: ₹125
- Bomb penalty: ₹100
- Target to complete: ₹350 in cumulative transactions

## Wallet System

- Initial bonus: ₹100
- Diamond clicks increase wallet balance
- Bomb clicks decrease wallet balance
- Minimum withdrawal amount: ₹1000
- Withdrawal methods:
  - Bank Transfer (requires Account Number, IFSC Code, Account Owner Name)
  - UPI (requires UPI ID)
- Automatic receipt generation and download upon withdrawal

## Getting Started

1. Open `index.html` in your web browser
2. Create an account or log in
3. Start playing and collect diamonds!

## Technologies Used

- HTML5
- CSS3
- JavaScript (Vanilla)
- Local Storage for data persistence

## Files

- `index.html` - Login and signup page
- `game.html` - Main game interface
- `styles.css` - Styling for all pages
- `auth.js` - Authentication functionality
- `game.js` - Game mechanics and level logic
- `diamond.gif` - Diamond image for gameplay
- `bomb.gif` - Bomb image for gameplay 