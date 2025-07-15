// Beta Notification Banner Controller
class BetaNotificationController {
    constructor() {
        this.banner = document.querySelector('.beta-notification-banner');
        this.initializeBanner();
    }
    
    initializeBanner() {
        if (this.banner) {
            this.banner.addEventListener('click', () => {
                window.open('https://forms.gle/R9TKot6XfY4ShGqr6', '_blank');
            });
        }
    }
}

// Navbar Controller
class NavbarController {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.navbarToggle = document.getElementById('navbar-toggle');
        this.navbarMenu = document.getElementById('navbar-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.scrolled = false;
        
        this.initializeNavbar();
        this.initializeCounters();
        this.initializeInteractions();
    }
    
    initializeNavbar() {
        // Mobile menu toggle
        this.navbarToggle?.addEventListener('click', () => {
            this.toggleMobileMenu();
        });
        
        // Smooth scrolling for navigation
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = link.getAttribute('data-target');
                this.scrollToSection(target);
                this.setActiveLink(link);
                
                // Close mobile menu if open
                if (this.navbarMenu?.classList.contains('active')) {
                    this.toggleMobileMenu();
                }
            });
        });
        
        // Scroll effects
        window.addEventListener('scroll', () => {
            this.handleScroll();
        });
    }
    
    toggleMobileMenu() {
        this.navbarToggle?.classList.toggle('active');
        this.navbarMenu?.classList.toggle('active');
    }
    
    scrollToSection(sectionId) {
        let targetElement;
        
        if (sectionId === 'home') {
            targetElement = document.getElementById('home');
        } else if (sectionId === 'games') {
            targetElement = document.getElementById('games');
        } else if (sectionId === 'leaderboard') {
            // Create a leaderboard section if it doesn't exist
            targetElement = this.createLeaderboardSection();
        } else if (sectionId === 'about') {
            targetElement = document.querySelector('.main-footer');
        }
        
        if (targetElement) {
            const offsetTop = targetElement.offsetTop - 80; // Account for navbar height
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }
    
    setActiveLink(activeLink) {
        this.navLinks.forEach(link => link.classList.remove('active'));
        activeLink.classList.add('active');
    }
    
    handleScroll() {
        const scrollY = window.scrollY;
        
        if (scrollY > 50 && !this.scrolled) {
            this.navbar?.classList.add('scrolled');
            this.scrolled = true;
        } else if (scrollY <= 50 && this.scrolled) {
            this.navbar?.classList.remove('scrolled');
            this.scrolled = false;
        }
    }
    
    initializeCounters() {
        const counters = document.querySelectorAll('.counter-number');
        const observerOptions = {
            threshold: 0.7
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    this.animateCounter(counter);
                    observer.unobserve(counter);
                }
            });
        }, observerOptions);
        
        counters.forEach(counter => observer.observe(counter));
    }
    
    animateCounter(counter) {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            counter.textContent = Math.floor(current).toLocaleString();
        }, 16);
    }
    
    initializeInteractions() {
        // Start playing button
        const startBtn = document.getElementById('start-playing-btn');
        startBtn?.addEventListener('click', () => {
            this.scrollToSection('games');
        });
        
        // View stats button
        const statsBtn = document.getElementById('view-stats-btn');
        statsBtn?.addEventListener('click', () => {
            this.showStatsModal();
        });
    }
    
    createLeaderboardSection() {
        const existingLeaderboard = document.getElementById('leaderboard');
        if (existingLeaderboard) return existingLeaderboard;
        
        const leaderboardSection = document.createElement('div');
        leaderboardSection.id = 'leaderboard';
        leaderboardSection.className = 'leaderboard-section';
        leaderboardSection.innerHTML = `
            <div class="container">
                <h2><i class="fas fa-trophy"></i> Leaderboard</h2>
                <div class="leaderboard-content">
                    <p>Track your progress and compete with AI!</p>
                    <div class="personal-stats">
                        <div class="stat-card">
                            <h3>Games Won</h3>
                            <div class="stat-value" id="total-wins">0</div>
                        </div>
                        <div class="stat-card">
                            <h3>Total Score</h3>
                            <div class="stat-value" id="total-points">0</div>
                        </div>
                        <div class="stat-card">
                            <h3>Win Rate</h3>
                            <div class="stat-value" id="win-rate">0%</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        const gamesSection = document.getElementById('games');
        gamesSection?.parentNode.insertBefore(leaderboardSection, gamesSection.nextSibling);
        
        return leaderboardSection;
    }
    
    showStatsModal() {
        // Implementation for stats modal
        alert('Stats feature coming soon!');
    }
    
    updateStats(wins, totalScore) {
        const winsElement = document.getElementById('games-won');
        const scoreElement = document.getElementById('total-score');
        
        if (winsElement) winsElement.textContent = wins;
        if (scoreElement) scoreElement.textContent = totalScore;
    }
}

// Game Hub Controller
class GameHub {
    constructor() {
        this.currentGame = 'tictactoe';
        this.games = {
            tictactoe: null,
            rps: null,
            memory: null,
            numberGuess: null,
            pong: null,
            shooter: null,
            snake: null,
            wordGuess: null,
            catch: null,
            countryQuiz: null,
            typing: null,
            chess: null
        };
        this.navbar = new NavbarController();
        this.initializeHub();
    }
    
    initializeHub() {
        // Initialize game tab switching
        const gameTabs = document.querySelectorAll('.game-tab');
        
        gameTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const gameType = tab.dataset.game;
                this.switchGame(gameType);
            });
        });
        
        // Wait for DOM to be fully ready, then initialize all games
        // Use longer delay to ensure chess DOM elements are loaded
        setTimeout(() => {
            this.games.tictactoe = new TicTacToeAI();
            this.games.rps = new RockPaperScissors();
            this.games.memory = new MemoryGame();
            this.games.numberGuess = new NumberGuessGame();
            this.games.pong = new PongGame();
            this.games.shooter = new SpaceShooterGame();
            this.games.wordGuess = new WordGuessGame();
            this.games.catch = new CatchGame();
            this.games.countryQuiz = new CountryQuizGame();
            this.games.typing = new TypingGame();
            
            // Initialize chess game with additional delay to ensure DOM is ready
            setTimeout(() => {
                console.log('Initializing NEW chess game...');
                this.games.chess = new ChessGameNew();
                console.log('NEW Chess game initialized:', this.games.chess);
            }, 200);
            
            this.games.flappy = new FlappyBirdGame();
            
            // Initialize Snake game separately to avoid conflicts
            if (typeof SnakeGame !== 'undefined') {
                this.games.snake = new SnakeGame();
            }
        }, 100);
    }
    
    switchGame(gameType) {
        // Update active tab
        document.querySelectorAll('.game-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-game="${gameType}"]`).classList.add('active');
        
        // Update active game container
        document.querySelectorAll('.game-container').forEach(container => {
            container.classList.remove('active');
        });
        
        const targetContainer = document.getElementById(`${gameType}-game`);
        if (targetContainer) {
            targetContainer.classList.add('active');
        }
        
        // Handle country-quiz mapping to countryQuiz
        const gameKey = gameType === 'country-quiz' ? 'countryQuiz' : gameType;
        this.currentGame = gameKey;
    }
}

// Enhanced Tic Tac Toe with better animations
class TicTacToeAI {
    constructor() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.difficulty = 'hard';
        this.scores = {
            player: 0,
            ai: 0,
            draws: 0
        };
        
        this.winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        
        this.initializeGame();
    }
    
    initializeGame() {
        this.cells = document.querySelectorAll('#tictactoe-game .cell');
        this.statusElement = document.getElementById('status');
        this.resetButton = document.getElementById('reset-btn');
        this.resetScoresButton = document.getElementById('reset-scores-btn');
        this.difficultySelect = document.getElementById('difficulty');
        this.playerTurn = document.getElementById('player-turn');
        this.aiTurn = document.getElementById('ai-turn');
        
        this.cells.forEach((cell, index) => {
            cell.addEventListener('click', () => this.handleCellClick(index));
        });
        
        this.resetButton.addEventListener('click', () => this.resetGame());
        this.resetScoresButton.addEventListener('click', () => this.resetScores());
        this.difficultySelect.addEventListener('change', (e) => {
            this.difficulty = e.target.value;
        });
        
        this.updateDisplay();
        this.updateScores();
    }
    
    handleCellClick(index) {
        if (!this.gameActive || this.board[index] !== '' || this.currentPlayer !== 'X') {
            return;
        }
        
        this.makeMove(index, 'X');
        
        if (this.gameActive && this.currentPlayer === 'O') {
            this.disableCells();
            this.showAIThinking();
            
            setTimeout(() => {
                this.makeAIMove();
                this.enableCells();
                this.hideAIThinking();
            }, 1000);
        }
    }
    
    makeMove(index, player) {
        this.board[index] = player;
        this.cells[index].textContent = player;
        this.cells[index].classList.add(player.toLowerCase());
        
        const winnerResult = this.checkWinner();
        if (winnerResult) {
            this.endGame(winnerResult.winner, winnerResult.combination);
        } else if (this.isBoardFull()) {
            this.endGame('draw');
        } else {
            this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
            this.updateDisplay();
        }
    }
    
    makeAIMove() {
        if (!this.gameActive) return;
        
        let move;
        switch (this.difficulty) {
            case 'easy':
                move = this.getRandomMove();
                break;
            case 'medium':
                move = Math.random() < 0.7 ? this.getBestMove() : this.getRandomMove();
                break;
            case 'hard':
            default:
                move = this.getBestMove();
                break;
        }
        
        if (move !== -1) {
            this.makeMove(move, 'O');
        }
    }
    
    getRandomMove() {
        const availableMoves = this.getAvailableMoves();
        return availableMoves.length > 0 
            ? availableMoves[Math.floor(Math.random() * availableMoves.length)]
            : -1;
    }
    
    getBestMove() {
        let bestScore = -Infinity;
        let bestMove = -1;
        
        for (let i = 0; i < 9; i++) {
            if (this.board[i] === '') {
                this.board[i] = 'O';
                const score = this.minimax(this.board, 0, false);
                this.board[i] = '';
                
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }
        
        return bestMove;
    }
    
    minimax(board, depth, isMaximizing) {
        const winnerResult = this.checkWinner();
        
        if (winnerResult && winnerResult.winner === 'O') return 10 - depth;
        if (winnerResult && winnerResult.winner === 'X') return depth - 10;
        if (this.isBoardFull()) return 0;
        
        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === '') {
                    board[i] = 'O';
                    const score = this.minimax(board, depth + 1, false);
                    board[i] = '';
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === '') {
                    board[i] = 'X';
                    const score = this.minimax(board, depth + 1, true);
                    board[i] = '';
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    }
    
    checkWinner() {
        for (let combination of this.winningCombinations) {
            const [a, b, c] = combination;
            if (this.board[a] && 
                this.board[a] === this.board[b] && 
                this.board[a] === this.board[c]) {
                return { winner: this.board[a], combination: combination };
            }
        }
        return null;
    }
    
    highlightWinningCells(combination) {
        combination.forEach(index => {
            this.cells[index].classList.add('winning');
        });
    }
    
    isBoardFull() {
        return this.board.every(cell => cell !== '');
    }
    
    getAvailableMoves() {
        return this.board.map((cell, index) => cell === '' ? index : null)
                         .filter(index => index !== null);
    }
    
    endGame(result, winningCombination = null) {
        this.gameActive = false;
        
        if (winningCombination) {
            this.highlightWinningCells(winningCombination);
        }
        
        let gameResult = null;
        if (result === 'X') {
            this.statusElement.textContent = '🎉 You won!';
            this.scores.player++;
            gameResult = { won: true };
        } else if (result === 'O') {
            this.statusElement.textContent = '🤖 AI won!';
            this.scores.ai++;
            gameResult = { won: false };
        } else {
            this.statusElement.textContent = '🤝 It\'s a draw!';
            this.scores.draws++;
            gameResult = { won: false }; // Count draws as non-wins
        }
        
        // Record the game in stats
        if (window.statsManager && gameResult) {
            window.statsManager.recordGame('tictactoe', gameResult);
        }
        
        this.updateScores();
        this.disableCells();
    }
    
    resetGame() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        
        this.cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o', 'winning', 'disabled');
        });
        
        this.updateDisplay();
        this.enableCells();
    }
    
    resetScores() {
        this.scores = { player: 0, ai: 0, draws: 0 };
        this.updateScores();
    }
    
    updateDisplay() {
        if (this.gameActive) {
            if (this.currentPlayer === 'X') {
                this.statusElement.textContent = 'Your turn! Click a cell to play.';
                this.playerTurn.classList.add('active');
                this.aiTurn.classList.remove('active');
            } else {
                this.statusElement.textContent = 'AI is thinking...';
                this.playerTurn.classList.remove('active');
                this.aiTurn.classList.add('active');
            }
        }
    }
    
    updateScores() {
        document.getElementById('player-score').textContent = this.scores.player;
        document.getElementById('ai-score').textContent = this.scores.ai;
        document.getElementById('draw-score').textContent = this.scores.draws;
    }
    
    disableCells() {
        this.cells.forEach(cell => cell.classList.add('disabled'));
    }
    
    enableCells() {
        this.cells.forEach(cell => {
            if (cell.textContent === '') {
                cell.classList.remove('disabled');
            }
        });
    }
    
    showAIThinking() {
        document.body.classList.add('ai-thinking');
    }
    
    hideAIThinking() {
        document.body.classList.remove('ai-thinking');
    }
}

// Rock Paper Scissors Game
class RockPaperScissors {
    constructor() {
        this.scores = { player: 0, ai: 0 };
        this.choices = ['rock', 'paper', 'scissors'];
        this.initializeGame();
    }
    
    initializeGame() {
        this.choiceBtns = document.querySelectorAll('#rps-game .choice-btn');
        this.playerChoiceIcon = document.getElementById('player-choice-icon');
        this.aiChoiceIcon = document.getElementById('ai-choice-icon');
        this.resultMessage = document.getElementById('rps-result-message');
        this.resetBtn = document.getElementById('rps-reset');
        
        this.choiceBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const playerChoice = btn.dataset.choice;
                this.playRound(playerChoice);
            });
        });
        
        if (this.resetBtn) {
            this.resetBtn.addEventListener('click', () => this.resetGame());
        }
        this.updateScores();
    }
    
    playRound(playerChoice) {
        const aiChoice = this.getAIChoice();
        const result = this.determineWinner(playerChoice, aiChoice);
        
        this.displayChoices(playerChoice, aiChoice);
        this.updateResult(result);
        this.updateScores();
    }
    
    getAIChoice() {
        // Smart AI that adapts to player patterns
        return this.choices[Math.floor(Math.random() * this.choices.length)];
    }
    
    determineWinner(player, ai) {
        if (player === ai) return 'draw';
        
        let won = false;
        if (
            (player === 'rock' && ai === 'scissors') ||
            (player === 'paper' && ai === 'rock') ||
            (player === 'scissors' && ai === 'paper')
        ) {
            this.scores.player++;
            won = true;
        } else {
            this.scores.ai++;
        }
        
        // Record the game in stats
        if (window.statsManager) {
            window.statsManager.recordGame('rps', { won: won });
        }
        
        return won ? 'player' : 'ai';
    }
    
    displayChoices(playerChoice, aiChoice) {
        this.playerChoiceIcon.innerHTML = this.getChoiceIcon(playerChoice);
        this.aiChoiceIcon.innerHTML = this.getChoiceIcon(aiChoice);
        
        // Add animation
        this.playerChoiceIcon.classList.add('choice-animate');
        this.aiChoiceIcon.classList.add('choice-animate');
        
        setTimeout(() => {
            this.playerChoiceIcon.classList.remove('choice-animate');
            this.aiChoiceIcon.classList.remove('choice-animate');
        }, 500);
    }
    
    getChoiceIcon(choice) {
        const icons = {
            rock: '<i class="fas fa-hand-rock"></i>',
            paper: '<i class="fas fa-hand-paper"></i>',
            scissors: '<i class="fas fa-hand-scissors"></i>'
        };
        return icons[choice];
    }
    
    updateResult(result) {
        const messages = {
            player: '🎉 You win this round!',
            ai: '🤖 AI wins this round!',
            draw: '🤝 It\'s a tie!'
        };
        this.resultMessage.textContent = messages[result];
    }
    
    updateScores() {
        document.getElementById('rps-player-score').textContent = this.scores.player;
        document.getElementById('rps-ai-score').textContent = this.scores.ai;
    }
    
    resetGame() {
        this.scores = { player: 0, ai: 0 };
        this.updateScores();
        this.playerChoiceIcon.innerHTML = '';
        this.aiChoiceIcon.innerHTML = '';
        this.resultMessage.textContent = 'Choose your move!';
    }
}

// Memory Game
class MemoryGame {
    constructor() {
        this.sequence = [];
        this.playerSequence = [];
        this.level = 1;
        this.score = 0;
        this.lives = 3;
        this.isPlaying = false;
        this.isPlayerTurn = false;
        this.initializeGame();
    }
    
    initializeGame() {
        this.cells = document.querySelectorAll('#memory-game .memory-cell');
        this.startBtn = document.getElementById('memory-start');
        this.resetBtn = document.getElementById('memory-reset');
        this.message = document.getElementById('memory-message');
        
        this.cells.forEach((cell, index) => {
            cell.addEventListener('click', () => {
                if (this.isPlayerTurn) {
                    this.handlePlayerChoice(index);
                }
            });
        });
        
        this.startBtn.addEventListener('click', () => this.startGame());
        this.resetBtn.addEventListener('click', () => this.resetGame());
        
        this.updateDisplay();
    }
    
    startGame() {
        this.isPlaying = true;
        this.sequence = [];
        this.level = 1;
        this.score = 0;
        this.lives = 3;
        this.nextRound();
    }
    
    nextRound() {
        this.playerSequence = [];
        this.isPlayerTurn = false;
        this.addToSequence();
        this.playSequence();
    }
    
    addToSequence() {
        const randomIndex = Math.floor(Math.random() * 4);
        this.sequence.push(randomIndex);
    }
    
    async playSequence() {
        this.message.textContent = `Level ${this.level} - Watch the pattern!`;
        
        for (let i = 0; i < this.sequence.length; i++) {
            await this.delay(600);
            this.flashCell(this.sequence[i]);
        }
        
        await this.delay(1000);
        this.isPlayerTurn = true;
        this.message.textContent = 'Your turn! Repeat the pattern.';
    }
    
    flashCell(index) {
        this.cells[index].classList.add('active');
        setTimeout(() => {
            this.cells[index].classList.remove('active');
        }, 400);
    }
    
