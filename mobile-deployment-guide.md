# Evolv Mobile App Deployment Guide

## App Store Submission Requirements

### Apple App Store Requirements

#### 1. **App Store Connect Setup**
- Apple Developer Account ($99/year)
- App Bundle ID: `com.evolv.recovery` 
- App Name: "Evolv Recovery - Sobriety & Wellness Tracker"
- Category: Medical/Health & Fitness
- Age Rating: 17+ (due to addiction/recovery content)

#### 2. **Required Metadata**
```
App Description:
"Evolv Recovery is a comprehensive sobriety and wellness tracking app designed specifically for addiction recovery. Track your recovery progress, build healthy habits, access crisis resources, and connect with support networks - all in one secure, private platform.

Features:
• Sobriety counter with milestone celebrations
• Recovery-focused habit tracking
• Crisis support resources (24/7 helplines)
• Daily wellness metrics for relapse prevention
• Evidence-based recovery tools and techniques
• Meeting finder for AA/NA/SMART Recovery
• Sponsor quick-contact features
• Offline mode for continuous tracking

IMPORTANT: This app is not a substitute for professional medical treatment. Always consult healthcare providers for addiction treatment."

Keywords: recovery, sobriety, addiction, wellness, habits, mental health, support
```

#### 3. **Privacy Requirements**
- Health data usage disclosure
- Crisis data handling policies
- Location services explanation (meeting finder)
- Contact access justification (sponsor calling)

#### 4. **Screenshots Required**
- iPhone 6.7" (3 screenshots minimum)
- iPhone 6.5" (3 screenshots minimum) 
- iPad Pro 12.9" (3 screenshots minimum)
- Focus on: Recovery dashboard, crisis resources, habit tracking

### Google Play Store Requirements

#### 1. **Play Console Setup**
- Google Play Developer Account ($25 one-time)
- Package Name: `com.evolv.recovery`
- App Title: "Evolv Recovery: Sobriety Tracker"
- Category: Medical/Health & Fitness
- Content Rating: Teen (addiction recovery content)

#### 2. **Required Metadata**
```
Short Description:
"Recovery-focused wellness app with sobriety tracking, crisis resources, and evidence-based tools for lasting addiction recovery."

Full Description:
"Evolv Recovery is your comprehensive companion for addiction recovery and wellness. Designed specifically for people in recovery, this app provides the tools, resources, and support you need for lasting sobriety.

🛡️ RECOVERY FEATURES:
• Real-time sobriety counter with milestone celebrations
• Recovery-focused daily habits and routines
• Crisis support with 24/7 helpline access
• Sponsor and accountability partner quick-contact
• Meeting finder for AA, NA, SMART Recovery groups
• Trigger identification and coping strategy tools

💪 WELLNESS TRACKING:
• Daily mood, energy, and focus monitoring
• Sleep quality tracking for recovery health
• Habit streak tracking with motivational milestones
• Progress analytics to visualize your journey

🆘 CRISIS SUPPORT:
• One-tap access to crisis helplines
• Emergency contact integration
• Offline mode ensures access anytime
• Privacy-focused design protects your data

This app is designed to complement professional treatment and is not a substitute for medical care. Always consult healthcare providers for addiction treatment."
```

#### 3. **Data Safety Section**
- Health data collection disclosure
- Location data usage (meeting finder)
- Contact data access (emergency contacts)
- No data sharing with third parties

## Technical Requirements for Mobile

### **React Native Conversion Checklist**

#### Core Dependencies
```json
{
  "@react-navigation/native": "^6.1.9",
  "@react-navigation/bottom-tabs": "^6.5.11",
  "@react-native-async-storage/async-storage": "^1.19.5",
  "react-native-push-notification": "^8.1.1",
  "react-native-biometrics": "^3.0.1",
  "react-native-contacts": "^7.0.8",
  "react-native-maps": "^1.8.0",
  "react-native-geolocation-service": "^5.3.1",
  "react-native-background-timer": "^2.4.1",
  "react-native-health": "^1.19.0",
  "react-native-google-fit": "^0.7.0"
}
```

