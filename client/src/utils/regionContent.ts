import type { LocationData } from '@/hooks/useLocation';

export interface RegionalContent {
  videoLinks: {
    meditation: string[];
    exercise: string[];
    breathing: string[];
    yoga: string[];
  };
  appLinks: {
    meditation: string[];
    fitness: string[];
    nutrition: string[];
    sleep: string[];
  };
  healthServices: {
    mentalHealth: string[];
    fitness: string[];
    nutrition: string[];
  };
  emergencyNumbers: {
    mental: string;
    health: string;
  };
}

const REGIONAL_CONTENT: Record<string, RegionalContent> = {
  CA: { // Canada
    videoLinks: {
      meditation: [
        'https://www.youtube.com/watch?v=ZToicYcHIOU',
        'https://www.youtube.com/watch?v=WPPPFqsECz0'
      ],
      exercise: [
        'https://www.youtube.com/watch?v=g_tea8ZNk5A',
        'https://www.youtube.com/watch?v=ml6cT4AZdqI'
      ],
      breathing: [
        'https://www.youtube.com/watch?v=YRPh_GaiL8s'
      ],
      yoga: [
        'https://www.youtube.com/watch?v=v7AYKMP6rOE'
      ]
    },
    appLinks: {
      meditation: [
        'https://www.headspace.com/ca',
        'https://ca.calm.com',
        'https://insighttimer.com'
      ],
      fitness: [
        'https://www.nike.com/ca/ntc-app',
        'https://www.adidas.ca/en/apps',
        'https://www.downdogapp.com'
      ],
      nutrition: [
        'https://www.myfitnesspal.com',
        'https://cronometer.com'
      ],
      sleep: [
        'https://www.sleepcycle.com',
        'https://ca.calm.com/sleep-stories'
      ]
    },
    healthServices: {
      mentalHealth: [
        'https://www.canada.ca/en/public-health/services/mental-health-services.html',
        'https://cmha.ca/find-help',
        'https://kidshelpphone.ca'
      ],
      fitness: [
        'https://www.participaction.com',
        'https://www.canada.ca/en/public-health/services/being-active.html'
      ],
      nutrition: [
        'https://food-guide.canada.ca/en/',
        'https://www.unlockfood.ca'
      ]
    },
    emergencyNumbers: {
      mental: '1-833-456-4566 (Talk Suicide Canada)',
      health: '811 (Health Link)'
    }
  },
  US: { // United States
    videoLinks: {
      meditation: [
        'https://www.youtube.com/watch?v=ZToicYcHIOU',
        'https://www.youtube.com/watch?v=WPPPFqsECz0'
      ],
      exercise: [
        'https://www.youtube.com/watch?v=g_tea8ZNk5A',
        'https://www.youtube.com/watch?v=ml6cT4AZdqI'
      ],
      breathing: [
        'https://www.youtube.com/watch?v=YRPh_GaiL8s'
      ],
      yoga: [
        'https://www.youtube.com/watch?v=v7AYKMP6rOE'
      ]
    },
    appLinks: {
      meditation: [
        'https://www.headspace.com',
        'https://www.calm.com',
        'https://insighttimer.com'
      ],
      fitness: [
        'https://www.nike.com/us/ntc-app',
        'https://www.adidas.com/us/apps',
        'https://www.downdogapp.com'
      ],
      nutrition: [
        'https://www.myfitnesspal.com',
        'https://cronometer.com'
      ],
      sleep: [
        'https://www.sleepcycle.com',
        'https://www.calm.com/sleep-stories'
      ]
    },
    healthServices: {
      mentalHealth: [
        'https://www.samhsa.gov/find-help/national-helpline',
        'https://www.mentalhealth.gov',
        'https://suicidepreventionlifeline.org'
      ],
      fitness: [
        'https://www.cdc.gov/physicalactivity',
        'https://health.gov/moveyourway'
      ],
      nutrition: [
        'https://www.myplate.gov',
        'https://www.eatright.org'
      ]
    },
    emergencyNumbers: {
      mental: '988 (Suicide & Crisis Lifeline)',
      health: '911'
    }
  },
  UK: { // United Kingdom
    videoLinks: {
      meditation: [
        'https://www.youtube.com/watch?v=ZToicYcHIOU',
        'https://www.youtube.com/watch?v=WPPPFqsECz0'
      ],
      exercise: [
        'https://www.youtube.com/watch?v=g_tea8ZNk5A',
        'https://www.youtube.com/watch?v=ml6cT4AZdqI'
      ],
      breathing: [
        'https://www.youtube.com/watch?v=YRPh_GaiL8s'
      ],
      yoga: [
        'https://www.youtube.com/watch?v=v7AYKMP6rOE'
      ]
    },
    appLinks: {
      meditation: [
        'https://www.headspace.com/gb',
        'https://www.calm.com/gb',
        'https://insighttimer.com'
      ],
      fitness: [
        'https://www.nike.com/gb/ntc-app',
        'https://www.adidas.co.uk/apps',
        'https://www.downdogapp.com'
      ],
      nutrition: [
        'https://www.myfitnesspal.com',
        'https://www.nutracheck.co.uk'
      ],
      sleep: [
        'https://www.sleepcycle.com',
        'https://www.calm.com/gb/sleep-stories'
      ]
    },
    healthServices: {
      mentalHealth: [
        'https://www.nhs.uk/mental-health/',
        'https://www.mind.org.uk',
        'https://www.samaritans.org'
      ],
      fitness: [
        'https://www.nhs.uk/live-well/exercise/',
        'https://www.sportengland.org'
      ],
      nutrition: [
        'https://www.nhs.uk/live-well/eat-well/',
        'https://www.nutrition.org.uk'
      ]
    },
    emergencyNumbers: {
      mental: '116 123 (Samaritans)',
      health: '111 (NHS)'
    }
  },
  AU: { // Australia
    videoLinks: {
      meditation: [
        'https://www.youtube.com/watch?v=ZToicYcHIOU',
        'https://www.youtube.com/watch?v=WPPPFqsECz0'
      ],
      exercise: [
        'https://www.youtube.com/watch?v=g_tea8ZNk5A',
        'https://www.youtube.com/watch?v=ml6cT4AZdqI'
      ],
      breathing: [
        'https://www.youtube.com/watch?v=YRPh_GaiL8s'
      ],
      yoga: [
        'https://www.youtube.com/watch?v=v7AYKMP6rOE'
      ]
    },
    appLinks: {
      meditation: [
        'https://www.headspace.com/au',
        'https://www.calm.com/au',
        'https://insighttimer.com'
      ],
      fitness: [
        'https://www.nike.com/au/ntc-app',
        'https://www.adidas.com.au/apps',
        'https://www.downdogapp.com'
      ],
      nutrition: [
        'https://www.myfitnesspal.com',
        'https://www.calorieking.com.au'
      ],
      sleep: [
        'https://www.sleepcycle.com',
        'https://www.calm.com/au/sleep-stories'
      ]
    },
    healthServices: {
      mentalHealth: [
        'https://www.lifeline.org.au',
        'https://www.beyondblue.org.au',
        'https://www.headspace.org.au'
      ],
      fitness: [
        'https://www.health.gov.au/topics/physical-activity',
        'https://www.sportaus.gov.au'
      ],
      nutrition: [
        'https://www.eatforhealth.gov.au',
        'https://www.nutrition.org.au'
      ]
    },
    emergencyNumbers: {
      mental: '13 11 14 (Lifeline)',
      health: '000'
    }
  }
};