    handlePlayerChoice(index) {
        this.playerSequence.push(index);
        this.flashCell(index);
        
        // Check if current choice is correct
        const currentIndex = this.playerSequence.length - 1;
        if (this.playerSequence[currentIndex] !== this.sequence[currentIndex]) {
            this.lives--;
            if (this.lives <= 0) {
                this.endGame();
            } else {
                this.message.textContent = `Wrong! ${this.lives} lives left. Try again!`;
                setTimeout(() => this.nextRound(), 1500);
            }
            this.updateDisplay();
            return;
        }
        
        // Check if sequence is complete
        if (this.playerSequence.length === this.sequence.length) {
            this.score += this.level * 10;
            this.level++;
            this.message.textContent = 'Correct! Next level coming up...';
            setTimeout(() => this.nextRound(), 1500);
            this.updateDisplay();
        }
    }
    
    endGame() {
        this.isPlaying = false;
        this.isPlayerTurn = false;
        this.message.textContent = `Game Over! Final Score: ${this.score}`;
        
        // Record the game in stats
        if (window.statsManager) {
            window.statsManager.recordGame('memory', { score: this.score });
        }
    }
    
    resetGame() {
        this.isPlaying = false;
        this.isPlayerTurn = false;
        this.sequence = [];
        this.playerSequence = [];
        this.level = 1;
        this.score = 0;
        this.lives = 3;
        this.message.textContent = 'Press Start to begin!';
        this.updateDisplay();
    }
    
    updateDisplay() {
        document.getElementById('memory-level').textContent = this.level;
        document.getElementById('memory-score').textContent = this.score;
        document.getElementById('memory-lives').textContent = this.lives;
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Number Guessing Game
class NumberGuessGame {
    constructor() {
        this.targetNumber = 0;
        this.attempts = 0;
        this.bestScore = localStorage.getItem('numberGuessBest') || '-';
        this.range = { min: 1, max: 100 };
        this.history = [];
        this.initializeGame();
    }
    
    initializeGame() {
        this.input = document.getElementById('number-input');
        this.submitBtn = document.getElementById('number-submit');
        this.feedback = document.getElementById('number-feedback');
        this.newGameBtn = document.getElementById('number-new-game');
        this.difficultySelect = document.getElementById('number-difficulty');
        this.historyDiv = document.getElementById('number-history');
        
        this.submitBtn.addEventListener('click', () => this.makeGuess());
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.makeGuess();
        });
        this.newGameBtn.addEventListener('click', () => this.newGame());
        this.difficultySelect.addEventListener('change', () => this.updateDifficulty());
        
        this.updateDisplay();
        this.newGame();
    }
    
    newGame() {
        this.targetNumber = Math.floor(Math.random() * (this.range.max - this.range.min + 1)) + this.range.min;
        this.attempts = 0;
        this.history = [];
        this.input.value = '';
        this.feedback.textContent = `I'm thinking of a number between ${this.range.min} and ${this.range.max}...`;
        this.updateDisplay();
        this.updateHistory();
    }
    
    makeGuess() {
        const guess = parseInt(this.input.value);
        
        if (isNaN(guess) || guess < this.range.min || guess > this.range.max) {
            this.feedback.textContent = `Please enter a number between ${this.range.min} and ${this.range.max}!`;
            return;
        }
        
        this.attempts++;
        let feedback = '';
        let isCorrect = false;
        
        if (guess === this.targetNumber) {
            feedback = `🎉 Congratulations! You got it in ${this.attempts} attempts!`;
            this.updateBestScore();
            isCorrect = true;
            
            // Record the game in stats
            if (window.statsManager) {
                window.statsManager.recordGame('numberGuess', { 
                    won: true, 
                    attempts: this.attempts 
                });
            }
        } else if (guess < this.targetNumber) {
            const diff = this.targetNumber - guess;
            if (diff <= 5) feedback = '📈 Very close! Go higher!';
            else if (diff <= 15) feedback = '⬆️ Close! Go higher!';
            else feedback = '🔼 Too low! Go much higher!';
        } else {
            const diff = guess - this.targetNumber;
            if (diff <= 5) feedback = '📉 Very close! Go lower!';
            else if (diff <= 15) feedback = '⬇️ Close! Go lower!';
            else feedback = '🔽 Too high! Go much lower!';
        }
        
        this.history.unshift({
            guess: guess,
            feedback: feedback,
            isCorrect: isCorrect
        });
        
        this.feedback.textContent = feedback;
        this.input.value = '';
        this.updateDisplay();
        this.updateHistory();
    }
    
    updateBestScore() {
        if (this.bestScore === '-' || this.attempts < parseInt(this.bestScore)) {
            this.bestScore = this.attempts;
            localStorage.setItem('numberGuessBest', this.bestScore);
        }
    }
    
    updateDifficulty() {
        const difficulty = this.difficultySelect.value;
        switch (difficulty) {
            case 'easy':
                this.range = { min: 1, max: 50 };
                break;
            case 'medium':
                this.range = { min: 1, max: 100 };
                break;
            case 'hard':
                this.range = { min: 1, max: 500 };
                break;
        }
        this.newGame();
    }
    
    updateDisplay() {
        document.getElementById('number-range').textContent = `${this.range.min}-${this.range.max}`;
        document.getElementById('number-attempts').textContent = this.attempts;
        document.getElementById('number-best').textContent = this.bestScore;
        this.input.setAttribute('min', this.range.min);
        this.input.setAttribute('max', this.range.max);
    }
    
    updateHistory() {
        this.historyDiv.innerHTML = '';
        this.history.slice(0, 5).forEach(item => {
            const div = document.createElement('div');
            div.className = 'guess-item';
            div.innerHTML = `
                <strong>Guess: ${item.guess}</strong><br>
                <span style="color: ${item.isCorrect ? '#2ecc71' : '#7f8c8d'};">${item.feedback}</span>
            `;
            this.historyDiv.appendChild(div);
        });
    }
}

// Ping Pong Game
class PongGame {
    constructor() {
        this.canvas = document.getElementById('pong-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.overlay = document.getElementById('pong-overlay');
        this.message = document.getElementById('pong-message');
        
        // Verify canvas elements exist
        if (!this.canvas || !this.ctx) {
            console.error('Pong Game: Canvas or context not found');
            return;
        }
        
        // Set canvas size explicitly for consistent resolution
        this.canvas.width = 800;
        this.canvas.height = 400;
        
        // High DPI support for crisp graphics
        const devicePixelRatio = window.devicePixelRatio || 1;
        if (devicePixelRatio > 1) {
            const rect = this.canvas.getBoundingClientRect();
            this.canvas.width = rect.width * devicePixelRatio;
            this.canvas.height = rect.height * devicePixelRatio;
            this.canvas.style.width = rect.width + 'px';
            this.canvas.style.height = rect.height + 'px';
            this.ctx.scale(devicePixelRatio, devicePixelRatio);
        }
        
        // Game state
        this.isPlaying = false;
        this.isPaused = false;
        this.gameOver = false;
        this.difficulty = 'medium';
        
        // Game objects (positioned for 800x400 canvas)
        this.ball = {
            x: 400,
            y: 200,
            dx: 5,
            dy: 3,
            radius: 8,
            speed: 5
        };
        
        this.playerPaddle = {
            x: 20,
            y: 150,
            width: 15,
            height: 100,
            speed: 8
        };
        
        this.aiPaddle = {
            x: 765,
            y: 150,
            width: 15,
            height: 100,
            speed: 6
        };
        
        this.scores = {
            player: 0,
            ai: 0
        };
        
        // Input handling
        this.keys = {};
        
        this.initializeGame();
    }
    
    initializeGame() {
        // Button event listeners
        document.getElementById('pong-start').addEventListener('click', () => this.startGame());
        document.getElementById('pong-pause').addEventListener('click', () => this.togglePause());
        document.getElementById('pong-reset').addEventListener('click', () => this.resetGame());
        
        // Mobile control event listeners
        const pongUpBtn = document.getElementById('pong-up-btn');
        const pongDownBtn = document.getElementById('pong-down-btn');
        
        if (pongUpBtn && pongDownBtn) {
            // Touch events for mobile
            pongUpBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.keys['arrowup'] = true;
                this.keys['w'] = true;
            });
            
            pongUpBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.keys['arrowup'] = false;
                this.keys['w'] = false;
            });
            
            pongDownBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.keys['arrowdown'] = true;
                this.keys['s'] = true;
            });
            
            pongDownBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.keys['arrowdown'] = false;
                this.keys['s'] = false;
            });
            
            // Mouse events for testing on desktop
            pongUpBtn.addEventListener('mousedown', () => {
                this.keys['arrowup'] = true;
                this.keys['w'] = true;
            });
            
            pongUpBtn.addEventListener('mouseup', () => {
                this.keys['arrowup'] = false;
                this.keys['w'] = false;
            });
            
            pongDownBtn.addEventListener('mousedown', () => {
                this.keys['arrowdown'] = true;
                this.keys['s'] = true;
            });
            
            pongDownBtn.addEventListener('mouseup', () => {
                this.keys['arrowdown'] = false;
                this.keys['s'] = false;
            });
        }
        
        // Difficulty selector
        document.getElementById('pong-difficulty').addEventListener('change', (e) => {
            this.difficulty = e.target.value;
            this.updateAISpeed();
        });
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });
        
        // Initial setup
        this.updateScores();
        this.updateAISpeed();
        this.resetBall(); // Reset ball position but don't start game
        this.drawGame();
        
        // Make sure overlay is visible initially
        this.overlay.classList.remove('hidden');
        this.message.textContent = 'Press Start to Play!';
        
        console.log('Pong Game initialized successfully with resolution:', this.canvas.width, 'x', this.canvas.height);
    }
    
    startGame() {
        if (!this.isPlaying) {
            this.isPlaying = true;
            this.isPaused = false;
            this.gameOver = false;
            this.overlay.classList.add('hidden');
            this.resetBall();
            this.gameLoop();
        }
    }
    
    togglePause() {
        if (this.isPlaying && !this.gameOver) {
            this.isPaused = !this.isPaused;
            const pauseBtn = document.getElementById('pong-pause');
            
            if (this.isPaused) {
                this.message.textContent = 'Game Paused - Click Start to Resume';
                this.overlay.classList.remove('hidden');
                pauseBtn.innerHTML = '<i class="fas fa-play"></i> Resume';
            } else {
                this.overlay.classList.add('hidden');
                pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
                this.gameLoop();
            }
        }
    }
    
    resetGame() {
        this.isPlaying = false;
        this.isPaused = false;
        this.gameOver = false;
        this.scores.player = 0;
        this.scores.ai = 0;
        this.updateScores();
        this.resetBall();
        this.resetPaddles();
        this.message.textContent = 'Press Start to Play!';
        this.overlay.classList.remove('hidden');
        this.drawGame();
    }
    
    resetBall() {
        this.ball.x = 400;
        this.ball.y = 200;
        this.ball.dx = (Math.random() > 0.5 ? 1 : -1) * this.ball.speed;
        this.ball.dy = (Math.random() - 0.5) * (this.ball.speed * 1.2);
    }
    
    resetPaddles() {
        this.playerPaddle.y = 150;
        this.aiPaddle.y = 150;
    }
    
    updateAISpeed() {
        switch (this.difficulty) {
            case 'easy':
                this.aiPaddle.speed = 4;
                this.playerPaddle.speed = 8;
                this.ball.speed = 5;
                break;
            case 'medium':
                this.aiPaddle.speed = 8;
                this.playerPaddle.speed = 10;
                this.ball.speed = 7;
                break;
            case 'hard':
                this.aiPaddle.speed = 12;
                this.playerPaddle.speed = 12;
                this.ball.speed = 9;
                break;
        }
    }
    
    gameLoop() {
        if (!this.isPlaying || this.isPaused || this.gameOver) return;
        
        this.update();
        this.drawGame();
        
        requestAnimationFrame(() => this.gameLoop());
    }
    
    update() {
        // Player paddle movement
        if ((this.keys['arrowup'] || this.keys['w']) && this.playerPaddle.y > 0) {
            this.playerPaddle.y -= this.playerPaddle.speed;
        }
        if ((this.keys['arrowdown'] || this.keys['s']) && 
            this.playerPaddle.y < this.canvas.height - this.playerPaddle.height) {
            this.playerPaddle.y += this.playerPaddle.speed;
        }
        
        // AI paddle movement (follows ball with some lag for realism)
        const aiPaddleCenter = this.aiPaddle.y + this.aiPaddle.height / 2;
        const ballY = this.ball.y;
        
        if (ballY < aiPaddleCenter - 10 && this.aiPaddle.y > 0) {
            this.aiPaddle.y -= this.aiPaddle.speed;
        } else if (ballY > aiPaddleCenter + 10 && 
                   this.aiPaddle.y < this.canvas.height - this.aiPaddle.height) {
            this.aiPaddle.y += this.aiPaddle.speed;
        }
        
        // Ball movement
        this.ball.x += this.ball.dx;
        this.ball.y += this.ball.dy;
        
        // Ball collision with top and bottom walls
        if (this.ball.y - this.ball.radius <= 0 || 
            this.ball.y + this.ball.radius >= this.canvas.height) {
            this.ball.dy = -this.ball.dy;
        }
        
        // Ball collision with paddles
        this.checkPaddleCollision();
        
        // Ball goes off screen (scoring)
        if (this.ball.x < 0) {
            this.scores.ai++;
            this.updateScores();
            this.checkGameOver();
            if (!this.gameOver) {
                this.resetBall();
                this.showPointMessage('AI Scores!');
            }
        } else if (this.ball.x > this.canvas.width) {
            this.scores.player++;
            this.updateScores();
            this.checkGameOver();
            if (!this.gameOver) {
                this.resetBall();
                this.showPointMessage('You Score!');
            }
        }
    }
    
    checkPaddleCollision() {
        // Player paddle collision
        if (this.ball.x - this.ball.radius <= this.playerPaddle.x + this.playerPaddle.width &&
            this.ball.x + this.ball.radius >= this.playerPaddle.x &&
            this.ball.y >= this.playerPaddle.y &&
            this.ball.y <= this.playerPaddle.y + this.playerPaddle.height) {
            
            this.ball.dx = Math.abs(this.ball.dx);
            // Add some angle based on where it hits the paddle
            const hitPos = (this.ball.y - this.playerPaddle.y) / this.playerPaddle.height;
            this.ball.dy = (hitPos - 0.5) * 8;
        }
        
        // AI paddle collision
        if (this.ball.x + this.ball.radius >= this.aiPaddle.x &&
            this.ball.x - this.ball.radius <= this.aiPaddle.x + this.aiPaddle.width &&
            this.ball.y >= this.aiPaddle.y &&
            this.ball.y <= this.aiPaddle.y + this.aiPaddle.height) {
            
            this.ball.dx = -Math.abs(this.ball.dx);
            // Add some angle based on where it hits the paddle
            const hitPos = (this.ball.y - this.aiPaddle.y) / this.aiPaddle.height;
            this.ball.dy = (hitPos - 0.5) * 8;
        }
    }
    
    checkGameOver() {
        // Game now runs infinitely - no win condition
        // Players can manually reset to start over
    }
    
    showPointMessage(text) {
        // Flash the canvas container
        const container = document.querySelector('.pong-canvas-container');
        container.classList.add('pong-point-scored');
        setTimeout(() => {
            container.classList.remove('pong-point-scored');
        }, 500);
    }
    
    drawGame() {
        // Clear canvas
        this.ctx.fillStyle = '#1a252f';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw center line
        this.ctx.setLineDash([10, 10]);
        this.ctx.strokeStyle = '#34495e';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(this.canvas.width / 2, 0);
        this.ctx.lineTo(this.canvas.width / 2, this.canvas.height);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
        
        // Draw paddles
        this.ctx.fillStyle = '#3498db';
        this.ctx.fillRect(this.playerPaddle.x, this.playerPaddle.y, 
                         this.playerPaddle.width, this.playerPaddle.height);
        
        this.ctx.fillStyle = '#e74c3c';
        this.ctx.fillRect(this.aiPaddle.x, this.aiPaddle.y, 
                         this.aiPaddle.width, this.aiPaddle.height);
        
        // Draw ball
        this.ctx.fillStyle = '#f1c40f';
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Add glow effect to ball
        this.ctx.shadowColor = '#f1c40f';
        this.ctx.shadowBlur = 15;
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
        
        // Draw scores on canvas
        this.ctx.fillStyle = '#ecf0f1';
        this.ctx.font = 'bold 36px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(this.scores.player, 200, 50);
        this.ctx.fillText(this.scores.ai, 600, 50);
    }
    
    updateScores() {
        document.getElementById('player-pong-score').textContent = this.scores.player;
        document.getElementById('ai-pong-score').textContent = this.scores.ai;
    }
}

