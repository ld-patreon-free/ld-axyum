/**
 * Quantum Portal State Manager
 * Handles window state transitions (minimize, maximize, restore, close, focus)
 * Part of LD Axyum quantum-portal.js refactoring
 */

export class QuantumPortalState {
  /**
   * Minimize the window
   */
  static minimize(portal) {
    if (!portal.windowElement || portal.minimized) return;

    portal.minimized = true;
    portal.windowElement.classList.add('minimized');
    portal.savePersistentState();
    portal.dispatchEvent('minimize', { windowId: portal.windowId });
  }

  /**
   * Maximize the window
   */
  static maximize(portal) {
    if (!portal.windowElement || portal.maximized) return;

    // Save current state for restore
    portal.previousState = {
      x: portal.options.x,
      y: portal.options.y,
      width: portal.options.width,
      height: portal.options.height
    };

    portal.maximized = true;
    portal.windowElement.classList.add('maximized');

    // Maximize to full screen
    portal.options.x = 0;
    portal.options.y = 0;
    portal.options.width = window.innerWidth;
    portal.options.height = window.innerHeight;

    portal.windowElement.style.left = '0px';
    portal.windowElement.style.top = '0px';
    portal.windowElement.style.width = `${portal.options.width}px`;
    portal.windowElement.style.height = `${portal.options.height}px`;

    portal.savePersistentState();
    portal.dispatchEvent('maximize', { windowId: portal.windowId });
  }

  /**
   * Restore the window from minimized or maximized state
   */
  static restore(portal) {
    if (!portal.windowElement) return;

    if (portal.minimized) {
      portal.minimized = false;
      portal.windowElement.classList.remove('minimized');
    }

    if (portal.maximized) {
      portal.maximized = false;
      portal.windowElement.classList.remove('maximized');

      // Restore previous state
      if (portal.previousState) {
        portal.options.x = portal.previousState.x;
        portal.options.y = portal.previousState.y;
        portal.options.width = portal.previousState.width;
        portal.options.height = portal.previousState.height;

        portal.windowElement.style.left = `${portal.options.x}px`;
        portal.windowElement.style.top = `${portal.options.y}px`;
        portal.windowElement.style.width = `${portal.options.width}px`;
        portal.windowElement.style.height = `${portal.options.height}px`;
      }
    }

    portal.savePersistentState();
    portal.dispatchEvent('restore', { windowId: portal.windowId });
  }

  /**
   * Close (destroy) the window
   */
  static close(portal) {
    if (!portal.windowElement) return;

    const closingWindow = portal.windowElement;

    // Animate closing
    closingWindow.classList.add('closing');

    setTimeout(() => {
      closingWindow.remove();
      portal.windowElement = null;

      // Clear from localStorage
      if (portal.options.persistState) {
        localStorage.removeItem(`quantumPortal:${portal.windowId}`);
      }

      portal.dispatchEvent('close', { windowId: portal.windowId });
    }, 200);
  }

  /**
   * Focus the window (bring to front)
   */
  static focus(portal) {
    if (!portal.windowElement) return;

    // Get all open portals and find max z-index
    const portals = document.querySelectorAll('.quantum-portal');
    let maxZ = portal.options.zIndex;

    portals.forEach(p => {
      const z = parseInt(window.getComputedStyle(p).zIndex) || 0;
      if (z > maxZ) maxZ = z;
    });

    portal.options.zIndex = maxZ + 1;
    portal.windowElement.style.zIndex = portal.options.zIndex;
    portal.windowElement.classList.add('focused');

    portal.dispatchEvent('focus', { windowId: portal.windowId, zIndex: portal.options.zIndex });
  }

  /**
   * Blur the window (remove focus)
   */
  static blur(portal) {
    if (!portal.windowElement) return;

    portal.windowElement.classList.remove('focused');
    portal.dispatchEvent('blur', { windowId: portal.windowId });
  }
}
