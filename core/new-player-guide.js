/**
 * NewPlayerGuide
 * 
 * Comprehensive learning system for new D&D 5e players
 * Provides inline tooltips, expandable sections, and terminology definitions
 * Organized by wizard page and D&D concepts
 * 
 * Features:
 * - 100+ learning topics across all D&D concepts
 * - Inline tooltips with hover-based display
 * - Expandable "Learn More" sections per topic
 * - Terminology dictionary with examples
 * - Page-specific learning paths
 * - Integration with RecommendationEngine for contextual help
 */
import { GUIDE_TOPICS, GUIDE_TERMINOLOGY, GUIDE_PAGE_GUIDES } from './guide-content-data.js';

class NewPlayerGuide {
  constructor() {
    this.topics = GUIDE_TOPICS;
    this.terminology = GUIDE_TERMINOLOGY;
    this.pageGuides = GUIDE_PAGE_GUIDES;
    this.tooltipElement = null;
    this.isVisible = false;
  }

  /**
   * Get a specific topic with all details
   */
  getTopic(topicKey) {
    return this.topics[topicKey] || null;
  }

  /**
   * Get all topics for a page
   */
  getPageTopics(pageName) {
    const guide = this.pageGuides[pageName];
    if (!guide) return [];

    return guide.relatedTopics.map(key => ({
      key: key,
      ...this.topics[key]
    })).filter(t => t.title);
  }

  /**
   * Get related topics
   */
  getRelatedTopics(topicKey) {
    const topic = this.topics[topicKey];
    if (!topic || !topic.relatedTopics) return [];

    return topic.relatedTopics.map(key => ({
      key: key,
      ...this.topics[key]
    })).filter(t => t.title);
  }

  /**
   * Search topics by keyword
   */
  searchTopics(keyword) {
    const lower = keyword.toLowerCase();
    const results = [];

    for (const [key, topic] of Object.entries(this.topics)) {
      if (topic.title.toLowerCase().includes(lower) ||
          topic.shortDescription.toLowerCase().includes(lower)) {
        results.push({ key, ...topic });
      }
    }

    return results;
  }

  /**
   * Get terminology by term or abbreviation
   */
  getTerminology(term) {
    return this.terminology[term] || null;
  }

  /**
   * Get all terminology
   */
  getAllTerminology() {
    return Object.entries(this.terminology).map(([abbr, data]) => ({
      abbreviation: abbr,
      ...data
    }));
  }

  /**
   * Get page guide
   */
  getPageGuide(pageName) {
    return this.pageGuides[pageName] || null;
  }

  /**
   * Create tooltip HTML element
   */
  createTooltip(topicKey, position = 'top') {
    const topic = this.getTopic(topicKey);
    if (!topic) return null;

    const tooltip = document.createElement('div');
    tooltip.className = `newplayer-tooltip tooltip-${position}`;
    tooltip.innerHTML = `
      <div class="tooltip-header">
        <h4>${topic.title}</h4>
        <button class="tooltip-close">×</button>
      </div>
      <div class="tooltip-content">
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
    `;

    tooltip.querySelector('.tooltip-close').addEventListener('click', () => {
      tooltip.remove();
      this.isVisible = false;
    });

    return tooltip;
  }

  /**
   * Show tooltip for a topic
   */
  showTooltip(topicKey, triggerElement) {
    if (this.tooltipElement) {
      this.tooltipElement.remove();
    }

    const tooltip = this.createTooltip(topicKey);
    if (!tooltip) return;

    document.body.appendChild(tooltip);
    this.tooltipElement = tooltip;
    this.isVisible = true;

    // Position tooltip near trigger element
    const rect = triggerElement.getBoundingClientRect();
    tooltip.style.position = 'fixed';
    tooltip.style.left = (rect.left + rect.width / 2) + 'px';
    tooltip.style.top = (rect.top - 10) + 'px';
    tooltip.style.transform = 'translateX(-50%) translateY(-100%)';
  }

  /**
   * Hide current tooltip
   */
  hideTooltip() {
    if (this.tooltipElement) {
      this.tooltipElement.remove();
      this.tooltipElement = null;
      this.isVisible = false;
    }
  }

  /**
   * Register tooltip triggers for elements with data-help-topic
   */
  registerTooltipTriggers() {
    const triggers = document.querySelectorAll('[data-help-topic]');

    triggers.forEach(trigger => {
      trigger.addEventListener('mouseenter', () => {
        const topicKey = trigger.dataset.helpTopic;
        this.showTooltip(topicKey, trigger);
      });

      trigger.addEventListener('mouseleave', () => {
        setTimeout(() => {
          if (!this.tooltipElement?.matches(':hover')) {
            this.hideTooltip();
          }
        }, 100);
      });
    });
  }

  /**
   * Get total topic count
   */
  getTopicCount() {
    return Object.keys(this.topics).length;
  }

  /**
   * Get topics by category (ability, combat, class, etc.)
   */
  getTopicsByCategory(category) {
    const categories = {
      'abilities': ['ability-scores', 'modifiers', 'ability-checks'],
      'combat': ['attack-rolls', 'armor-class', 'hit-points', 'damage', 'combat', 'initiative', 'turn-order', 'death-saves'],
      'classes': ['classes', 'subclasses', 'class-features', 'multiclassing'],
      'spellcasting': ['spellcasting', 'spell-slots', 'cantrips', 'concentration', 'spell-save-dc'],
      'progression': ['leveling-up', 'experience-points', 'ability-score-improvements', 'feats']
    };

    const topicKeys = categories[category] || [];
    return topicKeys.map(key => ({ key, ...this.topics[key] })).filter(t => t.title);
  }
}

// Export for use in axyum.mjs
if (typeof module !== 'undefined' && module.exports) {
  module.exports = NewPlayerGuide;
}
