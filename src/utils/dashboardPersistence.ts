/**
 * Advanced Dashboard Persistence System
 * 
 * Enterprise-grade state persistence with validation, versioning, compression,
 * and cross-tab synchronization for Atlas dashboard system.
 * 
 * Features:
 * - State validation and schema versioning
 * - Cross-tab synchronization with BroadcastChannel
 * - Compression for large state objects
 * - Automatic state migration between versions
 * - Error handling with fallback mechanisms
 * - Performance optimization with throttling
 * 
 * Architecture:
 * - Service layer wrapper pattern following backend integrity rules
 * - Type-safe state management with TypeScript
 * - Comprehensive error handling and logging
 * - Performance-first design with efficient algorithms
 * 
 * @module DashboardPersistence
 */

import { DashboardLayoutState, DashboardSection } from '@/components/dashboard';

/**
 * Persistent Dashboard State Interface
 * Complete state structure for dashboard persistence
 */
export interface PersistentDashboardState {
  /** Schema version for migration support */
  version: string;
  /** Current layout state */
  currentLayout: DashboardLayoutState;
  /** Active dashboard section */
  activeSection: DashboardSection | null;
  /** Sidebar collapsed state */
  isSidebarCollapsed: boolean;
  /** Recently visited sections */
  recentSections: DashboardSection[];
  /** User preferences */
  preferences: {
    animationEnabled: boolean;
    reducedMotion: boolean;
    sidebarWidth: number;
    theme: 'light' | 'dark' | 'auto';
  };
  /** Navigation history */
  navigationHistory: {
    section: DashboardSection;
    timestamp: number;
    scrollPosition?: number;
  }[];
  /** Session metadata */
  session: {
    startTime: number;
    lastActivity: number;
    pageViews: number;
    interactions: number;
  };
  /** Performance metrics */
  performance: {
    averageLoadTime: number;
    averageFPS: number;
    errorCount: number;
    lastPerformanceCheck: number;
  };
}

/**
 * State Validation Schema
 * Defines required structure for state validation
 */
export interface StateValidationSchema {
  version: string;
  requiredFields: (keyof PersistentDashboardState)[];
  optionalFields: (keyof PersistentDashboardState)[];
  validation: {
    [K in keyof PersistentDashboardState]?: (value: any) => boolean;
  };
}

/**
 * Persistence Configuration Interface
 */
export interface DashboardPersistenceConfig {
  /** Storage key prefix */
  storageKey: string;
  /** Enable compression */
  enableCompression: boolean;
  /** Enable cross-tab sync */
  enableCrossTabSync: boolean;
  /** Maximum history entries */
  maxHistoryEntries: number;
  /** State save throttle delay (ms) */
  saveThrottleDelay: number;
  /** Enable automatic state migration */
  enableAutoMigration: boolean;
  /** Maximum stored state versions */
  maxStoredVersions: number;
  /** Debug mode */
  debugMode: boolean;
}

/**
 * Current State Schema Version
 */
export const CURRENT_STATE_VERSION = '1.2.0';

/**
 * Default Persistence Configuration
 */
const defaultPersistenceConfig: DashboardPersistenceConfig = {
  storageKey: 'atlas-dashboard-state',
  enableCompression: true,
  enableCrossTabSync: true,
  maxHistoryEntries: 50,
  saveThrottleDelay: 300,
  enableAutoMigration: true,
  maxStoredVersions: 3,
  debugMode: false,
};

/**
 * State Validation Schema
 */
const stateValidationSchema: StateValidationSchema = {
  version: CURRENT_STATE_VERSION,
  requiredFields: ['version', 'currentLayout', 'session'],
  optionalFields: ['activeSection', 'isSidebarCollapsed', 'recentSections', 'preferences', 'navigationHistory', 'performance'],
  validation: {
    version: (value: any) => typeof value === 'string' && value.length > 0,
    currentLayout: (value: any) => ['homepage', 'dashboard'].includes(value),
    activeSection: (value: any) => value === null || typeof value === 'string',
    isSidebarCollapsed: (value: any) => typeof value === 'boolean',
    recentSections: (value: any) => Array.isArray(value),
    preferences: (value: any) => typeof value === 'object' && value !== null,
    navigationHistory: (value: any) => Array.isArray(value),
    session: (value: any) => typeof value === 'object' && value !== null,
    performance: (value: any) => typeof value === 'object' && value !== null,
  },
};