// Space Shooter Game
class SpaceShooterGame {
    constructor() {
        this.canvas = document.getElementById('shooter-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.overlay = document.getElementById('shooter-overlay');
        this.message = document.getElementById('shooter-message');
        
        // Verify canvas elements exist
        if (!this.canvas || !this.ctx) {
            console.error('Space Shooter: Canvas or context not found');
            return;
        }
        
        // Set canvas size explicitly
        this.canvas.width = 800;
        this.canvas.height = 500;
        
        // Game state
        this.isPlaying = false;
        this.isPaused = false;
        this.gameOver = false;
        this.difficulty = 'medium';
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.bestScore = localStorage.getItem('shooterBest') || 0;
        this.rapidFire = false;
        
        // Game objects
        this.player = {
            x: 375,
            y: 450,
            width: 50,
            height: 40,
            speed: 8,
            color: '#3498db'
        };
        
        this.bullets = [];
        this.enemies = [];
        this.enemyBullets = [];
        this.powerUps = [];
        
        // Game timing
        this.enemySpawnTimer = 0;
        this.enemySpawnRate = 120; // frames
        this.enemyShootTimer = 0;
        this.powerUpTimer = 0;
        
        // Input handling
        this.keys = {};
        
        this.initializeGame();
    }
    
    initializeGame() {
        // Verify all DOM elements exist
        const startBtn = document.getElementById('shooter-start');
        const pauseBtn = document.getElementById('shooter-pause');
        const resetBtn = document.getElementById('shooter-reset');
        const difficultySelect = document.getElementById('shooter-difficulty');
        
        if (!startBtn || !pauseBtn || !resetBtn || !difficultySelect) {
            console.error('Space Shooter: Missing DOM elements');
            return;
        }
        
        // Button event listeners
        startBtn.addEventListener('click', () => this.startGame());
        pauseBtn.addEventListener('click', () => this.togglePause());
        resetBtn.addEventListener('click', () => this.resetGame());
        
        // Mobile control event listeners
        const shooterLeftBtn = document.getElementById('shooter-left-btn');
        const shooterRightBtn = document.getElementById('shooter-right-btn');
        const shooterFireBtn = document.getElementById('shooter-fire-btn');
        
        if (shooterLeftBtn && shooterRightBtn && shooterFireBtn) {
            // Left button
            shooterLeftBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.keys['arrowleft'] = true;
                this.keys['a'] = true;
            });
            
            shooterLeftBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.keys['arrowleft'] = false;
                this.keys['a'] = false;
            });
            
            shooterLeftBtn.addEventListener('mousedown', () => {
                this.keys['arrowleft'] = true;
                this.keys['a'] = true;
            });
            
            shooterLeftBtn.addEventListener('mouseup', () => {
                this.keys['arrowleft'] = false;
                this.keys['a'] = false;
            });
            
            // Right button
            shooterRightBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.keys['arrowright'] = true;
                this.keys['d'] = true;
            });
            
            shooterRightBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.keys['arrowright'] = false;
                this.keys['d'] = false;
            });
            
            shooterRightBtn.addEventListener('mousedown', () => {
                this.keys['arrowright'] = true;
                this.keys['d'] = true;
            });
            
            shooterRightBtn.addEventListener('mouseup', () => {
                this.keys['arrowright'] = false;
                this.keys['d'] = false;
            });
            
            // Fire button
            shooterFireBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.keys[' '] = true;
                this.keys['space'] = true;
            });
            
            shooterFireBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.keys[' '] = false;
                this.keys['space'] = false;
            });
            
            shooterFireBtn.addEventListener('mousedown', () => {
                this.keys[' '] = true;
                this.keys['space'] = true;
            });
            
            shooterFireBtn.addEventListener('mouseup', () => {
                this.keys[' '] = false;
                this.keys['space'] = false;
            });
        }
        
        // Difficulty selector
        difficultySelect.addEventListener('change', (e) => {
            this.difficulty = e.target.value;
            this.updateDifficulty();
        });
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            const key = e.key.toLowerCase();
            this.keys[key] = true;
            // Also handle space key specifically
            if (e.code === 'Space') {
                this.keys[' '] = true;
                this.keys['space'] = true;
            }
        });
        
        document.addEventListener('keyup', (e) => {
            const key = e.key.toLowerCase();
            this.keys[key] = false;
            // Also handle space key specifically
            if (e.code === 'Space') {
                this.keys[' '] = false;
                this.keys['space'] = false;
            }
        });
        
        // Initial setup
        this.updateDisplay();
        this.updateDifficulty();
        this.drawGame();
        
        // Make sure overlay is visible initially
        this.overlay.classList.remove('hidden');
        this.message.textContent = 'Press Start to Begin!';
        
        console.log('Space Shooter Game initialized successfully');
    }
    
    startGame() {
        if (!this.isPlaying) {
            this.isPlaying = true;
            this.isPaused = false;
            this.gameOver = false;
            this.overlay.classList.add('hidden');
            this.resetGameState();
            this.gameLoop();
        }
    }
    
    togglePause() {
        if (this.isPlaying && !this.gameOver) {
            this.isPaused = !this.isPaused;
            const pauseBtn = document.getElementById('shooter-pause');
            
            if (this.isPaused) {
                this.message.textContent = 'Game Paused - Click Start to Resume';
                this.overlay.classList.remove('hidden');
                pauseBtn.innerHTML = '<i class="fas fa-play"></i> Resume';
            } else {
                this.overlay.classList.add('hidden');
                pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
                this.gameLoop();
            }
        }
    }
    
    resetGame() {
        this.isPlaying = false;
        this.isPaused = false;
        this.gameOver = false;
        this.resetGameState();
        this.message.textContent = 'Press Start to Begin!';
        this.overlay.classList.remove('hidden');
        this.drawGame();
    }
    
    resetGameState() {
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.player.x = 375;
        this.player.y = 450;
        this.bullets = [];
        this.enemies = [];
        this.enemyBullets = [];
        this.powerUps = [];
        this.enemySpawnTimer = 0;
        this.enemyShootTimer = 0;
        this.powerUpTimer = 0;
        this.lastShot = 0;
        this.rapidFire = false;
        this.updateDisplay();
    }
    
    updateDifficulty() {
        switch (this.difficulty) {
            case 'easy':
                this.enemySpawnRate = 180;
                this.player.speed = 10;
                break;
            case 'medium':
                this.enemySpawnRate = 120;
                this.player.speed = 8;
                break;
            case 'hard':
                this.enemySpawnRate = 80;
                this.player.speed = 7;
                break;
        }
    }
    
    gameLoop() {
        if (!this.isPlaying || this.isPaused || this.gameOver) return;
        
        this.update();
        this.drawGame();
        
        requestAnimationFrame(() => this.gameLoop());
    }
    
    update() {
        // Player movement
        if ((this.keys['arrowleft'] || this.keys['a']) && this.player.x > 0) {
            this.player.x -= this.player.speed;
        }
        if ((this.keys['arrowright'] || this.keys['d']) && 
            this.player.x < this.canvas.width - this.player.width) {
            this.player.x += this.player.speed;
        }
        
        // Player shooting
        if (this.keys[' '] || this.keys['space'] || this.keys['spacebar']) {
            this.shoot();
        }
        
        // Spawn enemies
        this.enemySpawnTimer++;
        if (this.enemySpawnTimer >= this.enemySpawnRate) {
            this.spawnEnemy();
            this.enemySpawnTimer = 0;
        }
        
        // Enemy AI shooting
        this.enemyShootTimer++;
        if (this.enemyShootTimer >= 60) {
            this.enemiesShoot();
            this.enemyShootTimer = 0;
        }
        
        // Update bullets
        this.updateBullets();
        
        // Update enemies
        this.updateEnemies();
        
        // Update enemy bullets
        this.updateEnemyBullets();
        
        // Check collisions
        this.checkCollisions();
        
        // Check level progression
        this.checkLevelProgression();
        
        // Spawn power-ups occasionally
        this.powerUpTimer++;
        if (this.powerUpTimer >= 900) { // Every 15 seconds
            this.spawnPowerUp();
            this.powerUpTimer = 0;
        }
    }
    
    shoot() {
        // Limit shooting rate based on rapid fire mode
        const fireRate = this.rapidFire ? 75 : 150;
        
        if (!this.lastShot || Date.now() - this.lastShot > fireRate) {
            this.bullets.push({
                x: this.player.x + this.player.width / 2 - 2,
                y: this.player.y,
                width: 4,
                height: 10,
                speed: 12,
                color: '#f1c40f'
            });
            this.lastShot = Date.now();
        }
    }
    
    spawnEnemy() {
        const enemyTypes = [
            { width: 40, height: 30, speed: 2, color: '#e74c3c', points: 10 },
            { width: 30, height: 25, speed: 3, color: '#e67e22', points: 15 },
            { width: 50, height: 35, speed: 1.5, color: '#8e44ad', points: 20 }
        ];
        
        const type = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
        
        this.enemies.push({
            x: Math.random() * (this.canvas.width - type.width),
            y: -type.height,
            ...type,
            shootTimer: Math.random() * 120
        });
    }
    
    enemiesShoot() {
        this.enemies.forEach(enemy => {
            // AI decides to shoot based on player position and difficulty
            const distanceToPlayer = Math.abs(enemy.x - this.player.x);
            let shootChance = 0.1; // Base chance
            
            if (distanceToPlayer < 100) shootChance = 0.3; // Higher chance if close
            if (this.difficulty === 'hard') shootChance *= 2;
            
            if (Math.random() < shootChance) {
                this.enemyBullets.push({
                    x: enemy.x + enemy.width / 2 - 2,
                    y: enemy.y + enemy.height,
                    width: 4,
                    height: 8,
                    speed: 5,
                    color: '#e74c3c'
                });
            }
        });
    }
    
    updateBullets() {
        this.bullets = this.bullets.filter(bullet => {
            bullet.y -= bullet.speed;
            return bullet.y > -bullet.height;
        });
    }
    
    updateEnemies() {
        this.enemies = this.enemies.filter(enemy => {
            enemy.y += enemy.speed;
            return enemy.y < this.canvas.height;
        });
    }
    
    updateEnemyBullets() {
        this.enemyBullets = this.enemyBullets.filter(bullet => {
            bullet.y += bullet.speed;
            return bullet.y < this.canvas.height;
        });
    }
    
    spawnPowerUp() {
        const powerUpTypes = [
            { type: 'health', color: '#27ae60', size: 20 },
            { type: 'rapid', color: '#3498db', size: 20 }
        ];
        
        const powerUp = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
        
        this.powerUps.push({
            x: Math.random() * (this.canvas.width - powerUp.size),
            y: -powerUp.size,
            ...powerUp,
            speed: 3
        });
    }
    
    checkCollisions() {
        // Player bullets vs enemies
        this.bullets.forEach((bullet, bulletIndex) => {
            this.enemies.forEach((enemy, enemyIndex) => {
                if (this.isColliding(bullet, enemy)) {
                    this.bullets.splice(bulletIndex, 1);
                    this.enemies.splice(enemyIndex, 1);
                    this.score += enemy.points;
                    this.updateDisplay();
                }
            });
        });
        
        // Enemy bullets vs player
        this.enemyBullets.forEach((bullet, bulletIndex) => {
            if (this.isColliding(bullet, this.player)) {
                this.enemyBullets.splice(bulletIndex, 1);
                this.lives--;
                this.updateDisplay();
                
                if (this.lives <= 0) {
                    this.endGame();
                }
            }
        });
        
        // Enemies vs player
        this.enemies.forEach((enemy, enemyIndex) => {
            if (this.isColliding(enemy, this.player)) {
                this.enemies.splice(enemyIndex, 1);
                this.lives--;
                this.updateDisplay();
                
                if (this.lives <= 0) {
                    this.endGame();
                }
            }
        });
        
        // Power-ups vs player
        this.powerUps.forEach((powerUp, powerUpIndex) => {
            if (this.isColliding(powerUp, this.player)) {
                this.powerUps.splice(powerUpIndex, 1);
                this.applyPowerUp(powerUp);
            }
        });
        
        // Update power-ups
        this.powerUps = this.powerUps.filter(powerUp => {
            powerUp.y += powerUp.speed;
            return powerUp.y < this.canvas.height;
        });
    }
    
    isColliding(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }
    
    applyPowerUp(powerUp) {
        switch (powerUp.type) {
            case 'health':
                this.lives = Math.min(this.lives + 1, 5);
                break;
            case 'rapid':
                // Temporary rapid fire effect
                this.rapidFire = true;
                setTimeout(() => { this.rapidFire = false; }, 5000);
                break;
        }
        this.updateDisplay();
    }
    
    checkLevelProgression() {
        const enemiesDestroyed = Math.floor(this.score / 100);
        const newLevel = Math.floor(enemiesDestroyed / 10) + 1;
        
        if (newLevel > this.level) {
            this.level = newLevel;
            this.enemySpawnRate = Math.max(40, this.enemySpawnRate - 10);
            this.updateDisplay();
        }
    }
    
    endGame() {
        this.gameOver = true;
        this.isPlaying = false;
        
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            localStorage.setItem('shooterBest', this.bestScore);
            this.updateDisplay();
        }
        
        // Record the game in stats
        if (window.statsManager) {
            window.statsManager.recordGame('shooter', { score: this.score });
        }
        
        this.message.textContent = `🚀 Game Over! Final Score: ${this.score}`;
        this.overlay.classList.remove('hidden');
    }
    
    drawGame() {
        // Ensure canvas and context are available
        if (!this.canvas || !this.ctx) {
            console.error('Canvas or context not available for drawing');
            return;
        }
        
        try {
            // Clear canvas with space background
            const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
            gradient.addColorStop(0, '#000428');
            gradient.addColorStop(1, '#004e92');
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
            // Draw stars
            this.drawStars();
            
            // Draw player
            this.ctx.fillStyle = this.player.color;
            this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
            
            // Draw bullets
            this.bullets.forEach(bullet => {
                this.ctx.fillStyle = bullet.color;
                this.ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
            });
            
            // Draw enemies
            this.enemies.forEach(enemy => {
                this.ctx.fillStyle = enemy.color;
                this.ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
            });
            
            // Draw enemy bullets
            this.enemyBullets.forEach(bullet => {
                this.ctx.fillStyle = bullet.color;
                this.ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
            });
            
            // Draw power-ups
            this.powerUps.forEach(powerUp => {
                this.ctx.fillStyle = powerUp.color;
                this.ctx.fillRect(powerUp.x, powerUp.y, powerUp.size, powerUp.size);
            });
            
            // Draw HUD
            this.drawHUD();
        } catch (error) {
            console.error('Error drawing Space Shooter game:', error);
        }
    }
    
    drawStars() {
        // Simple star field effect
        for (let i = 0; i < 50; i++) {
            this.ctx.fillStyle = 'white';
            this.ctx.fillRect(
                (i * 37) % this.canvas.width,
                (i * 23 + Date.now() * 0.05) % this.canvas.height,
                1, 1
            );
        }
    }
    
    drawHUD() {
        this.ctx.fillStyle = 'white';
        this.ctx.font = '16px Arial';
        this.ctx.fillText(`Score: ${this.score}`, 10, 25);
        this.ctx.fillText(`Lives: ${this.lives}`, 10, 45);
        this.ctx.fillText(`Level: ${this.level}`, 10, 65);
    }
    
    updateDisplay() {
        document.getElementById('shooter-score').textContent = this.score;
        document.getElementById('shooter-lives').textContent = this.lives;
        document.getElementById('shooter-level').textContent = this.level;
        document.getElementById('shooter-best').textContent = this.bestScore;
    }
}

// Word Guessing Game
class WordGuessGame {
    constructor() {
        // Game state
        this.currentWord = '';
        this.displayWord = '';
        this.guessedLetters = [];
        this.wrongLetters = [];
        this.category = 'technology';
        this.round = 1;
        this.playerScore = 0;
        this.aiScore = 0;
        this.streak = 0;
        this.hintsUsed = 0;
        this.maxHints = 2;
        
        // Word databases
        this.wordDatabase = {
            animals: [
                { word: 'elephant', hint: 'Large mammal with a trunk' },
                { word: 'giraffe', hint: 'Tallest animal in the world' },
                { word: 'penguin', hint: 'Black and white bird that cannot fly' },
                { word: 'dolphin', hint: 'Intelligent marine mammal' },
                { word: 'butterfly', hint: 'Colorful insect with wings' },
                { word: 'kangaroo', hint: 'Australian animal that hops' },
                { word: 'octopus', hint: 'Sea creature with eight arms' },
                { word: 'cheetah', hint: 'Fastest land animal' }
            ],
            technology: [
                { word: 'computer', hint: 'Electronic device for processing data' },
                { word: 'internet', hint: 'Global network of computers' },
                { word: 'smartphone', hint: 'Portable communication device' },
                { word: 'algorithm', hint: 'Set of rules for solving problems' },
                { word: 'database', hint: 'Organized collection of data' },
                { word: 'software', hint: 'Computer programs and applications' },
                { word: 'hardware', hint: 'Physical components of a computer' },
                { word: 'artificial', hint: 'Made by humans, not natural' }
            ],
            science: [
                { word: 'gravity', hint: 'Force that pulls objects toward Earth' },
                { word: 'molecule', hint: 'Smallest unit of a chemical compound' },
                { word: 'photosynthesis', hint: 'How plants make food from sunlight' },
                { word: 'evolution', hint: 'Process of species changing over time' },
                { word: 'microscope', hint: 'Tool for seeing very small things' },
                { word: 'telescope', hint: 'Tool for seeing distant objects' },
                { word: 'chemistry', hint: 'Study of matter and its properties' },
                { word: 'physics', hint: 'Study of matter, energy, and motion' }
            ],
            mixed: []
        };
        
        // Combine all categories for mixed mode
        this.wordDatabase.mixed = [
            ...this.wordDatabase.animals,
            ...this.wordDatabase.technology,
            ...this.wordDatabase.science
        ];
        
        this.initializeGame();
    }
    
    initializeGame() {
        // Button event listeners
        document.getElementById('word-start').addEventListener('click', () => this.startNewRound());
        document.getElementById('word-hint-btn').addEventListener('click', () => this.showHint());
        document.getElementById('word-reset').addEventListener('click', () => this.resetGame());
        
        // Category selector
        document.getElementById('word-difficulty').addEventListener('change', (e) => {
            this.category = e.target.value;
        });
        
        // Create letter grid
        this.createLetterGrid();
        
        // Initial setup
        this.updateDisplay();
        this.startNewRound();
    }
    
    createLetterGrid() {
        const letterGrid = document.getElementById('letter-grid');
        letterGrid.innerHTML = '';
        
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        
        alphabet.split('').forEach(letter => {
            const btn = document.createElement('button');
            btn.className = 'letter-btn';
            btn.textContent = letter;
            btn.addEventListener('click', () => this.guessLetter(letter.toLowerCase()));
            letterGrid.appendChild(btn);
        });
    }
    
    startNewRound() {
        // Select random word from category
        const words = this.wordDatabase[this.category];
        const wordData = words[Math.floor(Math.random() * words.length)];
        
        this.currentWord = wordData.word.toLowerCase();
        this.currentHint = wordData.hint;
        this.displayWord = '_'.repeat(this.currentWord.length);
        this.guessedLetters = [];
        this.wrongLetters = [];
        this.hintsUsed = 0;
        
        // Reset letter buttons
        document.querySelectorAll('.letter-btn').forEach(btn => {
            btn.disabled = false;
            btn.classList.remove('correct', 'wrong');
        });
        
        // Clear previous messages and reset styling
        const messageElement = document.getElementById('word-result-message');
        messageElement.textContent = 'Start guessing letters!';
        messageElement.style.color = '';
        messageElement.style.fontSize = '';
        messageElement.style.fontWeight = '';
        
        this.updateDisplay();
        this.updateWordDisplay();
        
        // Start AI timer (AI will guess after a random delay)
        this.startAITimer();
    }
    
    startAITimer() {
        // Clear any existing timer first
        if (this.aiTimer) {
            clearInterval(this.aiTimer);
        }
        
        // AI makes guesses at intervals
        this.aiTimer = setInterval(() => {
            if (this.isRoundComplete()) {
                clearInterval(this.aiTimer);
                return;
            }
            
            this.makeAIGuess();
        }, 2000 + Math.random() * 3000); // 2-5 seconds
    }
    
