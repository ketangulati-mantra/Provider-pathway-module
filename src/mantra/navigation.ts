import { MANTRA_CONFIG } from './config';
import { getLesson } from './api';

/**
 * Centrally preserves all active URL query parameters (service, upa_id, uid, locale, etc.)
 * when navigating to a new path or route.
 */
export const preserveQueryParams = (targetPath: string): string => {
  if (typeof window === 'undefined' || !window.location) {
    return targetPath;
  }

  const currentSearch = window.location.search;
  if (!currentSearch) {
    return targetPath;
  }

  const [pathname, targetQuery] = targetPath.split('?');
  const currentParams = new URLSearchParams(currentSearch);

  if (targetQuery) {
    const targetParams = new URLSearchParams(targetQuery);
    targetParams.forEach((value, key) => {
      currentParams.set(key, value);
    });
  }

  const mergedSearch = currentParams.toString();
  return mergedSearch ? `${pathname}?${mergedSearch}` : pathname;
};

/**
 * Universal Exit / Back button handler for all activities across three contexts:
 * 1. React Native WebView inside mobile app
 * 2. iframe inside web.mantracare.com
 * 3. Standalone browser
 */
export const handleExit = () => {
  if (typeof window === 'undefined') return;

  // 1. React Native WebView
  if ((window as any).ReactNativeWebView) {
    (window as any).ReactNativeWebView.postMessage(
      JSON.stringify({ action: "exit" })
    );
    return;
  }

  // 2. iframe inside web.mantracare.com
  if (window.parent !== window) {
    window.parent.postMessage(
      { action: "exit" },
      "https://provider.mantracare.com"
    );
    return;
  }

  // 3. Standalone browser
  window.location.href = "https://provider.mantracare.com";
};

/**
 * Helper to navigate to a specific screen inside the native React Native app (e.g. after task completion).
 */
export const navigateNativeApp = (screen: string, params?: Record<string, any>) => {
  if (typeof window !== 'undefined' && (window as any).ReactNativeWebView) {
    (window as any).ReactNativeWebView.postMessage(
      JSON.stringify({
        action: "navigate",
        screen,
        params,
      })
    );
    return true;
  }
  return false;
};

/**
 * Handles back routing. Falls back to handleExit() if no callback is supplied.
 */
export const goBack = (onBackCallback?: () => void) => {
  if (onBackCallback) {
    onBackCallback();
  } else {
    handleExit();
  }
};

/**
 * Redirects the user / exits the activity back to the dashboard or host container.
 */
export const goToDashboard = () => {
  handleExit();
};

/**
 * Navigates popstate router to the selected task route pathway,
 * automatically preserving query parameters.
 */
export const goToLesson = (route: string) => {
  const fullRoute = preserveQueryParams(route);
  window.history.pushState(null, '', fullRoute);
  window.dispatchEvent(new PopStateEvent('popstate'));
};

/**
 * Controls completion redirection actions, calling handleExit() or returning.
 */
export const redirectAfterCompletion = (lessonId: string, onBackCallback?: () => void) => {
  handleExit();
};
