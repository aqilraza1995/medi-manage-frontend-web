'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import PlanForm from '@/features/Plan/PlanForm';

export default function AddPlanPage() {
  return (
    <DashboardLayout>
      <PlanForm />
    </DashboardLayout>
  );
}
