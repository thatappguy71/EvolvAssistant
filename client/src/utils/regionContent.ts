import type { LocationData } from '@/hooks/useLocation';

// Function to get a deterministic but rotating index based on habit name and date
function getDailyRotationIndex(habitName: string, totalLinks: number): number {
  const today = new Date().toDateString(); // Gets date string like "Mon Jan 01 2024"
  const seed = habitName + today;
  
  // Simple hash function to convert string to number
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return Math.abs(hash) % totalLinks;
}

// Function to rotate links daily for the same habit
function getRotatedLinks(links: { title: string; url: string; type: string }[], habitName: string) {
  if (links.length <= 1) return links;
  
  const rotationIndex = getDailyRotationIndex(habitName, links.length);
  
  // Rotate the array so different links appear first each day
  return [
    ...links.slice(rotationIndex),
    ...links.slice(0, rotationIndex)
  ];
}

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
  
  // Enhanced habit mappings with multiple links for daily rotation
  const habitMappings: Record<string, { helpfulLinks: { title: string; url: string; type: string }[] }> = {
    'Morning Meditation': {
      helpfulLinks: [
        { title: 'Guided Morning Meditation (10 min)', url: content.videoLinks.meditation[0] || 'https://youtube.com/watch?v=ZToicYcHIOU', type: 'video' },
        { title: 'Mindfulness Meditation (15 min)', url: content.videoLinks.meditation[1] || 'https://youtube.com/watch?v=WPPPFqsECz0', type: 'video' },
        { title: 'Body Scan Meditation', url: 'https://youtube.com/watch?v=15q-N-_kkrU', type: 'video' },
        { title: 'Headspace Daily Sessions', url: content.appLinks.meditation[0] || 'https://headspace.com', type: 'app' },
        { title: 'Calm Meditation App', url: content.appLinks.meditation[1] || 'https://calm.com', type: 'app' },
        { title: 'Insight Timer Community', url: content.appLinks.meditation[2] || 'https://insighttimer.com', type: 'app' }
      ]
    },
    'Daily Exercise': {
      helpfulLinks: [
        { title: 'HIIT Workout (20 min)', url: content.videoLinks.exercise[0] || 'https://youtube.com/watch?v=g_tea8ZNk5A', type: 'video' },
        { title: 'Full Body Strength Training', url: content.videoLinks.exercise[1] || 'https://youtube.com/watch?v=ml6cT4AZdqI', type: 'video' },
        { title: 'Cardio Dance Workout', url: 'https://youtube.com/watch?v=gC_L9qAHVJ8', type: 'video' },
        { title: 'Nike Training Club', url: content.appLinks.fitness[0] || 'https://nike.com/ntc-app', type: 'app' },
        { title: 'Adidas Training App', url: content.appLinks.fitness[1] || 'https://adidas.com/apps', type: 'app' },
        { title: 'Seven Workout App', url: 'https://seven.app', type: 'app' }
      ]
    },
    'Breathing Exercises': {
      helpfulLinks: [
        { title: 'Box Breathing Technique', url: content.videoLinks.breathing[0] || 'https://youtube.com/watch?v=YRPh_GaiL8s', type: 'video' },
        { title: '4-7-8 Breathing Exercise', url: 'https://youtube.com/watch?v=gz4G31LGyog', type: 'video' },
        { title: 'Wim Hof Breathing Method', url: 'https://youtube.com/watch?v=tybOi4hjZFQ', type: 'video' },
        { title: 'Breathe App Techniques', url: 'https://apps.apple.com/app/breathe/id1438937415', type: 'app' },
        { title: 'Calm Breathing Exercises', url: content.appLinks.meditation[1] || 'https://calm.com', type: 'app' },
        { title: 'Pranayama Guide', url: 'https://youtube.com/watch?v=FUW2xPKJ3Tc', type: 'video' }
      ]
    },
    'Yoga Practice': {
      helpfulLinks: [
        { title: 'Morning Yoga Flow (30 min)', url: content.videoLinks.yoga[0] || 'https://youtube.com/watch?v=v7AYKMP6rOE', type: 'video' },
        { title: 'Beginner Yoga Sequence', url: 'https://youtube.com/watch?v=4vTJHUDB5ak', type: 'video' },
        { title: 'Evening Restorative Yoga', url: 'https://youtube.com/watch?v=BiWDsfZ3zbo', type: 'video' },
        { title: 'Power Yoga Flow', url: 'https://youtube.com/watch?v=GLy2rYHwUqY', type: 'video' },
        { title: 'Down Dog Yoga App', url: content.appLinks.fitness[2] || 'https://downdogapp.com', type: 'app' },
        { title: 'Daily Yoga App', url: 'https://dailyyoga.com', type: 'app' }
      ]
    },
    'High-Intensity Workout': {
      helpfulLinks: [
        { title: 'HIIT Cardio Blast (25 min)', url: 'https://youtube.com/watch?v=cZnsLVArIt8', type: 'video' },
        { title: 'Tabata Full Body Workout', url: 'https://youtube.com/watch?v=20Nw50nvobY', type: 'video' },
        { title: 'CrossFit Home Workout', url: 'https://youtube.com/watch?v=R5KRZ6VTzmU', type: 'video' },
        { title: 'Burpee Challenge', url: 'https://youtube.com/watch?v=qLBImHhCXSw', type: 'video' },
        { title: 'Nike Training Club', url: content.appLinks.fitness[0] || 'https://nike.com/ntc-app', type: 'app' },
        { title: 'Freeletics Bodyweight', url: 'https://freeletics.com', type: 'app' }
      ]
    },
    'Read for 30 Minutes': {
      helpfulLinks: [
        { title: 'Audible Audiobooks', url: 'https://audible.com', type: 'app' },
        { title: 'Kindle Unlimited', url: 'https://amazon.com/kindle-unlimited', type: 'app' },
        { title: 'Blinkist Book Summaries', url: 'https://blinkist.com', type: 'app' },
        { title: 'Goodreads Reading Lists', url: 'https://goodreads.com', type: 'resource' },
        { title: 'Project Gutenberg Free Books', url: 'https://gutenberg.org', type: 'resource' },
        { title: 'LibriVox Free Audiobooks', url: 'https://librivox.org', type: 'resource' }
      ]
    },
    'Daily Walk': {
      helpfulLinks: [
        { title: 'Walking for Fitness Guide', url: content.videoLinks.exercise[0] || 'https://youtube.com/watch?v=kFIfFJdA8Sk', type: 'video' },
        { title: 'Power Walking Techniques', url: 'https://youtube.com/watch?v=c4jJJhNMWDU', type: 'video' },
        { title: 'Nature Walk Benefits', url: 'https://youtube.com/watch?v=W5WfWmz-Fnw', type: 'video' },
        { title: 'Strava Activity Tracker', url: 'https://strava.com', type: 'app' },
        { title: 'MapMyWalk App', url: 'https://mapmywalk.com', type: 'app' },
        { title: 'Nike Run Club', url: 'https://nike.com/nrc-app', type: 'app' }
      ]
    },
    'Drink 8 Glasses of Water': {
      helpfulLinks: [
        { title: `${location?.country || 'Canada'} Hydration Guide`, url: content.healthServices.nutrition[0] || 'https://healthycanadians.gc.ca', type: 'guide' },
        { title: 'MyFitnessPal Water Tracker', url: 'https://myfitnesspal.com', type: 'app' },
        { title: 'WaterLlama Reminder App', url: 'https://apps.apple.com/app/waterllama/id1454778585', type: 'app' },
        { title: 'Hydro Coach Water Tracker', url: 'https://play.google.com/store/apps/details?id=com.tkapps.daily.water', type: 'app' },
        { title: 'Plant Nanny Water Game', url: 'https://play.google.com/store/apps/details?id=com.fourdesire.plantnanny2', type: 'app' },
        { title: 'Benefits of Proper Hydration', url: 'https://youtube.com/watch?v=9iMGFqMmUFs', type: 'video' }
      ]
    }
  };
  
  const habit = habitMappings[habitName];
  if (!habit) return null;
  
  // Apply daily rotation to the links
  const rotatedLinks = getRotatedLinks(habit.helpfulLinks, habitName);
  
  return {
    ...habit,
    helpfulLinks: rotatedLinks
  };
}