    guessLetter(letter) {
        if (this.guessedLetters.includes(letter) || this.isRoundComplete()) {
            return;
        }
        
        this.guessedLetters.push(letter);
        
        // Find the letter button and disable it
        const letterBtn = Array.from(document.querySelectorAll('.letter-btn'))
            .find(btn => btn.textContent.toLowerCase() === letter);
        
        if (this.currentWord.includes(letter)) {
            // Correct guess
            if (letterBtn) letterBtn.classList.add('correct');
            this.updateWordDisplay();
            
            if (this.isWordComplete()) {
                this.playerScore++;
                this.streak++;
                this.endRound('player');
            }
        } else {
            // Wrong guess
            this.wrongLetters.push(letter.toUpperCase());
            if (letterBtn) letterBtn.classList.add('wrong');
            this.updateDisplay();
            
            // Show progress toward AI win
            const remaining = 6 - this.wrongLetters.length;
            if (remaining > 0) {
                document.getElementById('word-result-message').textContent = 
                    `❌ Wrong letter! ${remaining} more wrong guesses and AI wins!`;
            }
            
            if (this.wrongLetters.length >= 6) {
                this.endRound('ai');
            }
        }
        
        if (letterBtn) letterBtn.disabled = true;
    }
    
    makeAIGuess() {
        // AI guessing strategy
        const availableLetters = 'abcdefghijklmnopqrstuvwxyz'
            .split('')
            .filter(letter => !this.guessedLetters.includes(letter));
        
        if (availableLetters.length === 0) return;
        
        // AI uses smart strategy: common letters first, then based on word patterns
        const commonLetters = ['e', 'a', 'r', 'i', 'o', 't', 'n', 's'];
        let chosenLetter;
        
        // First try common letters
        const availableCommon = commonLetters.filter(letter => availableLetters.includes(letter));
        if (availableCommon.length > 0) {
            chosenLetter = availableCommon[0];
        } else {
            // Random from remaining
            chosenLetter = availableLetters[Math.floor(Math.random() * availableLetters.length)];
        }
        
        // Simulate AI guess
        setTimeout(() => {
            this.guessLetter(chosenLetter);
        }, 500);
    }
    
    showHint() {
        if (this.hintsUsed < this.maxHints) {
            this.hintsUsed++;
            document.getElementById('word-hint').textContent = this.currentHint;
            
            const hintBtn = document.getElementById('word-hint-btn');
            hintBtn.textContent = `🔓 Hint Used (${this.maxHints - this.hintsUsed} left)`;
            
            if (this.hintsUsed >= this.maxHints) {
                hintBtn.disabled = true;
            }
        }
    }
    
    updateWordDisplay() {
        let display = '';
        
        for (let i = 0; i < this.currentWord.length; i++) {
            const letter = this.currentWord[i];
            if (this.guessedLetters.includes(letter)) {
                display += letter.toUpperCase() + ' ';
            } else {
                display += '_ ';
            }
        }
        
        const wordElement = document.getElementById('current-word');
        if (wordElement) {
            wordElement.textContent = display.trim();
            
            // Make the text clearly visible with black color
            wordElement.style.color = '#000000';
            wordElement.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
            wordElement.style.padding = '15px 25px';
            wordElement.style.borderRadius = '10px';
            wordElement.style.display = 'block';
            wordElement.style.visibility = 'visible';
            wordElement.style.fontWeight = 'bold';
            wordElement.style.fontSize = '2.5em';
            wordElement.style.textShadow = 'none';
            wordElement.style.border = '2px solid #333';
        }
    }
    
    isWordComplete() {
        return this.currentWord.split('').every(letter => this.guessedLetters.includes(letter));
    }
    
    isRoundComplete() {
        return this.isWordComplete() || this.wrongLetters.length >= 6;
    }
    
    endRound(winner) {
        clearInterval(this.aiTimer);
        
        let messageElement = document.getElementById('word-result-message');
        
        if (winner === 'ai') {
            this.aiScore++;
            this.streak = 0;
            
            // Make the AI win message more prominent
            messageElement.textContent = `🤖 AI got it! The word was "${this.currentWord.toUpperCase()}"`;
            messageElement.style.color = '#e74c3c';
            messageElement.style.fontSize = '1.4em';
            messageElement.style.fontWeight = 'bold';
            
            // Also show the complete word
            document.getElementById('current-word').textContent = this.currentWord.toUpperCase().split('').join(' ');
            
        } else {
            messageElement.textContent = `🎉 You got it! Great job!`;
            messageElement.style.color = '#27ae60';
            messageElement.style.fontSize = '1.4em';
            messageElement.style.fontWeight = 'bold';
        }
        
        this.round++;
        this.updateDisplay();
        
        // Reset message styling after delay and start next round
        setTimeout(() => {
            messageElement.style.color = '';
            messageElement.style.fontSize = '';
            messageElement.style.fontWeight = '';
            this.startNewRound();
        }, 4000); // Increased delay to 4 seconds for better visibility
    }
    
    resetGame() {
        clearInterval(this.aiTimer);
        this.round = 1;
        this.playerScore = 0;
        this.aiScore = 0;
        this.streak = 0;
        this.updateDisplay();
        this.startNewRound();
    }
    
    updateDisplay() {
        document.getElementById('word-round').textContent = this.round;
        document.getElementById('player-word-score').textContent = this.playerScore;
        document.getElementById('ai-word-score').textContent = this.aiScore;
        document.getElementById('word-streak').textContent = this.streak;
        document.getElementById('wrong-letters').textContent = this.wrongLetters.join(', ');
        
        // Reset hint button
        const hintBtn = document.getElementById('word-hint-btn');
        hintBtn.textContent = `💡 Get Hint (${this.maxHints - this.hintsUsed} left)`;
        hintBtn.disabled = this.hintsUsed >= this.maxHints;
        
        if (this.hintsUsed === 0) {
            document.getElementById('word-hint').textContent = 'Hint will appear here';
        }
    }
}

