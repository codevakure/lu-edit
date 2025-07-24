import { lazy } from "react";
import { nodeIconToDisplayIconMap, eagerLoadedIconsMap, getLucideIconName } from "./styleUtils";
import { isFontAwesomeIcon, fontAwesomeIcons } from "@/icons/fontAwesomeIcons";
import dynamicIconImports from "lucide-react/dynamicIconImports";

// Critical icons that should be preloaded immediately
const CRITICAL_ICONS = [
  'MessageCircle', 'Bot', 'Database', 'BrainCog', 'Cable', 'Layers',
  'ListFilter', 'ArrowRightLeft', 'Wand2', 'Download', 'Upload',
  'Link', 'Paperclip', 'Compass', 'FileSearch', 'Scissors',
  'Package2', 'Hammer', 'HelpCircle', 'Edit', 'StickyNote',
  'GradientSave', 'BotMessageSquareIcon', 'Play', 'Square',
  'Settings', 'Copy', 'Trash2', 'Eye', 'EyeOff', 'ChevronDown',
  'ChevronUp', 'Plus', 'X', 'Check', 'AlertCircle', 'Info'
];

// Icon cache with better typing
const iconPreloadCache = new Map<string, any>();
const preloadPromises = new Map<string, Promise<any>>();

/**
 * Preload critical icons to prevent loading delays
 */
export const preloadCriticalIcons = async () => {
  const preloadPromises = CRITICAL_ICONS.map(async (iconName) => {
    try {
      const icon = await getIconComponent(iconName);
      iconPreloadCache.set(iconName, icon);
      return { iconName, success: true };
    } catch (error) {
      console.warn(`Failed to preload icon: ${iconName}`, error);
      return { iconName, success: false, error };
    }
  });

  const results = await Promise.allSettled(preloadPromises);
  const successful = results.filter(r => r.status === 'fulfilled').length;
  console.log(`Preloaded ${successful}/${CRITICAL_ICONS.length} critical icons`);
};

/**
 * Get icon component with caching and fallback
 */
export const getIconComponent = async (name: string): Promise<any> => {
  // Check preload cache first
  if (iconPreloadCache.has(name)) {
    return iconPreloadCache.get(name);
  }

  // Check if already loading
  if (preloadPromises.has(name)) {
    return preloadPromises.get(name);
  }

  // Create loading promise
  const loadPromise = loadIconComponent(name);
  preloadPromises.set(name, loadPromise);

  try {
    const icon = await loadPromise;
    iconPreloadCache.set(name, icon);
    preloadPromises.delete(name);
    return icon;
  } catch (error) {
    preloadPromises.delete(name);
    throw error;
  }
};

/**
 * Load icon component from various sources
 */
const loadIconComponent = async (name: string): Promise<any> => {
  const iconName = nodeIconToDisplayIconMap[name] || name;

  // 1. Check eager loaded icons (fastest)
  if (eagerLoadedIconsMap[iconName]) {
    return eagerLoadedIconsMap[iconName];
  }

  // 2. Check FontAwesome icons
  if (isFontAwesomeIcon(iconName)) {
    return fontAwesomeIcons[iconName];
  }

  // 3. Check custom lazy icons
  try {
    const iconMappings = await import("@/icons/lazyIconImports").then(
      (module) => module.lazyIconsMapping,
    );
    
    if (iconMappings[iconName]) {
      return lazy(iconMappings[iconName]);
    }
  } catch (error) {
    console.warn(`Failed to load custom icon mapping for: ${iconName}`, error);
  }

  // 4. Check Lucide icons
  const lucideIconName = getLucideIconName(iconName);
  if (dynamicIconImports[lucideIconName]) {
    try {
      return lazy(dynamicIconImports[lucideIconName]);
    } catch (error) {
      console.warn(`Failed to load Lucide icon: ${lucideIconName}`, error);
    }
  }

  // 5. Fallback to empty component
  return lazy(() =>
    Promise.resolve({
      default: () => null,
    }),
  );
};

/**
 * Batch preload icons by category
 */
export const preloadIconsByCategory = async (category: string) => {
  const categoryIcons = getCategoryIcons(category);
  
  const preloadPromises = categoryIcons.map(async (iconName) => {
    try {
      return await getIconComponent(iconName);
    } catch (error) {
      console.warn(`Failed to preload category icon: ${iconName}`, error);
      return null;
    }
  });

  await Promise.allSettled(preloadPromises);
};

/**
 * Get icons commonly used in a category
 */
const getCategoryIcons = (category: string): string[] => {
  const categoryIconMap: Record<string, string[]> = {
    'models': ['BrainCog', 'OpenAI', 'Anthropic', 'Google', 'HuggingFace'],
    'data': ['Database', 'FileSearch', 'Paperclip', 'Layers'],
    'agents': ['Bot', 'MessageCircle', 'BotMessageSquareIcon'],
    'tools': ['Hammer', 'Package2', 'Wand2'],
    'inputs': ['Download', 'Cable', 'Upload'],
    'outputs': ['Upload', 'Share', 'Bell'],
  };

  return categoryIconMap[category] || [];
};

/**
 * Clear icon cache (useful for memory management)
 */
export const clearIconCache = () => {
  iconPreloadCache.clear();
  preloadPromises.clear();
};

/**
 * Get cache statistics
 */
export const getIconCacheStats = () => {
  return {
    preloadedCount: iconPreloadCache.size,
    loadingCount: preloadPromises.size,
    preloadedIcons: Array.from(iconPreloadCache.keys()),
  };
};
