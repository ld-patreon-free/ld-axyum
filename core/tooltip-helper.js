/**
 * TooltipHelper
 * 
 * Utility for integrating help tooltips into wizard templates
 * Provides reusable components and helper functions for displaying contextual help
 */

import { TOOLTIP_STYLES } from './tooltip-styles.js';

class TooltipHelper {
  constructor(newPlayerGuide) {
    this.guide = newPlayerGuide;
    this.tooltips = new Map();
  }

  /**
   * Create a help icon that triggers tooltip on hover
   * Usage in templates: {{{helpIcon "ability-scores" "What are ability scores?"}}}
   */
  createHelpIcon(topicKey, label = null, icon = '❓') {
    const topic = this.guide.getTopic(topicKey);
    if (!topic) return '';

    const displayLabel = label || topic.title;
    return `
      <span class="help-icon-wrapper" data-help-topic="${topicKey}" title="${displayLabel}">
        <span class="help-icon">${icon}</span>
        <span class="help-label">${displayLabel}</span>
      </span>
    `;
  }

  /**
   * Create an expandable help section for a page
   */
  createPageHelpSection(pageName, icon = '💡') {
    const pageGuide = this.guide.getPageGuide(pageName);
    if (!pageGuide) return '';

    return `
      <details class="page-help-section">
        <summary>${icon} ${pageGuide.title}</summary>
        <div class="help-section-content">
          <ul>
            ${pageGuide.tips.map(tip => `<li>${tip}</li>`).join('')}
          </ul>
          {{#if pageGuide.relatedTopics}}
            <div class="related-topics">
              <strong>Learn more:</strong>
              <div class="topic-links">
                ${pageGuide.relatedTopics.map(topicKey => {
                  const topic = this.guide.getTopic(topicKey);
                  return topic ? `<a href="#" data-topic="${topicKey}" class="topic-link">${topic.title}</a>` : '';
                }).join('')}
              </div>
            </div>
          {{/if}}
        </div>
      </details>
    `;
  }

  /**
   * Create inline help text with expandable details
   */
  createInlineHelp(topicKey, short = true) {
    const topic = this.guide.getTopic(topicKey);
    if (!topic) return '';

    const content = short ? topic.shortDescription : topic.fullDescription;
    const helpId = `help-${topicKey}-${Math.random().toString(36).substr(2, 9)}`;

    return `
      <div class="inline-help" data-topic="${topicKey}">
        <span class="help-trigger" id="${helpId}-trigger">${content}</span>
        <details class="help-details" id="${helpId}-details">
          <summary>Learn more</summary>
          <div class="help-details-content">
            <p>${topic.fullDescription}</p>
            ${topic.examples.length > 0 ? `
              <div class="examples">
                <strong>Examples:</strong>
                <ul>
                  ${topic.examples.map(ex => `<li>${ex}</li>`).join('')}
                </ul>
              </div>
            ` : ''}
          </div>
        </details>
      </div>
    `;
  }

  /**
   * Create a definition link for terminology
   */
  createTermLink(abbreviation) {
    const term = this.guide.getTerminology(abbreviation);
    if (!term) return abbreviation;

    return `
      <span class="term-link" data-term="${abbreviation}" title="${term.definition}">
        ${abbreviation}
      </span>
    `;
  }

  /**
   * Create a full terminology reference section
   */
  createTerminologySection() {
    const allTerms = this.guide.getAllTerminology();

    return `
      <div class="terminology-section">
        <h3>D&D Terminology Reference</h3>
        <div class="terminology-grid">
          ${allTerms.map(term => `
            <div class="terminology-item">
              <dt><strong>${term.abbreviation}</strong></dt>
              <dd>${term.term}</dd>
              <dd class="definition">${term.definition}</dd>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  /**
   * Create a "tip" callout box
   */
  createTipBox(text, type = 'info') {
    const icons = {
      'info': 'ℹ️',
      'warning': '⚠️',
      'success': '✓',
      'tip': '💡'
    };

    return `
      <div class="tip-box tip-${type}">
        <span class="tip-icon">${icons[type] || '💡'}</span>
        <span class="tip-text">${text}</span>
      </div>
    `;
  }

  /**
   * Create related topics section
   */
  createRelatedTopics(topicKey) {
    const related = this.guide.getRelatedTopics(topicKey);
    if (related.length === 0) return '';

    return `
      <div class="related-topics-section">
        <h4>Related Topics</h4>
        <ul class="related-topics-list">
          ${related.map(topic => `
            <li>
              <a href="#" data-topic="${topic.key}" class="related-topic-link">
                ${topic.title}
              </a>
            </li>
          `).join('')}
        </ul>
      </div>
    `;
  }

  /**
   * Create a learning path for a specific topic
   */
  createLearningPath(topicKey, depth = 3) {
    const visited = new Set();
    const path = [];

    const traverse = (key, level = 0) => {
      if (level >= depth || visited.has(key)) return;
      visited.add(key);

      const topic = this.guide.getTopic(key);
      if (!topic) return;

      path.push({
        key: key,
        title: topic.title,
        level: level
      });

      if (topic.relatedTopics) {
        topic.relatedTopics.forEach(relKey => traverse(relKey, level + 1));
      }
    };

    traverse(topicKey);

    return `
      <div class="learning-path">
        <h4>Learning Path</h4>
        <ol class="path-list">
          ${path.map(item => `
            <li class="path-level-${item.level}">
              <a href="#" data-topic="${item.key}" class="path-link">
                ${item.title}
              </a>
            </li>
          `).join('')}
        </ol>
      </div>
    `;
  }

  /**
   * Initialize event handlers for help elements
   */
  initializeHandlers() {
    // Help icon hovers
    document.addEventListener('mouseenter', (e) => {
      if (e.target.closest('[data-help-topic]')) {
        const wrapper = e.target.closest('[data-help-topic]');
        const topicKey = wrapper.dataset.helpTopic;
        this.guide.showTooltip(topicKey, wrapper);
      }
    }, true);

    document.addEventListener('mouseleave', (e) => {
      if (e.target.closest('[data-help-topic]')) {
        setTimeout(() => {
          if (!document.querySelector('.newplayer-tooltip:hover')) {
            this.guide.hideTooltip();
          }
        }, 100);
      }
    }, true);

    // Term links
    document.addEventListener('click', (e) => {
      if (e.target.closest('.term-link')) {
        e.preventDefault();
        const term = e.target.closest('.term-link').dataset.term;
        const definition = this.guide.getTerminology(term);
        if (definition) {
          alert(`${definition.term}\n\n${definition.definition}`);
        }
      }
    });

    // Related topic links
    document.addEventListener('click', (e) => {
      if (e.target.closest('.related-topic-link, .topic-link, .path-link')) {
        e.preventDefault();
        const topicKey = e.target.closest('[data-topic]')?.dataset.topic;
        if (topicKey) {
          const topic = this.guide.getTopic(topicKey);
          if (topic) {
            // You could dispatch a custom event or update a modal here
            window.dispatchEvent(new CustomEvent('showTopic', {
              detail: { topicKey, topic }
            }));
          }
        }
      }
    });
  }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TooltipHelper, TOOLTIP_STYLES };
}
