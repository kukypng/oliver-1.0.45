
// This component has been replaced by the new unified deletion system
// using src/hooks/useBudgetDeletion.ts and src/components/budgets/DeleteBudgetDialog.tsx
// 
// If you need to access this component for any reason, you can find the new implementation
// in the DeleteBudgetDialog component which provides better functionality including:
// - Soft delete with audit trail
// - Better error handling
// - Improved UX with restoration capabilities
// - Unified deletion logic

export const DeleteBudgetConfirm = () => {
  console.warn('DeleteBudgetConfirm is deprecated. Use DeleteBudgetDialog instead.');
  return null;
};
