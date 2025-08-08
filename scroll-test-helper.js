// Helper functions for better scrolling during browser testing

// Smooth scroll to element with better visibility
function scrollToElementSmoothly(selector, options = {}) {
  const element = document.querySelector(selector);
  if (!element) {
    console.log(`Element not found: ${selector}`);
    return false;
  }
  
  const defaultOptions = {
    behavior: 'smooth',
    block: 'center',
    inline: 'center',
    ...options
  };
  
  element.scrollIntoView(defaultOptions);
  
  // Wait for scroll to complete
  return new Promise(resolve => {
    setTimeout(() => {
      console.log(`Scrolled to: ${selector}`);
      resolve(true);
    }, 1000);
  });
}

// Scroll to specific position with animation
function scrollToPosition(x, y, duration = 1000) {
  const startX = window.pageXOffset;
  const startY = window.pageYOffset;
  const distanceX = x - startX;
  const distanceY = y - startY;
  const startTime = performance.now();
  
  function animation(currentTime) {
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    
    // Easing function for smooth animation
    const ease = progress < 0.5 
      ? 2 * progress * progress 
      : 1 - Math.pow(-2 * progress + 2, 2) / 2;
    
    window.scrollTo(
      startX + distanceX * ease,
      startY + distanceY * ease
    );
    
    if (progress < 1) {
      requestAnimationFrame(animation);
    }
  }
  
  requestAnimationFrame(animation);
  
  return new Promise(resolve => {
    setTimeout(resolve, duration + 100);
  });
}

// Scroll through page sections with delays
async function scrollThroughPage(sections = []) {
  const defaultSections = [
    { selector: 'header', name: 'Header' },
    { selector: 'main', name: 'Main Content' },
    { selector: '.scooter-grid', name: 'Scooter Grid' },
    { selector: '#bonus-section', name: 'Bonus Section' },
    { selector: '#scam-warning-section', name: 'Scam Warning' },
    { selector: 'footer', name: 'Footer' },
    { selector: 'iframe', name: 'Google Maps' }
  ];
  
  const sectionsToScroll = sections.length > 0 ? sections : defaultSections;
  
  for (const section of sectionsToScroll) {
    console.log(`Scrolling to: ${section.name}`);
    await scrollToElementSmoothly(section.selector);
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
  }
  
  // Scroll back to top
  await scrollToPosition(0, 0);
  console.log('Scroll test completed');
}

// Test responsive behavior at different viewport sizes
async function testResponsiveScroll(viewports = []) {
  const defaultViewports = [
    { width: 1920, height: 1080, name: 'Desktop' },
    { width: 1024, height: 768, name: 'Tablet' },
    { width: 375, height: 667, name: 'Mobile' }
  ];
  
  const viewportsToTest = viewports.length > 0 ? viewports : defaultViewports;
  
  for (const viewport of viewportsToTest) {
    console.log(`Testing ${viewport.name} (${viewport.width}x${viewport.height})`);
    
    // This would need to be called from Playwright context
    // window.resizeTo(viewport.width, viewport.height);
    
    await scrollThroughPage();
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

// Export for use in browser context
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    scrollToElementSmoothly,
    scrollToPosition,
    scrollThroughPage,
    testResponsiveScroll
  };
}
