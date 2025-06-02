/**
 * Browser API Type Definitions
 * Missing type definitions for browser APIs used in Atlas Site Revamp
 */

// Network Information API
interface NetworkInformation extends EventTarget {
  readonly effectiveType: 'slow-2g' | '2g' | '3g' | '4g';
  readonly downlink: number;
  readonly downlinkMax: number;
  readonly rtt: number;
  readonly saveData: boolean;
  readonly type: 'bluetooth' | 'cellular' | 'ethernet' | 'none' | 'wifi' | 'wimax' | 'other' | 'unknown';
  onchange: ((this: NetworkInformation, ev: Event) => any) | null;
}

// Battery Manager API
interface BatteryManager extends EventTarget {
  readonly charging: boolean;
  readonly chargingTime: number;
  readonly dischargingTime: number;
  readonly level: number;
  onchargingchange: ((this: BatteryManager, ev: Event) => any) | null;
  onchargingtimechange: ((this: BatteryManager, ev: Event) => any) | null;
  ondischargingtimechange: ((this: BatteryManager, ev: Event) => any) | null;
  onlevelchange: ((this: BatteryManager, ev: Event) => any) | null;
}

// Device Memory API
interface NavigatorDeviceMemory {
  readonly deviceMemory?: number;
}

// Hardware Concurrency
interface NavigatorHardwareConcurrency {
  readonly hardwareConcurrency: number;
}

// Connection API
interface NavigatorConnection {
  readonly connection?: NetworkInformation;
}

// Battery API
interface NavigatorBattery {
  getBattery(): Promise<BatteryManager>;
}

// GPU Info (WebGL)
interface WebGLDebugRendererInfo {
  readonly UNMASKED_VENDOR_WEBGL: number;
  readonly UNMASKED_RENDERER_WEBGL: number;
}

// Performance Observer Entry Types
interface PerformanceElementTiming extends PerformanceEntry {
  readonly renderTime: number;
  readonly loadTime: number;
  readonly identifier: string;
  readonly naturalWidth: number;
  readonly naturalHeight: number;
  readonly id: string;
  readonly element?: Element;
  readonly url?: string;
}

interface PerformanceLongTaskTiming extends PerformanceEntry {
  readonly attribution: TaskAttributionTiming[];
}

interface TaskAttributionTiming extends PerformanceEntry {
  readonly containerType: string;
  readonly containerSrc: string;
  readonly containerId: string;
  readonly containerName: string;
}

interface PerformanceEventTiming extends PerformanceEntry {
  readonly processingStart: number;
  readonly processingEnd: number;
  readonly cancelable: boolean;
  readonly target?: Node;
}

// Layout Instability API
interface LayoutShift extends PerformanceEntry {
  readonly value: number;
  readonly sources: LayoutShiftAttribution[];
  readonly hadRecentInput: boolean;
  readonly lastInputTime: number;
}

interface LayoutShiftAttribution {
  readonly node?: Node;
  readonly previousRect: DOMRectReadOnly;
  readonly currentRect: DOMRectReadOnly;
}

// Largest Contentful Paint
interface LargestContentfulPaint extends PerformanceEntry {
  readonly renderTime: number;
  readonly loadTime: number;
  readonly size: number;
  readonly id: string;
  readonly url: string;
  readonly element?: Element;
}

// First Input Delay
interface FirstInputDelay extends PerformanceEntry {
  readonly processingStart: number;
  readonly target?: Node;
}

// Visual Viewport API
interface VisualViewport extends EventTarget {
  readonly offsetLeft: number;
  readonly offsetTop: number;
  readonly pageLeft: number;
  readonly pageTop: number;
  readonly width: number;
  readonly height: number;
  readonly scale: number;
  onresize: ((this: VisualViewport, ev: Event) => any) | null;
  onscroll: ((this: VisualViewport, ev: Event) => any) | null;
}

