import React from 'react';

interface WorldTransitionProps {
  progress: number; // 0 to 1
}

export const WorldTransition: React.FC<WorldTransitionProps> = () => {
  // Removing the old technical HUD labels as requested.
  // The transition state is now managed globally by ChapterMarker.
  return null;
};

export default WorldTransition;
