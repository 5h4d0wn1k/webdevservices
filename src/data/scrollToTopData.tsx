import React from 'react';

interface ScrollToTopDataType {
  scrollThreshold: number;
  ariaLabel: string;
}

export const scrollToTopData: ScrollToTopDataType = {
  scrollThreshold: 300,
  ariaLabel: "Scroll to top",
}; 