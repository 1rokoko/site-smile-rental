// Exact layout structure and block hierarchy from original site
export const LAYOUT_STRUCTURE = {
  // Page structure in exact order
  sections: [
    {
      id: 'header',
      type: 'header',
      order: 1,
      content: {
        logo: true,
        reviews: ['google', 'hostadvice', 'trustscore']
      }
    },
    {
      id: 'hero',
      type: 'hero',
      order: 2,
      content: {
        mainHeadline: true,
        pricing: true,
        warningText: true
      }
    },
    {
      id: 'keyFeatures',
      type: 'features',
      order: 3,
      content: {
        title: 'Only with us you get:',
        features: [
          'videoRecorder',
          'scratchProtection', 
          'theftInsurance',
          'noBreakdownPayment'
        ]
      }
    },
    {
      id: 'scooterGrid1',
      type: 'productGrid',
      order: 4,
      content: {
        products: [
          'nmax',
          'filano', 
          'premiumHelmet',
          'gpx150',
          'gt270',
          'bestSeller1',
          'nmax2'
        ]
      }
    },
    {
      id: 'bonusSection',
      type: 'bonus',
      order: 5,
      content: {
        title: 'To everyone up to 6 000฿ when renting:',
        bonuses: [
          'vipRelax',
          'restaurantDiscounts',
          'tourDiscounts', 
          'freeBonus',
          'locationSelection',
          'photoRoutes',
          'couplesRoutes',
          'bachelorParty',
          'gastroTour'
        ],
        subtitle: 'Incredibly thoughtful routes for Maximum emotional, memorable holidays'
      }
    },
    {
      id: 'scooterGrid2',
      type: 'productGrid',
      order: 6,
      content: {
        products: [
          'bestSeller2',
          'gt270Premium',
          'bestSeller3',
          'bestSeller4',
          'bestSeller5',
          'bestSeller6',
          'xmax300',
          'nmaxAbs'
        ]
      }
    },
    {
      id: 'comparison',
      type: 'comparison',
      order: 7,
      content: {
        withoutUs: true,
        withUs: true,
        onlyWithUs: true
      }
    },
    {
      id: 'scamWarning',
      type: 'warning',
      order: 8,
      content: {
        title: 'Phuket Road Scams: Survival Guide',
        dashcamImages: true,
        scamList: true,
        conclusion: true
      }
    },
    {
      id: 'contact',
      type: 'contact',
      order: 9,
      content: {
        telegram: true,
        whatsapp: true
      }
    },
    {
      id: 'ownerTestimonial',
      type: 'testimonial',
      order: 10,
      content: {
        quote: true,
        ownerImage: true,
        ownerInfo: true
      }
    },
    {
      id: 'adventures',
      type: 'adventures',
      order: 11,
      content: {
        title: 'Thoughtful adventures are included:',
        tours: ['foodTour', 'photoTour', 'familyTour']
      }
    },
    {
      id: 'investment',
      type: 'investment',
      order: 12,
      content: {
        title: true,
        cta: true,
        contactActions: true
      }
    }
  ],

  // Layout patterns
  patterns: {
    productGrid: {
      columns: {
        mobile: 1,
        tablet: 2,
        desktop: 3
      },
      spacing: 'medium',
      cardStyle: 'elevated'
    },
    featureList: {
      layout: 'vertical',
      iconPosition: 'left',
      spacing: 'small'
    },
    comparison: {
      layout: 'threeColumn',
      alignment: 'center'
    }
  }
};
