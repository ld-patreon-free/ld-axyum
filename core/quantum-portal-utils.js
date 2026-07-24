/**
 * LD Axyum - QuantumPortal Utilities
 * 
 * Utility methods for window management:
 * - Focus and z-index management
 * - Content manipulation
 * - State queries
 * - Window lifecycle
 * 
 * Extracted from quantum-portal.js for LD protocol compliance.
 */

export class QuantumPortalUtils {
  /**
   * Focus the window (bring to front)
   */
  static focus(portal) {
    if (!portal.windowElement) return portal;

    // Get all open portals and find max z-index
    const portals = document.querySelectorAll('.quantum-portal');
    let maxZ = portal.options.zIndex;

    portals.forEach(portalEl => {
      const z = parseInt(window.getComputedStyle(portalEl).zIndex) || 0;
      if (z > maxZ) maxZ = z;
    });

    portal.options.zIndex = maxZ + 1;
    portal.windowElement.style.zIndex = portal.options.zIndex;
    portal.windowElement.classList.add('focused');

    portal.dispatchEvent('focus', { windowId: portal.windowId, zIndex: portal.options.zIndex });

    return portal;
  }

  /**
   * Blur the window (remove focus)
   */
  static blur(portal) {
    if (!portal.windowElement) return portal;

    portal.windowElement.classList.remove('focused');
    portal.dispatchEvent('blur', { windowId: portal.windowId });

    return portal;
  }

  /**
   * Get current window state
   */
  static getState(portal) {
    return {
      windowId: portal.windowId,
      x: portal.options.x,
      y: portal.options.y,
      width: portal.options.width,
      height: portal.options.height,
      minimized: portal.minimized,
      maximized: portal.maximized,
      zIndex: portal.options.zIndex
    };
  }

  /**
   * Set window content
   */
  static setContent(portal, content) {
    if (!portal.windowElement) return portal;

    const contentArea = portal.windowElement.querySelector('.qp-content');
    if (contentArea) {
      if (typeof content === 'string') {
        contentArea.innerHTML = content;
      } else if (content instanceof Element) {
        contentArea.innerHTML = '';
        contentArea.appendChild(content);
      }
    }

    return portal;
  }

  /**
   * Get window content element
   */
  static getContent(portal) {
    return portal.windowElement?.querySelector('.qp-content') || null;
  }

  /**
   * Update window title
   */
  static setTitle(portal, title) {
    if (!portal.windowElement) return portal;

    const titleEl = portal.windowElement.querySelector('.qp-title');
    if (titleEl) {
      titleEl.textContent = title;
      portal.options.title = title;
    }

    return portal;
  }

  /**
   * Check if window is open
   */
  static isOpen(portal) {
    return portal.windowElement && document.body.contains(portal.windowElement);
  }

  /**
   * Destroy the portal
   */
  static destroy(portal) {
    portal.close();
    portal.eventSystem = null;
    return null;
  }
}
