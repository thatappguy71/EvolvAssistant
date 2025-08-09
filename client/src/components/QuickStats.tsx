interface QuickStatsProps {
  stats?: {
    currentStreak: number;
    habitsCompletedToday: number;
    totalHabitsToday: number;
    wellnessScore: number;
    weeklyProgress: number;
  };
}

export default function QuickStats({ stats }: QuickStatsProps) {
  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  const completionPercentage = stats.totalHabitsToday > 0 
    ? Math.round((stats.habitsCompletedToday / stats.totalHabitsToday) * 100)
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Current Streak</p>
            <p className="text-3xl font-bold text-gray-900">{stats.currentStreak}</p>
            <p className="text-sm text-secondary mt-1">
              {stats.currentStreak > 0 ? 'Keep it up!' : 'Start today!'}
            </p>
          </div>
          <div className="text-3xl" style={{ filter: 'drop-shadow(0 0 6px #F59E0B)' }}>
            <i className="fas fa-fire text-orange-500"></i>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Habits Completed</p>
            <p className="text-3xl font-bold text-gray-900">
              {stats.habitsCompletedToday}/{stats.totalHabitsToday}
            </p>
            <p className="text-sm text-secondary mt-1">{completionPercentage}% completion</p>
          </div>
          <div className="text-3xl">
            <i className="fas fa-check-circle text-secondary"></i>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Wellness Score</p>
            <p className="text-3xl font-bold text-gray-900">{stats.wellnessScore}</p>
            <p className="text-sm text-secondary mt-1">
              {stats.wellnessScore >= 8 ? 'Excellent' : stats.wellnessScore >= 6 ? 'Good' : 'Needs attention'}
            </p>
          </div>
          <div className="text-3xl">
            <i className="fas fa-heart text-red-500"></i>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Weekly Goal</p>
            <p className="text-3xl font-bold text-gray-900">{stats.weeklyProgress}%</p>
            <p className="text-sm text-secondary mt-1">
              {stats.weeklyProgress >= 80 ? 'On track' : 'Keep pushing'}
            </p>
          </div>
          <div className="text-3xl">
            <i className="fas fa-target text-accent"></i>
          </div>
        </div>
      </div>
    </div>
  );
}