// Catch Game
class CatchGame {
    constructor() {
        this.canvas = document.getElementById('catch-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.overlay = document.getElementById('catch-overlay');
        this.message = document.getElementById('catch-message');
        
        // Verify canvas and context
        if (!this.canvas || !this.ctx) {
            console.error('Canvas or context not found');
            return;
        }
        
        // Set canvas dimensions explicitly
        this.canvas.width = 800;
        this.canvas.height = 500;
        
        // Game state
        this.isPlaying = false;
        this.isPaused = false;
        this.gameOver = false;
        this.difficulty = 'medium';
        this.score = 0;
        this.lives = 3;
        this.bestScore = localStorage.getItem('catchBest') || 0;
        
        // Game objects
        this.player = {
            x: 375, // Updated for new canvas width (800/2 - 25)
            y: 450, // Updated for new canvas height
            width: 50,
            height: 40,
            speed: 8,
            color: '#8B4513'
        };
        
        this.fallingObjects = [];
        this.particles = [];
        
        // Game timing
        this.objectSpawnTimer = 0;
        this.objectSpawnRate = 90; // frames
        
        // Input handling
        this.keys = {};
        
        this.initializeGame();
    }
    
    setupCanvas() {
        // Ensure canvas is visible and properly sized
        this.canvas.style.display = 'block';
        this.canvas.style.width = '800px';
        this.canvas.style.height = '500px';
        
        // Set up responsive canvas for smaller screens
        const resizeCanvas = () => {
            const containerWidth = this.canvas.parentElement.clientWidth;
            const aspectRatio = 800 / 500; // width / height
            
            if (containerWidth < 800) {
                this.canvas.style.width = containerWidth + 'px';
                this.canvas.style.height = (containerWidth / aspectRatio) + 'px';
            } else {
                this.canvas.style.width = '800px';
                this.canvas.style.height = '500px';
            }
        };
        
        // Initial resize and add listener
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
    }
    
    initializeGame() {
        // Button event listeners
        document.getElementById('catch-start').addEventListener('click', () => this.startGame());
        document.getElementById('catch-pause').addEventListener('click', () => this.togglePause());
        document.getElementById('catch-reset').addEventListener('click', () => this.resetGame());
        
        // Mobile control event listeners
        const catchLeftBtn = document.getElementById('catch-left-btn');
        const catchRightBtn = document.getElementById('catch-right-btn');
        
        if (catchLeftBtn && catchRightBtn) {
            // Left button
            catchLeftBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.keys['arrowleft'] = true;
                this.keys['a'] = true;
            });
            
            catchLeftBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.keys['arrowleft'] = false;
                this.keys['a'] = false;
            });
            
            catchLeftBtn.addEventListener('mousedown', () => {
                this.keys['arrowleft'] = true;
                this.keys['a'] = true;
            });
            
            catchLeftBtn.addEventListener('mouseup', () => {
                this.keys['arrowleft'] = false;
                this.keys['a'] = false;
            });
            
            // Right button
            catchRightBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.keys['arrowright'] = true;
                this.keys['d'] = true;
            });
            
            catchRightBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.keys['arrowright'] = false;
                this.keys['d'] = false;
            });
            
            catchRightBtn.addEventListener('mousedown', () => {
                this.keys['arrowright'] = true;
                this.keys['d'] = true;
            });
            
            catchRightBtn.addEventListener('mouseup', () => {
                this.keys['arrowright'] = false;
                this.keys['d'] = false;
            });
        }
        
        // Difficulty selector
        document.getElementById('catch-difficulty').addEventListener('change', (e) => {
            this.difficulty = e.target.value;
            this.updateDifficulty();
        });
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });
        
        // Initial setup and force canvas visibility
        this.canvas.style.display = 'block';
        this.canvas.style.visibility = 'visible';
        
        this.updateDisplay();
        this.updateDifficulty();
        
        // Draw immediately and also with a delay
        this.drawGame();
        setTimeout(() => {
            this.drawGame();
        }, 200);
        
        // Make sure overlay is visible initially
        this.overlay.classList.remove('hidden');
        this.message.textContent = 'Press Start to Begin!';
    }
    
    startGame() {
        if (!this.isPlaying) {
            this.isPlaying = true;
            this.isPaused = false;
            this.gameOver = false;
            this.overlay.classList.add('hidden');
            this.resetGameState();
            this.gameLoop();
        }
    }
    
    togglePause() {
        if (this.isPlaying && !this.gameOver) {
            this.isPaused = !this.isPaused;
            const pauseBtn = document.getElementById('catch-pause');
            
            if (this.isPaused) {
                this.message.textContent = 'Game Paused - Click Start to Resume';
                this.overlay.classList.remove('hidden');
                pauseBtn.innerHTML = '<i class="fas fa-play"></i> Resume';
            } else {
                this.overlay.classList.add('hidden');
                pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
                this.gameLoop();
            }
        }
    }
    
    resetGame() {
        this.isPlaying = false;
        this.isPaused = false;
        this.gameOver = false;
        this.resetGameState();
        this.message.textContent = 'Press Start to Begin!';
        this.overlay.classList.remove('hidden');
        this.drawGame();
    }
    
    resetGameState() {
        this.score = 0;
        this.lives = 3;
        this.player.x = 375; // Updated for new canvas width
        this.fallingObjects = [];
        this.particles = [];
        this.objectSpawnTimer = 0;
        this.updateDisplay();
    }
    
    updateDifficulty() {
        switch (this.difficulty) {
            case 'easy':
                this.objectSpawnRate = 120;
                this.player.speed = 10;
                break;
            case 'medium':
                this.objectSpawnRate = 90;
                this.player.speed = 8;
                break;
            case 'hard':
                this.objectSpawnRate = 60;
                this.player.speed = 7;
                break;
        }
    }
    
    gameLoop() {
        if (!this.isPlaying || this.isPaused || this.gameOver) return;
        
        this.update();
        this.drawGame();
        
        requestAnimationFrame(() => this.gameLoop());
    }
    
    update() {
        // Player movement
        if ((this.keys['arrowleft'] || this.keys['a']) && this.player.x > 0) {
            this.player.x -= this.player.speed;
        }
        if ((this.keys['arrowright'] || this.keys['d']) && 
            this.player.x < this.canvas.width - this.player.width) {
            this.player.x += this.player.speed;
        }
        
        // Spawn falling objects
        this.objectSpawnTimer++;
        if (this.objectSpawnTimer >= this.objectSpawnRate) {
            this.spawnObject();
            this.objectSpawnTimer = 0;
        }
        
        // Update falling objects
        this.updateFallingObjects();
        
        // Update particles
        this.updateParticles();
        
        // Check collisions
        this.checkCollisions();
    }
    
    spawnObject() {
        const objectTypes = [
            { type: 'fruit', color: '#FF6B6B', points: 10, isBomb: false },
            { type: 'fruit', color: '#4ECDC4', points: 15, isBomb: false },
            { type: 'fruit', color: '#45B7D1', points: 20, isBomb: false },
            { type: 'fruit', color: '#96CEB4', points: 25, isBomb: false },
            { type: 'fruit', color: '#FFEAA7', points: 30, isBomb: false }
        ];
        
        let chosenType;
        // 20% chance for bomb, 80% for fruit
        if (Math.random() < 0.2) {
            chosenType = { type: 'bomb', color: '#2C3E50', points: 0, isBomb: true };
        } else {
            chosenType = objectTypes[Math.floor(Math.random() * objectTypes.length)];
        }
        
        this.fallingObjects.push({
            x: Math.random() * (this.canvas.width - 30),
            y: -30,
            width: 30,
            height: 30,
            speed: 2 + Math.random() * 3,
            ...chosenType
        });
    }
    
    updateFallingObjects() {
        this.fallingObjects = this.fallingObjects.filter(obj => {
            obj.y += obj.speed;
            return obj.y < this.canvas.height;
        });
    }
    
    updateParticles() {
        this.particles = this.particles.filter(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += 0.2; // gravity
            particle.life--;
            return particle.life > 0;
        });
    }
    
    checkCollisions() {
        this.fallingObjects = this.fallingObjects.filter(obj => {
            if (this.isColliding(obj, this.player)) {
                if (obj.isBomb) {
                    // Hit a bomb - game over!
                    this.endGame('bomb');
                    return false;
                } else {
                    // Caught a fruit
                    this.score += obj.points;
                    this.createParticles(obj.x + obj.width/2, obj.y + obj.height/2, obj.color);
                    this.updateDisplay();
                    
                    // Add game effect
                    this.showCatchEffect();
                    return false;
                }
            }
            return true;
        });
    }
    
    isColliding(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }
    
    createParticles(x, y, color) {
        for (let i = 0; i < 8; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8 - 2,
                color: color,
                life: 30
            });
        }
    }
    
    showCatchEffect() {
        const container = document.querySelector('.catch-canvas-container');
        container.classList.add('catch-point-scored');
        setTimeout(() => {
            container.classList.remove('catch-point-scored');
        }, 600);
    }
    
    endGame(reason) {
        this.gameOver = true;
        this.isPlaying = false;
        
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            localStorage.setItem('catchBest', this.bestScore);
            this.updateDisplay();
        }
        
        let message;
        if (reason === 'bomb') {
            message = `💥 Bomb Hit! Game Over! Final Score: ${this.score}`;
        } else {
            message = `🎮 Game Over! Final Score: ${this.score}`;
        }
        
        this.message.textContent = message;
        this.overlay.classList.remove('hidden');
    }
    
    drawGame() {
        // Ensure canvas and context are available
        if (!this.canvas || !this.ctx) {
            console.error('Canvas or context not available');
            return;
        }
        
        // Clear canvas with sky gradient
        try {
            const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
            gradient.addColorStop(0, '#87CEEB');
            gradient.addColorStop(1, '#98FB98');
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Draw clouds
            this.drawClouds();
            
            // Draw player basket
            this.drawBasket();
            
            // Draw falling objects
            this.fallingObjects.forEach(obj => {
                if (obj.isBomb) {
                    this.drawBomb(obj);
                } else {
                    this.drawFruit(obj);
                }
            });
            
            // Draw particles
            this.particles.forEach(particle => {
                this.ctx.fillStyle = particle.color;
                this.ctx.globalAlpha = particle.life / 30;
                this.ctx.fillRect(particle.x - 2, particle.y - 2, 4, 4);
            });
            this.ctx.globalAlpha = 1;
            
            // Draw HUD
            this.drawHUD();
        } catch (error) {
            console.error('Error drawing game:', error);
        }
    }
    
    drawClouds() {
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        // Simple cloud shapes adjusted for larger canvas
        for (let i = 0; i < 4; i++) {
            const x = (i * 200) + (Date.now() * 0.01) % (this.canvas.width + 100);
            const y = 30 + i * 15;
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, 20, 0, Math.PI * 2);
            this.ctx.arc(x + 20, y, 25, 0, Math.PI * 2);
            this.ctx.arc(x + 40, y, 20, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }
    
    drawBasket() {
        // Basket body
        this.ctx.fillStyle = this.player.color;
        this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
        
        // Basket pattern
        this.ctx.strokeStyle = '#654321';
        this.ctx.lineWidth = 2;
        for (let i = 0; i < 3; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(this.player.x + (i * 12) + 5, this.player.y);
            this.ctx.lineTo(this.player.x + (i * 12) + 5, this.player.y + this.player.height);
            this.ctx.stroke();
        }
        
        // Basket handles
        this.ctx.strokeStyle = '#8B4513';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.arc(this.player.x - 5, this.player.y + 10, 8, 0, Math.PI);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.arc(this.player.x + this.player.width + 5, this.player.y + 10, 8, 0, Math.PI);
        this.ctx.stroke();
    }
    
    drawFruit(fruit) {
        this.ctx.fillStyle = fruit.color;
        this.ctx.beginPath();
        this.ctx.arc(fruit.x + fruit.width/2, fruit.y + fruit.height/2, fruit.width/2, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Add highlight
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.beginPath();
        this.ctx.arc(fruit.x + fruit.width/3, fruit.y + fruit.height/3, fruit.width/4, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    drawBomb(bomb) {
        // Bomb body
        this.ctx.fillStyle = bomb.color;
        this.ctx.beginPath();
        this.ctx.arc(bomb.x + bomb.width/2, bomb.y + bomb.height/2, bomb.width/2, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Bomb fuse
        this.ctx.strokeStyle = '#8B4513';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(bomb.x + bomb.width/2, bomb.y);
        this.ctx.lineTo(bomb.x + bomb.width/2 - 5, bomb.y - 8);
        this.ctx.stroke();
        
        // Spark effect on fuse
        this.ctx.fillStyle = '#FFD700';
        this.ctx.beginPath();
        this.ctx.arc(bomb.x + bomb.width/2 - 5, bomb.y - 8, 2, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Warning symbol
        this.ctx.fillStyle = '#FF0000';
        this.ctx.font = 'bold 12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('💣', bomb.x + bomb.width/2, bomb.y + bomb.height/2 + 4);
    }
    
    drawHUD() {
        this.ctx.fillStyle = 'white';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`Score: ${this.score}`, 10, 25);
        this.ctx.fillText(`Lives: ${this.lives}`, 10, 45);
        this.ctx.fillText(`Best: ${this.bestScore}`, 10, 65);
        
        // Warning for bombs
        this.ctx.fillStyle = '#FF0000';
        this.ctx.font = 'bold 14px Arial';
        this.ctx.textAlign = 'right';
        this.ctx.fillText('💣 = Game Over!', this.canvas.width - 10, 25);
    }
    
    updateDisplay() {
        document.getElementById('catch-score').textContent = this.score;
        document.getElementById('catch-lives').textContent = this.lives;
        document.getElementById('catch-best').textContent = this.bestScore;
    }
}

// Country Quiz Game
class CountryQuizGame {
    constructor() {
        // Game state
        this.round = 1;
        this.score = 0;
        this.totalScore = parseInt(localStorage.getItem('countryQuizTotalScore')) || 0;
        this.streak = 0;
        this.bestScore = localStorage.getItem('countryQuizBest') || 0;
        this.hintsRemaining = 3;
        this.timeLimit = 15; // seconds
        this.currentTime = this.timeLimit;
        this.region = 'world';
        this.isPlaying = false;
        this.isPaused = false;
        this.currentCountry = null;
        this.options = [];
        this.timer = null;
        
        // Country database with ISO country codes for FlagsAPI
        this.countries = {
            world: [
                { name: 'United States', code: 'US', region: 'americas' },
                { name: 'United Kingdom', code: 'GB', region: 'europe' },
                { name: 'France', code: 'FR', region: 'europe' },
                { name: 'Germany', code: 'DE', region: 'europe' },
                { name: 'Japan', code: 'JP', region: 'asia' },
                { name: 'China', code: 'CN', region: 'asia' },
                { name: 'India', code: 'IN', region: 'asia' },
                { name: 'Brazil', code: 'BR', region: 'americas' },
                { name: 'Canada', code: 'CA', region: 'americas' },
                { name: 'Australia', code: 'AU', region: 'oceania' },
                { name: 'Russia', code: 'RU', region: 'asia' },
                { name: 'Italy', code: 'IT', region: 'europe' },
                { name: 'Spain', code: 'ES', region: 'europe' },
                { name: 'Mexico', code: 'MX', region: 'americas' },
                { name: 'South Korea', code: 'KR', region: 'asia' },
                { name: 'Netherlands', code: 'NL', region: 'europe' },
                { name: 'Switzerland', code: 'CH', region: 'europe' },
                { name: 'Sweden', code: 'SE', region: 'europe' },
                { name: 'Norway', code: 'NO', region: 'europe' },
                { name: 'Denmark', code: 'DK', region: 'europe' },
                { name: 'Finland', code: 'FI', region: 'europe' },
                { name: 'Belgium', code: 'BE', region: 'europe' },
                { name: 'Austria', code: 'AT', region: 'europe' },
                { name: 'Portugal', code: 'PT', region: 'europe' },
                { name: 'Greece', code: 'GR', region: 'europe' },
                { name: 'Turkey', code: 'TR', region: 'asia' },
                { name: 'Egypt', code: 'EG', region: 'africa' },
                { name: 'South Africa', code: 'ZA', region: 'africa' },
                { name: 'Nigeria', code: 'NG', region: 'africa' },
                { name: 'Kenya', code: 'KE', region: 'africa' },
                { name: 'Morocco', code: 'MA', region: 'africa' },
                { name: 'Argentina', code: 'AR', region: 'americas' },
                { name: 'Chile', code: 'CL', region: 'americas' },
                { name: 'Colombia', code: 'CO', region: 'americas' },
                { name: 'Peru', code: 'PE', region: 'americas' },
                { name: 'Venezuela', code: 'VE', region: 'americas' },
                { name: 'Thailand', code: 'TH', region: 'asia' },
                { name: 'Vietnam', code: 'VN', region: 'asia' },
                { name: 'Malaysia', code: 'MY', region: 'asia' },
                { name: 'Singapore', code: 'SG', region: 'asia' },
                { name: 'Indonesia', code: 'ID', region: 'asia' },
                { name: 'Philippines', code: 'PH', region: 'asia' },
                { name: 'New Zealand', code: 'NZ', region: 'oceania' },
                { name: 'Poland', code: 'PL', region: 'europe' },
                { name: 'Czech Republic', code: 'CZ', region: 'europe' },
                { name: 'Hungary', code: 'HU', region: 'europe' },
                { name: 'Romania', code: 'RO', region: 'europe' },
                { name: 'Bulgaria', code: 'BG', region: 'europe' },
                { name: 'Croatia', code: 'HR', region: 'europe' },
                { name: 'Slovenia', code: 'SI', region: 'europe' },
                { name: 'Slovakia', code: 'SK', region: 'europe' },
                { name: 'Estonia', code: 'EE', region: 'europe' },
                { name: 'Latvia', code: 'LV', region: 'europe' },
                { name: 'Lithuania', code: 'LT', region: 'europe' }
            ]
        };
        
        // Create regional subsets
        this.countries.europe = this.countries.world.filter(c => c.region === 'europe');
        this.countries.asia = this.countries.world.filter(c => c.region === 'asia');
        this.countries.africa = this.countries.world.filter(c => c.region === 'africa');
        this.countries.americas = this.countries.world.filter(c => c.region === 'americas');
        this.countries.oceania = this.countries.world.filter(c => c.region === 'oceania');
        
        this.initializeGame();
    }
    
    initializeGame() {
        // Get DOM elements
        this.flagImage = document.getElementById('flag-image');
        this.optionsContainer = document.getElementById('quiz-options');
        this.messageElement = document.getElementById('quiz-message');
        this.timerFill = document.getElementById('timer-fill');
        this.timerText = document.getElementById('timer-text');
        
        // Button event listeners
        document.getElementById('quiz-start').addEventListener('click', () => this.startGame());
        document.getElementById('quiz-pause').addEventListener('click', () => this.togglePause());
        document.getElementById('quiz-reset').addEventListener('click', () => this.resetGame());
        document.getElementById('quiz-hint').addEventListener('click', () => this.useHint());
        
        // Region selector
        document.getElementById('quiz-difficulty').addEventListener('change', (e) => {
            this.region = e.target.value;
        });
        
        // Initial setup
        this.updateDisplay();
        this.showStartScreen();
    }
    
    startGame() {
        this.isPlaying = true;
        this.isPaused = false;
        this.round = 1;
        this.score = 0;
        this.streak = 0;
        this.hintsRemaining = 3;
        this.updateDisplay();
        this.nextQuestion();
    }
    
    togglePause() {
        if (!this.isPlaying) return;
        
        this.isPaused = !this.isPaused;
        const pauseBtn = document.getElementById('quiz-pause');
        
        if (this.isPaused) {
            this.pauseTimer();
            pauseBtn.innerHTML = '<i class="fas fa-play"></i> Resume';
            this.messageElement.textContent = 'Game Paused - Click Resume to continue';
        } else {
            this.startTimer();
            pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
            this.messageElement.textContent = 'Which country does this flag belong to?';
        }
    }
    
    resetGame() {
        this.isPlaying = false;
        this.isPaused = false;
        this.round = 1;
        this.score = 0;
        this.streak = 0;
        this.hintsRemaining = 3;
        this.pauseTimer();
        this.updateDisplay();
        this.showStartScreen();
    }
    
    nextQuestion() {
        if (!this.isPlaying) return;
        
        // Select random country from chosen region
        const countryPool = this.countries[this.region];
        this.currentCountry = countryPool[Math.floor(Math.random() * countryPool.length)];
        
        // Generate options (correct answer + 3 wrong answers)
        this.generateOptions();
        
        // Update display
        this.displayFlag(this.currentCountry.code);
        this.messageElement.textContent = 'Which country does this flag belong to?';
        
        // Start timer
        this.currentTime = this.timeLimit;
        this.startTimer();
        
        // Update display
        this.updateDisplay();
    }
    
    generateOptions() {
        this.options = [this.currentCountry];
        const countryPool = this.countries[this.region];
        
        // Add 3 random wrong answers
        while (this.options.length < 4) {
            const randomCountry = countryPool[Math.floor(Math.random() * countryPool.length)];
            if (!this.options.find(option => option.name === randomCountry.name)) {
                this.options.push(randomCountry);
            }
        }
        
        // Shuffle options
        this.options = this.shuffleArray(this.options);
        
        // Create option buttons
        this.createOptionButtons();
    }
    
    createOptionButtons() {
        this.optionsContainer.innerHTML = '';
        
        this.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'quiz-option';
            button.textContent = option.name;
            button.addEventListener('click', () => this.selectAnswer(option, button));
            this.optionsContainer.appendChild(button);
        });
    }
    
    selectAnswer(selectedCountry, buttonElement) {
        if (!this.isPlaying || this.isPaused) return;
        
        this.pauseTimer();
        
        // Disable all buttons
        const allButtons = this.optionsContainer.querySelectorAll('.quiz-option');
        allButtons.forEach(btn => btn.disabled = true);
        
        const isCorrect = selectedCountry.name === this.currentCountry.name;
        
        if (isCorrect) {
            buttonElement.classList.add('correct');
            this.handleCorrectAnswer();
        } else {
            buttonElement.classList.add('wrong');
            // Highlight the correct answer
            allButtons.forEach(btn => {
                if (btn.textContent === this.currentCountry.name) {
                    btn.classList.add('correct');
                }
            });
            this.handleWrongAnswer();
        }
        
        // Move to next question after delay
        setTimeout(() => {
            if (this.round >= 10) {
                this.endGame();
            } else {
                this.round++;
                this.nextQuestion();
            }
        }, 2000);
    }
    
    handleCorrectAnswer() {
        // Calculate score based on time remaining
        const timeBonus = Math.ceil(this.currentTime);
        const streakBonus = this.streak * 5;
        const points = 10 + timeBonus + streakBonus;
        
        this.score += points;
        this.totalScore += points;
        this.streak++;
        
        // Save total score to localStorage
        localStorage.setItem('countryQuizTotalScore', this.totalScore.toString());
        
        this.messageElement.textContent = `🎉 Correct! +${points} points (${timeBonus} time bonus + ${streakBonus} streak bonus)`;
        this.messageElement.style.color = '#27ae60';
    }
    
    handleWrongAnswer() {
        this.streak = 0;
        this.messageElement.textContent = `❌ Wrong! The correct answer was ${this.currentCountry.name}`;
        this.messageElement.style.color = '#e74c3c';
    }
    
    useHint() {
        if (this.hintsRemaining <= 0 || !this.isPlaying || this.isPaused) return;
        
        this.hintsRemaining--;
        
        // Remove one wrong answer
        const wrongButtons = Array.from(this.optionsContainer.querySelectorAll('.quiz-option'))
            .filter(btn => btn.textContent !== this.currentCountry.name && !btn.disabled);
        
        if (wrongButtons.length > 0) {
            const randomWrong = wrongButtons[Math.floor(Math.random() * wrongButtons.length)];
            randomWrong.style.opacity = '0.3';
            randomWrong.disabled = true;
        }
        
        this.updateDisplay();
    }
    
    startTimer() {
        this.pauseTimer(); // Clear any existing timer
        
        this.timer = setInterval(() => {
            if (this.isPaused) return;
            
            this.currentTime -= 0.1;
            this.updateTimer();
            
            if (this.currentTime <= 0) {
                this.handleTimeUp();
            }
        }, 100);
    }
    
    pauseTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }
    
    updateTimer() {
        const percentage = (this.currentTime / this.timeLimit) * 100;
        this.timerFill.style.width = percentage + '%';
        this.timerText.textContent = Math.ceil(this.currentTime) + 's';
        
        // Change color based on time remaining
        if (percentage > 50) {
            this.timerFill.style.backgroundColor = '#27ae60';
        } else if (percentage > 25) {
            this.timerFill.style.backgroundColor = '#f39c12';
        } else {
            this.timerFill.style.backgroundColor = '#e74c3c';
        }
    }
    
    handleTimeUp() {
        this.pauseTimer();
        this.streak = 0;
        
        // Highlight correct answer
        const allButtons = this.optionsContainer.querySelectorAll('.quiz-option');
        allButtons.forEach(btn => {
            btn.disabled = true;
            if (btn.textContent === this.currentCountry.name) {
                btn.classList.add('correct');
            }
        });
        
        this.messageElement.textContent = `⏰ Time's up! The correct answer was ${this.currentCountry.name}`;
        this.messageElement.style.color = '#e67e22';
        
        // Move to next question after delay
        setTimeout(() => {
            if (this.round >= 10) {
                this.endGame();
            } else {
                this.round++;
                this.nextQuestion();
            }
        }, 2000);
    }
    
    endGame() {
        this.isPlaying = false;
        this.pauseTimer();
        
        // Check for high score
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            localStorage.setItem('countryQuizBest', this.bestScore);
        }
        
        this.messageElement.textContent = `🏆 Quiz Complete! Final Score: ${this.score}`;
        this.messageElement.style.color = '#3498db';
        
        // Show final results
        this.displayFlag('🏆');
        this.optionsContainer.innerHTML = `
            <div class="quiz-results">
                <h3>🏆 Quiz Results</h3>
                <p><strong>Round Score:</strong> ${this.score} points</p>
                <p><strong>Total Score:</strong> ${this.totalScore} points</p>
                <p><strong>Questions:</strong> ${this.round - 1}/10</p>
                <p><strong>Best Round:</strong> ${this.bestScore} points</p>
                <button onclick="document.getElementById('quiz-start').click()" class="game-button">
                    <i class="fas fa-redo"></i> Play Again
                </button>
            </div>
        `;
        
        this.updateDisplay();
        
        // Keep timer visible
        const timerElement = document.querySelector('.quiz-timer');
        if (timerElement) {
            timerElement.style.display = 'flex';
            timerElement.style.visibility = 'visible';
        }
    }
    
    showStartScreen() {
        this.displayFlag('🌍');
        this.messageElement.textContent = 'Ready to test your flag knowledge?';
        this.messageElement.style.color = '#2c3e50';
        this.messageElement.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        this.messageElement.style.fontWeight = 'bold';
        this.messageElement.style.fontSize = '1.2em';
        
        this.optionsContainer.innerHTML = `
            <div class="quiz-start-screen">
                <p style="margin-top: 20px; font-weight: bold; color: #3498db; font-size: 1.1em;">
                    Select a region above and click Start Quiz to begin!
                </p>
            </div>
        `;
        
        this.currentTime = this.timeLimit;
        this.updateTimer();
        
        // Make sure timer is visible on start screen
        const timerElement = document.querySelector('.quiz-timer');
        if (timerElement) {
            timerElement.style.display = 'flex';
            timerElement.style.visibility = 'visible';
            timerElement.style.opacity = '1';
        }
    }
    
    displayFlag(countryCode) {
        // Clear any previous content
        this.flagImage.innerHTML = '';
        this.flagImage.textContent = '';
        
        // Set basic styles for the container
        this.flagImage.style.fontSize = '';
        this.flagImage.style.fontFamily = '';
        this.flagImage.style.lineHeight = '1';
        this.flagImage.style.textAlign = 'center';
        this.flagImage.style.display = 'flex';
        this.flagImage.style.alignItems = 'center';
        this.flagImage.style.justifyContent = 'center';
        this.flagImage.style.minHeight = '140px';
        this.flagImage.style.backgroundColor = '#f8f9fa';
        this.flagImage.style.borderRadius = '15px';
        this.flagImage.style.border = '3px solid #dee2e6';
        this.flagImage.style.padding = '10px';
        
        // Handle special cases for start screen
        if (countryCode === '🌍' || countryCode === '🏆') {
            this.flagImage.style.fontSize = '80px';
            this.flagImage.textContent = countryCode;
            return;
        }
        
        // Create flag image using FlagsAPI
        const flagImg = document.createElement('img');
        flagImg.src = `https://flagsapi.com/${countryCode.toUpperCase()}/flat/64.png`;
        flagImg.alt = `Flag of ${countryCode}`;
        flagImg.style.width = '120px';
        flagImg.style.height = 'auto';
        flagImg.style.maxHeight = '90px';
        flagImg.style.borderRadius = '8px';
        flagImg.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
        
        // Add loading and error handling
        flagImg.style.transition = 'opacity 0.3s ease';
        flagImg.style.opacity = '0';
        
        flagImg.onload = () => {
            flagImg.style.opacity = '1';
        };
        
        flagImg.onerror = () => {
            // Fallback if flag image fails to load
            this.flagImage.innerHTML = `
                <div style="
                    background: linear-gradient(45deg, #3498db, #2ecc71);
                    color: white;
                    padding: 20px;
                    border-radius: 10px;
                    font-size: 18px;
                    font-weight: bold;
                    text-align: center;
                    font-family: Arial, sans-serif;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                ">
                    🏳️ ${countryCode}<br>
                    <small style="font-size: 14px; opacity: 0.9;">Flag not available</small>
                </div>
            `;
        };
        
        // Add the image to the container
        this.flagImage.appendChild(flagImg);
        
        // Add loading indicator
        const loadingDiv = document.createElement('div');
        loadingDiv.style.position = 'absolute';
        loadingDiv.style.fontSize = '14px';
        loadingDiv.style.color = '#6c757d';
        loadingDiv.textContent = 'Loading flag...';
        this.flagImage.appendChild(loadingDiv);
        
        // Remove loading indicator when image loads
        flagImg.onload = () => {
            flagImg.style.opacity = '1';
            if (loadingDiv.parentNode) {
                loadingDiv.remove();
            }
        };
    }
    
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
    
    updateDisplay() {
        document.getElementById('quiz-round').textContent = this.round;
        document.getElementById('quiz-score').textContent = this.score;
        document.getElementById('quiz-total-score').textContent = this.totalScore;
        document.getElementById('quiz-streak').textContent = this.streak;
        document.getElementById('quiz-best').textContent = this.bestScore;
        
        const hintBtn = document.getElementById('quiz-hint');
        hintBtn.textContent = `💡 Hint (${this.hintsRemaining} left)`;
        hintBtn.disabled = this.hintsRemaining <= 0 || !this.isPlaying;
    }
}

