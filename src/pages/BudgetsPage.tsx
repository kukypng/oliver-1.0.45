import React from 'react';
import { AuthGuard } from '@/components/AuthGuard';
import { LayoutProvider } from '@/contexts/LayoutContext';
import { AdaptiveLayout } from '@/components/adaptive/AdaptiveLayout';
import { BudgetsContent } from '@/components/BudgetsContent';

export const BudgetsPage = () => {
  return (
    <AuthGuard>
      <LayoutProvider>
        <AdaptiveLayout activeTab="budgets" onTabChange={() => {}}>
          <BudgetsContent />
        </AdaptiveLayout>
      </LayoutProvider>
    </AuthGuard>
  );
};