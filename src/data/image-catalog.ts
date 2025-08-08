// Image catalog - SECURITY FIX: Removed blacklisted CDN (274418.selcdn.ru)
// All images now use local placeholders or clean CDN sources
export const IMAGE_CATALOG = {
  // Header/Logo
  logo: {
    src: "/images/logo-placeholder.jpg",
    alt: "Smile Rental Phuket Logo",
    usage: "Header logo and brand image"
  },

  // Review Platform Icons
  reviewIcons: {
    google: {
      src: "/images/trustpilot-reviews.png",
      alt: "Google Reviews",
      usage: "Google review platform icon"
    }
  },

  // Feature Icons - SECURITY FIX: Using local placeholders
  features: {
    videoRecorder: {
      src: "/images/icons/video-recorder-placeholder.png",
      alt: "Video recorder protection",
      usage: "Video recorder feature icon"
    },
    insurance: {
      src: "/images/icons/insurance-placeholder.svg",
      alt: "Insurance protection",
      usage: "Insurance and protection feature icon"
    },
    noBreakdowns: {
      src: "/images/icons/no-breakdowns-placeholder.png",
      alt: "No breakdown payments",
      usage: "No breakdown payment feature icon"
    },
    bestSeller: {
      src: "/images/icons/best-seller-placeholder.png",
      alt: "Best Seller badge",
      usage: "Best seller product badge"
    }
  },

  // Scooter Images - SECURITY FIX: Using local images
  scooters: {
    nmax: {
      src: "/images/scooters/nmax.jpg",
      alt: "Yamaha NMAX scooter",
      usage: "NMAX scooter product image",
      photoLink: "https://photos.app.goo.gl/jdDkh4icYJpunRi79"
    },
    filano: {
      src: "/images/scooters/filano.jpg",
      alt: "Yamaha Filano scooter",
      usage: "Filano scooter product image",
      photoLink: "https://photos.app.goo.gl/aGKH13bWvVe7TiLy5"
    },
    premiumHelmet: {
      src: "/images/scooters/helmet.jpg",
      alt: "Premium helmet",
      usage: "Premium helmet product image"
    },
    gpx150: {
      src: "/images/scooters/gpx150.jpg",
      alt: "GPX 150cc scooter",
      usage: "GPX 150cc scooter product image",
      photoLink: "https://photos.app.goo.gl/oXwcEEineMZpFLe78"
    },
    gt270: {
      src: "/images/scooters/gt270.jpg",
      alt: "GT 270 ABS scooter",
      usage: "GT 270 ABS scooter product image",
      photoLink: "https://photos.app.goo.gl/d5vNpjEE2otwL8X17"
    },
    bestSeller1: {
      src: "/images/scooters/bestseller1.jpg",
      alt: "Best seller scooter model",
      usage: "Best seller scooter product image",
      photoLink: "https://photos.app.goo.gl/e5WNPgSpzRqrQxBs5"
    },
    nmax2: {
      src: "/images/scooters/nmax2.jpg",
      alt: "Yamaha NMAX scooter variant",
      usage: "NMAX scooter variant product image",
      photoLink: "https://photos.app.goo.gl/mmB2xtFsPNfiVVtb9"
    }
  },

  // Bonus Section Icons - SECURITY FIX: Using local placeholders
  bonusIcons: {
    restaurant: {
      src: "/images/icons/restaurant-placeholder.png",
      alt: "Restaurant discounts",
      usage: "Restaurant discount bonus icon"
    },
    tour: {
      src: "/images/icons/tour-placeholder.png",
      alt: "Tour discounts",
      usage: "Tour discount bonus icon"
    },
    photoRoutes: {
      src: "/images/icons/photo-routes-placeholder.png",
      alt: "Photo routes",
      usage: "Photo routes bonus icon"
    },
    couples: {
      src: "/images/icons/couples-placeholder.png",
      alt: "Routes for couples",
      usage: "Couples routes bonus icon"
    }
  },

  // Additional Scooter Images - SECURITY FIX: Using local images
  moreScooters: {
    bestSeller2: {
      src: "/images/scooters/bestseller2.jpg",
      alt: "Best seller GPX scooter",
      usage: "Best seller GPX scooter product image",
      photoLink: "https://photos.app.goo.gl/oXwcEEineMZpFLe78"
    },
    gt270Premium: {
      src: "/images/scooters/gt270-premium.jpg",
      alt: "GT 270 ABS premium scooter",
      usage: "GT 270 ABS premium scooter product image",
      photoLink: "https://photos.app.goo.gl/cM5X1EBxGJBHHhjG7"
    },
    bestSeller3: {
      src: "/images/scooters/bestseller3.jpg",
      alt: "Best seller 2024 scooter",
      usage: "Best seller 2024 scooter product image",
      photoLink: "https://photos.app.goo.gl/rGfznuCuv9HLSjwT8"
    },
    bestSeller4: {
      src: "/images/scooters/bestseller4.jpg",
      alt: "Best seller 2023 scooter",
      usage: "Best seller 2023 scooter product image",
      photoLink: "https://photos.app.goo.gl/xZUiuSkZJYV4XAY59"
    },
    bestSeller5: {
      src: "/images/scooters/bestseller5.jpg",
      alt: "Best seller 2024 variant scooter",
      usage: "Best seller 2024 variant scooter product image",
      photoLink: "https://photos.app.goo.gl/J9cW8ojfQYJPPjFJ6"
    },
    bestSeller6: {
      src: "/images/scooters/bestseller6.jpg",
      alt: "Best seller premium variant scooter",
      usage: "Best seller premium variant scooter product image",
      photoLink: "https://photos.app.goo.gl/x5PwPevtKgVKB3P98"
    },
    xmax300: {
      src: "/images/scooters/xmax300.jpg",
      alt: "Yamaha XMAX 300cc ABS scooter",
      usage: "XMAX 300cc ABS premium scooter product image",
      photoLink: "https://photos.app.goo.gl/q4eQ5QABn2bCQ5M49"
    },
    nmaxAbs: {
      src: "/images/scooters/nmax-abs.jpg",
      alt: "Yamaha NMAX ABS scooter",
      usage: "NMAX ABS scooter product image",
      photoLink: "https://photos.app.goo.gl/r9JBHoTcfTs3BpEv9"
    }
  },

  // Scam Warning Images - SECURITY FIX: Using local placeholders
  scamWarning: {
    dashcam1: {
      src: "/images/scam-warning/dashcam1-placeholder.png",
      alt: "Dashcam protection example 1",
      usage: "Scam protection dashcam example"
    },
    dashcam2: {
      src: "/images/scam-warning/dashcam2-placeholder.png",
      alt: "Dashcam protection example 2",
      usage: "Scam protection dashcam example"
    }
  },

  // Owner Image - SECURITY FIX: Using local image
  owner: {
    alex: {
      src: "/images/owner/alex.jpg",
      alt: "Alex - Owner of Smile Rental Phuket",
      usage: "Owner profile image"
    }
  },

  // Adventure Tour Icons
  adventures: {
    foodTour: {
      src: "https://cdn2.craftum.com/images/advcard/033.webp",
      alt: "Food tour icon",
      usage: "Food tour adventure icon"
    },
    photoTour: {
      src: "https://cdn2.craftum.com/images/advcard/034.webp",
      alt: "Photo tour icon",
      usage: "Photo tour adventure icon"
    },
    familyTour: {
      src: "https://cdn2.craftum.com/images/advcard/035.webp",
      alt: "Family tour icon",
      usage: "Family tour adventure icon"
    }
  }
};