// Typing Speed Test Game
class TypingGame {
    constructor() {
        // Game state
        this.isPlaying = false;
        this.isPaused = false;
        this.startTime = null;
        this.endTime = null;
        this.currentText = '';
        this.typedText = '';
        this.currentIndex = 0;
        this.difficulty = 'medium';
        this.bestWPM = localStorage.getItem('typingBestWPM') || 0;
        this.timeLimit = 60; // 60 seconds time limit
        this.remainingTime = this.timeLimit;
        
        // Statistics
        this.correctChars = 0;
        this.wrongChars = 0;
        this.totalChars = 0;
        
        // Timers
        this.statsTimer = null;
        this.countdownTimer = null;
        
        // Sample texts for different difficulties
        this.textSamples = {
            easy: [
                "The quick brown fox jumps over the lazy dog. This is a simple test to check your typing speed.",
                "Technology has changed our lives in many ways. We use computers and smartphones every day.",
                "Learning to type fast is a useful skill. Practice makes perfect when it comes to typing.",
                "The weather today is quite nice. I hope it stays sunny for the rest of the week.",
                "Reading books is one of my favorite activities. Books can take us to different worlds.",
                "Cooking is both an art and a science. Good food brings people together at the table.",
                "Music has the power to change our mood. Different songs can make us feel happy or sad.",
                "Exercise is important for maintaining good health. A daily walk can make a big difference.",
                "Traveling helps us learn about different cultures. Each country has its own unique traditions.",
                "Education opens doors to new opportunities. Learning never stops throughout our entire lives."
            ],
            medium: [
                "The advancement of artificial intelligence has revolutionized the way we interact with technology. Machine learning algorithms can now process vast amounts of data to provide insights that were previously impossible to obtain.",
                "Climate change represents one of the most significant challenges facing humanity today. Rising sea levels, extreme weather patterns, and shifting ecosystems require immediate global action and sustainable solutions.",
                "The digital transformation of businesses has accelerated rapidly in recent years. Companies must adapt to new technologies, remote work environments, and changing consumer behaviors to remain competitive.",
                "Space exploration continues to push the boundaries of human knowledge and capability. Private companies and government agencies are working together to establish permanent settlements beyond Earth.",
                "Renewable energy sources such as solar, wind, and hydroelectric power are becoming increasingly cost-effective alternatives to fossil fuels. Investment in clean energy infrastructure is essential for environmental sustainability.",
                "The field of biotechnology holds immense promise for treating diseases, extending human lifespan, and improving quality of life. Gene therapy and personalized medicine are transforming healthcare delivery.",
                "Cybersecurity has become a critical concern as our dependence on digital systems grows. Organizations must implement robust security measures to protect sensitive data from increasingly sophisticated threats.",
                "Social media platforms have fundamentally changed how people communicate, share information, and form communities. These tools have both positive and negative impacts on society and individual well-being.",
                "Sustainable agriculture practices are essential for feeding the growing global population while protecting natural resources. Precision farming and vertical agriculture offer innovative solutions.",
                "The evolution of transportation technology, including electric vehicles and autonomous systems, promises to reduce emissions and improve safety on our roads and highways."
            ],
            hard: [
                "The intersection of quantum computing and cryptography presents both unprecedented opportunities and existential challenges for information security. As quantum computers approach practical viability, traditional encryption methods face obsolescence, necessitating the development of quantum-resistant algorithms that can withstand the computational power of these revolutionary machines while maintaining the efficiency required for real-world applications.",
                "Neuroscience research has revealed the extraordinary plasticity of the human brain, demonstrating its remarkable ability to reorganize neural pathways throughout an individual's lifetime. This neuroplasticity enables recovery from traumatic injuries, adaptation to environmental changes, and the acquisition of new skills, challenging previously held beliefs about the fixed nature of cognitive abilities and opening new avenues for therapeutic interventions.",
                "The ethical implications of genetic engineering and CRISPR technology extend far beyond scientific laboratories, touching upon fundamental questions of human identity, equality, and the responsibility we bear for future generations. As we gain the power to edit the very code of life, society must grapple with complex moral dilemmas regarding enhancement versus treatment, accessibility, and the potential for unintended consequences.",
                "Blockchain technology's decentralized architecture represents a paradigm shift in how we conceptualize trust, transparency, and value exchange in digital ecosystems. Beyond cryptocurrency applications, distributed ledger systems offer solutions for supply chain management, digital identity verification, smart contracts, and democratic governance, potentially reshaping traditional institutional frameworks and power structures.",
                "The phenomenon of consciousness remains one of the most perplexing mysteries in neuroscience and philosophy, defying attempts at comprehensive explanation despite centuries of investigation. The subjective experience of awareness, the binding problem of unified perception, and the emergence of self-reflection from neural activity continue to challenge our understanding of what it means to be sentient beings.",
                "Anthropogenic climate change represents an unprecedented global experiment with Earth's atmospheric composition, triggering cascading effects across interconnected environmental systems. The complex feedback loops between ocean currents, ice sheet dynamics, carbon cycles, and ecosystem responses create non-linear patterns that challenge predictive models and demand adaptive management strategies for planetary stewardship.",
                "The convergence of artificial intelligence and robotics is precipitating a fundamental transformation in labor markets, social structures, and human-machine relationships. As autonomous systems become increasingly sophisticated, questions arise about employment displacement, skill requirements, ethical decision-making frameworks, and the preservation of human agency in an algorithm-driven world.",
                "Epigenetic mechanisms provide a crucial bridge between environmental influences and genetic expression, revealing how external factors can modify gene activity without altering DNA sequences. These heritable changes in gene function offer insights into disease susceptibility, developmental processes, and evolutionary adaptation, expanding our understanding of inheritance beyond traditional Mendelian genetics.",
                "The mathematical elegance of fractals reveals self-similar patterns across scales of observation, from microscopic cellular structures to cosmic web formations. These infinitely complex geometric forms provide powerful tools for modeling natural phenomena, generating computer graphics, analyzing market fluctuations, and understanding the underlying order within apparent chaos.",
                "Quantum entanglement demonstrates the profound interconnectedness of particles across vast distances, challenging classical intuitions about locality and reality. This phenomenon enables quantum communication protocols, quantum computing algorithms, and teleportation experiments that push the boundaries of information theory and our understanding of the fundamental nature of physical reality."
            ]
        };
        
        this.initializeGame();
    }
    
    initializeGame() {
        // Button event listeners
        document.getElementById('typing-start').addEventListener('click', () => this.startTest());
        document.getElementById('typing-reset').addEventListener('click', () => this.newText());
        document.getElementById('typing-restart').addEventListener('click', () => this.restartTest());
        
        // Difficulty selector
        document.getElementById('typing-difficulty').addEventListener('change', (e) => {
            this.difficulty = e.target.value;
            this.newText();
        });
        
        // Input event listener
        const typingInput = document.getElementById('typing-input');
        typingInput.addEventListener('input', (e) => this.handleInput(e));
        typingInput.addEventListener('keydown', (e) => this.handleKeyDown(e));
        
        // Initialize with first text
        this.newText();
        this.updateDisplay();
    }
    
    newText() {
        const texts = this.textSamples[this.difficulty];
        this.currentText = texts[Math.floor(Math.random() * texts.length)];
        this.resetTest();
        this.displayText();
    }
    
    resetTest() {
        this.isPlaying = false;
        this.isPaused = false;
        this.startTime = null;
        this.endTime = null;
        this.typedText = '';
        this.currentIndex = 0;
        this.correctChars = 0;
        this.wrongChars = 0;
        this.totalChars = 0;
        this.remainingTime = this.timeLimit;
        
        // Clear timers
        if (this.statsTimer) {
            clearInterval(this.statsTimer);
            this.statsTimer = null;
        }
        
        if (this.countdownTimer) {
            clearInterval(this.countdownTimer);
            this.countdownTimer = null;
        }
        
        // Reset UI
        document.getElementById('typing-input').value = '';
        document.getElementById('typing-input').disabled = true;
        document.getElementById('typing-results').style.display = 'none';
        document.getElementById('typing-start').innerHTML = '<i class="fas fa-play"></i> Start Test';
        
        this.updateDisplay();
        this.updateProgress();
    }
    
    restartTest() {
        this.resetTest();
        this.displayText();
    }
    
    displayText() {
        const textElement = document.getElementById('typing-text');
        textElement.innerHTML = '';
        
        for (let i = 0; i < this.currentText.length; i++) {
            const char = document.createElement('span');
            char.className = 'char';
            char.textContent = this.currentText[i];
            if (i === 0) char.classList.add('current');
            textElement.appendChild(char);
        }
        
        // Update character count
        document.getElementById('typing-total-chars').textContent = this.currentText.length;
    }
    
    startTest() {
        if (!this.isPlaying) {
            this.isPlaying = true;
            this.startTime = Date.now();
            this.remainingTime = this.timeLimit;
            
            // Enable input
            const typingInput = document.getElementById('typing-input');
            typingInput.disabled = false;
            typingInput.focus();
            
            // Update button
            document.getElementById('typing-start').innerHTML = '<i class="fas fa-stop"></i> Stop Test';
            
            // Start stats timer
            this.statsTimer = setInterval(() => {
                this.updateStats();
            }, 100);
            
            // Start countdown timer
            this.countdownTimer = setInterval(() => {
                this.remainingTime--;
                this.updateTimeDisplay();
                
                if (this.remainingTime <= 0) {
                    this.endTest('timeout');
                }
            }, 1000);
        } else {
            this.endTest('manual');
        }
    }
    
    handleInput(e) {
        if (!this.isPlaying) return;
        
        // Get the current typed text
        this.typedText = e.target.value;
        this.currentIndex = this.typedText.length;
        
        // Ensure spaces are preserved and counted correctly
        // No need to trim or modify the typed text as it should match exactly
        
        // Update text display
        this.updateTextDisplay();
        
        // Update progress
        this.updateProgress();
        
        // Check if test is complete (all text typed)
        if (this.typedText.length >= this.currentText.length) {
            this.endTest('completed');
        }
    }
    
    handleKeyDown(e) {
        // When not playing, only prevent certain navigation keys but allow all input
        if (!this.isPlaying) {
            // Allow typing input but prevent certain navigation keys
            if (['Tab', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'].includes(e.key)) {
                return; // Allow these keys to work normally
            }
            // For all other keys, if the input is disabled, prevent them
            const inputElement = document.getElementById('typing-input');
            if (inputElement.disabled) {
                e.preventDefault();
                return;
            }
        }
        
        // During the game, allow all normal typing including spaces
        // Only prevent certain keys that might interfere with the test
        if (this.isPlaying) {
            // Allow all normal typing keys including space, letters, numbers, punctuation
            // Only prevent keys that might navigate away or cause issues
            if (e.key === 'Tab' || e.key === 'Escape' || e.ctrlKey || e.altKey || e.metaKey) {
                e.preventDefault();
            }
        }
    }
    
    updateTextDisplay() {
        const textElement = document.getElementById('typing-text');
        const chars = textElement.querySelectorAll('.char');
        
        // Reset all characters
        chars.forEach((char, index) => {
            char.className = 'char';
            
            if (index < this.typedText.length) {
                if (this.typedText[index] === this.currentText[index]) {
                    char.classList.add('correct');
                } else {
                    char.classList.add('incorrect');
                }
            } else if (index === this.typedText.length) {
                char.classList.add('current');
            }
        });
    }
    
    updateProgress() {
        const progress = Math.min((this.typedText.length / this.currentText.length) * 100, 100);
        document.getElementById('typing-progress-fill').style.width = progress + '%';
        document.getElementById('typing-progress-percent').textContent = Math.round(progress) + '%';
        document.getElementById('typing-char-count').textContent = this.typedText.length;
    }
    
    updateStats() {
        if (!this.isPlaying || !this.startTime) return;
        
        const currentTime = Date.now();
        const timeElapsed = (currentTime - this.startTime) / 1000; // seconds
        const timeElapsedMinutes = timeElapsed / 60; // minutes
        
        // Calculate statistics
        this.calculateStats();
        
        // Calculate WPM (words per minute) - standard calculation
        // WPM = (correct characters / 5) / minutes elapsed
        // This is the standard formula used by most typing tests
        const wpm = timeElapsedMinutes > 0 ? Math.round((this.correctChars / 5) / timeElapsedMinutes) : 0;
        
        // Calculate accuracy - ensure spaces are counted correctly
        const accuracy = this.typedText.length > 0 ? 
            Math.round((this.correctChars / this.typedText.length) * 100) : 100;
        
        // Update display
        document.getElementById('typing-wpm').textContent = wpm;
        document.getElementById('typing-accuracy').textContent = accuracy + '%';
        document.getElementById('typing-time').textContent = this.remainingTime + 's';
    }
    
    updateTimeDisplay() {
        // Update the time display to show remaining time
        document.getElementById('typing-time').textContent = this.remainingTime + 's';
        
        // Change color based on remaining time
        const timeElement = document.getElementById('typing-time');
        const parentElement = timeElement.closest('.stat-item');
        
        if (this.remainingTime <= 10) {
            parentElement.style.background = 'rgba(231, 76, 60, 0.2)';
            parentElement.style.borderColor = '#e74c3c';
        } else if (this.remainingTime <= 20) {
            parentElement.style.background = 'rgba(230, 126, 34, 0.2)';
            parentElement.style.borderColor = '#e67e22';
        } else {
            parentElement.style.background = 'rgba(255, 255, 255, 0.1)';
            parentElement.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        }
    }
    
    calculateStats() {
        this.correctChars = 0;
        this.wrongChars = 0;
        
        for (let i = 0; i < this.typedText.length; i++) {
            if (i < this.currentText.length && this.typedText[i] === this.currentText[i]) {
                this.correctChars++;
            } else {
                this.wrongChars++;
            }
        }
    }
    
    endTest(reason = 'completed') {
        this.isPlaying = false;
        this.endTime = Date.now();
        
        // Clear timers
        clearInterval(this.statsInterval);
        clearInterval(this.countdownTimer);
        
        // Disable input
        document.getElementById('typing-input').disabled = true;
        
        // Clear timer
        if (this.statsTimer) {
            clearInterval(this.statsTimer);
            this.statsTimer = null;
        }
        
        // Calculate final statistics
        this.calculateFinalStats(reason);
        
        // Show results
        this.showResults(reason);
        
        // Update button
        document.getElementById('typing-start').innerHTML = '<i class="fas fa-play"></i> Start Test';
    }
    
    calculateFinalStats(reason = 'completed') {
        const timeElapsed = (this.endTime - this.startTime) / 1000; // seconds
        const timeElapsedMinutes = timeElapsed / 60; // minutes
        
        // Calculate final statistics
        this.calculateStats();
        
        // Calculate WPM
        const wordsTyped = this.typedText.trim().split(/\s+/).length;
        this.finalWPM = timeElapsedMinutes > 0 ? Math.round(wordsTyped / timeElapsedMinutes) : 0;
        
        // Calculate accuracy
        this.finalAccuracy = this.typedText.length > 0 ? 
            Math.round((this.correctChars / this.typedText.length) * 100) : 100;
        
        this.finalTime = Math.round(timeElapsed);
        this.testReason = reason;
        
        // Update best score only if completed normally (not timeout)
        if (reason === 'completed' && this.finalWPM > this.bestWPM) {
            this.bestWPM = this.finalWPM;
            localStorage.setItem('typingBestWPM', this.bestWPM);
        }
    }
    
    showResults(reason = 'completed') {
        // Update final stats display
        document.getElementById('final-wpm').textContent = this.finalWPM;
        document.getElementById('final-accuracy').textContent = this.finalAccuracy + '%';
        document.getElementById('final-time').textContent = this.finalTime + 's';
        document.getElementById('final-chars').textContent = this.typedText.length;
        document.getElementById('final-correct').textContent = this.correctChars;
        document.getElementById('final-wrong').textContent = this.wrongChars;
        
        // Show completion percentage if test ended due to timeout
        if (reason === 'timeout') {
            const completionPercentage = Math.round((this.typedText.length / this.targetText.length) * 100);
            const statusElement = document.createElement('div');
            statusElement.style.cssText = 'background: rgba(231, 76, 60, 0.2); border: 1px solid #e74c3c; border-radius: 8px; padding: 10px; margin: 10px 0; text-align: center; color: #e74c3c; font-weight: 500;';
            statusElement.innerHTML = `⏰ Time's up! You completed ${completionPercentage}% of the text.`;
            
            const resultsContainer = document.getElementById('typing-results');
            const firstChild = resultsContainer.firstElementChild;
            resultsContainer.insertBefore(statusElement, firstChild);
        }
        
        // Show results section
        document.getElementById('typing-results').style.display = 'block';
        
        // Update current stats
        this.updateDisplay();
    }
    
    updateDisplay() {
        document.getElementById('typing-best').textContent = this.bestWPM;
        
        if (!this.isPlaying) {
            document.getElementById('typing-wpm').textContent = this.finalWPM || 0;
            document.getElementById('typing-accuracy').textContent = (this.finalAccuracy || 100) + '%';
            document.getElementById('typing-time').textContent = (this.finalTime || 0) + 's';
        }
    }
}

// Chess Game Implementation
class ChessGame {
    constructor() {
        console.log('ChessGame constructor called');
        
        this.board = this.initializeBoard();
        this.currentPlayer = 'white';
        this.selectedSquare = null;
        this.moveHistory = [];
        this.capturedPieces = { white: [], black: [] };
        this.gameState = 'playing'; // 'playing', 'check', 'checkmate', 'stalemate', 'draw'
        this.aiDifficulty = 'medium';
        this.scores = this.loadScores();
        this.aiThinking = false;
        
        console.log('Calling initializeGame...');
        this.initializeGame();
        console.log('Calling setupEventListeners...');
        this.setupEventListeners();
        console.log('ChessGame constructor completed');
    }
    
    initializeBoard() {
        return [
            ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
            ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
            ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
        ];
    }
    
    initializeGame() {
        console.log('Chess initializeGame called');
        this.createBoard();
        this.updateScoreDisplay();
        
        // Automatically start a new game
        this.updateStatus('Game ready! White to move.');
        this.updateTurnDisplay();
        this.updateCapturedDisplay();
        this.updateMoveHistory();
        
        console.log('Chess game board created and ready');
    }
    
    createBoard() {
        const boardElement = document.getElementById('chess-board');
        
        // Check if board element exists
        if (!boardElement) {
            console.error('Chess board element not found! Make sure the chess game DOM is loaded.');
            return;
        }
        
        console.log('Creating chess board...');
        boardElement.innerHTML = '';
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = document.createElement('div');
                square.className = `chess-square ${(row + col) % 2 === 0 ? 'light' : 'dark'}`;
                square.dataset.row = row;
                square.dataset.col = col;
                
                const piece = this.board[row][col];
                if (piece) {
                    // Create a piece element instead of just setting innerHTML
                    const pieceElement = document.createElement('span');
                    pieceElement.textContent = this.getPieceSymbol(piece);
                    pieceElement.className = 'chess-piece';
                    
                    // Add color class based on piece case (uppercase = white, lowercase = black)
                    if (piece === piece.toUpperCase()) {
                        pieceElement.classList.add('white-piece');
                    } else {
                        pieceElement.classList.add('black-piece');
                    }
                    
                    square.appendChild(pieceElement);
                }
                
                // Add click handler with debugging
                square.addEventListener('click', (e) => {
                    console.log(`Square clicked: row ${row}, col ${col}, piece: ${piece || 'empty'}`);
                    this.handleSquareClick(row, col);
                });
                
                boardElement.appendChild(square);
            }
        }
        