// Memory Info (Chrome specific)
interface MemoryInfo {
  readonly totalJSHeapSize: number;
  readonly usedJSHeapSize: number;
  readonly jsHeapSizeLimit: number;
}

interface PerformanceMemory {
  readonly memory?: MemoryInfo;
}

// Touch Force
interface TouchForce {
  readonly force: number;
  readonly altitudeAngle?: number;
  readonly azimuthAngle?: number;
}

// Extended Touch interface
interface TouchExtended extends Touch {
  readonly force?: number;
  readonly altitudeAngle?: number;
  readonly azimuthAngle?: number;
}

// Enhanced Navigator interface
interface Navigator extends NavigatorDeviceMemory, NavigatorHardwareConcurrency, NavigatorConnection, NavigatorBattery {
  readonly vibrate?: (pattern: number | number[]) => boolean;
  readonly wakeLock?: WakeLock;
  readonly userAgentData?: NavigatorUAData;
}

// Wake Lock API
interface WakeLock {
  request(type?: WakeLockType): Promise<WakeLockSentinel>;
}

interface WakeLockSentinel extends EventTarget {
  readonly released: boolean;
  readonly type: WakeLockType;
  release(): Promise<void>;
  onrelease: ((this: WakeLockSentinel, ev: Event) => any) | null;
}

type WakeLockType = 'screen';

// User Agent Data
interface NavigatorUAData {
  readonly brands: NavigatorUABrandVersion[];
  readonly mobile: boolean;
  readonly platform: string;
  getHighEntropyValues(hints: string[]): Promise<UADataValues>;
}

interface NavigatorUABrandVersion {
  readonly brand: string;
  readonly version: string;
}

interface UADataValues {
  readonly architecture?: string;
  readonly bitness?: string;
  readonly model?: string;
  readonly platformVersion?: string;
  readonly uaFullVersion?: string;
}

// Enhanced Window interface
interface Window {
  readonly visualViewport?: VisualViewport;
  readonly DeviceOrientationEvent?: {
    requestPermission?: () => Promise<'granted' | 'denied' | 'default'>;
  };
  readonly DeviceMotionEvent?: {
    requestPermission?: () => Promise<'granted' | 'denied' | 'default'>;
  };
}

// Enhanced Performance interface
interface Performance extends PerformanceMemory {
  measureUserAgentSpecificMemory?(): Promise<{
    bytes: number;
    breakdown: Array<{
      bytes: number;
      attribution: Array<{
        url?: string;
        scope?: string;
      }>;
      types: string[];
    }>;
  }>;
}

// CSS Paint API
interface CSS {
  paintWorklet?: Worklet;
  supports(property: string, value: string): boolean;
  supports(conditionText: string): boolean;
}

interface Worklet {
  addModule(moduleURL: string, options?: WorkletOptions): Promise<void>;
}

interface WorkletOptions {
  credentials?: RequestCredentials;
}

// Event Timing API
interface PerformanceObserverEntryList {
  getEntries(): PerformanceEntry[];
  getEntriesByType(type: string): PerformanceEntry[];
  getEntriesByName(name: string, type?: string): PerformanceEntry[];
}

// Animation Frame Timing
interface AnimationFrameTiming extends PerformanceEntry {
  readonly desiredExecutionStart: number;
}

// Declare global extensions
declare global {
  interface Navigator extends NavigatorDeviceMemory, NavigatorHardwareConcurrency, NavigatorConnection, NavigatorBattery {}
  interface Window {
    readonly visualViewport?: VisualViewport;
  }
  interface Performance extends PerformanceMemory {}
}

// Export types for use in modules
export type {
  NetworkInformation,
  BatteryManager,
  PerformanceElementTiming,
  PerformanceLongTaskTiming,
  PerformanceEventTiming,
  LayoutShift,
  LargestContentfulPaint,
  FirstInputDelay,
  VisualViewport,
  MemoryInfo,
  TouchExtended,
  WakeLock,
  WakeLockSentinel,
  NavigatorUAData,
  UADataValues
}; 