export function getRegionalContent(location: LocationData | null): RegionalContent {
  if (!location) {
    return REGIONAL_CONTENT.CA; // Default to Canada
  }

  // Map country codes to our regional content
  const countryCode = location.countryCode;
  return REGIONAL_CONTENT[countryCode] || REGIONAL_CONTENT.CA;
}

export function getRegionalizedHabit(habitName: string, location: LocationData | null) {
  const content = getRegionalContent(location);
  
  // Map habit names to appropriate regional content
  switch (habitName.toLowerCase()) {
    case 'morning meditation':
      return {
        helpfulLinks: [
          { title: "Morning Meditation Guide", url: content.videoLinks.meditation[0], type: "video" },
          { title: `${location?.country || 'Canada'} Meditation App`, url: content.appLinks.meditation[0], type: "app" },
          { title: "Local Mental Health Resources", url: content.healthServices.mentalHealth[0], type: "guide" }
        ]
      };
    case 'daily walk':
      return {
        helpfulLinks: [
          { title: "Walking Exercise Guide", url: content.videoLinks.exercise[0], type: "video" },
          { title: "Local Fitness Resources", url: content.healthServices.fitness[0], type: "guide" },
          { title: "Regional Fitness App", url: content.appLinks.fitness[0], type: "app" }
        ]
      };
    case 'drink 8 glasses of water':
      return {
        helpfulLinks: [
          { title: `${location?.country || 'Canada'} Nutrition Guide`, url: content.healthServices.nutrition[0], type: "guide" },
          { title: "Nutrition Tracking App", url: content.appLinks.nutrition[0], type: "app" },
          { title: "Hydration Tips", url: content.healthServices.nutrition[1] || content.healthServices.nutrition[0], type: "resource" }
        ]
      };
    default:
      return null;
  }
}