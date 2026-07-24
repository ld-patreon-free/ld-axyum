import { QUANTUM_PORTAL_STYLES } from "./quantum-portal-styles.js";

import { QuantumPortalDOM } from "./quantum-portal-dom.js";

import { QuantumPortalState } from "./quantum-portal-state.js";

import { QuantumPortalInteraction } from "./quantum-portal-interaction.js";

import { QuantumPortalUtils } from "./quantum-portal-utils.js";

class QuantumPortal {
    constructor(windowId, options = {}) {
        this.windowId = windowId;
        this.options = {
            width: options.width || 800,
            height: options.height || 600,
            x: options.x || window.innerWidth / 2 - (options.width || 800) / 2,
            y: options.y || window.innerHeight / 2 - (options.height || 600) / 2,
            minWidth: options.minWidth || 400,
            minHeight: options.minHeight || 300,
            title: options.title || "LD Axyum",
            content: options.content || "",
            resizable: options.resizable !== false,
            draggable: options.draggable !== false,
            collapsible: options.collapsible !== false,
            persistState: options.persistState !== false,
            zIndex: options.zIndex || 1e3,
            className: options.className || ""
        };
        this.windowElement = null;
        this.isDragging = false;
        this.isResizing = false;
        this.dragOffset = {
            x: 0,
            y: 0
        };
        this.resizeStart = {
            x: 0,
            y: 0,
            width: 0,
            height: 0
        };
        this.eventListeners = new Map;
        this.minimized = false;
        this.maximized = false;
        this.previousState = null;
        this.loadPersistentState();
        this.setupEventSystem();
    }
    loadPersistentState() {
        if (!this.options.persistState) return;
        const key = `quantumPortal:${this.windowId}`;
        const saved = localStorage.getItem(key);
        if (saved) {
            try {
                const state = JSON.parse(saved);
                this.options.x = state.x;
                this.options.y = state.y;
                this.options.width = state.width;
                this.options.height = state.height;
                this.minimized = state.minimized || false;
                this.maximized = state.maximized || false;
            } catch (e) {
                console.warn("Failed to load persistent portal state:", e);
            }
        }
    }
    savePersistentState() {
        if (!this.options.persistState) return;
        const key = `quantumPortal:${this.windowId}`;
        const state = {
            x: this.options.x,
            y: this.options.y,
            width: this.options.width,
            height: this.options.height,
            minimized: this.minimized,
            maximized: this.maximized,
            timestamp: Date.now()
        };
        localStorage.setItem(key, JSON.stringify(state));
    }
    setupEventSystem() {
        this.eventSystem = {
            spawn: [],
            close: [],
            minimize: [],
            restore: [],
            maximize: [],
            drag: [],
            resize: [],
            focus: [],
            blur: []
        };
    }
    addEventListener(eventName, callback) {
        if (this.eventSystem[eventName]) {
            this.eventSystem[eventName].push(callback);
        }
        return this;
    }
    removeEventListener(eventName, callback) {
        if (this.eventSystem[eventName]) {
            this.eventSystem[eventName] = this.eventSystem[eventName].filter((cb => cb !== callback));
        }
        return this;
    }
    dispatchEvent(eventName, detail = {}) {
        const eventData = {
            type: eventName,
            windowId: this.windowId,
            ...detail
        };
        if (this.eventSystem[eventName]) {
            this.eventSystem[eventName].forEach((callback => {
                try {
                    callback(eventData);
                } catch (e) {
                    console.error(`Error in event listener for ${eventName}:`, e);
                }
            }));
        }
        if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent(`quantumPortal:${eventName}`, {
                detail: eventData
            }));
        }
    }
    createWindowElement() {
        return QuantumPortalDOM.createWindowElement(this.windowId, this.options);
    }
    createWindowHeader() {
        return QuantumPortalDOM.createWindowHeader(this.options);
    }
    createControlButton(action, symbol) {
        return QuantumPortalDOM.createControlButton(action, symbol);
    }
    spawn() {
        if (this.windowElement && document.body.contains(this.windowElement)) {
            this.focus();
            return this;
        }
        const existing = document.getElementById(`qp-${this.windowId}`);
        if (existing) existing.remove();
        this.windowElement = this.createWindowElement();
        document.body.appendChild(this.windowElement);
        this.attachEventHandlers();
        this.dispatchEvent("spawn", {
            window: this.windowElement
        });
        return this;
    }
    attachEventHandlers() {
        const header = this.windowElement.querySelector(".qp-header");
        const resizeHandle = this.windowElement.querySelector(".qp-resize-handle");
        const controlButtons = this.windowElement.querySelectorAll(".qp-control-btn");
        this.dragStartHandler = e => this.startDrag(e);
        this.resizeStartHandler = e => this.startResize(e);
        this.dragResizeHandler = e => this.handleDragResize(e);
        this.dragEndHandler = () => this.endDragResize();
        this.focusHandler = () => this.focus();
        this.controlButtonHandler = e => this.handleControlButton(e);
        if (this.options.draggable && header) {
            header.addEventListener("mousedown", this.dragStartHandler);
        }
        if (resizeHandle) {
            resizeHandle.addEventListener("mousedown", this.resizeStartHandler);
        }
        controlButtons.forEach((btn => {
            btn.addEventListener("click", this.controlButtonHandler);
        }));
        this.windowElement.addEventListener("mousedown", this.focusHandler);
        document.addEventListener("mouseup", this.dragEndHandler);
        document.addEventListener("mousemove", this.dragResizeHandler);
    }
    startDrag(e) {
        QuantumPortalInteraction.startDrag(this, e);
    }
    startResize(e) {
        QuantumPortalInteraction.startResize(this, e);
    }
    handleDragResize(e) {
        QuantumPortalInteraction.handleDragResize(this, e);
    }
    endDragResize() {
        QuantumPortalInteraction.endDragResize(this);
    }
    handleControlButton(e) {
        const action = e.target.closest(".qp-control-btn").dataset.action;
        switch (action) {
          case "minimize":
            this.minimize();
            break;

          case "maximize":
            this.maximized ? this.restore() : this.maximize();
            break;

          case "close":
            this.close();
            break;
        }
    }
    minimize() {
        if (!this.windowElement) return this;
        this.minimized = true;
        this.windowElement.classList.add("minimized");
        const content = this.windowElement.querySelector(".qp-content");
        const originalHeight = this.windowElement.offsetHeight;
        const headerHeight = this.windowElement.querySelector(".qp-header").offsetHeight;
        this.windowElement.style.height = `${headerHeight}px`;
        content.style.display = "none";
        this.savePersistentState();
        this.dispatchEvent("minimize", {
            windowId: this.windowId
        });
        return this;
    }
    maximize() {
        if (!this.windowElement) return this;
        this.previousState = {
            x: this.options.x,
            y: this.options.y,
            width: this.options.width,
            height: this.options.height
        };
        this.maximized = true;
        this.windowElement.classList.add("maximized");
        const padding = 10;
        this.options.x = padding;
        this.options.y = padding;
        this.options.width = window.innerWidth - padding * 2;
        this.options.height = window.innerHeight - padding * 2;
        this.windowElement.style.left = `${this.options.x}px`;
        this.windowElement.style.top = `${this.options.y}px`;
        this.windowElement.style.width = `${this.options.width}px`;
        this.windowElement.style.height = `${this.options.height}px`;
        this.savePersistentState();
        this.dispatchEvent("maximize", {
            windowId: this.windowId
        });
        return this;
    }
    restore() {
        if (!this.windowElement) return this;
        if (this.minimized) {
            this.minimized = false;
            this.windowElement.classList.remove("minimized");
            const content = this.windowElement.querySelector(".qp-content");
            content.style.display = "";
            this.windowElement.style.height = `${this.previousState?.height || this.options.height}px`;
        }
        if (this.maximized && this.previousState) {
            this.maximized = false;
            this.windowElement.classList.remove("maximized");
            this.options.x = this.previousState.x;
            this.options.y = this.previousState.y;
            this.options.width = this.previousState.width;
            this.options.height = this.previousState.height;
            this.windowElement.style.left = `${this.options.x}px`;
            this.windowElement.style.top = `${this.options.y}px`;
            this.windowElement.style.width = `${this.options.width}px`;
            this.windowElement.style.height = `${this.options.height}px`;
        }
        this.savePersistentState();
        this.dispatchEvent("restore", {
            windowId: this.windowId
        });
        return this;
    }
    close() {
        if (!this.windowElement) return this;
        const closingWindow = this.windowElement;
        closingWindow.classList.add("closing");
        setTimeout((() => {
            closingWindow.remove();
            this.windowElement = null;
            if (this.options.persistState) {
                localStorage.removeItem(`quantumPortal:${this.windowId}`);
            }
            this.dispatchEvent("close", {
                windowId: this.windowId
            });
        }), 200);
        return this;
    }
    focus() {
        return QuantumPortalUtils.focus(this);
    }
    blur() {
        return QuantumPortalUtils.blur(this);
    }
    getState() {
        return QuantumPortalUtils.getState(this);
    }
    setContent(content) {
        return QuantumPortalUtils.setContent(this, content);
    }
    getContent() {
        return QuantumPortalUtils.getContent(this);
    }
    setTitle(title) {
        return QuantumPortalUtils.setTitle(this, title);
    }
    isOpen() {
        return QuantumPortalUtils.isOpen(this);
    }
    destroy() {
        if (this.windowElement) {
            const header = this.windowElement.querySelector(".qp-header");
            const resizeHandle = this.windowElement.querySelector(".qp-resize-handle");
            const controlButtons = this.windowElement.querySelectorAll(".qp-control-btn");
            if (header && this.dragStartHandler) {
                header.removeEventListener("mousedown", this.dragStartHandler);
            }
            if (resizeHandle && this.resizeStartHandler) {
                resizeHandle.removeEventListener("mousedown", this.resizeStartHandler);
            }
            if (this.focusHandler) {
                this.windowElement.removeEventListener("mousedown", this.focusHandler);
            }
            if (controlButtons && this.controlButtonHandler) {
                controlButtons.forEach((btn => {
                    btn.removeEventListener("click", this.controlButtonHandler);
                }));
            }
        }
        if (this.dragEndHandler) {
            document.removeEventListener("mouseup", this.dragEndHandler);
        }
        if (this.dragResizeHandler) {
            document.removeEventListener("mousemove", this.dragResizeHandler);
        }
        if (this.eventSystem) {
            for (const key in this.eventSystem) {
                this.eventSystem[key] = [];
            }
        }
        this.dragStartHandler = null;
        this.resizeStartHandler = null;
        this.dragResizeHandler = null;
        this.dragEndHandler = null;
        this.focusHandler = null;
        this.controlButtonHandler = null;
        return QuantumPortalUtils.destroy(this);
    }
}

if (typeof module !== "undefined" && module.exports) {
    module.exports = {
        QuantumPortal: QuantumPortal,
        QUANTUM_PORTAL_STYLES: QUANTUM_PORTAL_STYLES
    };
}