#### Recovery-Specific Features
```javascript
// Crisis support integration
import { Linking } from 'react-native';

const callCrisisLine = (number: string) => {
  Linking.openURL(`tel:${number}`);
};

const textCrisisLine = (number: string, message: string) => {
  Linking.openURL(`sms:${number}?body=${encodeURIComponent(message)}`);
};

// Offline data persistence
import AsyncStorage from '@react-native-async-storage/async-storage';

const saveOfflineData = async (data: any) => {
  try {
    await AsyncStorage.setItem('evolv-offline', JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save offline data:', error);
  }
};
```

### **PWA Mobile Optimization (Immediate)**

#### Service Worker for Offline Support
```javascript
// Register service worker for offline functionality
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(registration => console.log('SW registered'))
    .catch(error => console.log('SW registration failed'));
}
```

#### Mobile-Specific CSS
```css
/* Mobile-first responsive design */
@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .crisis-button {
    position: fixed;
    bottom: 80px;
    right: 16px;
    z-index: 1000;
  }
  
  .bottom-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 64px;
  }
}
```

## App Store Optimization (ASO)

### **Keywords Strategy**

#### Primary Keywords
- "addiction recovery app"
- "sobriety tracker" 
- "recovery support"
- "sober living app"
- "addiction help"

#### Secondary Keywords
- "habit tracker recovery"
- "wellness recovery"
- "crisis support app"
- "meeting finder AA NA"
- "sponsor contact app"

### **Visual Assets Required**

#### App Icon Requirements
- 1024x1024px for App Store
- Adaptive icon for Android (108x108dp)
- Focus on recovery symbols (shield, growth, support)

#### Screenshots Strategy
1. **Recovery Dashboard** - Show sobriety counter prominently
2. **Crisis Resources** - Demonstrate immediate help access
3. **Habit Tracking** - Recovery-focused daily routines
4. **Progress Analytics** - Wellness improvement over time
5. **Meeting Finder** - Support group location features

## Monetization for Mobile

### **Freemium Model Optimization**
- **Free Tier**: 15 recovery habits, basic crisis resources, 7-day analytics
- **Premium**: Unlimited habits, advanced analytics, family sharing, priority crisis support
- **Family Plan**: Support for household recovery (partners, family members)

### **In-App Purchases**
- Premium upgrade ($4.99 CAD/month)
- Family plan upgrade ($69.99 CAD/year)
- Crisis support premium features
- Advanced analytics and insights

### **Subscription Management**
- Apple StoreKit integration
- Google Play Billing integration
- Transparent cancellation process
- Recovery-focused retention strategies

## Compliance & Legal

### **Healthcare Compliance**
- **HIPAA Compliance** (US market)
- **PIPEDA Compliance** (Canadian market)
- **Medical Disclaimer** prominently displayed
- **Crisis Resource Liability** protection

### **Content Guidelines**
- No medical treatment claims
- Clear disclaimers about professional help
- Evidence-based content only
- Peer review of recovery content

## Launch Strategy

### **Soft Launch** (Months 1-2)
- Beta testing with recovery organizations
- Feedback collection from treatment centers
- App store optimization based on initial reviews

### **Full Launch** (Month 3)
- Coordinated launch across iOS and Android
- Partnership announcements with treatment centers
- PR campaign focusing on recovery innovation
- Influencer partnerships with recovery advocates

### **Post-Launch** (Months 4-6)
- User feedback integration
- Feature updates based on recovery community needs
- Expansion to additional recovery organization partnerships
- International market exploration

This mobile strategy positions Evolv as the premier recovery-focused wellness app, ready for app store distribution while maintaining compliance with healthcare regulations and recovery community standards.