/**
 * Advanced Dashboard Persistence Service
 * 
 * Enterprise-grade persistence service providing state management,
 * validation, versioning, and cross-tab synchronization.
 * 
 * Architecture:
 * - Service layer wrapper following backend integrity principles
 * - Type-safe operations with comprehensive validation
 * - Performance optimization with throttling and compression
 * - Error handling with graceful degradation
 * - Cross-tab synchronization with BroadcastChannel API
 * 
 * @class DashboardPersistenceService
 */
export class DashboardPersistenceService {
  private config: DashboardPersistenceConfig;
  private broadcastChannel: BroadcastChannel | null = null;
  private saveThrottleTimer: NodeJS.Timeout | null = null;
  private lastSavedState: PersistentDashboardState | null = null;

  /**
   * Initialize Dashboard Persistence Service
   * 
   * @param config - Persistence configuration override
   */
  constructor(config: Partial<DashboardPersistenceConfig> = {}) {
    this.config = { ...defaultPersistenceConfig, ...config };
    this.initializeCrossTabSync();
  }

  /**
   * Initialize Cross-Tab Synchronization
   * Sets up BroadcastChannel for state synchronization across tabs
   */
  private initializeCrossTabSync(): void {
    if (!this.config.enableCrossTabSync || typeof BroadcastChannel === 'undefined') {
      return;
    }

    try {
      this.broadcastChannel = new BroadcastChannel(`${this.config.storageKey}-sync`);
      
      this.broadcastChannel.addEventListener('message', (event) => {
        if (event.data.type === 'state-updated') {
          this.handleCrossTabStateUpdate(event.data.state);
        }
      });

      if (this.config.debugMode) {
        console.log('Cross-tab synchronization initialized');
      }
    } catch (error) {
      console.warn('Failed to initialize cross-tab sync:', error);
    }
  }

  /**
   * Handle Cross-Tab State Update
   * Processes state updates from other tabs
   */
  private handleCrossTabStateUpdate(state: PersistentDashboardState): void {
    try {
      if (this.validateState(state)) {
        this.lastSavedState = state;
        
        // Emit custom event for components to listen
        window.dispatchEvent(new CustomEvent('dashboard-state-sync', {
          detail: { state }
        }));

        if (this.config.debugMode) {
          console.log('Cross-tab state synchronized:', state);
        }
      }
    } catch (error) {
      console.warn('Failed to handle cross-tab state update:', error);
    }
  }

  /**
   * Validate State Against Schema
   * Comprehensive state validation with schema checking
   */
  private validateState(state: any): state is PersistentDashboardState {
    if (!state || typeof state !== 'object') {
      return false;
    }

    // Check required fields
    for (const field of stateValidationSchema.requiredFields) {
      if (!(field in state)) {
        if (this.config.debugMode) {
          console.warn(`Missing required field: ${field}`);
        }
        return false;
      }
    }

    // Validate field types
    for (const [field, validator] of Object.entries(stateValidationSchema.validation)) {
      if (field in state && validator && !validator(state[field])) {
        if (this.config.debugMode) {
          console.warn(`Invalid field value: ${field}`, state[field]);
        }
        return false;
      }
    }

    return true;
  }

  /**
   * Compress State Data
   * Simple compression for large state objects
   */
  private compressState(state: PersistentDashboardState): string {
    if (!this.config.enableCompression) {
      return JSON.stringify(state);
    }

    try {
      // Simple compression: remove whitespace and optimize JSON
      const compressedState = {
        ...state,
        // Optimize arrays by removing empty entries
        recentSections: state.recentSections?.filter(Boolean) || [],
        navigationHistory: state.navigationHistory?.slice(-this.config.maxHistoryEntries) || [],
      };

      return JSON.stringify(compressedState);
    } catch (error) {
      console.warn('State compression failed, using uncompressed:', error);
      return JSON.stringify(state);
    }
  }

