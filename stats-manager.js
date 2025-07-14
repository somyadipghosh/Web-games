// Statistics Manager for Web Games
class StatsManager {
    constructor() {
        this.initializeStats();
        this.updateLeaderboardDisplay();
    }

    // Initialize default stats structure
    initializeStats() {
        const defaultStats = {
            totalGames: 0,
            totalWins: 0,
            totalScore: 0,
            winRate: 0,
            gamesData: {
                tictactoe: {
                    played: 0,
                    won: 0,
                    winRate: 0,
                    bestStreak: 0
                },
                chess: {
                    played: 0,
                    won: 0,
                    winRate: 0,
                    bestStreak: 0
                },
                snake: {
                    played: 0,
                    highScore: 0,
                    totalScore: 0,
                    averageScore: 0
                },
                flappy: {
                    played: 0,
                    highScore: 0,
                    totalScore: 0,
                    averageScore: 0
                },
                rps: {
                    played: 0,
                    won: 0,
                    winRate: 0,
                    bestStreak: 0
                },
                memory: {
                    played: 0,
                    highScore: 0,
                    totalScore: 0,
                    averageScore: 0
                },
                numberGuess: {
                    played: 0,
                    won: 0,
                    winRate: 0,
                    bestAttempts: null
                },
                pong: {
                    played: 0,
                    won: 0,
                    winRate: 0,
                    bestStreak: 0
                },
                shooter: {
                    played: 0,
                    highScore: 0,
                    totalScore: 0,
                    averageScore: 0
                },
                wordGuess: {
                    played: 0,
                    won: 0,
                    winRate: 0,
                    bestStreak: 0
                },
                catch: {
                    played: 0,
                    highScore: 0,
                    totalScore: 0,
                    averageScore: 0
                },
                countryQuiz: {
                    played: 0,
                    won: 0,
                    winRate: 0,
                    bestStreak: 0
                },
                typing: {
                    played: 0,
                    highScore: 0,
                    totalScore: 0,
                    averageScore: 0
                }
            }
        };

        // Get existing stats or use defaults
        const existingStats = localStorage.getItem('webGamesStats');
        if (!existingStats) {
            localStorage.setItem('webGamesStats', JSON.stringify(defaultStats));
        }
    }

    // Get current stats from localStorage
    getStats() {
        const stats = localStorage.getItem('webGamesStats');
        return stats ? JSON.parse(stats) : null;
    }

    // Save stats to localStorage
    saveStats(stats) {
        localStorage.setItem('webGamesStats', JSON.stringify(stats));
        this.updateLeaderboardDisplay();
    }

    // Record a game completion
    recordGame(gameType, gameData) {
        const stats = this.getStats();
        if (!stats || !stats.gamesData[gameType]) return;

        const gameStats = stats.gamesData[gameType];
        gameStats.played++;

        // Update game-specific stats based on game type
        switch (gameType) {
            case 'tictactoe':
            case 'chess':
            case 'rps':
            case 'numberGuess':
            case 'pong':
            case 'wordGuess':
            case 'countryQuiz':
                if (gameData.won) {
                    gameStats.won++;
                    stats.totalWins++;
                }
                gameStats.winRate = Math.round((gameStats.won / gameStats.played) * 100);
                if (gameData.streak && gameData.streak > gameStats.bestStreak) {
                    gameStats.bestStreak = gameData.streak;
                }
                break;

            case 'snake':
            case 'flappy':
            case 'memory':
            case 'shooter':
            case 'catch':
            case 'typing':
                if (gameData.score) {
                    gameStats.totalScore += gameData.score;
                    stats.totalScore += gameData.score;
                    gameStats.averageScore = Math.round(gameStats.totalScore / gameStats.played);
                    
                    if (gameData.score > gameStats.highScore) {
                        gameStats.highScore = gameData.score;
                    }
                }
                break;
        }

        // Special case for number guessing - track best attempts
        if (gameType === 'numberGuess' && gameData.won && gameData.attempts) {
            if (!gameStats.bestAttempts || gameData.attempts < gameStats.bestAttempts) {
                gameStats.bestAttempts = gameData.attempts;
            }
        }

        // Update total stats
        stats.totalGames++;
        stats.winRate = Math.round((stats.totalWins / stats.totalGames) * 100);

        this.saveStats(stats);
        
        // Log the game completion for debugging
        console.log(`Game recorded: ${gameType}`, gameData, 'Updated stats:', stats);
    }

    // Reset all statistics
    resetStats() {
        localStorage.removeItem('webGamesStats');
        this.initializeStats();
        this.updateLeaderboardDisplay();
    }

