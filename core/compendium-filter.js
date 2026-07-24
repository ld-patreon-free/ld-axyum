/**
 * CompendiumFilter - Handles filtering logic for compendium items
 */
export class CompendiumFilter {
  constructor() {
    this.selectedCompendiumFilter = 'all';
    this.selectedRaceCompendiumFilter = 'all';
    this.selectedBackgroundCompendiumFilter = 'all';
    this.showHomebrew = true;
    this.selectedRoleIndex = null;
  }

  setCompendiumFilter(type, value) {
    switch(type) {
      case 'class':
        this.selectedCompendiumFilter = value;
        break;
      case 'race':
        this.selectedRaceCompendiumFilter = value;
        break;
      case 'background':
        this.selectedBackgroundCompendiumFilter = value;
        break;
    }
  }

  getCompendiumFilter(type) {
    switch(type) {
      case 'class':
        return this.selectedCompendiumFilter;
      case 'race':
        return this.selectedRaceCompendiumFilter;
      case 'background':
        return this.selectedBackgroundCompendiumFilter;
      default:
        return 'all';
    }
  }

  setHomebrewVisibility(show) {
    this.showHomebrew = show;
  }

  getHomebrewVisibility() {
    return this.showHomebrew;
  }

  setSelectedRole(roleIndex) {
    this.selectedRoleIndex = roleIndex;
  }

  getSelectedRole() {
    return this.selectedRoleIndex;
  }

  filterHomebrewItems(items) {
    if (this.showHomebrew || !Array.isArray(items)) {
      return items;
    }
    return items.filter(item => !item?.isHomebrew);
  }

  getRecommendedClassesForRole(roleIndex) {
    const roleClassMap = {
      0: ['Fighter', 'Paladin', 'Barbarian'],
      1: ['Rogue', 'Ranger', 'Fighter', 'Sorcerer', 'Warlock'],
      2: ['Wizard', 'Druid', 'Cleric', 'Sorcerer'],
      3: ['Bard', 'Cleric', 'Paladin', 'Druid'],
      4: ['Cleric', 'Druid', 'Paladin', 'Bard'],
      5: ['Rogue', 'Bard', 'Ranger', 'Artificer'],
      6: ['Bard', 'Paladin', 'Warlock', 'Sorcerer'],
      7: null
    };
    return roleClassMap[roleIndex] || null;
  }

  filterClassesByRole(classes) {
    // Don't filter if no role selected or "Any Role" selected
    if (this.selectedRoleIndex === null || this.selectedRoleIndex === 7) {
      return classes;
    }

    const recommendedClasses = this.getRecommendedClassesForRole(this.selectedRoleIndex);
    if (!recommendedClasses || recommendedClasses.length === 0) {
      return classes;
    }

    const filtered = classes.filter(cls => 
      recommendedClasses.some(recommended => 
        cls.name.toLowerCase().includes(recommended.toLowerCase())
      )
    );
    
    // If filtering removes ALL classes, return original list instead
    // (user's homebrew classes may not match standard names)
    if (filtered.length === 0 && classes.length > 0) {
      console.log('CompendiumFilter | Role filter would remove all classes, returning unfiltered');
      return classes;
    }
    
    return filtered;
  }

  filterByCompendium(items, filterValue) {
    if (!filterValue || filterValue === 'all') {
      return items;
    }
    return items.filter(item => item.packName === filterValue);
  }

  getSourceBadge(item) {
    if (!item?.source) return '';
    
    const isHomebrew = item.isHomebrew || (item.source && item.source !== 'PHB');
    const badgeClass = isHomebrew ? 'homebrew' : 'official';
    const badgeIcon = isHomebrew ? '<i class="fas fa-scroll"></i>' : '<i class="fas fa-book"></i>';
    
    return `<span class="source-badge ${badgeClass}" title="${item.source}">${badgeIcon}${item.source}</span>`;
  }

  getClassIcon(className) {
    const icons = {
      'Barbarian': 'fas fa-fire',
      'Bard': 'fas fa-music',
      'Cleric': 'fas fa-cross',
      'Druid': 'fas fa-leaf',
      'Fighter': 'fas fa-shield-alt',
      'Monk': 'fas fa-hand-fist',
      'Paladin': 'fas fa-horse',
      'Ranger': 'fas fa-bow',
      'Rogue': 'fas fa-mask',
      'Sorcerer': 'fas fa-wand-magic',
      'Warlock': 'fas fa-book',
      'Wizard': 'fas fa-hat-wizard'
    };
    return icons[className] || 'fas fa-star';
  }

  applyAllFilters(items, type) {
    let filtered = items || [];
    
    console.log(`CompendiumFilter | applyAllFilters(${type})`, {
      inputCount: items?.length || 0,
      showHomebrew: this.showHomebrew,
      selectedRoleIndex: this.selectedRoleIndex
    });

    filtered = this.filterHomebrewItems(filtered);
    console.log(`CompendiumFilter | After homebrew filter: ${filtered?.length || 0}`);

    if (type === 'class') {
      filtered = this.filterClassesByRole(filtered);
      console.log(`CompendiumFilter | After role filter: ${filtered?.length || 0}`);
      filtered = this.filterByCompendium(filtered, this.selectedCompendiumFilter);
      console.log(`CompendiumFilter | After compendium filter: ${filtered?.length || 0}`);
    } else if (type === 'race') {
      filtered = this.filterByCompendium(filtered, this.selectedRaceCompendiumFilter);
    } else if (type === 'background') {
      filtered = this.filterByCompendium(filtered, this.selectedBackgroundCompendiumFilter);
    }

    return filtered;
  }

  reset() {
    this.selectedCompendiumFilter = 'all';
    this.selectedRaceCompendiumFilter = 'all';
    this.selectedBackgroundCompendiumFilter = 'all';
    this.showHomebrew = true;
    this.selectedRoleIndex = null;
  }
}
