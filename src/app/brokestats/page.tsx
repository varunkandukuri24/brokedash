'use client'

import React from 'react';
import { useUser } from '@/contexts/UserContext';
import HistogramChart from '@/components/HistogramChart';
import Leaderboard from '@/components/Leaderboard';
import NounsBox from '@/components/NounsBox';
import ProtectedRoute from '@/components/ProtectedRoute';

const BrokeStats: React.FC = () => {
  const { user, loading } = useUser();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col lg:flex-row p-4 pt-16 bg-lightAccent mt-4">
        <div className="w-full lg:w-1/2 mb-2 lg:mb-0 lg:pr-4 flex flex-col">
          <Leaderboard />
        </div>
        <div className="w-full lg:w-1/2 flex flex-col lg:pl-4 space-y-2">
          <div className="flex-grow">
            <HistogramChart />
          </div>
          <div className="flex-shrink-0">
            <NounsBox />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default BrokeStats;
