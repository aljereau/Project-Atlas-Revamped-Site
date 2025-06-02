/**
 * React Type Declarations
 * Essential React types for Atlas Site Revamp
 */

declare module 'react' {
  export interface RefObject<T> {
    readonly current: T | null;
  }

  export type MutableRefObject<T> = {
    current: T;
  };

  export type Key = string | number;
  export type ReactText = string | number;
  export type ReactNode = React.ReactElement | ReactText | ReactFragment | ReactPortal | boolean | null | undefined;
  export type ReactElement = any;
  export type ReactFragment = any;
  export type ReactPortal = any;

  export type SetStateAction<S> = S | ((prevState: S) => S);
  export type Dispatch<A> = (value: A) => void;
  export type EffectCallback = () => (void | (() => void | undefined));
  export type DependencyList = ReadonlyArray<unknown>;

  export function useState<S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>];
  export function useState<S = undefined>(): [S | undefined, Dispatch<SetStateAction<S | undefined>>];
  export function useEffect(effect: EffectCallback, deps?: DependencyList): void;
  export function useCallback<T extends Function>(callback: T, deps: DependencyList): T;
  export function useRef<T>(initialValue: T): MutableRefObject<T>;
  export function useRef<T>(initialValue: T | null): RefObject<T>;
  export function useRef<T = undefined>(): MutableRefObject<T | undefined>;
  export function useMemo<T>(factory: () => T, deps: DependencyList | undefined): T;
}

declare module 'react-dom' {
  export function render(element: any, container: Element | null): void;
}

declare module '@testing-library/react' {
  export function render(element: any): any;
}

declare module 'framer-motion' {
  export interface Variants {
    [key: string]: any;
  }

  export interface Transition {
    [key: string]: any;
  }

  export interface MotionStyle {
    [key: string]: any;
  }

  export interface MotionValue<T = any> {
    get(): T;
    set(value: T): void;
    on(event: string, callback: Function): () => void;
  }

  export interface PanInfo {
    point: { x: number; y: number };
    delta: { x: number; y: number };
    offset: { x: number; y: number };
    velocity: { x: number; y: number };
  }

  export interface DragControls {
    start(event: any, options?: any): void;
  }

  export interface Orchestration {
    when?: string;
    delayChildren?: number;
    staggerChildren?: number;
    staggerDirection?: number;
  }

  export const motion: any;
} 