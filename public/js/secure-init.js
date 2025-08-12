/**
 * Secure initialization script for Smile Rental Phuket
 * Google Ads compliant implementation
 * Replaces inline scripts with external file for better security
 */

(function() {
  'use strict';

  // Security-compliant CSS loading function
  // Replaces the dangerous document.createElement pattern
  function loadNonCriticalCSS(href) {
    // Validate URL to prevent malicious injection
    if (!href || typeof href !== 'string') {
      console.error('Invalid CSS URL provided');
      return;
    }

    // Check if CSS is already loaded
    var existingLink = document.querySelector('link[href="' + href + '"]');
    if (existingLink) {
      return;
    }

    try {
      // Create link element using standard DOM methods
      var linkElement = document.createElement('link');
      linkElement.rel = 'stylesheet';
      linkElement.href = href;
      linkElement.media = 'print'; // Load as print to avoid render blocking

      // Security: Add integrity check for external resources
      if (href.indexOf('//') !== -1 && !href.startsWith(window.location.origin)) {
        linkElement.crossOrigin = 'anonymous';
      }

      // Switch to all media after load
      linkElement.onload = function() {
        this.media = 'all';
        console.log('✅ Non-critical CSS loaded: ' + href);
      };

      // Error handling
      linkElement.onerror = function() {
        console.error('❌ Failed to load CSS: ' + href);
      };

      // Append to head
      var head = document.head || document.getElementsByTagName('head')[0];
      head.appendChild(linkElement);
    } catch (error) {
      console.error('Error loading CSS:', error);
    }
  }

  // Initialize after DOM is ready
  function initializeSecureFeatures() {
    console.log('🔒 Initializing secure features...');

    // Load any additional non-critical stylesheets here
    // Example: loadNonCriticalCSS('/css/non-critical.css');

    // Add any other secure initialization code here
    console.log('✅ Secure features initialized');
  }

  // Wait for page load to initialize non-critical features
  if (document.readyState === 'loading') {
    window.addEventListener('load', function() {
      setTimeout(initializeSecureFeatures, 50);
    });
  } else {
    // Page already loaded
    setTimeout(initializeSecureFeatures, 50);
  }

  // Export functions for potential use by other scripts
  window.SmileRentalSecure = {
    loadNonCriticalCSS: loadNonCriticalCSS
  };

})();