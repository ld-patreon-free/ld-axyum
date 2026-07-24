/**
 * Quantum Portal DOM Builder
 * Handles creation of window DOM elements
 * Part of LD Axyum quantum-portal.js refactoring
 */

export class QuantumPortalDOM {
  /**
   * Create window element
   */
  static createWindowElement(windowId, options) {
    const container = document.createElement('div');
    container.className = `quantum-portal ${options.className}`;
    container.id = `qp-${windowId}`;
    container.setAttribute('data-window-id', windowId);

    const style = `
      position: fixed;
      left: ${options.x}px;
      top: ${options.y}px;
      width: ${options.width}px;
      height: ${options.height}px;
      z-index: ${options.zIndex};
    `;
    container.setAttribute('style', style);

    // Window frame
    const frame = document.createElement('div');
    frame.className = 'qp-frame';

    // Header with title bar
    const header = this.createWindowHeader(options);

    // Content area
    const content = document.createElement('div');
    content.className = 'qp-content';
    if (options.content) {
      content.innerHTML = options.content;
    }

    // Footer with resize handle
    const footer = document.createElement('div');
    footer.className = 'qp-footer';
    const resizeHandle = document.createElement('div');
    resizeHandle.className = 'qp-resize-handle';
    resizeHandle.title = 'Drag to resize';
    footer.appendChild(resizeHandle);

    frame.appendChild(header);
    frame.appendChild(content);
    if (options.resizable) {
      frame.appendChild(footer);
    }

    container.appendChild(frame);
    return container;
  }

  /**
   * Create the window header with title and controls
   */
  static createWindowHeader(options) {
    const header = document.createElement('div');
    header.className = 'qp-header';

    const titleBar = document.createElement('div');
    titleBar.className = 'qp-title-bar';

    const title = document.createElement('span');
    title.className = 'qp-title';
    title.textContent = options.title;

    titleBar.appendChild(title);

    // Control buttons
    const controls = document.createElement('div');
    controls.className = 'qp-controls';

    // Minimize button
    if (options.collapsible) {
      const minimizeBtn = this.createControlButton('minimize', '−');
      controls.appendChild(minimizeBtn);
    }

    // Maximize button
    if (options.resizable) {
      const maximizeBtn = this.createControlButton('maximize', '□');
      controls.appendChild(maximizeBtn);
    }

    // Close button
    const closeBtn = this.createControlButton('close', '✕');
    controls.appendChild(closeBtn);

    header.appendChild(titleBar);
    header.appendChild(controls);
    return header;
  }

  /**
   * Create a control button
   */
  static createControlButton(action, symbol) {
    const btn = document.createElement('button');
    btn.className = `qp-control-btn qp-${action}`;
    btn.textContent = symbol;
    btn.title = action.charAt(0).toUpperCase() + action.slice(1);
    btn.setAttribute('data-action', action);
    return btn;
  }
}