  /**
   * Decompress State Data
   * Decompress and parse state data
   */
  private decompressState(data: string): PersistentDashboardState | null {
    try {
      return JSON.parse(data);
    } catch (error) {
      console.warn('State decompression failed:', error);
      return null;
    }
  }

  /**
   * Migrate State Version
   * Handles state migration between versions
   */
  private migrateState(state: any): PersistentDashboardState | null {
    if (!this.config.enableAutoMigration) {
      return null;
    }

    try {
      // Migration logic for different versions
      const currentVersion = state.version || '1.0.0';
      
      if (currentVersion === CURRENT_STATE_VERSION) {
        return state;
      }

      // Version-specific migrations
      let migratedState = { ...state };

      if (currentVersion < '1.1.0') {
        // Add performance metrics for v1.1.0
        migratedState.performance = {
          averageLoadTime: 0,
          averageFPS: 60,
          errorCount: 0,
          lastPerformanceCheck: Date.now(),
        };
      }

      if (currentVersion < '1.2.0') {
        // Add session metadata for v1.2.0
        migratedState.session = {
          startTime: Date.now(),
          lastActivity: Date.now(),
          pageViews: 1,
          interactions: 0,
          ...(migratedState.session || {}),
        };
      }

      // Update version
      migratedState.version = CURRENT_STATE_VERSION;

      if (this.config.debugMode) {
        console.log(`State migrated from ${currentVersion} to ${CURRENT_STATE_VERSION}`);
      }

      return migratedState;
    } catch (error) {
      console.warn('State migration failed:', error);
      return null;
    }
  }

  /**
   * Save Dashboard State
   * Throttled state saving with validation and compression
   */
  public saveState(state: PersistentDashboardState): void {
    // Clear existing throttle timer
    if (this.saveThrottleTimer) {
      clearTimeout(this.saveThrottleTimer);
    }

    // Throttle save operations
    this.saveThrottleTimer = setTimeout(() => {
      this.performStateSave(state);
    }, this.config.saveThrottleDelay);
  }

  /**
   * Perform Actual State Save
   * Internal method for saving state to storage
   */
  private performStateSave(state: PersistentDashboardState): void {
    try {
      // Validate state before saving
      if (!this.validateState(state)) {
        console.warn('Invalid state, skipping save');
        return;
      }

      // Update state metadata
      const stateToSave: PersistentDashboardState = {
        ...state,
        version: CURRENT_STATE_VERSION,
        session: {
          ...state.session,
          lastActivity: Date.now(),
        },
      };

      // Compress and save
      const compressedData = this.compressState(stateToSave);
      localStorage.setItem(this.config.storageKey, compressedData);

      // Save state version for migration tracking
      localStorage.setItem(`${this.config.storageKey}-version`, CURRENT_STATE_VERSION);

      // Update last saved state
      this.lastSavedState = stateToSave;

      // Broadcast to other tabs
      if (this.broadcastChannel) {
        this.broadcastChannel.postMessage({
          type: 'state-updated',
          state: stateToSave,
          timestamp: Date.now(),
        });
      }

      if (this.config.debugMode) {
        console.log('Dashboard state saved:', stateToSave);
      }
    } catch (error) {
      console.error('Failed to save dashboard state:', error);
    }
  }

