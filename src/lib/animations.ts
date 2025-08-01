// iPhone-style animation presets
export const animations = {
  // Fade animations
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const }
  },

  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const }
  },

  fadeInDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const }
  },

  // Scale animations
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const }
  },

  // Slide animations
  slideInLeft: {
    initial: { opacity: 0, x: -30 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const }
  },

  slideInRight: {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 30 },
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const }
  },

  // Stagger animations for lists
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  },

  staggerItem: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const }
  },

  // Hover animations
  hoverScale: {
    whileHover: {
      scale: 1.02,
      transition: { duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] as const }
    },
    whileTap: {
      scale: 0.98,
      transition: { duration: 0.1 }
    }
  },

  hoverLift: {
    whileHover: {
      y: -2,
      transition: { duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] as const }
    },
    whileTap: {
      y: 0,
      transition: { duration: 0.1 }
    }
  },

  // Button press animation
  buttonPress: {
    whileTap: { 
      scale: 0.95,
      transition: { duration: 0.1 }
    }
  }
};

// Easing curves (iPhone-style)
export const easings = {
  easeInOut: [0.25, 0.46, 0.45, 0.94],
  easeOut: [0.25, 0.46, 0.45, 0.94],
  easeIn: [0.55, 0.06, 0.68, 0.19],
  spring: { type: "spring", stiffness: 300, damping: 30 }
};

// Viewport animation settings
export const viewportSettings = {
  once: true,
  margin: "-50px 0px",
  amount: 0.3
};
