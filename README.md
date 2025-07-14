# 🎮 AI Game Hub

Welcome to the **AI Game Hub** - a collection of 9 interactive games where you can challenge intelligent AI opponents! Built with pure HTML5, CSS3, and JavaScript, this project showcases various AI algorithms and game mechanics.

![AI Game Hub](https://img.shields.io/badge/Games-10-brightgreen) ![AI Powered](https://img.shields.io/badge/AI-Powered-blue) ![Web Technologies](https://img.shields.io/badge/Web-HTML%20%7C%20CSS%20%7C%20JS-orange) ![Flags API](https://img.shields.io/badge/Flags-API-red)

## 🎯 Features

- **10 Different Games** with varying difficulty levels and AI opponents
- **Smart AI Opponents** using different algorithms (Minimax, Pathfinding, Pattern Recognition)
- **Modern UI Design** with glassmorphism effects and smooth animations
- **Responsive Design** that works on desktop and mobile devices
- **Score Tracking** with local storage persistence and total score tracking
- **Real-time Gameplay** with smooth animations and visual feedback
- **Flag Quiz Integration** with FlagsAPI for accurate flag display
- **Enhanced Visibility** with improved contrast and text readability across all games

## 🎲 Games Included

### 1. 🔲 Tic Tac Toe
- **AI Algorithm**: Minimax with Alpha-Beta Pruning
- **Difficulty Levels**: Easy, Medium, Hard (Unbeatable)
- **Features**: Strategic AI that learns from player moves

### 2. ✂️ Rock Paper Scissors
- **AI Algorithm**: Pattern Recognition and Adaptive Strategy
- **Features**: AI analyzes player patterns and adapts its strategy
- **Modes**: Quick rounds with instant feedback

### 3. 🧠 Memory Game
- **AI Algorithm**: Sequence Generation and Pattern Matching
- **Features**: Progressively challenging sequences
- **Gameplay**: Remember and repeat AI-generated patterns

### 4. 🔢 Number Guessing
- **AI Algorithm**: Binary Search Optimization
- **Features**: AI uses optimal guessing strategies
- **Difficulty**: Multiple number ranges (1-50, 1-100, 1-500)

### 5. 🏓 Ping Pong
- **AI Algorithm**: Physics-based Movement with Predictive Tracking
- **Features**: Realistic ball physics and paddle AI
- **Controls**: Arrow keys or WASD for smooth gameplay

### 6. 🚀 Space Shooter
- **AI Algorithm**: Enemy Pathfinding and Strategic Shooting
- **Features**: Multiple enemy types, power-ups, progressive difficulty
- **Gameplay**: Survive waves of intelligent enemy ships

### 7. 🐍 AI Snake Battle
- **AI Algorithm**: A* Pathfinding with Collision Avoidance
- **Features**: Compete against AI snake for food
- **Strategy**: AI snake uses intelligent movement patterns

### 8. 📝 Word Guessing Battle
- **AI Algorithm**: Frequency Analysis and Smart Letter Selection
- **Features**: Multiple categories (Technology, Animals, Science)
- **Strategy**: AI uses common letter patterns for optimal guessing

### 9. 🤾 Catch Game
- **Game Type**: Reflex and Precision Challenge
- **Features**: Falling fruits to catch, bombs to avoid
- **Difficulty**: Progressive speed increase, bomb frequency varies
- **Goal**: Catch as many fruits as possible while avoiding explosive bombs!

### 10. 🏳️ Country Quiz
- **Quiz Type**: Geography and Flag Recognition
- **Features**: Real flag images via FlagsAPI, multiple regions (World, Europe, Asia, Africa, Americas, Oceania)
- **Scoring**: Time bonuses, streak multipliers, total score tracking with localStorage persistence
- **Challenge**: 15-second timer per question, hint system (3 hints per game)
- **Goal**: Test your knowledge of world flags and countries!

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No additional installations required!

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/somyadipghosh/Web-games.git
   cd Web-games
   ```

2. **Open in browser**
   ```bash
   # Simply open index.html in your browser
   open index.html
   # or
   double-click index.html
   ```

3. **Start playing!**
   - Choose any game from the main menu
   - Select difficulty level
   - Challenge the AI and have fun!

## 🎮 How to Play

1. **Launch the Game Hub**: Open `index.html` in your web browser
2. **Select a Game**: Click on any game tile from the main menu
3. **Choose Difficulty**: Most games offer Easy, Medium, and Hard difficulty levels
4. **Start Playing**: Follow the game-specific instructions and controls
5. **Track Your Progress**: Scores are automatically saved and displayed

### Game Controls

| Game | Controls |
|------|----------|
| Tic Tac Toe | Mouse click on cells |
| Rock Paper Scissors | Click choice buttons |
| Memory Game | Mouse click to repeat sequence |
| Number Guessing | Type numbers and press Enter |
| Ping Pong | Arrow keys or WASD |
| Space Shooter | Arrow keys to move, Space to shoot |
| Snake | Arrow keys or WASD to move |
| Word Guessing | Click letter buttons |
| Catch Game | Arrow keys or A/D to move basket |
| Country Quiz | Click on country name options, hint button for help |

## 🛠️ Technical Details

### Technologies Used
- **HTML5**: Semantic structure and Canvas API for games
- **CSS3**: Modern styling with Flexbox, Grid, and animations
- **JavaScript ES6+**: Game logic, AI algorithms, and DOM manipulation
- **Font Awesome**: Icons for enhanced UI
- **FlagsAPI**: External API for accurate country flag images
- **LocalStorage**: Persistent score tracking and game state management

### AI Algorithms Implemented

1. **Minimax Algorithm** (Tic Tac Toe)
   - Perfect play strategy
   - Alpha-beta pruning for optimization
   - Unbeatable on hard difficulty

2. **A* Pathfinding** (Snake Game)
   - Optimal path finding to food
   - Collision avoidance
   - Dynamic obstacle navigation

3. **Pattern Recognition** (Rock Paper Scissors)
   - Analyzes player behavior
   - Adapts strategy based on history
   - Counter-prediction algorithms

4. **Physics Simulation** (Ping Pong, Space Shooter)
   - Realistic ball physics
   - Collision detection
   - Predictive AI movement

5. **API Integration** (Country Quiz)
   - FlagsAPI for real flag images
   - Dynamic country data loading
   - Error handling and fallback systems

6. **Score Persistence** (All Games)
   - LocalStorage integration
   - Cross-session score tracking
   - Best score and total score systems

### Project Structure
```
Web-games/
├── index.html          # Main game hub interface
├── style.css           # Comprehensive styling and animations
├── script.js           # Game logic and AI implementations
└── README.md           # Project documentation
```

## 🎨 Features & Highlights

- **🎯 Smart AI**: Each game features carefully crafted AI with different strategies
- **🎨 Modern UI**: Glassmorphism design with smooth animations and improved contrast
- **📱 Responsive**: Works perfectly on desktop, tablet, and mobile
- **⚡ Performance**: Optimized JavaScript for smooth 60fps gameplay
- **💾 Persistence**: Scores and progress saved locally with total score tracking
- **🔧 Customizable**: Easy to modify and extend with new games
- **🏳️ Real Flags**: Accurate country flags via FlagsAPI integration
- **♿ Accessible**: Enhanced text visibility and contrast across all games
- **📊 Analytics**: Comprehensive scoring system with streaks and bonuses

## 🏆 Game Difficulty Levels

- **Easy**: Perfect for beginners, AI makes occasional mistakes
- **Medium**: Balanced gameplay, AI plays strategically but not perfectly
- **Hard**: Maximum challenge, AI uses optimal strategies

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/new-game`
3. **Make your changes**: Add new games or improve existing ones
4. **Commit changes**: `git commit -m "Add new AI game"`
5. **Push to branch**: `git push origin feature/new-game`
6. **Open a Pull Request**

### Ideas for Contributions
- Add new games (Chess, Checkers, Connect Four)
- Improve existing AI algorithms
- Add multiplayer functionality
- Create mobile-optimized controls
- Add sound effects and music
- Implement game statistics and analytics
- Add more quiz categories (capitals, landmarks)
- Improve accessibility features
- Add internationalization (i18n) support
- Create comprehensive test suite

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🔮 Future Enhancements

- [ ] Multiplayer online functionality
- [ ] Tournament mode with AI brackets
- [ ] Advanced AI difficulty settings
- [ ] Game statistics and analytics dashboard
- [ ] Sound effects and background music
- [ ] Mobile app version
- [ ] More AI games (Chess, Checkers, etc.)
- [ ] AI performance visualization
- [ ] Additional quiz categories (Capitals, Landmarks, etc.)
- [ ] Leaderboard system with online sharing
- [ ] Achievement system and badges
- [ ] Dark/Light theme toggle

## 📞 Contact

**Somyadip Ghosh**
- GitHub: [@somyadipghosh](https://github.com/somyadipghosh)
- Email: [your-email@example.com]

## 🆕 Recent Updates

### Version 2.0 - Enhanced Gaming Experience
- **🏳️ Country Quiz Addition**: New geography quiz with real flag images via FlagsAPI
- **📊 Total Score Tracking**: Persistent score tracking across all game sessions
- **♿ Improved Accessibility**: Enhanced text visibility and contrast across all games
- **🎨 UI/UX Improvements**: Better color schemes and readable text on all backgrounds
- **🔧 Bug Fixes**: Resolved flag display issues and text visibility problems
- **⚡ Performance Optimizations**: Smoother gameplay and faster loading times

## 🙏 Acknowledgments

- Font Awesome for the beautiful icons
- Web development community for inspiration and best practices
- AI algorithm research papers and implementations

---

### 🎮 Ready to Challenge the AI?

[**🚀 Play Now**](https://somyadipghosh.github.io/Web-games/) | [**📚 Documentation**](#-how-to-play) | [**🐛 Report Issues**](https://github.com/somyadipghosh/Web-games/issues)

**Made with ❤️ and lots of ☕**
