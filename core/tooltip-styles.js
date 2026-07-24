/**
 * LD Axyum - Tooltip Helper Styles
 * 
 * CSS styles for tooltip help system and components.
 * Extracted from tooltip-helper.js for LD protocol compliance.
 * 
 * Includes styles for:
 * - Tooltips and popups
 * - Help icons and labels
 * - Inline help and expandable details
 * - Term links and terminology sections
 * - Tip boxes (info, warning, success, tip)
 * - Page help sections
 * - Related topics and learning paths
 * - Responsive design and animations
 */

export const TOOLTIP_STYLES = `
/* Tooltip styles */
.newplayer-tooltip {
  position: fixed;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(30, 30, 30, 0.95) 100%);
  border: 1px solid rgba(76, 175, 80, 0.4);
  border-radius: 6px;
  padding: 1rem;
  max-width: 300px;
  z-index: 10000;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
  animation: tooltipSlideIn 0.2s ease-out;
}

.newplayer-tooltip::before {
  content: '';
  position: absolute;
  width: 10px;
  height: 10px;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(30, 30, 30, 0.95) 100%);
  border: 1px solid rgba(76, 175, 80, 0.4);
  border-top: none;
  border-left: none;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%) rotate(45deg);
}

.tooltip-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  border-bottom: 1px solid rgba(76, 175, 80, 0.2);
  padding-bottom: 0.5rem;
}

.tooltip-header h4 {
  margin: 0;
  color: #4CAF50;
  font-size: 0.95rem;
}

.tooltip-close {
  background: none;
  border: none;
  color: #aaa;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0;
  transition: color 0.2s;
}

.tooltip-close:hover {
  color: #fff;
}

.tooltip-content {
  color: #ddd;
  font-size: 0.9rem;
  line-height: 1.5;
}

.tooltip-content p {
  margin: 0 0 0.75rem 0;
}

.tooltip-content .examples {
  background: rgba(76, 175, 80, 0.1);
  padding: 0.75rem;
  border-radius: 4px;
  margin-top: 0.5rem;
}

.tooltip-content strong {
  color: #4CAF50;
}

.tooltip-content ul {
  margin: 0.5rem 0;
  padding-left: 1.5rem;
}

.tooltip-content li {
  margin: 0.25rem 0;
  color: #bbb;
}

@keyframes tooltipSlideIn {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(-100%);
  }
}

/* Help icon styles */
.help-icon-wrapper {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  cursor: help;
  color: rgba(76, 175, 80, 0.7);
  transition: color 0.2s;
}

.help-icon-wrapper:hover {
  color: #4CAF50;
}

.help-icon {
  font-size: 0.9rem;
  font-weight: bold;
}

.help-label {
  font-size: 0.9rem;
  text-decoration: underline dotted;
}

/* Inline help styles */
.inline-help {
  background: rgba(76, 175, 80, 0.05);
  border-left: 3px solid rgba(76, 175, 80, 0.3);
  padding: 0.75rem;
  border-radius: 4px;
  margin: 0.75rem 0;
}

.help-trigger {
  color: #bbb;
  font-size: 0.95rem;
  line-height: 1.5;
}

.help-details {
  cursor: pointer;
  margin-top: 0.5rem;
}

.help-details summary {
  color: #4CAF50;
  font-size: 0.85rem;
  font-weight: 600;
  transition: color 0.2s;
  user-select: none;
}

.help-details summary:hover {
  color: #6adb5e;
}

.help-details-content {
  margin-top: 0.75rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 4px;
  color: #aaa;
  font-size: 0.9rem;
  line-height: 1.5;
}

.help-details-content .examples {
  margin-top: 0.75rem;
  padding: 0.75rem;
  background: rgba(76, 175, 80, 0.1);
  border-radius: 4px;
}

/* Term link styles */
.term-link {
  border-bottom: 1px dotted rgba(76, 175, 80, 0.4);
  color: inherit;
  cursor: help;
  transition: border-color 0.2s, color 0.2s;
}

.term-link:hover {
  border-bottom-color: rgba(76, 175, 80, 0.8);
  color: #4CAF50;
}

/* Tip box styles */
.tip-box {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 6px;
  margin: 1rem 0;
  border-left: 4px solid;
}

.tip-info {
  background: rgba(33, 150, 243, 0.1);
  border-left-color: #2196f3;
}

.tip-warning {
  background: rgba(255, 152, 0, 0.1);
  border-left-color: #ff9800;
}

.tip-success {
  background: rgba(76, 175, 80, 0.1);
  border-left-color: #4CAF50;
}

.tip-tip {
  background: rgba(76, 175, 80, 0.1);
  border-left-color: #4CAF50;
}

.tip-icon {
  font-size: 1.2rem;
  margin-top: 0.1rem;
  flex-shrink: 0;
}

.tip-text {
  color: #bbb;
  font-size: 0.95rem;
  line-height: 1.5;
}

/* Page help section */
.page-help-section {
  background: rgba(76, 175, 80, 0.05);
  border: 1px solid rgba(76, 175, 80, 0.2);
  border-radius: 6px;
  padding: 1rem;
  margin: 1.5rem 0;
}

.page-help-section summary {
  cursor: pointer;
  color: #4CAF50;
  font-weight: 600;
  user-select: none;
  transition: color 0.2s;
}

.page-help-section summary:hover {
  color: #6adb5e;
}

.help-section-content {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(76, 175, 80, 0.2);
  color: #bbb;
  font-size: 0.95rem;
}

.help-section-content ul {
  margin: 0;
  padding-left: 1.5rem;
}

.help-section-content li {
  margin: 0.5rem 0;
}

.related-topics {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(76, 175, 80, 0.2);
}

.related-topics strong {
  color: #4CAF50;
  display: block;
  margin-bottom: 0.5rem;
}

.topic-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.topic-link {
  background: rgba(76, 175, 80, 0.15);
  color: #4CAF50;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  text-decoration: none;
  font-size: 0.85rem;
  transition: all 0.2s;
}

.topic-link:hover {
  background: rgba(76, 175, 80, 0.3);
  color: #fff;
}

/* Related topics section */
.related-topics-section {
  margin-top: 1.5rem;
  padding: 1rem;
  background: rgba(76, 175, 80, 0.05);
  border: 1px solid rgba(76, 175, 80, 0.2);
  border-radius: 6px;
}

.related-topics-section h4 {
  margin-top: 0;
  color: #4CAF50;
}

.related-topics-list {
  margin: 0;
  padding-left: 1.5rem;
  list-style: none;
}

.related-topics-list li {
  margin: 0.5rem 0;
}

.related-topic-link {
  color: #4CAF50;
  text-decoration: none;
  transition: color 0.2s;
}

.related-topic-link:hover {
  color: #6adb5e;
  text-decoration: underline;
}

/* Learning path styles */
.learning-path {
  margin-top: 1.5rem;
  padding: 1rem;
  background: rgba(76, 175, 80, 0.05);
  border: 1px solid rgba(76, 175, 80, 0.2);
  border-radius: 6px;
}

.learning-path h4 {
  margin-top: 0;
  color: #4CAF50;
}

.path-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.path-list li {
  margin: 0.75rem 0;
  padding-left: 2rem;
  position: relative;
  color: #bbb;
}

.path-list li::before {
  content: '→';
  position: absolute;
  left: 0;
  color: rgba(76, 175, 80, 0.5);
}

.path-level-1 { margin-left: 1rem; }
.path-level-2 { margin-left: 2rem; }
.path-level-3 { margin-left: 3rem; }

.path-link {
  color: #4CAF50;
  text-decoration: none;
  transition: color 0.2s;
}

.path-link:hover {
  color: #6adb5e;
  text-decoration: underline;
}

/* Terminology section */
.terminology-section {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 2rem;
  margin: 2rem 0;
}

.terminology-section h3 {
  color: #fff;
  margin-top: 0;
}

.terminology-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.terminology-item {
  background: rgba(76, 175, 80, 0.05);
  border: 1px solid rgba(76, 175, 80, 0.2);
  padding: 1rem;
  border-radius: 6px;
}

.terminology-item dt {
  color: #4CAF50;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.terminology-item dd {
  margin: 0 0 0.5rem 0;
  color: #bbb;
  font-size: 0.95rem;
}

.terminology-item dd.definition {
  font-size: 0.9rem;
  color: #999;
}
`;