        console.log(`Chess board created with ${boardElement.children.length} squares`);
    }
    
    getPieceSymbol(piece) {
        const symbols = {
            'K': '♔', 'Q': '♕', 'R': '♖', 'B': '♗', 'N': '♘', 'P': '♙',
            'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟'
        };
        return symbols[piece] || '';
    }
    
    handleSquareClick(row, col) {
        console.log(`Chess square clicked: row ${row}, col ${col}`);
        
        if (this.aiThinking || this.gameState === 'checkmate') return;
        
        const piece = this.board[row][col];
        
        if (this.selectedSquare) {
            const [selectedRow, selectedCol] = this.selectedSquare;
            
            if (row === selectedRow && col === selectedCol) {
                // Deselect
                this.selectedSquare = null;
                this.clearHighlights();
                console.log('Piece deselected');
                return;
            }
            
            if (this.isValidMove(selectedRow, selectedCol, row, col)) {
                console.log(`Making move from ${selectedRow},${selectedCol} to ${row},${col}`);
                this.makeMove(selectedRow, selectedCol, row, col);
                this.selectedSquare = null;
                this.clearHighlights();
                
                // Check game state
                this.updateGameState();
                
                // AI move
                if (this.currentPlayer === 'black' && this.gameState === 'playing') {
                    this.aiThinking = true;
                    this.updateStatus('AI is thinking...');
                    setTimeout(() => this.makeAIMove(), 500);
                }
            } else {
                console.log('Invalid move attempted');
                // Select new piece if it belongs to current player
                if (piece && this.isPieceColor(piece, this.currentPlayer)) {
                    this.selectedSquare = [row, col];
                    this.highlightSquare(row, col);
                    this.highlightValidMoves(row, col);
                    console.log(`New piece selected: ${piece}`);
                } else {
                    this.selectedSquare = null;
                    this.clearHighlights();
                    console.log('Invalid piece selection');
                }
            }
        } else {
            // Select piece if it belongs to current player
            if (piece && this.isPieceColor(piece, this.currentPlayer)) {
                this.selectedSquare = [row, col];
                this.highlightSquare(row, col);
                this.highlightValidMoves(row, col);
                console.log(`Piece selected: ${piece} at ${row},${col}`);
            } else {
                console.log('No valid piece to select');
            }
        }
    }
    
    isPieceColor(piece, color) {
        if (color === 'white') return piece === piece.toUpperCase();
        return piece === piece.toLowerCase();
    }
    
    isValidMove(fromRow, fromCol, toRow, toCol) {
        const piece = this.board[fromRow][fromCol];
        if (!piece) return false;
        
        // Check if piece belongs to current player
        if (!this.isPieceColor(piece, this.currentPlayer)) return false;
        
        // Check if target square has own piece
        const targetPiece = this.board[toRow][toCol];
        if (targetPiece && this.isPieceColor(targetPiece, this.currentPlayer)) return false;
        
        // Check piece-specific movement
        if (!this.isPieceMovementValid(piece, fromRow, fromCol, toRow, toCol)) return false;
        
        // Check if move would put own king in check
        return !this.wouldBeInCheck(fromRow, fromCol, toRow, toCol);
    }
    
    isPieceMovementValid(piece, fromRow, fromCol, toRow, toCol) {
        const pieceType = piece.toLowerCase();
        const rowDiff = toRow - fromRow;
        const colDiff = toCol - fromCol;
        
        switch (pieceType) {
            case 'p': return this.isValidPawnMove(piece, fromRow, fromCol, toRow, toCol);
            case 'r': return this.isValidRookMove(fromRow, fromCol, toRow, toCol);
            case 'n': return this.isValidKnightMove(rowDiff, colDiff);
            case 'b': return this.isValidBishopMove(fromRow, fromCol, toRow, toCol);
            case 'q': return this.isValidQueenMove(fromRow, fromCol, toRow, toCol);
            case 'k': return this.isValidKingMove(rowDiff, colDiff);
        }
        return false;
    }
    
    isValidPawnMove(piece, fromRow, fromCol, toRow, toCol) {
        const isWhite = piece === piece.toUpperCase();
        const direction = isWhite ? -1 : 1;
        const startRow = isWhite ? 6 : 1;
        const rowDiff = toRow - fromRow;
        const colDiff = Math.abs(toCol - fromCol);
        
        // Forward move
        if (colDiff === 0) {
            if (rowDiff === direction && !this.board[toRow][toCol]) return true;
            if (fromRow === startRow && rowDiff === 2 * direction && !this.board[toRow][toCol]) return true;
        }
        // Diagonal capture
        else if (colDiff === 1 && rowDiff === direction) {
            return this.board[toRow][toCol] !== null;
        }
        
        return false;
    }
    
    isValidRookMove(fromRow, fromCol, toRow, toCol) {
        if (fromRow !== toRow && fromCol !== toCol) return false;
        return this.isPathClear(fromRow, fromCol, toRow, toCol);
    }
    
    isValidKnightMove(rowDiff, colDiff) {
        return (Math.abs(rowDiff) === 2 && Math.abs(colDiff) === 1) ||
               (Math.abs(rowDiff) === 1 && Math.abs(colDiff) === 2);
    }
    
    isValidBishopMove(fromRow, fromCol, toRow, toCol) {
        if (Math.abs(toRow - fromRow) !== Math.abs(toCol - fromCol)) return false;
        return this.isPathClear(fromRow, fromCol, toRow, toCol);
    }
    
    isValidQueenMove(fromRow, fromCol, toRow, toCol) {
        return this.isValidRookMove(fromRow, fromCol, toRow, toCol) ||
               this.isValidBishopMove(fromRow, fromCol, toRow, toCol);
    }
    
    isValidKingMove(rowDiff, colDiff) {
        return Math.abs(rowDiff) <= 1 && Math.abs(colDiff) <= 1;
    }
    
    isPathClear(fromRow, fromCol, toRow, toCol) {
        const rowStep = toRow > fromRow ? 1 : toRow < fromRow ? -1 : 0;
        const colStep = toCol > fromCol ? 1 : toCol < fromCol ? -1 : 0;
        
        let currentRow = fromRow + rowStep;
        let currentCol = fromCol + colStep;
        
        while (currentRow !== toRow || currentCol !== toCol) {
            if (this.board[currentRow][currentCol] !== null) return false;
            currentRow += rowStep;
            currentCol += colStep;
        }
        
        return true;
    }
    
    makeMove(fromRow, fromCol, toRow, toCol) {
        console.log(`Making move: ${this.board[fromRow][fromCol]} from [${fromRow},${fromCol}] to [${toRow},${toCol}]`);
        
        const piece = this.board[fromRow][fromCol];
        const capturedPiece = this.board[toRow][toCol];
        
        // Handle captures
        if (capturedPiece) {
            const capturer = this.currentPlayer;
            this.capturedPieces[capturer].push(capturedPiece);
            this.updateCapturedDisplay();
            console.log(`Captured piece: ${capturedPiece}`);
        }
        
        // Make the move
        this.board[toRow][toCol] = piece;
        this.board[fromRow][fromCol] = null;
        
        console.log(`Board updated: [${fromRow},${fromCol}] = null, [${toRow},${toCol}] = ${piece}`);
        
        // Handle pawn promotion
        if (piece.toLowerCase() === 'p') {
            if ((piece === 'P' && toRow === 0) || (piece === 'p' && toRow === 7)) {
                this.handlePawnPromotion(toRow, toCol);
            }
        }
        
        // Record move
        const moveNotation = this.getMoveNotation(piece, fromRow, fromCol, toRow, toCol, capturedPiece);
        this.moveHistory.push({
            piece, fromRow, fromCol, toRow, toCol, capturedPiece, notation: moveNotation
        });
        
        this.updateMoveHistory();
        console.log('Calling updateDisplay...');
        this.updateDisplay();
        this.highlightLastMove(fromRow, fromCol, toRow, toCol);
        
        // Switch players
        this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
        this.updateTurnDisplay();
    }
    
    getMoveNotation(piece, fromRow, fromCol, toRow, toCol, captured) {
        const files = 'abcdefgh';
        const pieceSymbol = piece.toUpperCase() === 'P' ? '' : piece.toUpperCase();
        const captureSymbol = captured ? 'x' : '';
        return `${pieceSymbol}${captureSymbol}${files[toCol]}${8 - toRow}`;
    }
    
    handlePawnPromotion(row, col) {
        // For simplicity, auto-promote to queen
        const isWhite = row === 0;
        this.board[row][col] = isWhite ? 'Q' : 'q';
    }
    
    wouldBeInCheck(fromRow, fromCol, toRow, toCol) {
        // Make temporary move
        const originalPiece = this.board[toRow][toCol];
        const movingPiece = this.board[fromRow][fromCol];
        this.board[toRow][toCol] = movingPiece;
        this.board[fromRow][fromCol] = null;
        
        const inCheck = this.isInCheck(this.currentPlayer);
        
        // Restore board
        this.board[fromRow][fromCol] = movingPiece;
        this.board[toRow][toCol] = originalPiece;
        
        return inCheck;
    }
    
    isInCheck(color) {
        const kingPosition = this.findKing(color);
        if (!kingPosition) return false;
        
        const [kingRow, kingCol] = kingPosition;
        const opponentColor = color === 'white' ? 'black' : 'white';
        
        // Check if any opponent piece can attack the king
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board[row][col];
                if (piece && this.isPieceColor(piece, opponentColor)) {
                    if (this.isPieceMovementValid(piece, row, col, kingRow, kingCol)) {
                        return true;
                    }
                }
            }
        }
        
        return false;
    }
    
    findKing(color) {
        const king = color === 'white' ? 'K' : 'k';
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (this.board[row][col] === king) {
                    return [row, col];
                }
            }
        }
        return null;
    }
    
    updateGameState() {
        if (this.isInCheck(this.currentPlayer)) {
            if (this.hasValidMoves(this.currentPlayer)) {
                this.gameState = 'check';
                this.updateStatus(`${this.currentPlayer} is in check!`);
                this.highlightKingInCheck();
            } else {
                this.gameState = 'checkmate';
                const winner = this.currentPlayer === 'white' ? 'black' : 'white';
                this.updateStatus(`Checkmate! ${winner} wins!`);
                this.endGame(winner);
            }
        } else if (!this.hasValidMoves(this.currentPlayer)) {
            this.gameState = 'stalemate';
            this.updateStatus('Stalemate! It\'s a draw.');
            this.endGame('draw');
        } else {
            this.gameState = 'playing';
            this.updateStatus(`${this.currentPlayer}'s turn`);
        }
    }
    
    hasValidMoves(color) {
        for (let fromRow = 0; fromRow < 8; fromRow++) {
            for (let fromCol = 0; fromCol < 8; fromCol++) {
                const piece = this.board[fromRow][fromCol];
                if (piece && this.isPieceColor(piece, color)) {
                    for (let toRow = 0; toRow < 8; toRow++) {
                        for (let toCol = 0; toCol < 8; toCol++) {
                            if (this.isValidMove(fromRow, fromCol, toRow, toCol)) {
                                return true;
                            }
                        }
                    }
                }
            }
        }
        return false;
    }
    
    makeAIMove() {
        const bestMove = this.getBestMove();
        if (bestMove) {
            const { fromRow, fromCol, toRow, toCol } = bestMove;
            this.makeMove(fromRow, fromCol, toRow, toCol);
            this.updateGameState();
        }
        this.aiThinking = false;
    }
    
    getBestMove() {
        const depth = this.getAIDepth();
        const moves = this.getAllValidMoves('black');
        let bestMove = null;
        let bestScore = -Infinity;
        
        for (const move of moves) {
            const score = this.minimax(move, depth - 1, -Infinity, Infinity, false);
            if (score > bestScore) {
                bestScore = score;
                bestMove = move;
            }
        }
        
        return bestMove;
    }
    
    getAIDepth() {
        switch (this.aiDifficulty) {
            case 'easy': return 2;
            case 'medium': return 3;
            case 'hard': return 4;
            case 'expert': return 5;
            default: return 3;
        }
    }
    
    minimax(move, depth, alpha, beta, maximizing) {
        // Make move
        const { fromRow, fromCol, toRow, toCol } = move;
        const originalPiece = this.board[toRow][toCol];
        const movingPiece = this.board[fromRow][fromCol];
        this.board[toRow][toCol] = movingPiece;
        this.board[fromRow][fromCol] = null;
        
        let score;
        
        if (depth === 0 || this.isGameOver()) {
            score = this.evaluatePosition();
        } else {
            const color = maximizing ? 'black' : 'white';
            const moves = this.getAllValidMoves(color);
            
            if (maximizing) {
                score = -Infinity;
                for (const nextMove of moves) {
                    score = Math.max(score, this.minimax(nextMove, depth - 1, alpha, beta, false));
                    alpha = Math.max(alpha, score);
                    if (beta <= alpha) break;
                }
            } else {
                score = Infinity;
                for (const nextMove of moves) {
                    score = Math.min(score, this.minimax(nextMove, depth - 1, alpha, beta, true));
                    beta = Math.min(beta, score);
                    if (beta <= alpha) break;
                }
            }
        }
        
        // Restore board
        this.board[fromRow][fromCol] = movingPiece;
        this.board[toRow][toCol] = originalPiece;
        
        return score;
    }
    
    getAllValidMoves(color) {
        const moves = [];
        for (let fromRow = 0; fromRow < 8; fromRow++) {
            for (let fromCol = 0; fromCol < 8; fromCol++) {
                const piece = this.board[fromRow][fromCol];
                if (piece && this.isPieceColor(piece, color)) {
                    for (let toRow = 0; toRow < 8; toRow++) {
                        for (let toCol = 0; toCol < 8; toCol++) {
                            if (this.isValidMove(fromRow, fromCol, toRow, toCol)) {
                                moves.push({ fromRow, fromCol, toRow, toCol });
                            }
                        }
                    }
                }
            }
        }
        return moves;
    }
    
    evaluatePosition() {
        const pieceValues = {
            'p': 1, 'n': 3, 'b': 3, 'r': 5, 'q': 9, 'k': 0,
            'P': -1, 'N': -3, 'B': -3, 'R': -5, 'Q': -9, 'K': 0
        };
        
        let score = 0;
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board[row][col];
                if (piece) {
                    score += pieceValues[piece];
                }
            }
        }
        
        return score;
    }
    
    isGameOver() {
        return this.gameState === 'checkmate' || this.gameState === 'stalemate';
    }
    
    highlightSquare(row, col) {
        this.clearHighlights();
        const square = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        square.classList.add('selected');
    }
    
    highlightValidMoves(row, col) {
        for (let toRow = 0; toRow < 8; toRow++) {
            for (let toCol = 0; toCol < 8; toCol++) {
                if (this.isValidMove(row, col, toRow, toCol)) {
                    const square = document.querySelector(`[data-row="${toRow}"][data-col="${toCol}"]`);
                    square.classList.add('valid-move');
                }
            }
        }
    }
    
    highlightLastMove(fromRow, fromCol, toRow, toCol) {
        this.clearHighlights();
        const fromSquare = document.querySelector(`[data-row="${fromRow}"][data-col="${fromCol}"]`);
        const toSquare = document.querySelector(`[data-row="${toRow}"][data-col="${toCol}"]`);
        fromSquare.classList.add('last-move');
        toSquare.classList.add('last-move');
    }
    
    highlightKingInCheck() {
        const kingPosition = this.findKing(this.currentPlayer);
        if (kingPosition) {
            const [row, col] = kingPosition;
            const square = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            square.classList.add('check');
        }
    }
    
    clearHighlights() {
        document.querySelectorAll('.chess-square').forEach(square => {
            square.classList.remove('selected', 'valid-move', 'last-move', 'check');
        });
    }
    
    updateDisplay() {
        console.log('Chess updateDisplay called');
        console.log('Current board state:', this.board);
        
        // Update existing board pieces without recreating the entire board
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
                if (square) {
                    const piece = this.board[row][col];
                    
                    // Force clear everything first
                    square.innerHTML = '';
                    square.classList.remove('chess-piece', 'white-piece', 'black-piece');
                    
                    // Force reflow
                    square.offsetHeight;
                    
                    // Add piece if exists
                    if (piece) {
                        const pieceSymbol = this.getPieceSymbol(piece);
                        
                        // Create a new element for the piece to ensure fresh rendering
                        const pieceElement = document.createElement('span');
                        pieceElement.textContent = pieceSymbol;
                        pieceElement.className = 'chess-piece';
                        
                        // Add color class based on piece case (uppercase = white, lowercase = black)
                        if (piece === piece.toUpperCase()) {
                            pieceElement.classList.add('white-piece');
                        } else {
                            pieceElement.classList.add('black-piece');
                        }
                        
                        square.appendChild(pieceElement);
                        console.log(`Updated square [${row},${col}] with piece ${piece} (${pieceSymbol})`);
                    } else {
                        console.log(`Cleared square [${row},${col}]`);
                    }
                }
            }
        }
        console.log('Chess updateDisplay completed');
    }
    
    // Test method to manually refresh the board
    testUpdateDisplay() {
        console.log('Test update display called');
        this.updateDisplay();
    }
    
    updateStatus(message) {
        document.getElementById('chess-status-title').textContent = this.gameState === 'playing' ? 'Game in Progress' : 'Game Status';
        document.getElementById('chess-status-message').textContent = message;
    }
    
    updateTurnDisplay() {
        document.getElementById('chess-turn').textContent = this.currentPlayer === 'white' ? 'White' : 'Black';
    }
    
    updateCapturedDisplay() {
        const whiteContainer = document.getElementById('captured-by-white');
        const blackContainer = document.getElementById('captured-by-black');
        
        whiteContainer.innerHTML = this.capturedPieces.white.map(piece => {
            const colorClass = piece === piece.toUpperCase() ? 'white-piece' : 'black-piece';
            return `<span class="captured-piece chess-piece ${colorClass}">${this.getPieceSymbol(piece)}</span>`;
        }).join('');
        
        blackContainer.innerHTML = this.capturedPieces.black.map(piece => {
            const colorClass = piece === piece.toUpperCase() ? 'white-piece' : 'black-piece';
            return `<span class="captured-piece chess-piece ${colorClass}">${this.getPieceSymbol(piece)}</span>`;
        }).join('');
    }
    
    updateMoveHistory() {
        const historyContainer = document.getElementById('chess-move-history');
        let historyHTML = '';
        
        for (let i = 0; i < this.moveHistory.length; i += 2) {
            const moveNumber = Math.floor(i / 2) + 1;
            const whiteMove = this.moveHistory[i]?.notation || '';
            const blackMove = this.moveHistory[i + 1]?.notation || '';
            
            historyHTML += `
                <div class="move-pair">
                    <span class="move-number">${moveNumber}.</span>
                    <span class="move-white">${whiteMove}</span>
                    <span class="move-black">${blackMove}</span>
                </div>
            `;
        }
        
        historyContainer.innerHTML = historyHTML;
        historyContainer.scrollTop = historyContainer.scrollHeight;
    }
    
    newGame() {
        this.board = this.initializeBoard();
        this.currentPlayer = 'white';
        this.selectedSquare = null;
        this.moveHistory = [];
        this.capturedPieces = { white: [], black: [] };
        this.gameState = 'playing';
        this.aiThinking = false;
        
        this.initializeGame();
        this.updateStatus('Game started! White to move.');
        this.clearHighlights();
        
        // Enable undo button
        document.getElementById('chess-undo').disabled = false;
    }
    
    undoMove() {
        if (this.moveHistory.length === 0 || this.aiThinking) return;
        
        // Undo last move (and AI move if applicable)
        const movesToUndo = this.currentPlayer === 'white' ? 2 : 1;
        
        for (let i = 0; i < movesToUndo && this.moveHistory.length > 0; i++) {
            const lastMove = this.moveHistory.pop();
            const { piece, fromRow, fromCol, toRow, toCol, capturedPiece } = lastMove;
            
            // Restore the move
            this.board[fromRow][fromCol] = piece;
            this.board[toRow][toCol] = capturedPiece;
            
            // Restore captured pieces
            if (capturedPiece) {
                const capturer = this.isPieceColor(piece, 'white') ? 'white' : 'black';
                const index = this.capturedPieces[capturer].indexOf(capturedPiece);
                if (index > -1) {
                    this.capturedPieces[capturer].splice(index, 1);
                }
            }
            
            // Switch current player
            this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
        }
        
        this.updateDisplay();
        this.updateTurnDisplay();
        this.updateCapturedDisplay();
        this.updateMoveHistory();
        this.updateGameState();
        this.clearHighlights();
    }
    
    getHint() {
        if (this.currentPlayer === 'black' || this.gameState !== 'playing') return;
        
        const moves = this.getAllValidMoves('white');
        if (moves.length > 0) {
            const randomMove = moves[Math.floor(Math.random() * moves.length)];
            const { fromRow, fromCol, toRow, toCol } = randomMove;
            
            // Highlight the suggested move
            this.clearHighlights();
            const fromSquare = document.querySelector(`[data-row="${fromRow}"][data-col="${fromCol}"]`);
            const toSquare = document.querySelector(`[data-row="${toRow}"][data-col="${toCol}"]`);
            fromSquare.classList.add('selected');
            toSquare.classList.add('valid-move');
            
            // Show hint message
            this.updateStatus(`Hint: Consider moving from ${String.fromCharCode(97 + fromCol)}${8 - fromRow} to ${String.fromCharCode(97 + toCol)}${8 - toRow}`);
            
            // Clear hint after 3 seconds
            setTimeout(() => {
                this.clearHighlights();
                this.updateStatus(`${this.currentPlayer}'s turn`);
            }, 3000);
        }
    }
    
    endGame(winner) {
        if (winner === 'draw') {
            this.scores.draws++;
        } else if (winner === 'white') {
            this.scores.white++;
        } else {
            this.scores.black++;
        }
        
        this.saveScores();
        this.updateScoreDisplay();
        
        // Disable undo button
        document.getElementById('chess-undo').disabled = true;
    }
    
    resetScores() {
        this.scores = { white: 0, black: 0, draws: 0 };
        this.saveScores();
        this.updateScoreDisplay();
    }
    
    updateScoreDisplay() {
        document.getElementById('player-chess-score').textContent = this.scores.white;
        document.getElementById('ai-chess-score').textContent = this.scores.black;
        document.getElementById('chess-draws').textContent = this.scores.draws;
    }
    
    loadScores() {
        const saved = localStorage.getItem('chessScores');
        return saved ? JSON.parse(saved) : { white: 0, black: 0, draws: 0 };
    }
    
    saveScores() {
        localStorage.setItem('chessScores', JSON.stringify(this.scores));
    }
    
    setupEventListeners() {
        // Check if chess elements exist before adding event listeners
        const newGameBtn = document.getElementById('chess-new-game');
        const undoBtn = document.getElementById('chess-undo');
        const hintBtn = document.getElementById('chess-hint');
        const resetScoresBtn = document.getElementById('chess-reset-scores');
        const difficultySelect = document.getElementById('chess-difficulty');
        
        if (!newGameBtn || !undoBtn || !hintBtn || !resetScoresBtn || !difficultySelect) {
            console.error('Chess control elements not found! Make sure the chess game DOM is loaded.');
            return;
        }
        
        newGameBtn.addEventListener('click', () => this.newGame());
        undoBtn.addEventListener('click', () => this.undoMove());
        hintBtn.addEventListener('click', () => this.getHint());
        resetScoresBtn.addEventListener('click', () => this.resetScores());
        
        difficultySelect.addEventListener('change', (e) => {
            this.aiDifficulty = e.target.value;
        });
    }
}

