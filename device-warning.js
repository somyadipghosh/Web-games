/**
 * Device Warning System
 * Detects mobile/tablet devices and shows optimization warning
 */

class DeviceWarningManager {
    constructor() {
        this.modal = null;
        this.overlay = null;
        this.continueBtn = null;
        this.understandBtn = null;
        this.dontShowCheckbox = null;
        this.storageKey = 'ai-games-hide-device-warning';
        
        this.init();
    }
    
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }
    
    setup() {
        this.getElements();
        this.bindEvents();
        
        // Set initial aria attributes
        if (this.modal) {
            this.modal.setAttribute('aria-hidden', 'true');
            this.modal.setAttribute('role', 'dialog');
            this.modal.setAttribute('aria-labelledby', 'warning-title');
            this.modal.setAttribute('aria-describedby', 'warning-description');
        }
        
        // Check if we should show the warning
        if (this.shouldShowWarning()) {
            // Small delay to ensure page is fully loaded
            setTimeout(() => this.showWarning(), 500);
        }
    }
    
    getElements() {
        this.modal = document.getElementById('device-warning-modal');
        this.overlay = this.modal?.querySelector('.warning-modal-overlay');
        this.continueBtn = document.getElementById('continue-mobile');
        this.understandBtn = document.getElementById('understand-warning');
        this.dontShowCheckbox = document.getElementById('dont-show-warning');
    }
    
    bindEvents() {
        if (!this.modal) return;
        
        // Continue button
        this.continueBtn?.addEventListener('click', () => {
            this.hideWarning();
            this.savePreference();
        });
        
        // Understand button
        this.understandBtn?.addEventListener('click', () => {
            this.hideWarning();
            this.savePreference();
        });
        
        // Overlay click to close
        this.overlay?.addEventListener('click', () => {
            this.hideWarning();
            this.savePreference();
        });
        
        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal?.classList.contains('show')) {
                this.hideWarning();
                this.savePreference();
            }
        });
    }
    
    shouldShowWarning() {
        // Check if user has chosen not to show warning again
        if (this.hasUserOptedOut()) {
            return false;
        }
        
        // Detect mobile and tablet devices
        return this.isMobileOrTablet();
    }
    
    isMobileOrTablet() {
        // Multiple detection methods for better accuracy
        
        // Method 1: User Agent detection
        const userAgent = navigator.userAgent.toLowerCase();
        const mobileKeywords = [
            'mobile', 'android', 'iphone', 'ipad', 'ipod', 
            'blackberry', 'windows phone', 'opera mini'
        ];
        
        const hasMobileUA = mobileKeywords.some(keyword => userAgent.includes(keyword));
        
        // Method 2: Screen size detection
        const screenWidth = window.screen.width;
        const screenHeight = window.screen.height;
        const isSmallScreen = screenWidth <= 1024 || screenHeight <= 768;
        
        // Method 3: Touch capability
        const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        // Method 4: CSS media queries
        const isNarrowViewport = window.matchMedia('(max-width: 1023px)').matches;
        
        // Method 5: Device pixel ratio (mobile devices often have higher DPR)
        const highDPR = window.devicePixelRatio > 1.5;
        
        // Method 6: Orientation API (mainly available on mobile)
        const hasOrientationAPI = 'orientation' in window;
        
        // Combine detection methods
        const mobileIndicators = [
            hasMobileUA,
            isSmallScreen && hasTouch,
            isNarrowViewport && hasTouch,
            hasTouch && highDPR && hasOrientationAPI
        ];
        
        // Consider it mobile/tablet if at least 2 indicators are true
        const indicatorCount = mobileIndicators.filter(Boolean).length;
        
        // Special case: iPad detection (newer iPads report as desktop in UA)
        const isIPad = /iPad/.test(userAgent) || 
                     (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
        
        return indicatorCount >= 2 || isIPad || hasMobileUA;
    }
    
    hasUserOptedOut() {
        try {
            return localStorage.getItem(this.storageKey) === 'true';
        } catch (e) {
            return false;
        }
    }
    
    savePreference() {
        if (this.dontShowCheckbox?.checked) {
            try {
                localStorage.setItem(this.storageKey, 'true');
            } catch (e) {
                console.warn('Could not save device warning preference');
            }
        }
    }
    
    showWarning() {
        if (!this.modal) return;
        
        // Set accessibility attributes
        this.modal.setAttribute('aria-hidden', 'false');
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Show modal with animation
        this.modal.style.display = 'flex';
        
        // Trigger animation
        requestAnimationFrame(() => {
            this.modal.classList.add('show');
            
            // Focus the first button for accessibility
            setTimeout(() => {
                this.continueBtn?.focus();
            }, 100);
        });
        
        // Add device-specific information
        this.addDeviceInfo();
        
        // Analytics (if needed)
        this.trackWarningShown();
    }
    
    hideWarning() {
        if (!this.modal) return;
        
        // Set accessibility attributes
        this.modal.setAttribute('aria-hidden', 'true');
        
        // Hide modal with animation
        this.modal.classList.remove('show');
        
        // Remove from DOM after animation
        setTimeout(() => {
            this.modal.style.display = 'none';
            document.body.style.overflow = '';
        }, 300);
    }
    
    addDeviceInfo() {
        const deviceInfo = this.getDeviceInfo();
        const messageDiv = this.modal?.querySelector('.warning-message');
        
        if (messageDiv && deviceInfo) {
            // Add device-specific recommendations
            const deviceTip = document.createElement('div');
            deviceTip.className = 'device-specific-tip';
            deviceTip.innerHTML = `
                <p><strong>Detected Device:</strong> ${deviceInfo.type} (${deviceInfo.screen})</p>
                <p><strong>Recommendation:</strong> ${deviceInfo.recommendation}</p>
            `;
            deviceTip.style.cssText = `
                background: rgba(52, 73, 94, 0.3);
                border: 1px solid #d4af37;
                border-radius: 8px;
                padding: 15px;
                margin: 15px 0;
                font-size: 0.9rem;
            `;
            
            messageDiv.appendChild(deviceTip);
        }
    }
    
    getDeviceInfo() {
        const width = window.screen.width;
        const height = window.screen.height;
        const userAgent = navigator.userAgent;
        
        let deviceType = 'Mobile Device';
        let recommendation = 'Switch to a desktop computer for the best experience.';
        
        // Determine device type
        if (/iPad/.test(userAgent) || (width >= 768 && width <= 1024)) {
            deviceType = 'Tablet';
            recommendation = 'Consider using a laptop or desktop for better controls and performance.';
        } else if (width <= 767) {
            deviceType = 'Mobile Phone';
            recommendation = 'Use a desktop or laptop for optimal gaming experience.';
        }
        
        return {
            type: deviceType,
            screen: `${width}×${height}`,
            recommendation: recommendation
        };
    }
    
    trackWarningShown() {
        // Analytics tracking (implement if needed)
        console.log('Device warning shown to user');
    }
    
    // Public method to manually show warning (for testing)
    forceShowWarning() {
        this.showWarning();
    }
    
    // Public method to reset user preference
    resetPreference() {
        try {
            localStorage.removeItem(this.storageKey);
            console.log('Device warning preference reset');
        } catch (e) {
            console.warn('Could not reset device warning preference');
        }
    }
}

// Initialize the device warning system
const deviceWarning = new DeviceWarningManager();

// Export for global access (optional)
window.DeviceWarning = deviceWarning;

// Debug helpers (remove in production)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.showDeviceWarning = () => deviceWarning.forceShowWarning();
    window.resetDeviceWarning = () => deviceWarning.resetPreference();
}
