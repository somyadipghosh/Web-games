// Fresh Chess Game Implementation
class ChessGameNew {
    constructor() {
        console.log('New Chess Game initializing...');
        this.board = this.initializeBoard();
        this.currentPlayer = 'white';
        this.selectedSquare = null;
        this.moveHistory = [];
        this.capturedPieces = { white: [], black: [] };
        this.gameState = 'playing';
        this.aiDifficulty = 'medium';
        this.scores = this.loadScores();
        this.aiThinking = false;
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeGame());
        } else {
            this.initializeGame();
        }
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
        console.log('Initializing chess game...');
        
        // Check if elements exist
        const boardElement = document.getElementById('chess-board');
        if (!boardElement) {
            console.error('Chess board element not found!');
            return;
        }
        
        this.createBoard();
        this.setupEventListeners();
        this.updateScoreDisplay();
        this.updateStatus('Game ready! White to move.');
        this.updateTurnDisplay();
        this.updateCapturedDisplay();
        this.updateMoveHistory();
        
        console.log('Chess game initialized successfully!');
    }
    
    createBoard() {
        const boardElement = document.getElementById('chess-board');
        boardElement.innerHTML = '';
        
        console.log('Creating fresh chess board...');
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = document.createElement('div');
                square.className = `chess-square ${(row + col) % 2 === 0 ? 'light' : 'dark'}`;
                square.setAttribute('data-row', row);
                square.setAttribute('data-col', col);
                
                // Add piece if exists
                const piece = this.board[row][col];
                if (piece) {
                    this.addPieceToSquare(square, piece);
                }
                
                // Add click event listener
                square.addEventListener('click', () => this.handleSquareClick(row, col));
                
                boardElement.appendChild(square);
            }
        }
        
        console.log('Chess board created with all pieces!');
    }
    
    addPieceToSquare(square, piece) {
        const pieceElement = document.createElement('div');
        pieceElement.className = 'chess-piece-symbol';
        pieceElement.textContent = this.getPieceSymbol(piece);
        
        // Add color styling
        if (piece === piece.toUpperCase()) {
            pieceElement.classList.add('white-piece');
        } else {
            pieceElement.classList.add('black-piece');
        }
        
        square.appendChild(pieceElement);
    }
    
    getPieceSymbol(piece) {
        const symbols = {
            'K': '♔', 'Q': '♕', 'R': '♖', 'B': '♗', 'N': '♘', 'P': '♙',
            'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟'
        };
        return symbols[piece] || '';
    }
    
    handleSquareClick(row, col) {
        console.log(`Square clicked: [${row}, ${col}]`);
        
        if (this.aiThinking || this.gameState === 'checkmate') {
            console.log('Cannot move - AI thinking or game over');
            return;
        }
        
        const piece = this.board[row][col];
        console.log(`Piece at clicked square: ${piece || 'empty'}`);
        
        if (this.selectedSquare) {
            const [selectedRow, selectedCol] = this.selectedSquare;
            
            // Clicking same square - deselect
            if (row === selectedRow && col === selectedCol) {
                console.log('Deselecting piece');
                this.selectedSquare = null;
                this.clearHighlights();
                return;
            }
            
            // Try to make a move
            if (this.isValidMove(selectedRow, selectedCol, row, col)) {
                console.log(`Making move from [${selectedRow}, ${selectedCol}] to [${row}, ${col}]`);
                this.makeMove(selectedRow, selectedCol, row, col);
                this.selectedSquare = null;
                this.clearHighlights();
                
                // Check game state and handle AI move
                this.updateGameState();
                if (this.currentPlayer === 'black' && this.gameState === 'playing') {
                    this.aiThinking = true;
                    this.updateStatus('AI is thinking...');
                    setTimeout(() => this.makeAIMove(), 1000);
                }
            } else {
                console.log('Invalid move attempted');
                // Select new piece if it belongs to current player
                if (piece && this.isPieceColor(piece, this.currentPlayer)) {
                    console.log(`Selecting new piece: ${piece}`);
                    this.selectedSquare = [row, col];
                    this.highlightSquare(row, col);
                    this.highlightValidMoves(row, col);
                } else {
                    console.log('Cannot select this piece');
                    this.selectedSquare = null;
                    this.clearHighlights();
                }
            }
        } else {
            // No piece selected - try to select
            if (piece && this.isPieceColor(piece, this.currentPlayer)) {
                console.log(`Selecting piece: ${piece} at [${row}, ${col}]`);
                this.selectedSquare = [row, col];
                this.highlightSquare(row, col);
                this.highlightValidMoves(row, col);
            } else {
                console.log('Cannot select this piece - wrong color or empty');
            }
        }
    }
    
    makeMove(fromRow, fromCol, toRow, toCol) {
        console.log(`Executing move: [${fromRow}, ${fromCol}] → [${toRow}, ${toCol}]`);
        
        const piece = this.board[fromRow][fromCol];
        const capturedPiece = this.board[toRow][toCol];
        
        console.log(`Moving piece: ${piece}, capturing: ${capturedPiece || 'none'}`);
        
        // Handle captures
        if (capturedPiece) {
            this.capturedPieces[this.currentPlayer].push(capturedPiece);
            this.updateCapturedDisplay();
        }
        
        // Update board state
        this.board[toRow][toCol] = piece;
        this.board[fromRow][fromCol] = null;
        
        // Update visual board
        this.updateBoardDisplay();
        
        // Record move
        const moveNotation = this.getMoveNotation(piece, fromRow, fromCol, toRow, toCol, capturedPiece);
        this.moveHistory.push({
            piece, fromRow, fromCol, toRow, toCol, capturedPiece, notation: moveNotation
        });
        
        this.updateMoveHistory();
        this.highlightLastMove(fromRow, fromCol, toRow, toCol);
        
        // Switch players
        this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
        this.updateTurnDisplay();
        
        console.log(`Move completed. Current player: ${this.currentPlayer}`);
    }
    
    updateBoardDisplay() {
        console.log('Updating board display...');
        
        // Clear all squares first
        document.querySelectorAll('.chess-square').forEach(square => {
            // Remove any existing piece
            const existingPiece = square.querySelector('.chess-piece-symbol');
            if (existingPiece) {
                existingPiece.remove();
            }
        });
        
        // Add pieces to their new positions
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board[row][col];
                if (piece) {
                    const square = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
                    if (square) {
                        this.addPieceToSquare(square, piece);
                        console.log(`Placed ${piece} at [${row}, ${col}]`);
                    }
                }
            }
        }
        
        console.log('Board display updated!');
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
        
        // Check piece-specific movement (simplified for now)
        return this.isPieceMovementValid(piece, fromRow, fromCol, toRow, toCol);
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
    
    makeAIMove() {
        console.log('AI making move...');
        const bestMove = this.getBestMove();
        if (bestMove) {
            const { fromRow, fromCol, toRow, toCol } = bestMove;
            this.makeMove(fromRow, fromCol, toRow, toCol);
            this.updateGameState();
        }
        this.aiThinking = false;
    }
    
    getBestMove() {
        // Simple AI - just pick a random valid move for now
        const moves = this.getAllValidMoves('black');
        if (moves.length > 0) {
            return moves[Math.floor(Math.random() * moves.length)];
        }
        return null;
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
    
    updateGameState() {
        // Simplified game state checking
        this.gameState = 'playing';
        this.updateStatus(`${this.currentPlayer}'s turn`);
    }
    
    highlightSquare(row, col) {
        this.clearHighlights();
        const square = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        if (square) {
            square.classList.add('selected');
        }
    }
    
    highlightValidMoves(row, col) {
        for (let toRow = 0; toRow < 8; toRow++) {
            for (let toCol = 0; toCol < 8; toCol++) {
                if (this.isValidMove(row, col, toRow, toCol)) {
                    const square = document.querySelector(`[data-row="${toRow}"][data-col="${toCol}"]`);
                    if (square) {
                        square.classList.add('valid-move');
                    }
                }
            }
        }
    }
    
    highlightLastMove(fromRow, fromCol, toRow, toCol) {
        this.clearHighlights();
        const fromSquare = document.querySelector(`[data-row="${fromRow}"][data-col="${fromCol}"]`);
        const toSquare = document.querySelector(`[data-row="${toRow}"][data-col="${toCol}"]`);
        if (fromSquare) fromSquare.classList.add('last-move');
        if (toSquare) toSquare.classList.add('last-move');
    }
    
    clearHighlights() {
        document.querySelectorAll('.chess-square').forEach(square => {
            square.classList.remove('selected', 'valid-move', 'last-move', 'check');
        });
    }
    
    getMoveNotation(piece, fromRow, fromCol, toRow, toCol, captured) {
        const files = 'abcdefgh';
        const pieceSymbol = piece.toUpperCase() === 'P' ? '' : piece.toUpperCase();
        const captureSymbol = captured ? 'x' : '';
        return `${pieceSymbol}${captureSymbol}${files[toCol]}${8 - toRow}`;
    }
    
    updateStatus(message) {
        const statusElement = document.getElementById('chess-status-message');
        if (statusElement) {
            statusElement.textContent = message;
        }
    }
    
    updateTurnDisplay() {
        const turnElement = document.getElementById('chess-turn');
        if (turnElement) {
            turnElement.textContent = this.currentPlayer === 'white' ? 'White' : 'Black';
        }
    }
    
    updateCapturedDisplay() {
        const whiteContainer = document.getElementById('captured-by-white');
        const blackContainer = document.getElementById('captured-by-black');
        
        if (whiteContainer) {
            whiteContainer.innerHTML = this.capturedPieces.white.map(piece => 
                `<span class="captured-piece">${this.getPieceSymbol(piece)}</span>`
            ).join('');
        }
        
        if (blackContainer) {
            blackContainer.innerHTML = this.capturedPieces.black.map(piece => 
                `<span class="captured-piece">${this.getPieceSymbol(piece)}</span>`
            ).join('');
        }
    }
    
    updateMoveHistory() {
        const historyContainer = document.getElementById('chess-move-history');
        if (!historyContainer) return;
        
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
        console.log('Starting new game...');
        this.board = this.initializeBoard();
        this.currentPlayer = 'white';
        this.selectedSquare = null;
        this.moveHistory = [];
        this.capturedPieces = { white: [], black: [] };
        this.gameState = 'playing';
        this.aiThinking = false;
        
        this.createBoard();
        this.updateStatus('Game started! White to move.');
        this.updateTurnDisplay();
        this.updateCapturedDisplay();
        this.updateMoveHistory();
        this.clearHighlights();
    }
    
    setupEventListeners() {
        const newGameBtn = document.getElementById('chess-new-game');
        if (newGameBtn) {
            newGameBtn.addEventListener('click', () => this.newGame());
        }
        
        const difficultySelect = document.getElementById('chess-difficulty');
        if (difficultySelect) {
            difficultySelect.addEventListener('change', (e) => {
                this.aiDifficulty = e.target.value;
            });
        }
    }
    
    loadScores() {
        try {
            return JSON.parse(localStorage.getItem('chessScores')) || { white: 0, black: 0, draws: 0 };
        } catch {
            return { white: 0, black: 0, draws: 0 };
        }
    }
    
    updateScoreDisplay() {
        const playerScore = document.getElementById('player-chess-score');
        const aiScore = document.getElementById('ai-chess-score');
        const draws = document.getElementById('chess-draws');
        
        if (playerScore) playerScore.textContent = this.scores.white;
        if (aiScore) aiScore.textContent = this.scores.black;
        if (draws) draws.textContent = this.scores.draws;
    }
}

// Initialize the new chess game when the script loads
console.log('Chess game script loaded, waiting for DOM...');