// Flappy Bird Game
class FlappyBirdGame {
    constructor() {
        this.canvas = document.getElementById('flappy-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.overlay = document.getElementById('flappy-overlay');
        this.gameOverScreen = document.getElementById('flappy-game-over');
        
        // Verify canvas elements exist
        if (!this.canvas || !this.ctx) {
            console.error('Flappy Bird Game: Canvas or context not found');
            return;
        }
        
        // Set canvas size explicitly for consistent resolution
        this.canvas.width = 800;
        this.canvas.height = 500;
        
        // High DPI support for crisp graphics
        const devicePixelRatio = window.devicePixelRatio || 1;
        if (devicePixelRatio > 1) {
            const rect = this.canvas.getBoundingClientRect();
            this.canvas.width = rect.width * devicePixelRatio;
            this.canvas.height = rect.height * devicePixelRatio;
            this.canvas.style.width = rect.width + 'px';
            this.canvas.style.height = rect.height + 'px';
            this.ctx.scale(devicePixelRatio, devicePixelRatio);
        }
        
        // Game state
        this.isPlaying = false;
        this.isPaused = false;
        this.gameOver = false;
        this.score = 0;
        this.pipesPassed = 0;
        this.bestScore = parseInt(localStorage.getItem('flappyBestScore')) || 0;
        this.difficulty = 'medium';
        
        // Game settings (optimized for 800x500 canvas)
        this.gravity = 0.5;
        this.jumpForce = -8;
        this.pipeSpeed = 2;
        this.pipeGap = 150;
        this.pipeWidth = 60;
        this.pipeSpacing = 300;
        
        // Bird properties (positioned for 800x500 canvas)
        this.bird = {
            x: 100,
            y: 250,
            width: 30,
            height: 25,
            velocity: 0,
            rotation: 0
        };
        
        // Pipes array
        this.pipes = [];
        this.pipeTimer = 0;
        
        // Background elements
        this.backgroundX = 0;
        this.cloudX = 0;
        
        this.initializeGame();
    }
    
    initializeGame() {
        // Button event listeners
        document.getElementById('flappy-start').addEventListener('click', () => this.startGame());
        document.getElementById('flappy-pause').addEventListener('click', () => this.togglePause());
        document.getElementById('flappy-reset').addEventListener('click', () => this.resetBestScore());
        
        // Game over screen buttons
        document.getElementById('flappy-restart-btn').addEventListener('click', () => this.restartGame());
        document.getElementById('flappy-menu-btn').addEventListener('click', () => this.backToMenu());
        document.getElementById('flappy-start-btn').addEventListener('click', () => this.startGame());
        
        // Difficulty selector
        document.getElementById('flappy-difficulty').addEventListener('change', (e) => {
            this.difficulty = e.target.value;
            this.updateDifficulty();
        });
        
        // Canvas click for flapping
        this.canvas.addEventListener('click', () => this.flap());
        
        // Mobile tap zone
        const tapZone = document.getElementById('flappy-tap-zone');
        if (tapZone) {
            tapZone.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.flap();
            });
            tapZone.addEventListener('click', () => this.flap());
        }
        
        // Keyboard controls - only respond when flappy game is active
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' || e.key === ' ') {
                // Only prevent default and flap if the flappy game container is active
                const flappyContainer = document.getElementById('flappy-game');
                if (flappyContainer && flappyContainer.classList.contains('active')) {
                    e.preventDefault();
                    this.flap();
                }
            }
        });
        
        // Initial setup
        this.updateStats();
        this.updateDifficulty();
        this.resetGame();
        this.drawGame();
        
        console.log('Flappy Bird Game initialized successfully with resolution:', 800, 'x', 500);
    }
    
    updateDifficulty() {
        switch (this.difficulty) {
            case 'easy':
                this.pipeGap = 180;
                this.pipeSpeed = 1.5;
                break;
            case 'medium':
                this.pipeGap = 150;
                this.pipeSpeed = 2;
                break;
            case 'hard':
                this.pipeGap = 120;
                this.pipeSpeed = 2.5;
                break;
        }
    }
    
    startGame() {
        if (!this.isPlaying) {
            this.isPlaying = true;
            this.isPaused = false;
            this.gameOver = false;
            
            // Hide overlay with multiple methods to ensure it's hidden
            this.overlay.style.display = 'none';
            this.overlay.classList.add('hidden');
            
            this.gameOverScreen.style.display = 'none';
            this.resetGame();
            this.gameLoop();
        }
    }
    
    togglePause() {
        if (this.isPlaying && !this.gameOver) {
            this.isPaused = !this.isPaused;
            const pauseBtn = document.getElementById('flappy-pause');
            
            if (this.isPaused) {
                pauseBtn.innerHTML = '<i class="fas fa-play"></i> Resume';
            } else {
                pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
                this.gameLoop();
            }
        }
    }
    
    resetGame() {
        this.bird.x = 100;
        this.bird.y = 250;
        this.bird.velocity = 0;
        this.bird.rotation = 0;
        this.pipes = [];
        this.pipeTimer = 0;
        this.score = 0;
        this.pipesPassed = 0;
        this.backgroundX = 0;
        this.cloudX = 0;
        this.updateStats();
    }
    
    restartGame() {
        this.resetGame();
        this.startGame();
    }
    
    backToMenu() {
        this.isPlaying = false;
        this.isPaused = false;
        this.gameOver = false;
        this.resetGame();
        
        // Show overlay with multiple methods to ensure it's visible
        this.overlay.style.display = 'flex';
        this.overlay.classList.remove('hidden');
        
        this.gameOverScreen.style.display = 'none';
        this.drawGame();
    }
    
    resetBestScore() {
        this.bestScore = 0;
        localStorage.setItem('flappyBestScore', '0');
        this.updateStats();
    }
    
    flap() {
        if (this.isPlaying && !this.isPaused && !this.gameOver) {
            this.bird.velocity = this.jumpForce;
            this.bird.rotation = -20; // Tilt up when flapping
        }
    }
    
    gameLoop() {
        if (!this.isPlaying || this.isPaused || this.gameOver) return;
        
        this.update();
        this.drawGame();
        
        requestAnimationFrame(() => this.gameLoop());
    }
    
    update() {
        // Update bird physics
        this.bird.velocity += this.gravity;
        this.bird.y += this.bird.velocity;
        
        // Update bird rotation based on velocity
        this.bird.rotation = Math.max(-20, Math.min(20, this.bird.velocity * 3));
        
        // Move background
        this.backgroundX -= this.pipeSpeed * 0.5;
        this.cloudX -= this.pipeSpeed * 0.3;
        
        if (this.backgroundX <= -100) this.backgroundX = 0;
        if (this.cloudX <= -200) this.cloudX = 0;
        
        // Generate pipes
        this.pipeTimer++;
        if (this.pipeTimer >= this.pipeSpacing / this.pipeSpeed) {
            this.generatePipe();
            this.pipeTimer = 0;
        }
        
        // Update pipes
        for (let i = this.pipes.length - 1; i >= 0; i--) {
            const pipe = this.pipes[i];
            pipe.x -= this.pipeSpeed;
            
            // Remove pipes that are off screen
            if (pipe.x + this.pipeWidth < 0) {
                this.pipes.splice(i, 1);
                continue;
            }
            
            // Check if bird passed through pipe
            if (!pipe.passed && pipe.x + this.pipeWidth < this.bird.x) {
                pipe.passed = true;
                this.score++;
                this.pipesPassed++;
                this.updateStats();
            }
            
            // Check collision
            if (this.checkCollision(pipe)) {
                this.endGame();
                return;
            }
        }
        
        // Check if bird hit ground or ceiling
        if (this.bird.y + this.bird.height >= this.canvas.height || this.bird.y <= 0) {
            this.endGame();
        }
    }
    
    generatePipe() {
        const minHeight = 50;
        const maxHeight = this.canvas.height - this.pipeGap - minHeight;
        const topHeight = Math.random() * (maxHeight - minHeight) + minHeight;
        
        this.pipes.push({
            x: this.canvas.width,
            topHeight: topHeight,
            bottomY: topHeight + this.pipeGap,
            bottomHeight: this.canvas.height - (topHeight + this.pipeGap),
            passed: false
        });
    }
    
    checkCollision(pipe) {
        const birdLeft = this.bird.x;
        const birdRight = this.bird.x + this.bird.width;
        const birdTop = this.bird.y;
        const birdBottom = this.bird.y + this.bird.height;
        
        const pipeLeft = pipe.x;
        const pipeRight = pipe.x + this.pipeWidth;
        
        // Check if bird is within pipe's horizontal bounds
        if (birdRight > pipeLeft && birdLeft < pipeRight) {
            // Check collision with top pipe
            if (birdTop < pipe.topHeight) {
                return true;
            }
            // Check collision with bottom pipe
            if (birdBottom > pipe.bottomY) {
                return true;
            }
        }
        
        return false;
    }
    
    endGame() {
        this.gameOver = true;
        this.isPlaying = false;
        
        // Check for new best score
        let newBest = false;
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            localStorage.setItem('flappyBestScore', this.bestScore.toString());
            newBest = true;
        }
        
        // Record the game in stats
        if (window.statsManager) {
            window.statsManager.recordGame('flappy', { score: this.score });
        }
        
        // Show game over screen
        this.showGameOverScreen(newBest);
    }
    
    showGameOverScreen(newBest) {
        const gameOverScreen = document.getElementById('flappy-game-over');
        const finalScore = document.getElementById('final-score-value');
        const finalPipes = document.getElementById('final-pipes-value');
        const newBestElement = document.getElementById('new-best');
        const newBestValue = document.getElementById('new-best-value');
        
        finalScore.textContent = this.score;
        finalPipes.textContent = this.pipesPassed;
        
        if (newBest) {
            newBestElement.style.display = 'flex';
            newBestValue.textContent = this.bestScore;
        } else {
            newBestElement.style.display = 'none';
        }
        
        gameOverScreen.style.display = 'flex';
        this.updateStats();
    }
    
    drawGame() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw sky background
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(1, '#98FB98');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw moving clouds
        this.drawClouds();
        
        // Draw pipes
        this.drawPipes();
        
        // Draw bird
        this.drawBird();
        
        // Draw score
        this.drawScore();
    }
    
    drawClouds() {
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        
        // Draw multiple clouds
        for (let i = 0; i < 4; i++) {
            const x = this.cloudX + i * 200;
            const y = 50 + i * 30;
            this.drawCloud(x, y);
            this.drawCloud(x + 800, y); // Second set for seamless scrolling
        }
    }
    
    drawCloud(x, y) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, 20, 0, Math.PI * 2);
        this.ctx.arc(x + 20, y, 30, 0, Math.PI * 2);
        this.ctx.arc(x + 40, y, 20, 0, Math.PI * 2);
        this.ctx.arc(x + 20, y - 20, 25, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    drawPipes() {
        this.pipes.forEach(pipe => {
            // Draw top pipe
            this.ctx.fillStyle = '#228B22';
            this.ctx.fillRect(pipe.x, 0, this.pipeWidth, pipe.topHeight);
            
            // Draw bottom pipe
            this.ctx.fillRect(pipe.x, pipe.bottomY, this.pipeWidth, pipe.bottomHeight);
            
            // Add pipe highlights
            this.ctx.fillStyle = '#32CD32';
            this.ctx.fillRect(pipe.x, 0, 10, pipe.topHeight);
            this.ctx.fillRect(pipe.x, pipe.bottomY, 10, pipe.bottomHeight);
            
            // Draw pipe caps
            this.ctx.fillStyle = '#006400';
            this.ctx.fillRect(pipe.x - 5, pipe.topHeight - 20, this.pipeWidth + 10, 20);
            this.ctx.fillRect(pipe.x - 5, pipe.bottomY, this.pipeWidth + 10, 20);
        });
    }
    
    drawBird() {
        this.ctx.save();
        
        // Translate to bird center for rotation
        this.ctx.translate(this.bird.x + this.bird.width / 2, this.bird.y + this.bird.height / 2);
        this.ctx.rotate(this.bird.rotation * Math.PI / 180);
        
        // Draw bird body
        this.ctx.fillStyle = '#FFD700';
        this.ctx.beginPath();
        this.ctx.ellipse(0, 0, this.bird.width / 2, this.bird.height / 2, 0, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw bird wing
        this.ctx.fillStyle = '#FFA500';
        this.ctx.beginPath();
        this.ctx.ellipse(-5, -2, 8, 6, 0, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw bird eye
        this.ctx.fillStyle = 'white';
        this.ctx.beginPath();
        this.ctx.arc(5, -5, 4, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.fillStyle = 'black';
        this.ctx.beginPath();
        this.ctx.arc(6, -5, 2, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw beak
        this.ctx.fillStyle = '#FF8C00';
        this.ctx.beginPath();
        this.ctx.moveTo(10, 0);
        this.ctx.lineTo(18, 2);
        this.ctx.lineTo(10, 4);
        this.ctx.closePath();
        this.ctx.fill();
        
        this.ctx.restore();
    }
    
    drawScore() {
        this.ctx.fillStyle = 'white';
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 3;
        this.ctx.font = 'bold 48px Arial';
        this.ctx.textAlign = 'center';
        
        const text = this.score.toString();
        this.ctx.strokeText(text, this.canvas.width / 2, 80);
        this.ctx.fillText(text, this.canvas.width / 2, 80);
    }
    
    updateStats() {
        document.getElementById('flappy-score').textContent = this.score;
        document.getElementById('flappy-best').textContent = this.bestScore;
        document.getElementById('flappy-pipes').textContent = this.pipesPassed;
    }
}

// Initialize the Game Hub
document.addEventListener('DOMContentLoaded', () => {
    new GameHub();
    new BetaNotificationController();
    
    // Add ripple effect to buttons
    addRippleEffect();
    
    // Smooth scrolling polyfill for older browsers
    if (!window.CSS || !CSS.supports('scroll-behavior', 'smooth')) {
        const links = document.querySelectorAll('a[href^="#"]');
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
});

// Ripple Effect Function
function addRippleEffect() {
    const buttons = document.querySelectorAll('.cta-primary, .cta-secondary, .game-button');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('button-ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Enhanced scroll reveal animation
function initScrollReveal() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for scroll reveal
    const revealElements = document.querySelectorAll('.game-container, .feature-item, .stat-card');
    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Call scroll reveal after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initScrollReveal, 500);
});
