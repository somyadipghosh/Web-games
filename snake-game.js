// Snake Game - Clean Implementation
class SnakeGame {
    constructor() {
        this.canvas = document.getElementById('snake-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.overlay = document.getElementById('snake-overlay');
        this.message = document.getElementById('snake-message');
        
        // Verify canvas elements exist
        if (!this.canvas || !this.ctx) {
            console.error('Snake Game: Canvas or context not found');
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
        
        // Game settings (positioned for 800x500 canvas)
        this.gridSize = 20;
        this.gridWidth = 800 / this.gridSize; // 40 grid cells wide
        this.gridHeight = 500 / this.gridSize; // 25 grid cells high
        
        console.log('Canvas dimensions:', 800, 'x', 500);
        console.log('Grid dimensions:', this.gridWidth, 'x', this.gridHeight);
        
        // Game state
        this.isPlaying = false;
        this.isPaused = false;
        this.gameOver = false;
        this.difficulty = 'medium';
        this.lastUpdate = 0;
        
        // Initialize game objects
        this.resetGameObjects();
        
        this.food = [];
        this.gameSpeed = 150; // milliseconds
        
        // Input handling
        this.keys = {};
        
        this.initializeGame();
    }
    
    resetGameObjects() {
        // Player snake (green) - starts at left side
        this.playerSnake = {
            body: [
                { x: 5, y: 10 },
                { x: 4, y: 10 },
                { x: 3, y: 10 }
            ],
            direction: { x: 1, y: 0 },
            nextDirection: { x: 1, y: 0 }, // Buffer for direction changes
            score: 0
        };
        
        // AI snake (red) - starts at right side, positioned safely within bounds
        // Canvas is typically 800x500, so grid is 40x25
        const safeX = Math.max(15, this.gridWidth - 10); // At least 10 cells from right edge
        this.aiSnake = {
            body: [
                { x: safeX, y: 10 },
                { x: safeX + 1, y: 10 },
                { x: safeX + 2, y: 10 }
            ],
            direction: { x: -1, y: 0 }, // Moving LEFT
            score: 0,
            target: null
        };
        
        console.log('Game objects reset - Grid size:', this.gridWidth, 'x', this.gridHeight);
        console.log('Player snake head at:', this.playerSnake.body[0]);
        console.log('AI snake head at:', this.aiSnake.body[0]);
        console.log('AI snake positioned at safe X:', safeX, 'Grid width:', this.gridWidth);
    }
    
    initializeGame() {
        // Button event listeners
        document.getElementById('snake-start').addEventListener('click', () => this.startGame());
        document.getElementById('snake-pause').addEventListener('click', () => this.togglePause());
        document.getElementById('snake-reset').addEventListener('click', () => this.resetGame());
        
        // Mobile control event listeners
        const snakeUpBtn = document.getElementById('snake-up-btn');
        const snakeDownBtn = document.getElementById('snake-down-btn');
        const snakeLeftBtn = document.getElementById('snake-left-btn');
        const snakeRightBtn = document.getElementById('snake-right-btn');
        
        if (snakeUpBtn && snakeDownBtn && snakeLeftBtn && snakeRightBtn) {
            snakeUpBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.handleKeyPress('arrowup');
            });
            
            snakeUpBtn.addEventListener('click', () => {
                this.handleKeyPress('arrowup');
            });
            
            snakeDownBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.handleKeyPress('arrowdown');
            });
            
            snakeDownBtn.addEventListener('click', () => {
                this.handleKeyPress('arrowdown');
            });
            
            snakeLeftBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.handleKeyPress('arrowleft');
            });
            
            snakeLeftBtn.addEventListener('click', () => {
                this.handleKeyPress('arrowleft');
            });
            
            snakeRightBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.handleKeyPress('arrowright');
            });
            
            snakeRightBtn.addEventListener('click', () => {
                this.handleKeyPress('arrowright');
            });
        }
        
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
        this.updateDifficulty();
        this.spawnFood();
        this.updateDisplay();
        this.drawGame();
        
        // Make sure overlay is visible initially
        this.overlay.classList.remove('hidden');
        this.message.textContent = 'Press Start to Begin!';
        
        console.log('Snake Game initialized successfully with resolution:', 800, 'x', 500);
        console.log('Snake Game initialized - Score check:', this.playerSnake.score, this.aiSnake.score);
    }
    
    startGame() {
        console.log('Starting Snake Game...');
        if (!this.isPlaying) {
            this.isPlaying = true;
            this.isPaused = false;
            this.gameOver = false;
            this.overlay.classList.add('hidden');
            
            // Reset everything fresh
            this.resetGameObjects();
            this.food = [];
            this.spawnFood();
            this.updateDisplay();
            
            this.lastUpdate = Date.now(); // Initialize timing
            console.log('Game started - Initial scores:', this.playerSnake.score, this.aiSnake.score);
            this.gameLoop();
        }
    }
    
    togglePause() {
        if (this.isPlaying && !this.gameOver) {
            this.isPaused = !this.isPaused;
            const pauseBtn = document.getElementById('snake-pause');
            
            if (this.isPaused) {
                this.message.textContent = 'Game Paused - Click Resume to Continue';
                this.overlay.classList.remove('hidden');
                pauseBtn.innerHTML = '<i class="fas fa-play"></i> Resume';
            } else {
                this.overlay.classList.add('hidden');
                pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
                this.lastUpdate = Date.now(); // Reset timing after unpause
            }
        }
    }
    
    resetGame() {
        console.log('Resetting Snake Game...');
        this.isPlaying = false;
        this.isPaused = false;
        this.gameOver = false;
        
        this.resetGameObjects();
        this.food = [];
        this.spawnFood();
        this.updateDisplay();
        
        this.message.textContent = 'Press Start to Begin!';
        this.overlay.classList.remove('hidden');
        this.drawGame();
        console.log('Game reset - Scores:', this.playerSnake.score, this.aiSnake.score);
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
                if (currentDir.y !== 1) this.playerSnake.nextDirection = { x: 0, y: -1 };
                break;
            case 'arrowdown':
            case 's':
                if (currentDir.y !== -1) this.playerSnake.nextDirection = { x: 0, y: 1 };
                break;
            case 'arrowleft':
            case 'a':
                if (currentDir.x !== 1) this.playerSnake.nextDirection = { x: -1, y: 0 };
                break;
            case 'arrowright':
            case 'd':
                if (currentDir.x !== -1) this.playerSnake.nextDirection = { x: 1, y: 0 };
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
        // Apply buffered direction change for player
        this.playerSnake.direction = { ...this.playerSnake.nextDirection };
        
        // Update AI snake decision
        this.updateAI();
        
        // Move snakes
        this.moveSnake(this.playerSnake);
        this.moveSnake(this.aiSnake);
        
        // Check food collection first (before collision checks)
        this.checkFoodCollection();
        
        // Check collisions after movement
        this.checkCollisions();
        
        // Spawn more food if needed
        if (this.food.length < 3) {
            this.spawnFood();
        }
    }
    
    updateAI() {
        const head = this.aiSnake.body[0];
        let nearestFood = null;
        let minDistance = Infinity;
        
        // Find nearest food
        this.food.forEach(food => {
            const distance = Math.abs(head.x - food.x) + Math.abs(head.y - food.y);
            if (distance < minDistance) {
                minDistance = distance;
                nearestFood = food;
            }
        });
        
        if (nearestFood) {
            const currentDir = this.aiSnake.direction;
            
            // Get all possible moves (except opposite direction)
            let possibleMoves = [
                { x: 1, y: 0 },   // right
                { x: -1, y: 0 },  // left
                { x: 0, y: 1 },   // down
                { x: 0, y: -1 }   // up
            ].filter(move => 
                !(move.x === -currentDir.x && move.y === -currentDir.y)
            );
            
            // Filter safe moves
            let safeMoves = possibleMoves.filter(move => {
                const newHead = { x: head.x + move.x, y: head.y + move.y };
                return this.isInBounds(newHead) &&
                       !this.wouldCollide(newHead, this.aiSnake.body) &&
                       !this.wouldCollide(newHead, this.playerSnake.body);
            });
            
            if (safeMoves.length > 0) {
                // Choose move that gets closer to food
                let bestMove = safeMoves[0];
                let bestDistance = Infinity;
                
                safeMoves.forEach(move => {
                    const newHead = { x: head.x + move.x, y: head.y + move.y };
                    const distance = Math.abs(newHead.x - nearestFood.x) + Math.abs(newHead.y - nearestFood.y);
                    
                    if (distance < bestDistance) {
                        bestDistance = distance;
                        bestMove = move;
                    }
                });
                
                this.aiSnake.direction = bestMove;
            } else if (possibleMoves.length > 0) {
                // No safe moves toward food, just survive
                this.aiSnake.direction = possibleMoves[0];
            }
        }
    }
    
    moveSnake(snake) {
        const head = { ...snake.body[0] };
        head.x += snake.direction.x;
        head.y += snake.direction.y;
        
        snake.body.unshift(head);
        // Don't remove tail yet - will be removed in checkFoodCollection if no food eaten
    }
    
    wouldCollide(pos, body) {
        return body.some(segment => segment.x === pos.x && segment.y === pos.y);
    }
    
    isInBounds(pos) {
        return pos.x >= 0 && pos.x < this.gridWidth && pos.y >= 0 && pos.y < this.gridHeight;
    }
    
    checkCollisions() {
        if (this.gameOver) return; // Already game over
        
        const playerHead = this.playerSnake.body[0];
        const aiHead = this.aiSnake.body[0];
        
        console.log('Checking collisions - Player head:', playerHead, 'AI head:', aiHead);
        console.log('Bounds check - Grid width:', this.gridWidth, 'Grid height:', this.gridHeight);
        
        // Check wall collisions
        if (!this.isInBounds(playerHead)) {
            console.log('Player hit wall - position:', playerHead, 'bounds: 0-' + (this.gridWidth-1) + ', 0-' + (this.gridHeight-1));
            this.endGame('AI');
            return;
        }
        
        if (!this.isInBounds(aiHead)) {
            console.log('AI hit wall - position:', aiHead, 'bounds: 0-' + (this.gridWidth-1) + ', 0-' + (this.gridHeight-1));
            this.endGame('Player');
            return;
        }
        
        // Check self-collision (excluding head)
        if (this.wouldCollide(playerHead, this.playerSnake.body.slice(1))) {
            console.log('Player hit self - AI wins');
            this.endGame('AI');
            return;
        }
        
        if (this.wouldCollide(aiHead, this.aiSnake.body.slice(1))) {
            console.log('AI hit self - Player wins');
            this.endGame('Player');
            return;
        }
        
        // Check snake vs snake collision
        if (this.wouldCollide(playerHead, this.aiSnake.body)) {
            console.log('Player hit AI - AI wins');
            this.endGame('AI');
            return;
        }
        
        if (this.wouldCollide(aiHead, this.playerSnake.body)) {
            console.log('AI hit Player - Player wins');
            this.endGame('Player');
            return;
        }
        
        // Score-based win condition removed - game now runs infinitely
        // Players can manually reset to start over when desired
    }
    
    checkFoodCollection() {
        const playerHead = this.playerSnake.body[0];
        const aiHead = this.aiSnake.body[0];
        let playerAte = false;
        let aiAte = false;
        
        this.food = this.food.filter(food => {
            if (food.x === playerHead.x && food.y === playerHead.y) {
                this.playerSnake.score++;
                playerAte = true;
                console.log('Player ate food! Score:', this.playerSnake.score);
                this.updateDisplay();
                return false; // Remove this food
            }
            
            if (food.x === aiHead.x && food.y === aiHead.y) {
                this.aiSnake.score++;
                aiAte = true;
                console.log('AI ate food! Score:', this.aiSnake.score);
                this.updateDisplay();
                return false; // Remove this food
            }
            
            return true; // Keep this food
        });
        
        // Remove tail if no food was eaten
        if (!playerAte) {
            this.playerSnake.body.pop();
        }
        
        if (!aiAte) {
            this.aiSnake.body.pop();
        }
    }
    
    spawnFood() {
        let attempts = 0;
        while (attempts < 50) {
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
        if (this.gameOver) return; // Prevent multiple calls
        
        console.log('Game ending - Winner:', winner, 'Scores - Player:', this.playerSnake.score, 'AI:', this.aiSnake.score);
        
        this.gameOver = true;
        this.isPlaying = false;
        
        let message;
        if (winner === 'Player') {
            message = `🎉 You Win! Score: ${this.playerSnake.score} vs ${this.aiSnake.score}`;
        } else {
            message = `🤖 AI Wins! Score: ${this.aiSnake.score} vs ${this.playerSnake.score}`;
        }
        
        // Record the game in stats
        if (window.statsManager) {
            window.statsManager.recordGame('snake', { score: this.playerSnake.score });
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
