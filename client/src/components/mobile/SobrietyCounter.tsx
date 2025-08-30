import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Award, TrendingUp } from 'lucide-react';

interface SobrietyCounterProps {
  sobrietyDate?: string; // ISO date string when sobriety began
}

export default function SobrietyCounter({ sobrietyDate }: SobrietyCounterProps) {
  const [timeElapsed, setTimeElapsed] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    if (!sobrietyDate) return;

    const updateCounter = () => {
      const start = new Date(sobrietyDate);
      const now = new Date();
      const diff = now.getTime() - start.getTime();

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeElapsed({ days, hours, minutes, seconds });
    };

    updateCounter();
    const interval = setInterval(updateCounter, 1000);

    return () => clearInterval(interval);
  }, [sobrietyDate]);

  const getMilestone = (days: number) => {
    if (days >= 365) return { text: `${Math.floor(days / 365)} Year${Math.floor(days / 365) > 1 ? 's' : ''}`, color: 'bg-purple-100 text-purple-800' };
    if (days >= 90) return { text: '3+ Months', color: 'bg-blue-100 text-blue-800' };
    if (days >= 30) return { text: '1+ Month', color: 'bg-green-100 text-green-800' };
    if (days >= 7) return { text: '1+ Week', color: 'bg-yellow-100 text-yellow-800' };
    if (days >= 1) return { text: 'Getting Started', color: 'bg-orange-100 text-orange-800' };
    return { text: 'Day One', color: 'bg-red-100 text-red-800' };
  };

  if (!sobrietyDate) {
    return (
      <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
        <CardContent className="p-6 text-center">
          <Calendar className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            Track Your Recovery Journey
          </h3>
          <p className="text-green-700 text-sm">
            Set your sobriety date to begin tracking your progress
          </p>
        </CardContent>
      </Card>
    );
  }

  const milestone = getMilestone(timeElapsed.days);

  return (
    <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
      <CardHeader className="text-center pb-2">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Award className="h-6 w-6 text-green-600" />
          <CardTitle className="text-green-800">Recovery Progress</CardTitle>
        </div>
        <Badge className={milestone.color}>
          {milestone.text}
        </Badge>
      </CardHeader>
      <CardContent className="text-center">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div>
            <div className="text-2xl font-bold text-green-600">{timeElapsed.days}</div>
            <div className="text-xs text-green-700">Days</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">{timeElapsed.hours}</div>
            <div className="text-xs text-green-700">Hours</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">{timeElapsed.minutes}</div>
            <div className="text-xs text-green-700">Minutes</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">{timeElapsed.seconds}</div>
            <div className="text-xs text-green-700">Seconds</div>
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-sm text-green-700 font-medium">
            Every moment counts. You're doing amazing! 💪
          </p>
        </div>
      </CardContent>
    </Card>
  );
}