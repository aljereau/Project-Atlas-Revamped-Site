// UI Components
export { default as Button } from './ui/Button';
export { default as Card } from './ui/Card';

// Modal Components  
export { default as Modal } from './modals/Modal';
export { ModalProvider, useModalContext } from './modals/ModalProvider';

// Phase 2 Modal Content
export { WhatWeBuildContent, WhyWeExistContent, WhoWeAreContent, OurTimelineContent } from './modals/ModalContent';

// Phase 3 Advanced Modal Components
export { default as AboutAtlasModal } from './modals/AboutAtlasModal';
export { default as AtlasToolsModal } from './modals/AtlasToolsModal';
export { default as ProjectLogModal } from './modals/ProjectLogModal';
export { default as GetInvolvedModal } from './modals/GetInvolvedModal';

// Navigation Components
export { default as Navigation } from './navigation/Navigation';

// Homepage Components
export { default as HomePage } from './homepage/HomePage';
export { default as NavigationCard } from './homepage/NavigationCard';

// Re-export types
export * from '../types';
export type { NavigationCardProps } from './homepage/NavigationCard';
export type { NavigationProps } from './navigation/Navigation';

// Phase 3 Modal Types
export type { AboutAtlasModalProps } from './modals/AboutAtlasModal';
export type { AtlasToolsModalProps } from './modals/AtlasToolsModal';
export type { ProjectLogModalProps } from './modals/ProjectLogModal';
export type { GetInvolvedModalProps } from './modals/GetInvolvedModal'; 