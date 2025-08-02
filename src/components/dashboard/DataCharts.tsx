import React from 'react';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import type { Application, ApplicationStatus } from '../../types';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
);

interface DataChartsProps {
  applications: Application[];
  isLoading?: boolean;
}

interface ChartContainerProps {
  title: string;
  description: string;
  children: React.ReactNode;
  delay?: number;
}

const ChartContainer: React.FC<ChartContainerProps> = ({ 
  title, 
  description, 
  children, 
  delay = 0 
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="bg-white rounded-xl p-6 shadow-soft"
  >
    <div className="mb-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
    <div className="h-80">
      {children}
    </div>
  </motion.div>
);

const LoadingSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="bg-white rounded-xl p-6 shadow-soft animate-pulse">
        <div className="mb-4">
          <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="h-80 bg-gray-100 rounded"></div>
      </div>
    ))}
  </div>
);

export const DataCharts: React.FC<DataChartsProps> = ({ 
  applications, 
  isLoading = false 
}) => {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  // Application Status Distribution
  const statusCounts = applications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {} as Record<ApplicationStatus, number>);

  const statusLabels = Object.keys(statusCounts).map(status => 
    status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
  );

  const statusColors = {
    draft: '#9CA3AF',
    in_progress: '#3B82F6',
    submitted: '#F59E0B',
    under_review: '#F97316',
    interview_scheduled: '#8B5CF6',
    accepted: '#10B981',
    rejected: '#EF4444',
    waitlisted: '#F59E0B',
    deferred: '#6366F1',
    withdrawn: '#6B7280',
  };

  const doughnutData = {
    labels: statusLabels,
    datasets: [
      {
        data: Object.values(statusCounts),
        backgroundColor: Object.keys(statusCounts).map(status => 
          statusColors[status as keyof typeof statusColors] || '#9CA3AF'
        ),
        borderWidth: 2,
        borderColor: '#ffffff',
        hoverBorderWidth: 3,
      },
    ],
  };

  // Application Timeline (submissions over time)
  const getMonthlySubmissions = () => {
    const monthlyData: Record<string, number> = {};
    
    applications.forEach(app => {
      if (app.submittedAt) {
        const month = new Date(app.submittedAt).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short' 
        });
        monthlyData[month] = (monthlyData[month] || 0) + 1;
      }
    });

    // Fill in missing months for the last 6 months
    const months = [];
    const counts = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short' 
      });
      months.push(monthKey);
      counts.push(monthlyData[monthKey] || 0);
    }

    return { months, counts };
  };

  const { months, counts } = getMonthlySubmissions();

  const lineData = {
    labels: months,
    datasets: [
      {
        label: 'Applications Submitted',
        data: counts,
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        pointBackgroundColor: '#3B82F6',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // University Applications by Type
  const getUniversityTypes = () => {
    // This would normally come from university data
    // For now, we'll create mock data based on application count
    const typeDistribution = {
      'Public Universities': Math.floor(applications.length * 0.4),
      'Private Universities': Math.floor(applications.length * 0.35),
      'Community Colleges': Math.floor(applications.length * 0.15),
      'Online Programs': Math.floor(applications.length * 0.1),
    };
    
    return typeDistribution;
  };

  const universityTypes = getUniversityTypes();

  const barData = {
    labels: Object.keys(universityTypes),
    datasets: [
      {
        label: 'Applications',
        data: Object.values(universityTypes),
        backgroundColor: [
          '#3B82F6',
          '#10B981',
          '#F59E0B',
          '#8B5CF6',
        ],
        borderColor: [
          '#2563EB',
          '#059669',
          '#D97706',
          '#7C3AED',
        ],
        borderWidth: 1,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  // Acceptance Rate Analysis
  const getAcceptanceData = () => {
    const acceptedCount = applications.filter(app => app.status === 'accepted').length;
    const rejectedCount = applications.filter(app => app.status === 'rejected').length;
    const submittedCount = applications.filter(app => 
      ['submitted', 'under_review', 'interview_scheduled', 'accepted', 'rejected', 'waitlisted', 'deferred'].includes(app.status)
    ).length;

    const acceptanceRate = submittedCount > 0 ? (acceptedCount / submittedCount) * 100 : 0;
    const rejectionRate = submittedCount > 0 ? (rejectedCount / submittedCount) * 100 : 0;
    const pendingRate = 100 - acceptanceRate - rejectionRate;

    return {
      accepted: acceptanceRate,
      rejected: rejectionRate,
      pending: pendingRate,
    };
  };

  const acceptanceData = getAcceptanceData();

  const acceptanceChartData = {
    labels: ['Accepted', 'Pending', 'Rejected'],
    datasets: [
      {
        data: [acceptanceData.accepted, acceptanceData.pending, acceptanceData.rejected],
        backgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
        borderWidth: 2,
        borderColor: '#ffffff',
        hoverBorderWidth: 3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
      },
    },
  };

  const barOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          color: '#6B7280',
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        ticks: {
          color: '#6B7280',
        },
        grid: {
          display: false,
        },
      },
    },
  };

  const lineOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          color: '#6B7280',
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        ticks: {
          color: '#6B7280',
        },
        grid: {
          display: false,
        },
      },
    },
    elements: {
      point: {
        hoverBackgroundColor: '#3B82F6',
      },
    },
  };

  if (applications.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-soft">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h3>
          <p className="text-gray-500">Start submitting applications to see your analytics</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ChartContainer
        title="Application Status"
        description="Distribution of your application statuses"
        delay={0}
      >
        <Doughnut data={doughnutData} options={chartOptions} />
      </ChartContainer>

      <ChartContainer
        title="Submission Timeline"
        description="Applications submitted over the last 6 months"
        delay={0.1}
      >
        <Line data={lineData} options={lineOptions} />
      </ChartContainer>

      <ChartContainer
        title="University Types"
        description="Applications by institution type"
        delay={0.2}
      >
        <Bar data={barData} options={barOptions} />
      </ChartContainer>

      <ChartContainer
        title="Acceptance Analysis"
        description="Your current acceptance rate"
        delay={0.3}
      >
        <Doughnut data={acceptanceChartData} options={chartOptions} />
      </ChartContainer>
    </div>
  );
};

export default DataCharts;