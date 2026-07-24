/**
 * Quantum Portal Interaction Handlers
 * Handles drag and resize interactions
 * Part of LD Axyum quantum-portal.js refactoring
 */

export class QuantumPortalInteraction {
  /**
   * Start dragging window
   */
  static startDrag(portal, e) {
    if (portal.minimized) return;

    portal.isDragging = true;
    const rect = portal.windowElement.getBoundingClientRect();
    portal.dragOffset.x = e.clientX - rect.left;
    portal.dragOffset.y = e.clientY - rect.top;

    portal.windowElement.classList.add('dragging');
  }

  /**
   * Start resizing window
   */
  static startResize(portal, e) {
    if (portal.minimized || portal.maximized) return;

    portal.isResizing = true;
    portal.resizeStart.x = e.clientX;
    portal.resizeStart.y = e.clientY;
    portal.resizeStart.width = portal.windowElement.offsetWidth;
    portal.resizeStart.height = portal.windowElement.offsetHeight;

    portal.windowElement.classList.add('resizing');
  }

  /**
   * Handle drag and resize during mouse movement
   */
  static handleDragResize(portal, e) {
    if (portal.isDragging) {
      const x = e.clientX - portal.dragOffset.x;
      const y = e.clientY - portal.dragOffset.y;

      portal.options.x = Math.max(0, Math.min(x, window.innerWidth - portal.windowElement.offsetWidth));
      portal.options.y = Math.max(0, Math.min(y, window.innerHeight - portal.windowElement.offsetHeight));

      portal.windowElement.style.left = `${portal.options.x}px`;
      portal.windowElement.style.top = `${portal.options.y}px`;

      portal.dispatchEvent('drag', { x: portal.options.x, y: portal.options.y });
    }

    if (portal.isResizing) {
      const deltaX = e.clientX - portal.resizeStart.x;
      const deltaY = e.clientY - portal.resizeStart.y;

      const newWidth = Math.max(portal.options.minWidth, portal.resizeStart.width + deltaX);
      const newHeight = Math.max(portal.options.minHeight, portal.resizeStart.height + deltaY);

      portal.options.width = newWidth;
      portal.options.height = newHeight;

      portal.windowElement.style.width = `${newWidth}px`;
      portal.windowElement.style.height = `${newHeight}px`;

      portal.dispatchEvent('resize', { width: newWidth, height: newHeight });
    }
  }

  /**
   * End drag and resize
   */
  static endDragResize(portal) {
    if (portal.isDragging || portal.isResizing) {
      portal.isDragging = false;
      portal.isResizing = false;

      portal.windowElement?.classList.remove('dragging', 'resizing');
      portal.savePersistentState();
    }
  }
}
