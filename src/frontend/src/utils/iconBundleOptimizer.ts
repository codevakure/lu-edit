/**
 * Icon Bundle Optimizer
 * Provides utilities for optimizing icon loading and bundling
 */

// Critical icons that should be in the main bundle
export const CRITICAL_ICON_BUNDLE = [
  'MessageCircle', 'Bot', 'Database', 'BrainCog', 'Cable', 'Layers',
  'Settings', 'Play', 'Square', 'Copy', 'Trash2', 'Eye', 'EyeOff',
  'ChevronDown', 'ChevronUp', 'Plus', 'X', 'Check', 'AlertCircle',
  'Info', 'HelpCircle', 'Edit', 'StickyNote', 'GradientSave'
];

// Icons that can be lazy loaded by category
export const CATEGORY_ICON_BUNDLES = {
  models: ['OpenAI', 'Anthropic', 'Google', 'HuggingFace', 'Ollama', 'MistralAI'],
  data: ['Database', 'FileSearch', 'Paperclip', 'Layers', 'Table'],
  agents: ['Bot', 'MessageCircle', 'BotMessageSquareIcon', 'Users'],
  tools: ['Hammer', 'Package2', 'Wand2', 'Wrench', 'Cog'],
  inputs: ['Download', 'Cable', 'Upload', 'Import', 'ArrowDown'],
  outputs: ['Upload', 'Share', 'Bell', 'Export', 'ArrowUp'],
  processing: ['ListFilter', 'Shuffle', 'RotateCcw', 'Zap'],
  logic: ['ArrowRightLeft', 'GitBranch', 'Split', 'Merge'],
};

// Frequently used UI icons
export const UI_ICON_BUNDLE = [
  'Settings', 'Menu', 'Search', 'Filter', 'Sort', 'Grid',
  'List', 'Maximize', 'Minimize', 'MoreHorizontal', 'MoreVertical',
  'Refresh', 'Save', 'Load', 'Download', 'Upload'
];

/**
 * Get icons to preload based on current route/context
 */
export const getContextualIcons = (context: string): string[] => {
  const contextMap: Record<string, string[]> = {
    'flow-editor': [...CRITICAL_ICON_BUNDLE, ...UI_ICON_BUNDLE],
    'dashboard': ['Grid', 'List', 'Plus', 'Search', 'Filter'],
    'settings': ['Settings', 'User', 'Key', 'Shield', 'Bell'],
    'templates': ['Template', 'Copy', 'Download', 'Star'],
  };

  return contextMap[context] || CRITICAL_ICON_BUNDLE;
};

/**
 * Calculate icon bundle size for optimization
 */
export const calculateBundleSize = (iconNames: string[]): number => {
  // Rough estimate: each icon ~2KB
  return iconNames.length * 2;
};

/**
 * Get recommended icon loading strategy
 */
export const getLoadingStrategy = (iconCount: number) => {
  if (iconCount <= 20) {
    return 'eager'; // Load all immediately
  } else if (iconCount <= 50) {
    return 'hybrid'; // Load critical immediately, others on demand
  } else {
    return 'lazy'; // Load all on demand with aggressive caching
  }
};

/**
 * Icon usage analytics for optimization
 */
export class IconUsageTracker {
  private usage = new Map<string, number>();
  private loadTimes = new Map<string, number>();

  trackUsage(iconName: string) {
    const current = this.usage.get(iconName) || 0;
    this.usage.set(iconName, current + 1);
  }

  trackLoadTime(iconName: string, loadTime: number) {
    this.loadTimes.set(iconName, loadTime);
  }

  getMostUsedIcons(limit: number = 20): string[] {
    return Array.from(this.usage.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([name]) => name);
  }

  getSlowestIcons(limit: number = 10): Array<{ name: string; loadTime: number }> {
    return Array.from(this.loadTimes.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([name, loadTime]) => ({ name, loadTime }));
  }

  getOptimizationRecommendations() {
    const mostUsed = this.getMostUsedIcons();
    const slowest = this.getSlowestIcons();
    
    return {
      shouldEagerLoad: mostUsed.filter(icon => 
        !CRITICAL_ICON_BUNDLE.includes(icon)
      ),
      shouldOptimize: slowest.filter(({ loadTime }) => loadTime > 100),
      totalIcons: this.usage.size,
      averageLoadTime: Array.from(this.loadTimes.values())
        .reduce((a, b) => a + b, 0) / this.loadTimes.size,
    };
  }
}

// Global tracker instance
export const iconTracker = new IconUsageTracker();