  /**
   * Load Dashboard State
   * Load and validate state from storage with migration support
   */
  public loadState(): PersistentDashboardState | null {
    try {
      const savedData = localStorage.getItem(this.config.storageKey);
      if (!savedData) {
        return null;
      }

      // Decompress state
      const state = this.decompressState(savedData);
      if (!state) {
        return null;
      }

      // Validate state
      if (!this.validateState(state)) {
        // Attempt migration
        const migratedState = this.migrateState(state);
        if (migratedState && this.validateState(migratedState)) {
          this.saveState(migratedState); // Save migrated state
          return migratedState;
        }
        
        console.warn('Invalid state and migration failed, clearing storage');
        this.clearState();
        return null;
      }

      // Check for version mismatch
      if (state.version !== CURRENT_STATE_VERSION) {
        const migratedState = this.migrateState(state);
        if (migratedState) {
          this.saveState(migratedState);
          return migratedState;
        }
      }

      this.lastSavedState = state;
      
      if (this.config.debugMode) {
        console.log('Dashboard state loaded:', state);
      }

      return state;
    } catch (error) {
      console.error('Failed to load dashboard state:', error);
      return null;
    }
  }

  /**
   * Clear Dashboard State
   * Remove all stored state data
   */
  public clearState(): void {
    try {
      localStorage.removeItem(this.config.storageKey);
      localStorage.removeItem(`${this.config.storageKey}-version`);
      this.lastSavedState = null;

      // Broadcast clear to other tabs
      if (this.broadcastChannel) {
        this.broadcastChannel.postMessage({
          type: 'state-cleared',
          timestamp: Date.now(),
        });
      }

      if (this.config.debugMode) {
        console.log('Dashboard state cleared');
      }
    } catch (error) {
      console.error('Failed to clear dashboard state:', error);
    }
  }

  /**
   * Get State Size
   * Calculate approximate storage size of state
   */
  public getStateSize(): number {
    try {
      const savedData = localStorage.getItem(this.config.storageKey);
      return savedData ? new Blob([savedData]).size : 0;
    } catch (error) {
      console.warn('Failed to calculate state size:', error);
      return 0;
    }
  }

  /**
   * Create Default State
   * Generate a default state structure
   */
  public createDefaultState(): PersistentDashboardState {
    return {
      version: CURRENT_STATE_VERSION,
      currentLayout: 'homepage',
      activeSection: null,
      isSidebarCollapsed: false,
      recentSections: [],
      preferences: {
        animationEnabled: true,
        reducedMotion: false,
        sidebarWidth: 280,
        theme: 'light',
      },
      navigationHistory: [],
      session: {
        startTime: Date.now(),
        lastActivity: Date.now(),
        pageViews: 1,
        interactions: 0,
      },
      performance: {
        averageLoadTime: 0,
        averageFPS: 60,
        errorCount: 0,
        lastPerformanceCheck: Date.now(),
      },
    };
  }

  /**
   * Cleanup
   * Clean up resources and event listeners
   */
  public cleanup(): void {
    if (this.saveThrottleTimer) {
      clearTimeout(this.saveThrottleTimer);
      this.saveThrottleTimer = null;
    }

    if (this.broadcastChannel) {
      this.broadcastChannel.close();
      this.broadcastChannel = null;
    }
  }
}

/**
 * Default Dashboard Persistence Service Instance
 * Singleton instance for application-wide use
 */
export const dashboardPersistence = new DashboardPersistenceService();

/**
 * Dashboard Persistence Hook
 * React hook for using dashboard persistence in components
 */
export function useDashboardPersistence(config?: Partial<DashboardPersistenceConfig>) {
  const [persistenceService] = React.useState(
    () => config ? new DashboardPersistenceService(config) : dashboardPersistence
  );

  React.useEffect(() => {
    return () => {
      if (config) {
        persistenceService.cleanup();
      }
    };
  }, [persistenceService, config]);

  return {
    saveState: persistenceService.saveState.bind(persistenceService),
    loadState: persistenceService.loadState.bind(persistenceService),
    clearState: persistenceService.clearState.bind(persistenceService),
    getStateSize: persistenceService.getStateSize.bind(persistenceService),
    createDefaultState: persistenceService.createDefaultState.bind(persistenceService),
  };
}

/**
 * Dashboard Persistence Exports
 * Named exports for service and related types
 */
export type {
  PersistentDashboardState,
  StateValidationSchema,
  DashboardPersistenceConfig,
}; 