/**
 * WizardNavigation - Handles page navigation logic for Axyum wizard
 */
export class WizardNavigation {
  constructor(pages) {
    this.pages = pages || [
      'welcome', 'role', 'class', 'multiclass', 'race', 'background', 'abilities',
      'skills', 'proficiencies', 'equipment', 'spells', 'feat-selection', 'details', 'biography', 'summary'
    ];
    this.currentPageIndex = 0;
  }

  getCurrentPage() {
    return this.pages[this.currentPageIndex];
  }

  getCurrentPageIndex() {
    return this.currentPageIndex;
  }

  getTotalPages() {
    return this.pages.length;
  }

  isFirstPage() {
    return this.currentPageIndex === 0;
  }

  isLastPage() {
    return this.currentPageIndex === this.pages.length - 1;
  }

  canNavigateNext() {
    return !this.isLastPage();
  }

  canNavigatePrevious() {
    return !this.isFirstPage();
  }

  nextPage() {
    if (this.canNavigateNext()) {
      this.currentPageIndex++;
      return true;
    }
    return false;
  }

  previousPage() {
    if (this.canNavigatePrevious()) {
      this.currentPageIndex--;
      return true;
    }
    return false;
  }

  goToPage(pageNameOrIndex) {
    if (typeof pageNameOrIndex === 'number') {
      if (pageNameOrIndex >= 0 && pageNameOrIndex < this.pages.length) {
        this.currentPageIndex = pageNameOrIndex;
        return true;
      }
    } else if (typeof pageNameOrIndex === 'string') {
      const index = this.pages.indexOf(pageNameOrIndex);
      if (index !== -1) {
        this.currentPageIndex = index;
        return true;
      }
    }
    return false;
  }

  getPageLabel(pageName) {
    const labels = {
      'welcome': 'Welcome',
      'role': 'Role Selection',
      'class': 'Class',
      'multiclass': 'Multiclass',
      'race': 'Race & Species',
      'background': 'Background',
      'abilities': 'Ability Scores',
      'skills': 'Skills',
      'proficiencies': 'Proficiencies',
      'equipment': 'Equipment',
      'spells': 'Spells',
      'feat-selection': 'Feats',
      'details': 'Details',
      'biography': 'Biography',
      'summary': 'Summary'
    };
    return labels[pageName] || pageName;
  }

  getSteps() {
    return this.pages.map((page, index) => ({
      id: page,
      label: this.getPageLabel(page),
      index: index
    }));
  }
}
