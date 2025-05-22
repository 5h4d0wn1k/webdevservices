import React from 'react';

interface HeroDataType {
  spanText: string;
  headingTextPart1: string;
  headingTextPart2: string;
  descriptionText: string;
  exploreButtonText: string;
  exploreButtonHref: string;
  startButtonText: string;
  startButtonHref: string;
}

export const heroData: HeroDataType = {
  spanText: "Digital Agency",
  headingTextPart1: "The Future of",
  headingTextPart2: "Digital Innovation",
  descriptionText: "Transforming visions into digital masterpieces through innovative design and cutting-edge technology. Experience the next generation of web development.",
  exploreButtonText: "Explore Our Work",
  exploreButtonHref: "#portfolio",
  startButtonText: "Start Your Project",
  startButtonHref: "/onboarding",
}; 