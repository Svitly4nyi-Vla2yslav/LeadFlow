export {};

declare global {
  interface Window {
    fbq?: ((...args: any[]) => void) & {
      queue?: any[];
      version?: string;
      loaded?: boolean;
      callMethod?: (...args: any[]) => void;
      push?: (...args: any[]) => void;
    };
    _fbq?: any;

    dataLayer: any[];
    gtag: (...args: any[]) => void;

    __fbSent?: Record<string, boolean>;
  }
}
