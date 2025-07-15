/* ===== ENHANCED MOBILE CONTROLS FOR AI GAME HUB ===== */
/* Touch controls, haptic feedback, and mobile-specific interactions */

class MobileControlsManager {
    constructor() {
        this.isMobile = this.detectMobile();
        this.isTablet = this.detectTablet();
        this.touchSupported = 'ontouchstart' in window;
        this.hapticSupported = 'vibrate' in navigator;
        
        // Touch event tracking
        this.touchStartTime = 0;
        this.touchDuration = 0;
        this.lastTouchTime = 0;
        this.doubleTapThreshold = 300; // ms
        
        // Mobile-specific settings
        this.preventZoom = true;
        this.preventScroll = true;
        
        this.init();
    }
    
    init() {
        if (this.isMobile || this.isTablet) {
            this.setupMobileEnvironment();
            this.initializeTouchControls();
            this.addMobileSpecificStyles();
            this.handleOrientationChanges();
            this.optimizePerformance();
        }
        
        console.log('Mobile Controls Manager initialized:', {
            isMobile: this.isMobile,
            isTablet: this.isTablet,
            touchSupported: this.touchSupported,
            hapticSupported: this.hapticSupported
        });
    }
    
    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               (window.innerWidth <= 768 && this.touchSupported);
    }
    
    detectTablet() {
        return /iPad|Tablet|PlayBook|Kindle|Silk|Android.*\b(A|a)ndroid\b.*\b(T|t)ablet\b/i.test(navigator.userAgent) ||
               (window.innerWidth > 768 && window.innerWidth <= 1024 && this.touchSupported);
    }
    
    setupMobileEnvironment() {
        // Prevent zoom on double tap
        if (this.preventZoom) {
            document.addEventListener('touchstart', (e) => {
                if (e.touches.length > 1) {
                    e.preventDefault();
                }
            }, { passive: false });
            
            let lastTouchEnd = 0;
            document.addEventListener('touchend', (e) => {
                const now = (new Date()).getTime();
                if (now - lastTouchEnd <= 300) {
                    e.preventDefault();
                }
                lastTouchEnd = now;
            }, false);
        }
        
        // Add mobile viewport optimization
        this.addMobileViewport();
        
        // Hide address bar on mobile browsers
        window.addEventListener('load', () => {
            setTimeout(() => {
                window.scrollTo(0, 1);
            }, 100);
        });
    }
    
    addMobileViewport() {
        let viewport = document.querySelector('meta[name="viewport"]');
        if (!viewport) {
            viewport = document.createElement('meta');
            viewport.name = 'viewport';
            document.head.appendChild(viewport);
        }
        
        viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, shrink-to-fit=no';
    }
    
    initializeTouchControls() {
        // Enhanced Pong Controls
        this.initPongControls();
        
        // Enhanced Snake Controls
        this.initSnakeControls();
        
        // Enhanced Shooter Controls
        this.initShooterControls();
        
        // Enhanced Catch Controls
        this.initCatchControls();
        
        // Enhanced Flappy Bird Controls
        this.initFlappyControls();
        
        // Universal touch gestures
        this.initUniversalGestures();
    }
    
    initPongControls() {
        const upBtn = document.getElementById('pong-up-btn');
        const downBtn = document.getElementById('pong-down-btn');
        
        if (upBtn && downBtn) {
            // Touch events for continuous movement
            this.addContinuousTouch(upBtn, () => {
                this.triggerGameAction('pong', 'up');
                this.hapticFeedback('light');
            });
            
            this.addContinuousTouch(downBtn, () => {
                this.triggerGameAction('pong', 'down');
                this.hapticFeedback('light');
            });
            
            // Visual feedback
            this.addTouchVisualFeedback(upBtn);
            this.addTouchVisualFeedback(downBtn);
        }
    }
    
    initSnakeControls() {
        const dpadButtons = {
            up: document.querySelector('.dpad-up'),
            down: document.querySelector('.dpad-down'),
            left: document.querySelector('.dpad-left'),
            right: document.querySelector('.dpad-right')
        };
        
        Object.entries(dpadButtons).forEach(([direction, button]) => {
            if (button) {
                this.addTouchEvent(button, () => {
                    this.triggerGameAction('snake', direction);
                    this.hapticFeedback('medium');
                });
                
                this.addTouchVisualFeedback(button);
            }
        });
        
        // Swipe gestures for snake
        this.addSwipeGestures('snake-canvas', {
            up: () => this.triggerGameAction('snake', 'up'),
            down: () => this.triggerGameAction('snake', 'down'),
            left: () => this.triggerGameAction('snake', 'left'),
            right: () => this.triggerGameAction('snake', 'right')
        });
    }
    
    initShooterControls() {
        const leftBtn = document.getElementById('shooter-left-btn');
        const rightBtn = document.getElementById('shooter-right-btn');
        const fireBtn = document.getElementById('shooter-fire-btn');
        const boostBtn = document.getElementById('shooter-boost-btn');
        
        if (leftBtn) {
            this.addContinuousTouch(leftBtn, () => {
                this.triggerGameAction('shooter', 'left');
                this.hapticFeedback('light');
            });
            this.addTouchVisualFeedback(leftBtn);
        }
        
        if (rightBtn) {
            this.addContinuousTouch(rightBtn, () => {
                this.triggerGameAction('shooter', 'right');
                this.hapticFeedback('light');
            });
            this.addTouchVisualFeedback(rightBtn);
        }
        
        if (fireBtn) {
            this.addTouchEvent(fireBtn, () => {
                this.triggerGameAction('shooter', 'fire');
                this.hapticFeedback('medium');
            });
            this.addTouchVisualFeedback(fireBtn);
        }
        
        if (boostBtn) {
            this.addTouchEvent(boostBtn, () => {
                this.triggerGameAction('shooter', 'boost');
                this.hapticFeedback('heavy');
            });
            this.addTouchVisualFeedback(boostBtn);
        }
    }
    
    initCatchControls() {
        const leftBtn = document.querySelector('#catch-mobile-controls .touch-button:nth-child(1)');
        const rightBtn = document.querySelector('#catch-mobile-controls .touch-button:nth-child(2)');
        
        if (leftBtn) {
            this.addContinuousTouch(leftBtn, () => {
                this.triggerGameAction('catch', 'left');
                this.hapticFeedback('light');
            });
            this.addTouchVisualFeedback(leftBtn);
        }
        
        if (rightBtn) {
            this.addContinuousTouch(rightBtn, () => {
                this.triggerGameAction('catch', 'right');
                this.hapticFeedback('light');
            });
            this.addTouchVisualFeedback(rightBtn);
        }
        
        // Tilt controls for catch game (if device supports)
        if (window.DeviceOrientationEvent) {
            this.initTiltControls('catch');
        }
    }
    
    initFlappyControls() {
        const tapZone = document.getElementById('flappy-tap-zone');
        const canvas = document.getElementById('flappy-canvas');
        
        if (tapZone) {
            this.addTouchEvent(tapZone, () => {
                this.triggerGameAction('flappy', 'flap');
                this.hapticFeedback('medium');
            });
            this.addTouchVisualFeedback(tapZone);
        }
        
        // Make entire canvas tappable for flappy bird
        if (canvas) {
            this.addTouchEvent(canvas, () => {
                this.triggerGameAction('flappy', 'flap');
                this.hapticFeedback('light');
            });
        }
    }
    
    addTouchEvent(element, callback, options = {}) {
        if (!element) return;
        
        const defaultOptions = {
            preventDefault: true,
            passive: false,
            debounce: 50
        };
        
        const opts = { ...defaultOptions, ...options };
        let lastCall = 0;
        
        const touchHandler = (e) => {
            if (opts.preventDefault) {
                e.preventDefault();
                e.stopPropagation();
            }
            
            const now = Date.now();
            if (now - lastCall < opts.debounce) return;
            lastCall = now;
            
            callback(e);
        };
        
        element.addEventListener('touchstart', touchHandler, { passive: !opts.preventDefault });
        element.addEventListener('click', touchHandler, { passive: !opts.preventDefault });
    }
    
    addContinuousTouch(element, callback, interval = 100) {
        if (!element) return;
        
        let touchInterval;
        let isActive = false;
        
        const startContinuous = (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            if (isActive) return;
            isActive = true;
            
            // Immediate call
            callback();
            
            // Continuous calls
            touchInterval = setInterval(callback, interval);
        };
        
        const stopContinuous = (e) => {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            
            isActive = false;
            if (touchInterval) {
                clearInterval(touchInterval);
                touchInterval = null;
            }
        };
        
        element.addEventListener('touchstart', startContinuous, { passive: false });
        element.addEventListener('mousedown', startContinuous, { passive: false });
        
        element.addEventListener('touchend', stopContinuous, { passive: false });
        element.addEventListener('touchcancel', stopContinuous, { passive: false });
        element.addEventListener('mouseup', stopContinuous, { passive: false });
        element.addEventListener('mouseleave', stopContinuous, { passive: false });
        
        // Global stop to handle cases where touch ends outside element
        document.addEventListener('touchend', stopContinuous, { passive: false });
        document.addEventListener('mouseup', stopContinuous, { passive: false });
    }
    
    addTouchVisualFeedback(element) {
        if (!element) return;
        
        const addActiveClass = () => {
            element.classList.add('touch-active');
        };
        
        const removeActiveClass = () => {
            element.classList.remove('touch-active');
        };
        
        element.addEventListener('touchstart', addActiveClass, { passive: true });
        element.addEventListener('mousedown', addActiveClass, { passive: true });
        
        element.addEventListener('touchend', removeActiveClass, { passive: true });
        element.addEventListener('touchcancel', removeActiveClass, { passive: true });
        element.addEventListener('mouseup', removeActiveClass, { passive: true });
        element.addEventListener('mouseleave', removeActiveClass, { passive: true });
    }
    
    addSwipeGestures(elementId, callbacks) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        let startX, startY, startTime;
        const minSwipeDistance = 50;
        const maxSwipeTime = 300;
        
        element.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
            startTime = Date.now();
        }, { passive: true });
        
        element.addEventListener('touchend', (e) => {
            e.preventDefault();
            
            const touch = e.changedTouches[0];
            const endX = touch.clientX;
            const endY = touch.clientY;
            const endTime = Date.now();
            
            const deltaX = endX - startX;
            const deltaY = endY - startY;
            const deltaTime = endTime - startTime;
            
            if (deltaTime > maxSwipeTime) return;
            
            const absDeltaX = Math.abs(deltaX);
            const absDeltaY = Math.abs(deltaY);
            
            if (absDeltaX > minSwipeDistance || absDeltaY > minSwipeDistance) {
                if (absDeltaX > absDeltaY) {
                    // Horizontal swipe
                    if (deltaX > 0 && callbacks.right) {
                        callbacks.right();
                        this.hapticFeedback('light');
                    } else if (deltaX < 0 && callbacks.left) {
                        callbacks.left();
                        this.hapticFeedback('light');
                    }
                } else {
                    // Vertical swipe
                    if (deltaY > 0 && callbacks.down) {
                        callbacks.down();
                        this.hapticFeedback('light');
                    } else if (deltaY < 0 && callbacks.up) {
                        callbacks.up();
                        this.hapticFeedback('light');
                    }
                }
            }
        }, { passive: false });
    }
    
    initTiltControls(gameType) {
        let tiltEnabled = false;
        let tiltSensitivity = 15; // degrees
        
        const toggleTilt = () => {
            tiltEnabled = !tiltEnabled;
            console.log('Tilt controls:', tiltEnabled ? 'enabled' : 'disabled');
        };
        
        window.addEventListener('deviceorientation', (e) => {
            if (!tiltEnabled) return;
            
            const tilt = e.gamma; // Left-right tilt (-90 to 90)
            
            if (tilt > tiltSensitivity) {
                this.triggerGameAction(gameType, 'right');
            } else if (tilt < -tiltSensitivity) {
                this.triggerGameAction(gameType, 'left');
            }
        });
        
        // Add toggle button for tilt controls
        this.addTiltToggle(gameType, toggleTilt);
    }
    
    addTiltToggle(gameType, toggleCallback) {
        const controlsContainer = document.getElementById(`${gameType}-mobile-controls`);
        if (!controlsContainer) return;
        
        const tiltToggle = document.createElement('button');
        tiltToggle.className = 'touch-button tilt-toggle';
        tiltToggle.innerHTML = `
            <i class="fas fa-mobile-alt"></i>
            <span>Tilt Controls</span>
        `;
        
        this.addTouchEvent(tiltToggle, () => {
            toggleCallback();
            tiltToggle.classList.toggle('active');
            this.hapticFeedback('medium');
        });
        
        controlsContainer.appendChild(tiltToggle);
    }
    
    initUniversalGestures() {
        // Double tap to pause/resume games
        document.addEventListener('touchend', (e) => {
            const currentTime = Date.now();
            
            if (currentTime - this.lastTouchTime < this.doubleTapThreshold) {
                // Double tap detected
                this.handleDoubleTap(e);
            }
            
            this.lastTouchTime = currentTime;
        });
        
        // Long press for game menu
        this.addLongPressGesture();
        
        // Pinch gesture for zoom (if applicable)
        this.addPinchGesture();
    }
    
    handleDoubleTap(e) {
        // Find if we're in a game area
        const gameCanvas = e.target.closest('canvas');
        if (gameCanvas) {
            const gameType = this.getGameTypeFromCanvas(gameCanvas);
            if (gameType) {
                this.triggerGameAction(gameType, 'toggle-pause');
                this.hapticFeedback('heavy');
            }
        }
    }
    
    addLongPressGesture() {
        let longPressTimer;
        const longPressThreshold = 800; // ms
        
        document.addEventListener('touchstart', (e) => {
            longPressTimer = setTimeout(() => {
                this.handleLongPress(e);
            }, longPressThreshold);
        });
        
        document.addEventListener('touchend', () => {
            clearTimeout(longPressTimer);
        });
        
        document.addEventListener('touchmove', () => {
            clearTimeout(longPressTimer);
        });
    }
    
    handleLongPress(e) {
        const gameCanvas = e.target.closest('canvas');
        if (gameCanvas) {
            const gameType = this.getGameTypeFromCanvas(gameCanvas);
            if (gameType) {
                this.showGameMenu(gameType);
                this.hapticFeedback('heavy');
            }
        }
    }
    
    addPinchGesture() {
        let initialDistance = 0;
        
        document.addEventListener('touchstart', (e) => {
            if (e.touches.length === 2) {
                initialDistance = this.getDistance(e.touches[0], e.touches[1]);
            }
        });
        
        document.addEventListener('touchmove', (e) => {
            e.preventDefault();
            
            if (e.touches.length === 2) {
                const currentDistance = this.getDistance(e.touches[0], e.touches[1]);
                const scale = currentDistance / initialDistance;
                
                // Handle pinch zoom if needed
                this.handlePinch(scale);
            }
        }, { passive: false });
    }
    
    getDistance(touch1, touch2) {
        const dx = touch1.clientX - touch2.clientX;
        const dy = touch1.clientY - touch2.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    handlePinch(scale) {
        // Implement pinch zoom for games that support it
        console.log('Pinch scale:', scale);
    }
    
    triggerGameAction(gameType, action) {
        // Dispatch custom events for game actions
        const event = new CustomEvent('mobileGameAction', {
            detail: { gameType, action }
        });
        
        document.dispatchEvent(event);
        
        // Also trigger keyboard events for compatibility
        this.simulateKeyPress(gameType, action);
    }
    
    simulateKeyPress(gameType, action) {
        const keyMappings = {
            pong: {
                up: 'ArrowUp',
                down: 'ArrowDown'
            },
            snake: {
                up: 'ArrowUp',
                down: 'ArrowDown',
                left: 'ArrowLeft',
                right: 'ArrowRight'
            },
            shooter: {
                left: 'ArrowLeft',
                right: 'ArrowRight',
                fire: 'Space',
                boost: 'Shift'
            },
            catch: {
                left: 'ArrowLeft',
                right: 'ArrowRight'
            },
            flappy: {
                flap: 'Space'
            }
        };
        
        const key = keyMappings[gameType]?.[action];
        if (key) {
            const keyEvent = new KeyboardEvent('keydown', {
                key: key === 'Space' ? ' ' : key,
                code: key,
                bubbles: true
            });
            
            document.dispatchEvent(keyEvent);
        }
    }
    
    getGameTypeFromCanvas(canvas) {
        const id = canvas.id;
        if (id.includes('pong')) return 'pong';
        if (id.includes('snake')) return 'snake';
        if (id.includes('shooter')) return 'shooter';
        if (id.includes('catch')) return 'catch';
        if (id.includes('flappy')) return 'flappy';
        return null;
    }
    
    showGameMenu(gameType) {
        // Show contextual game menu
        const menu = document.createElement('div');
        menu.className = 'mobile-game-menu';
        menu.innerHTML = `
            <div class="menu-content">
                <h3>${gameType.charAt(0).toUpperCase() + gameType.slice(1)} Game</h3>
                <button class="menu-btn" data-action="pause">Pause/Resume</button>
                <button class="menu-btn" data-action="restart">Restart</button>
                <button class="menu-btn" data-action="settings">Settings</button>
                <button class="menu-btn menu-close">Close</button>
            </div>
        `;
        
        document.body.appendChild(menu);
        
        // Handle menu actions
        menu.addEventListener('click', (e) => {
            const action = e.target.dataset.action;
            if (action) {
                this.triggerGameAction(gameType, action);
            }
            
            if (e.target.classList.contains('menu-close') || action) {
                document.body.removeChild(menu);
            }
        });
        
        // Auto-close after 5 seconds
        setTimeout(() => {
            if (document.body.contains(menu)) {
                document.body.removeChild(menu);
            }
        }, 5000);
    }
    
    hapticFeedback(intensity = 'light') {
        if (!this.hapticSupported) return;
        
        const patterns = {
            light: 10,
            medium: [10, 10, 10],
            heavy: [20, 10, 20]
        };
        
        const pattern = patterns[intensity] || patterns.light;
        navigator.vibrate(pattern);
    }
    
    handleOrientationChanges() {
        window.addEventListener('orientationchange', () => {
            // Delay to account for orientation change completion
            setTimeout(() => {
                this.adjustLayoutForOrientation();
                this.recalculateCanvasSizes();
            }, 100);
        });
        
        // Also listen for resize events
        window.addEventListener('resize', () => {
            this.adjustLayoutForOrientation();
            this.recalculateCanvasSizes();
        });
    }
    
    adjustLayoutForOrientation() {
        const isLandscape = window.innerWidth > window.innerHeight;
        const body = document.body;
        
        if (isLandscape) {
            body.classList.add('landscape-mode');
            body.classList.remove('portrait-mode');
        } else {
            body.classList.add('portrait-mode');
            body.classList.remove('landscape-mode');
        }
        
        // Adjust mobile controls layout
        const mobileControls = document.querySelectorAll('.mobile-controls');
        mobileControls.forEach(control => {
            if (isLandscape) {
                control.classList.add('landscape-layout');
            } else {
                control.classList.remove('landscape-layout');
            }
        });
    }
    
    recalculateCanvasSizes() {
        const canvases = document.querySelectorAll('canvas');
        canvases.forEach(canvas => {
            // Trigger a resize event for each canvas
            const resizeEvent = new Event('resize');
            canvas.dispatchEvent(resizeEvent);
        });
    }
    
    addMobileSpecificStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Mobile-specific touch feedback */
            .touch-active {
                transform: scale(0.95) !important;
                opacity: 0.8 !important;
                background: linear-gradient(135deg, rgba(212, 175, 55, 0.6), rgba(255, 215, 0, 0.5)) !important;
                border-color: #ffd700 !important;
                box-shadow: 0 0 30px rgba(212, 175, 55, 0.8) !important;
            }
            
            /* Tilt toggle active state */
            .tilt-toggle.active {
                background: linear-gradient(135deg, rgba(46, 204, 113, 0.4), rgba(39, 174, 96, 0.3)) !important;
                border-color: #2ecc71 !important;
                color: #2ecc71 !important;
            }
            
            /* Mobile game menu */
            .mobile-game-menu {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                backdrop-filter: blur(10px);
            }
            
            .menu-content {
                background: linear-gradient(135deg, rgba(0, 0, 0, 0.9), rgba(20, 20, 20, 0.8));
                border: 2px solid rgba(212, 175, 55, 0.5);
                border-radius: 15px;
                padding: 30px;
                text-align: center;
                max-width: 300px;
                width: 90%;
            }
            
            .menu-content h3 {
                color: #d4af37;
                margin-bottom: 20px;
                font-size: 1.5em;
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            
            .menu-btn {
                display: block;
                width: 100%;
                padding: 12px 20px;
                margin: 10px 0;
                background: linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(255, 215, 0, 0.1));
                border: 2px solid rgba(212, 175, 55, 0.5);
                border-radius: 8px;
                color: #ffffff;
                font-weight: 600;
                font-size: 1em;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .menu-btn:hover,
            .menu-btn:active {
                background: linear-gradient(135deg, rgba(212, 175, 55, 0.4), rgba(255, 215, 0, 0.3));
                border-color: #d4af37;
                transform: translateY(-2px);
            }
            
            .menu-close {
                background: linear-gradient(135deg, rgba(231, 76, 60, 0.3), rgba(192, 57, 43, 0.2)) !important;
                border-color: rgba(231, 76, 60, 0.6) !important;
            }
            
            /* Landscape mode adjustments */
            .landscape-mode .mobile-controls {
                margin-top: 10px;
                padding: 15px;
            }
            
            .landscape-mode .touch-controls-grid {
                grid-template-columns: repeat(6, 1fr);
                gap: 8px;
            }
            
            .landscape-mode .touch-button {
                padding: 10px;
                min-height: 50px;
                font-size: 0.9em;
            }
            
            .landscape-mode .dpad-container {
                max-width: 150px;
            }
            
            .landscape-mode .dpad-button {
                min-height: 40px;
                font-size: 1.2em;
            }
            
            /* Portrait mode optimizations */
            .portrait-mode .game-container {
                margin: 20px 10px;
                padding: 20px 15px;
            }
            
            .portrait-mode .hero-header {
                padding: 80px 15px 50px;
            }
            
            /* High DPI touch targets */
            @media (-webkit-min-device-pixel-ratio: 2) {
                .touch-button,
                .dpad-button,
                .paddle-button,
                .action-button {
                    min-height: 48px;
                    min-width: 48px;
                }
            }
            
            /* Reduce motion for users who prefer it */
            @media (prefers-reduced-motion: reduce) {
                .touch-active {
                    transform: none !important;
                    transition: none !important;
                }
                
                .menu-btn:hover {
                    transform: none !important;
                }
            }
        `;
        
        document.head.appendChild(style);
    }
    
    optimizePerformance() {
        // Use passive event listeners where possible
        document.addEventListener('touchstart', () => {}, { passive: true });
        document.addEventListener('touchmove', () => {}, { passive: true });
        
        // Disable hover effects on touch devices
        if (this.touchSupported) {
            document.body.classList.add('touch-device');
            
            const hoverStyle = document.createElement('style');
            hoverStyle.textContent = `
                .touch-device *:hover {
                    /* Disable hover effects on touch devices */
                }
            `;
            document.head.appendChild(hoverStyle);
        }
        
        // Optimize canvas rendering for mobile
        this.optimizeCanvasRendering();
    }
    
    optimizeCanvasRendering() {
        const canvases = document.querySelectorAll('canvas');
        canvases.forEach(canvas => {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                // Optimize for mobile performance
                ctx.imageSmoothingEnabled = false;
                ctx.imageSmoothingQuality = 'low';
                
                // Use will-change for better performance
                canvas.style.willChange = 'transform';
            }
        });
    }
}

// Initialize mobile controls when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure all game elements are loaded
    setTimeout(() => {
        window.mobileControls = new MobileControlsManager();
    }, 500);
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MobileControlsManager;
}
