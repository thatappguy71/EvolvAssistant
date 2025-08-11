import { useQuery } from "@tanstack/react-query";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

export default function AnalyticsCharts() {
  const { data: recentMetrics = [] } = useQuery({
    queryKey: ['/api/metrics/recent'],
    queryFn: async () => {
      const response = await fetch('/api/metrics/recent?days=7', {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch recent metrics');
      return response.json();
    },
  });

  const { data: stats } = useQuery({
    queryKey: ['/api/dashboard/stats'],
  });

  // Prepare data for habit completion trends
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  });

  const habitTrendsData = {
    labels: last7Days,
    datasets: [{
      label: 'Completion %',
      data: [80, 90, 75, 85, 95, 70, 85],
      borderColor: 'hsl(203.8863, 88.2845%, 53.1373%)',
      backgroundColor: 'hsla(203.8863, 88.2845%, 53.1373%, 0.1)',
      fill: true,
      tension: 0.4
    }]
  };

  // Prepare data for wellness score history
  const wellnessData = {
    labels: recentMetrics.slice(0, 4).reverse().map((_: any, i: number) => `Week ${i + 1}`),
    datasets: [{
      label: 'Wellness Score',
      data: recentMetrics.slice(0, 4).reverse().map((metric: any) => 
        ((metric.energy + metric.focus + metric.mood + metric.productivity + metric.sleepQuality) / 5).toFixed(1)
      ),
      borderColor: 'hsl(159.7826, 100%, 36.0784%)',
      backgroundColor: 'hsla(159.7826, 100%, 36.0784%, 0.1)',
      fill: true,
      tension: 0.4
    }]
  };

  // Weekly progress doughnut data
  const weeklyProgressData = {
    labels: ['Completed', 'Remaining'],
    datasets: [{
      data: [75, 25],
      backgroundColor: ['hsl(159.7826, 100%, 36.0784%)', 'hsl(210, 5.2632%, 90%)'],
      borderWidth: 0
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    cutout: '70%'
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Habit Completion Trends */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Habit Completion Trends</h3>
          <select className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
          </select>
        </div>
        <div className="h-48">
          <Line data={habitTrendsData} options={chartOptions} />
        </div>
      </div>
      
      {/* Wellness Score History */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Wellness Score History</h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Current:</span>
            <span className="text-lg font-bold text-secondary dark:text-secondary">
              8.2
            </span>
          </div>
        </div>
        <div className="h-48">
          {recentMetrics.length > 0 ? (
            <Line data={wellnessData} options={chartOptions} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
              <div className="text-center">
                <i className="fas fa-chart-line text-4xl mb-2"></i>
                <p>No data available yet</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
