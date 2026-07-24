/**
 * Quantum Portal Styles
 * CSS styles for QuantumPortal window system
 * Part of LD Axyum quantum-portal.js refactoring
 */

export const QUANTUM_PORTAL_STYLES = `
.quantum-portal {
  position: fixed;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.3) 100%);
  border: 1px solid rgba(76, 175, 80, 0.3);
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.2s, border-color 0.2s;
  overflow: hidden;
}

.quantum-portal.focused {
  border-color: rgba(76, 175, 80, 0.6);
  box-shadow: 0 12px 48px rgba(76, 175, 80, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15);
}

.quantum-portal.dragging {
  opacity: 0.9;
  cursor: move;
}

.quantum-portal.resizing {
  opacity: 0.9;
}

.quantum-portal.closing {
  animation: portalClose 0.2s ease-out forwards;
}

.quantum-portal.minimized {
  overflow: hidden;
}

.quantum-portal.minimized .qp-content,
.quantum-portal.minimized .qp-footer {
  display: none;
}

.quantum-portal.maximized {
  border-radius: 0;
}

@keyframes portalClose {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.95);
  }
}

/* Frame */
.qp-frame {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: transparent;
}

/* Header */
.qp-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: linear-gradient(90deg, rgba(76, 175, 80, 0.2) 0%, rgba(76, 175, 80, 0.1) 100%);
  border-bottom: 1px solid rgba(76, 175, 80, 0.2);
  user-select: none;
  cursor: grab;
}

.quantum-portal.dragging .qp-header {
  cursor: grabbing;
}

.qp-title-bar {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.qp-title {
  color: #4CAF50;
  font-weight: 600;
  font-size: 0.95rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Controls */
.qp-controls {
  display: flex;
  gap: 0.5rem;
  margin-left: 1rem;
}

.qp-control-btn {
  width: 24px;
  height: 24px;
  padding: 0;
  background: rgba(76, 175, 80, 0.1);
  border: 1px solid rgba(76, 175, 80, 0.3);
  color: #999;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.qp-control-btn:hover {
  background: rgba(76, 175, 80, 0.25);
  color: #4CAF50;
  border-color: rgba(76, 175, 80, 0.5);
}

.qp-control-btn:active {
  transform: scale(0.95);
}

/* Content */
.qp-content {
  flex: 1;
  overflow: auto;
  padding: 1rem;
  color: #bbb;
  font-size: 0.9rem;
  line-height: 1.6;
  background: rgba(0, 0, 0, 0.2);
}

.qp-content::-webkit-scrollbar {
  width: 8px;
}

.qp-content::-webkit-scrollbar-track {
  background: rgba(76, 175, 80, 0.05);
  border-radius: 4px;
}

.qp-content::-webkit-scrollbar-thumb {
  background: rgba(76, 175, 80, 0.3);
  border-radius: 4px;
}

.qp-content::-webkit-scrollbar-thumb:hover {
  background: rgba(76, 175, 80, 0.5);
}

/* Footer */
.qp-footer {
  display: flex;
  justify-content: flex-end;
  padding: 4px;
  background: rgba(76, 175, 80, 0.05);
  border-top: 1px solid rgba(76, 175, 80, 0.1);
}

.qp-resize-handle {
  width: 16px;
  height: 16px;
  background: linear-gradient(135deg, transparent 0%, rgba(76, 175, 80, 0.4) 100%);
  cursor: nwse-resize;
  border-radius: 2px;
  transition: background 0.2s;
}

.qp-resize-handle:hover {
  background: linear-gradient(135deg, transparent 0%, rgba(76, 175, 80, 0.7) 100%);
}

.quantum-portal.resizing .qp-resize-handle {
  background: linear-gradient(135deg, transparent 0%, rgba(76, 175, 80, 0.9) 100%);
}

/* Responsive */
@media (max-width: 768px) {
  .quantum-portal {
    border-radius: 4px;
    min-width: 280px !important;
    min-height: 200px !important;
  }

  .qp-header {
    padding: 0.5rem 0.75rem;
  }

  .qp-title {
    font-size: 0.85rem;
  }

  .qp-content {
    padding: 0.75rem;
    font-size: 0.85rem;
  }

  .qp-control-btn {
    width: 20px;
    height: 20px;
    font-size: 0.75rem;
  }
}
`;