    // Reset stats for a specific game
    resetGameStats(gameType) {
        const stats = this.getStats();
        if (!stats || !stats.gamesData[gameType]) return;

        // Reset game-specific stats
        const gameStats = stats.gamesData[gameType];
        const oldWins = gameStats.won || 0;
        const oldScore = gameStats.totalScore || 0;
        const oldGames = gameStats.played || 0;

        // Reset the specific game stats
        if (['tictactoe', 'chess', 'rps', 'numberGuess', 'pong', 'wordGuess', 'countryQuiz'].includes(gameType)) {
            gameStats.played = 0;
            gameStats.won = 0;
            gameStats.winRate = 0;
            gameStats.bestStreak = 0;
            if (gameType === 'numberGuess') gameStats.bestAttempts = null;
        } else {
            gameStats.played = 0;
            gameStats.highScore = 0;
            gameStats.totalScore = 0;
            gameStats.averageScore = 0;
        }

        // Update total stats by subtracting the old values
        stats.totalGames -= oldGames;
        stats.totalWins -= oldWins;
        stats.totalScore -= oldScore;
        
        // Recalculate win rate
        stats.winRate = stats.totalGames > 0 ? Math.round((stats.totalWins / stats.totalGames) * 100) : 0;

        this.saveStats(stats);
    }

    // Update the leaderboard display in real-time
    updateLeaderboardDisplay() {
        const stats = this.getStats();
        if (!stats) return;

        // Update main stat cards
        this.updateElement('total-games-stat', stats.totalGames);
        this.updateElement('total-wins-stat', stats.totalWins);
        this.updateElement('win-rate-stat', `${stats.winRate}%`);
        this.updateElement('total-score-stat', this.formatNumber(stats.totalScore));

        // Update game-specific stats
        this.updateGameSpecificStats(stats.gamesData);
    }

    // Update individual elements safely
    updateElement(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = value;
        }
    }

    // Update game-specific statistics display
    updateGameSpecificStats(gamesData) {
        // Tic Tac Toe
        if (gamesData.tictactoe) {
            this.updateElement('ttt-games', gamesData.tictactoe.played);
            this.updateElement('ttt-wins', gamesData.tictactoe.won);
            this.updateElement('ttt-rate', `${gamesData.tictactoe.winRate}%`);
        }

        // Chess
        if (gamesData.chess) {
            this.updateElement('chess-games', gamesData.chess.played);
            this.updateElement('chess-wins', gamesData.chess.won);
            this.updateElement('chess-rate', `${gamesData.chess.winRate}%`);
        }

        // Snake
        if (gamesData.snake) {
            this.updateElement('snake-games', gamesData.snake.played);
            this.updateElement('snake-high', gamesData.snake.highScore);
            this.updateElement('snake-avg', gamesData.snake.averageScore);
        }

        // Flappy Bird
        if (gamesData.flappy) {
            this.updateElement('flappy-games', gamesData.flappy.played);
            this.updateElement('flappy-high', gamesData.flappy.highScore);
            this.updateElement('flappy-avg', gamesData.flappy.averageScore);
        }
    }

    // Format large numbers with commas
    formatNumber(num) {
        return num.toLocaleString();
    }

    // Get stats for a specific game
    getGameStats(gameType) {
        const stats = this.getStats();
        return stats ? stats.gamesData[gameType] : null;
    }

    // Get total statistics
    getTotalStats() {
        const stats = this.getStats();
        if (!stats) return null;

        return {
            totalGames: stats.totalGames,
            totalWins: stats.totalWins,
            totalScore: stats.totalScore,
            winRate: stats.winRate
        };
    }

    // Export stats as JSON (for backup/sharing)
    exportStats() {
        const stats = this.getStats();
        return JSON.stringify(stats, null, 2);
    }

    // Import stats from JSON (for restore/sharing)
    importStats(jsonData) {
        try {
            const stats = JSON.parse(jsonData);
            this.saveStats(stats);
            return true;
        } catch (error) {
            console.error('Failed to import stats:', error);
            return false;
        }
    }

    // Get achievement data (for future use)
    checkAchievements() {
        const stats = this.getStats();
        const achievements = [];

        if (stats.totalGames >= 10) achievements.push('First Steps: Play 10 games');
        if (stats.totalGames >= 50) achievements.push('Getting Serious: Play 50 games');
        if (stats.totalGames >= 100) achievements.push('Dedicated Player: Play 100 games');
        
        if (stats.totalWins >= 10) achievements.push('Winner: Win 10 games');
        if (stats.totalWins >= 25) achievements.push('Champion: Win 25 games');
        if (stats.totalWins >= 50) achievements.push('Legend: Win 50 games');
        
        if (stats.winRate >= 50) achievements.push('Skilled: 50% win rate');
        if (stats.winRate >= 75) achievements.push('Expert: 75% win rate');
        if (stats.winRate >= 90) achievements.push('Master: 90% win rate');

        return achievements;
    }
}

// Create global stats manager instance
window.statsManager = new StatsManager();

// Export for module usage if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StatsManager;
}
