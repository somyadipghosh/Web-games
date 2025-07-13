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
            catch: null
        };
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
        
        // Wait a bit for DOM to be fully ready, then initialize all games
        setTimeout(() => {
            this.games.tictactoe = new TicTacToeAI();
            this.games.rps = new RockPaperScissors();
            this.games.memory = new MemoryGame();
            this.games.numberGuess = new NumberGuessGame();
            this.games.pong = new PongGame();
            this.games.shooter = new SpaceShooterGame();
            this.games.snake = new SnakeGame();
            this.games.wordGuess = new WordGuessGame();
            this.games.catch = new CatchGame();
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
        
        this.currentGame = gameType;
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
        
        if (result === 'X') {
            this.statusElement.textContent = '🎉 You won!';
            this.scores.player++;
        } else if (result === 'O') {
            this.statusElement.textContent = '🤖 AI won!';
            this.scores.ai++;
        } else {
            this.statusElement.textContent = '🤝 It\'s a draw!';
            this.scores.draws++;
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
        
        if (
            (player === 'rock' && ai === 'scissors') ||
            (player === 'paper' && ai === 'rock') ||
            (player === 'scissors' && ai === 'paper')
        ) {
            this.scores.player++;
            return 'player';
        } else {
            this.scores.ai++;
            return 'ai';
        }
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
        
        // Game state
        this.isPlaying = false;
        this.isPaused = false;
        this.gameOver = false;
        this.difficulty = 'medium';
        
        // Game objects
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
        if (this.scores.player >= 5 || this.scores.ai >= 5) {
            this.gameOver = true;
            this.isPlaying = false;
            
            let winner, emoji;
            if (this.scores.player >= 5) {
                winner = 'You Win!';
                emoji = '🎉';
            } else {
                winner = 'AI Wins!';
                emoji = '🤖';
            }
            
            this.message.textContent = `${emoji} ${winner} Final Score: ${this.scores.player} - ${this.scores.ai}`;
            this.overlay.classList.remove('hidden');
            
            // Add game over animation
            const gameContainer = document.getElementById('pong-game');
            if (gameContainer) {
                gameContainer.classList.add('pong-game-over');
                setTimeout(() => {
                    gameContainer.classList.remove('pong-game-over');
                }, 1000);
            }
        }
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
        
        // Game state
        this.isPlaying = false;
        this.isPaused = false;
        this.gameOver = false;
        this.difficulty = 'medium';
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.bestScore = localStorage.getItem('shooterBest') || 0;
        
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
        // Button event listeners
        document.getElementById('shooter-start').addEventListener('click', () => this.startGame());
        document.getElementById('shooter-pause').addEventListener('click', () => this.togglePause());
        document.getElementById('shooter-reset').addEventListener('click', () => this.resetGame());
        
        // Difficulty selector
        document.getElementById('shooter-difficulty').addEventListener('change', (e) => {
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
        
        // Initial setup
        this.updateDisplay();
        this.updateDifficulty();
        this.drawGame();
        
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
        if (this.keys[' '] || this.keys['spacebar']) {
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
        // Limit shooting rate
        if (!this.lastShot || Date.now() - this.lastShot > 150) {
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
        
        this.message.textContent = `🚀 Game Over! Final Score: ${this.score}`;
        this.overlay.classList.remove('hidden');
    }
    
    drawGame() {
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

// Snake Game
class SnakeGame {
    constructor() {
        this.canvas = document.getElementById('snake-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.overlay = document.getElementById('snake-overlay');
        this.message = document.getElementById('snake-message');
        
        // Game settings
        this.gridSize = 20;
        this.gridWidth = this.canvas.width / this.gridSize;
        this.gridHeight = this.canvas.height / this.gridSize;
        
        // Game state
        this.isPlaying = false;
        this.isPaused = false;
        this.gameOver = false;
        this.difficulty = 'medium';
        
        // Player snake (green)
        this.playerSnake = {
            body: [{ x: 10, y: 10 }],
            direction: { x: 1, y: 0 },
            score: 0
        };
        
        // AI snake (red)
        this.aiSnake = {
            body: [{ x: 20, y: 10 }],
            direction: { x: -1, y: 0 },
            score: 0,
            target: null
        };
        
        this.food = [];
        this.gameSpeed = 150; // milliseconds
        this.lastUpdate = 0;
        
        // Input handling
        this.keys = {};
        
        this.initializeGame();
    }
    
    initializeGame() {
        // Button event listeners
        document.getElementById('snake-start').addEventListener('click', () => this.startGame());
        document.getElementById('snake-pause').addEventListener('click', () => this.togglePause());
        document.getElementById('snake-reset').addEventListener('click', () => this.resetGame());
        
        // Difficulty selector
        document.getElementById('snake-difficulty').addEventListener('change', (e) => {
            this.difficulty = e.target.value;
            this.updateDifficulty();
        });
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            this.handleKeyPress(e.key.toLowerCase());
        });
        
        // Initial setup
        this.updateDisplay();
        this.updateDifficulty();
        this.spawnFood();
        this.drawGame();
        
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
            const pauseBtn = document.getElementById('snake-pause');
            
            if (this.isPaused) {
                this.message.textContent = 'Game Paused - Click Start to Resume';
                this.overlay.classList.remove('hidden');
                pauseBtn.innerHTML = '<i class="fas fa-play"></i> Resume';
            } else {
                this.overlay.classList.add('hidden');
                pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
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
        this.playerSnake = {
            body: [{ x: 5, y: 10 }],
            direction: { x: 1, y: 0 },
            score: 0
        };
        
        this.aiSnake = {
            body: [{ x: 25, y: 10 }],
            direction: { x: -1, y: 0 },
            score: 0,
            target: null
        };
        
        this.food = [];
        this.spawnFood();
        this.updateDisplay();
    }
    
    updateDifficulty() {
        switch (this.difficulty) {
            case 'easy':
                this.gameSpeed = 200;
                break;
            case 'medium':
                this.gameSpeed = 150;
                break;
            case 'hard':
                this.gameSpeed = 100;
                break;
        }
    }
    
    handleKeyPress(key) {
        if (!this.isPlaying || this.isPaused) return;
        
        const currentDir = this.playerSnake.direction;
        
        switch (key) {
            case 'arrowup':
            case 'w':
                if (currentDir.y !== 1) this.playerSnake.direction = { x: 0, y: -1 };
                break;
            case 'arrowdown':
            case 's':
                if (currentDir.y !== -1) this.playerSnake.direction = { x: 0, y: 1 };
                break;
            case 'arrowleft':
            case 'a':
                if (currentDir.x !== 1) this.playerSnake.direction = { x: -1, y: 0 };
                break;
            case 'arrowright':
            case 'd':
                if (currentDir.x !== -1) this.playerSnake.direction = { x: 1, y: 0 };
                break;
        }
    }
    
    gameLoop() {
        if (!this.isPlaying || this.gameOver) return;
        
        const now = Date.now();
        if (now - this.lastUpdate >= this.gameSpeed) {
            if (!this.isPaused) {
                this.update();
            }
            this.drawGame();
            this.lastUpdate = now;
        }
        
        requestAnimationFrame(() => this.gameLoop());
    }
    
    update() {
        // Update AI snake decision
        this.updateAI();
        
        // Move snakes
        this.moveSnake(this.playerSnake);
        this.moveSnake(this.aiSnake);
        
        // Check collisions
        this.checkCollisions();
        
        // Check food collection
        this.checkFoodCollection();
        
        // Spawn more food if needed
        if (this.food.length < 3) {
            this.spawnFood();
        }
    }
    
    updateAI() {
        // Simple AI pathfinding to nearest food
        const head = this.aiSnake.body[0];
        let nearestFood = null;
        let minDistance = Infinity;
        
        this.food.forEach(food => {
            const distance = Math.abs(head.x - food.x) + Math.abs(head.y - food.y);
            if (distance < minDistance) {
                minDistance = distance;
                nearestFood = food;
            }
        });
        
        if (nearestFood) {
            const dx = nearestFood.x - head.x;
            const dy = nearestFood.y - head.y;
            
            // Choose direction based on difficulty
            let possibleMoves = [];
            
            if (dx > 0) possibleMoves.push({ x: 1, y: 0 });
            if (dx < 0) possibleMoves.push({ x: -1, y: 0 });
            if (dy > 0) possibleMoves.push({ x: 0, y: 1 });
            if (dy < 0) possibleMoves.push({ x: 0, y: -1 });
            
            // Filter out opposite direction
            const currentDir = this.aiSnake.direction;
            possibleMoves = possibleMoves.filter(move => 
                !(move.x === -currentDir.x && move.y === -currentDir.y)
            );
            
            // Check for collisions and avoid them
            possibleMoves = possibleMoves.filter(move => {
                const newHead = { x: head.x + move.x, y: head.y + move.y };
                return !this.wouldCollide(newHead, this.aiSnake.body) &&
                       !this.wouldCollide(newHead, this.playerSnake.body) &&
                       this.isInBounds(newHead);
            });
            
            if (possibleMoves.length > 0) {
                // Choose best move based on difficulty
                let chosenMove;
                if (this.difficulty === 'hard') {
                    // Always choose optimal move
                    chosenMove = possibleMoves[0];
                } else {
                    // Sometimes make suboptimal moves
                    const randomChance = this.difficulty === 'medium' ? 0.8 : 0.6;
                    if (Math.random() < randomChance) {
                        chosenMove = possibleMoves[0];
                    } else {
                        chosenMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
                    }
                }
                
                this.aiSnake.direction = chosenMove;
            }
        }
    }
    
    moveSnake(snake) {
        const head = { ...snake.body[0] };
        head.x += snake.direction.x;
        head.y += snake.direction.y;
        
        snake.body.unshift(head);
        snake.body.pop(); // Remove tail (will be added back if food eaten)
    }
    
    wouldCollide(pos, body) {
        return body.some(segment => segment.x === pos.x && segment.y === pos.y);
    }
    
    isInBounds(pos) {
        return pos.x >= 0 && pos.x < this.gridWidth && pos.y >= 0 && pos.y < this.gridHeight;
    }
    
    checkCollisions() {
        // Check wall collisions
        const playerHead = this.playerSnake.body[0];
        const aiHead = this.aiSnake.body[0];
        
        if (!this.isInBounds(playerHead) || this.wouldCollide(playerHead, this.playerSnake.body.slice(1))) {
            this.endGame('AI');
            return;
        }
        
        if (!this.isInBounds(aiHead) || this.wouldCollide(aiHead, this.aiSnake.body.slice(1))) {
            this.endGame('Player');
            return;
        }
        
        // Check snake collision with each other
        if (this.wouldCollide(playerHead, this.aiSnake.body)) {
            this.endGame('AI');
            return;
        }
        
        if (this.wouldCollide(aiHead, this.playerSnake.body)) {
            this.endGame('Player');
            return;
        }
    }
    
    checkFoodCollection() {
        const playerHead = this.playerSnake.body[0];
        const aiHead = this.aiSnake.body[0];
        
        this.food = this.food.filter(food => {
            if (food.x === playerHead.x && food.y === playerHead.y) {
                this.playerSnake.body.push({}); // Grow snake
                this.playerSnake.score++;
                this.updateDisplay();
                return false;
            }
            
            if (food.x === aiHead.x && food.y === aiHead.y) {
                this.aiSnake.body.push({}); // Grow snake
                this.aiSnake.score++;
                this.updateDisplay();
                return false;
            }
            
            return true;
        });
    }
    
    spawnFood() {
        let attempts = 0;
        while (attempts < 50) { // Prevent infinite loop
            const food = {
                x: Math.floor(Math.random() * this.gridWidth),
                y: Math.floor(Math.random() * this.gridHeight)
            };
            
            // Check if position is free
            const occupied = this.playerSnake.body.some(segment => segment.x === food.x && segment.y === food.y) ||
                           this.aiSnake.body.some(segment => segment.x === food.x && segment.y === food.y) ||
                           this.food.some(existingFood => existingFood.x === food.x && existingFood.y === food.y);
            
            if (!occupied) {
                this.food.push(food);
                break;
            }
            attempts++;
        }
    }
    
    endGame(winner) {
        this.gameOver = true;
        this.isPlaying = false;
        
        let message;
        if (winner === 'Player') {
            message = `🎉 You Win! Score: ${this.playerSnake.score} vs ${this.aiSnake.score}`;
        } else {
            message = `🤖 AI Wins! Score: ${this.aiSnake.score} vs ${this.playerSnake.score}`;
        }
        
        this.message.textContent = message;
        this.overlay.classList.remove('hidden');
    }
    
    drawGame() {
        // Clear canvas
        this.ctx.fillStyle = '#2c3e50';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw grid
        this.ctx.strokeStyle = '#34495e';
        this.ctx.lineWidth = 1;
        for (let x = 0; x <= this.canvas.width; x += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        for (let y = 0; y <= this.canvas.height; y += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
        
        // Draw player snake (green)
        this.ctx.fillStyle = '#27ae60';
        this.playerSnake.body.forEach((segment, index) => {
            if (index === 0) {
                this.ctx.fillStyle = '#2ecc71'; // Brighter head
            } else {
                this.ctx.fillStyle = '#27ae60';
            }
            this.ctx.fillRect(
                segment.x * this.gridSize + 1,
                segment.y * this.gridSize + 1,
                this.gridSize - 2,
                this.gridSize - 2
            );
        });
        
        // Draw AI snake (red)
        this.ctx.fillStyle = '#e74c3c';
        this.aiSnake.body.forEach((segment, index) => {
            if (index === 0) {
                this.ctx.fillStyle = '#c0392b'; // Darker head
            } else {
                this.ctx.fillStyle = '#e74c3c';
            }
            this.ctx.fillRect(
                segment.x * this.gridSize + 1,
                segment.y * this.gridSize + 1,
                this.gridSize - 2,
                this.gridSize - 2
            );
        });
        
        // Draw food
        this.ctx.fillStyle = '#f1c40f';
        this.food.forEach(food => {
            this.ctx.fillRect(
                food.x * this.gridSize + 3,
                food.y * this.gridSize + 3,
                this.gridSize - 6,
                this.gridSize - 6
            );
        });
    }
    
    updateDisplay() {
        document.getElementById('player-snake-score').textContent = this.playerSnake.score;
        document.getElementById('ai-snake-score').textContent = this.aiSnake.score;
        document.getElementById('snake-food-count').textContent = this.food.length;
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

// Initialize the Game Hub
document.addEventListener('DOMContentLoaded', () => {
    new GameHub();
});
