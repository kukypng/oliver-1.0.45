import React, { useState, useEffect } from 'react';
import { AuthGuard } from '@/components/AuthGuard';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useIOSOptimizations } from '@/hooks/useIOSOptimizations';
import { 
  Search, 
  Plus, 
  Filter, 
  MoreVertical,
  Calendar,
  DollarSign,
  User,
  Phone,
  Eye,
  Edit,
  Trash2,
  Share,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/EmptyState';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const BudgetsPage = () => {
  useIOSOptimizations();
  const { user, profile } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedBudgets, setSelectedBudgets] = useState<string[]>([]);
  const [showQuickActions, setShowQuickActions] = useState(false);

  // Fetch budgets
  const { data: budgets = [], isLoading, error, refetch } = useQuery({
    queryKey: ['budgets', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .eq('owner_id', user.id)
        .is('deleted_at', null)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  // Filter budgets
  const filteredBudgets = budgets.filter(budget => {
    const matchesSearch = budget.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         budget.device_type?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedFilter === 'all') return matchesSearch;
    if (selectedFilter === 'pending') return matchesSearch && budget.workflow_status === 'pending';
    if (selectedFilter === 'approved') return matchesSearch && budget.workflow_status === 'approved';
    if (selectedFilter === 'rejected') return matchesSearch && budget.workflow_status === 'rejected';
    
    return matchesSearch;
  });

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'approved':
        return { color: 'bg-green-500/10 text-green-600 border-green-500/20', icon: CheckCircle2, label: 'Aprovado' };
      case 'rejected':
        return { color: 'bg-red-500/10 text-red-600 border-red-500/20', icon: XCircle, label: 'Rejeitado' };
      default:
        return { color: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20', icon: Clock, label: 'Pendente' };
    }
  };

  const stats = {
    total: budgets.length,
    approved: budgets.filter(b => b.workflow_status === 'approved').length,
    pending: budgets.filter(b => b.workflow_status === 'pending').length,
    rejected: budgets.filter(b => b.workflow_status === 'rejected').length,
    totalValue: budgets.reduce((acc, b) => acc + (parseFloat(String(b.total_price || 0))), 0)
  };

  if (!user) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <EmptyState 
            icon={User} 
            title="Faça login para continuar" 
            description="Você precisa estar logado para ver seus orçamentos." 
          />
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/20">
        {/* iOS Safe Area Header */}
        <div className="pt-safe-top">
          {/* Modern Header */}
          <div className="bg-background/80 backdrop-blur-xl border-b border-border/50 sticky top-safe-top z-50">
            <div className="px-4 py-4">
              {/* Top Section */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    Orçamentos
                  </h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    {stats.total} {stats.total === 1 ? 'orçamento' : 'orçamentos'}
                  </p>
                </div>
                <Button 
                  size="sm" 
                  className="rounded-full h-10 w-10 p-0 shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => setShowQuickActions(!showQuickActions)}
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                <motion.div 
                  className="bg-card/50 backdrop-blur-sm rounded-xl p-3 border border-border/50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-xs text-muted-foreground mb-1">Total</div>
                  <div className="text-sm font-semibold">{stats.total}</div>
                </motion.div>
                
                <motion.div 
                  className="bg-green-500/5 backdrop-blur-sm rounded-xl p-3 border border-green-500/20"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-xs text-green-600/70 mb-1">Aprovados</div>
                  <div className="text-sm font-semibold text-green-600">{stats.approved}</div>
                </motion.div>
                
                <motion.div 
                  className="bg-yellow-500/5 backdrop-blur-sm rounded-xl p-3 border border-yellow-500/20"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-xs text-yellow-600/70 mb-1">Pendentes</div>
                  <div className="text-sm font-semibold text-yellow-600">{stats.pending}</div>
                </motion.div>
                
                <motion.div 
                  className="bg-primary/5 backdrop-blur-sm rounded-xl p-3 border border-primary/20"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-xs text-primary/70 mb-1">Valor</div>
                  <div className="text-xs font-semibold text-primary">
                    R$ {stats.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                  </div>
                </motion.div>
              </div>

              {/* Search and Filter */}
              <div className="flex gap-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar orçamentos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 rounded-full border-border/50 bg-muted/20 backdrop-blur-sm ios-input"
                  />
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="rounded-full px-4 ios-button"
                  onClick={() => {/* Open filter modal */}}
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </div>

              {/* Filter Chips */}
              <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
                {[
                  { key: 'all', label: 'Todos', count: stats.total },
                  { key: 'pending', label: 'Pendentes', count: stats.pending },
                  { key: 'approved', label: 'Aprovados', count: stats.approved },
                  { key: 'rejected', label: 'Rejeitados', count: stats.rejected }
                ].map((filter) => (
                  <motion.button
                    key={filter.key}
                    className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      selectedFilter === filter.key
                        ? 'bg-primary text-primary-foreground shadow-lg'
                        : 'bg-muted/50 text-muted-foreground hover:bg-muted/80'
                    }`}
                    onClick={() => setSelectedFilter(filter.key)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {filter.label} {filter.count > 0 && `(${filter.count})`}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-4 py-6 pb-safe-bottom">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-card/50 rounded-2xl p-4 border border-border/50 animate-pulse">
                    <div className="h-4 bg-muted/50 rounded w-3/4 mb-3"></div>
                    <div className="h-3 bg-muted/30 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-muted/30 rounded w-1/3"></div>
                  </div>
                ))}
              </div>
            ) : filteredBudgets.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-12"
              >
                <EmptyState
                  icon={searchTerm ? Search : TrendingUp}
                  title={searchTerm ? "Nenhum resultado encontrado" : "Nenhum orçamento ainda"}
                  description={
                    searchTerm 
                      ? `Não encontramos orçamentos com "${searchTerm}"`
                      : "Comece criando seu primeiro orçamento"
                  }
                  action={{
                    label: searchTerm ? "Limpar busca" : "Criar orçamento",
                    onClick: () => searchTerm ? setSearchTerm('') : console.log('Create budget')
                  }}
                />
              </motion.div>
            ) : (
              <AnimatePresence mode="popLayout">
                <div className="space-y-3">
                  {filteredBudgets.map((budget, index) => {
                    const statusConfig = getStatusConfig(budget.workflow_status);
                    const StatusIcon = statusConfig.icon;
                    
                    return (
                      <motion.div
                        key={budget.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ delay: index * 0.05 }}
                        className="group"
                      >
                        <Card className="bg-card/50 backdrop-blur-sm border-border/50 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 ios-card">
                          <div className="p-4">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                                  {budget.client_name || 'Cliente não informado'}
                                </h3>
                                <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                                  {budget.device_type || 'Serviço não informado'}
                                </p>
                              </div>
                              <Badge className={`${statusConfig.color} flex items-center gap-1 text-xs px-2 py-1`}>
                                <StatusIcon className="h-3 w-3" />
                                {statusConfig.label}
                              </Badge>
                            </div>

                            {/* Details */}
                            <div className="grid grid-cols-2 gap-3 mb-4">
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <DollarSign className="h-4 w-4 text-green-600" />
                                <span className="font-medium text-green-600">
                                  R$ {parseFloat(String(budget.total_price || 0)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>
                                  {format(new Date(budget.created_at), "dd/MM/yy", { locale: ptBR })}
                                </span>
                              </div>
                            </div>

                            {/* Contact */}
                            {budget.client_phone && (
                              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                                <Phone className="h-4 w-4" />
                                <span>{budget.client_phone}</span>
                              </div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-2">
                              <Button size="sm" variant="ghost" className="flex-1 rounded-xl h-9 ios-button">
                                <Eye className="h-4 w-4 mr-2" />
                                Ver
                              </Button>
                              <Button size="sm" variant="ghost" className="flex-1 rounded-xl h-9 ios-button">
                                <Share className="h-4 w-4 mr-2" />
                                Enviar
                              </Button>
                              <Button size="sm" variant="ghost" className="rounded-xl h-9 px-3 ios-button">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </AnimatePresence>
            )}
          </div>
        </div>

        {/* Quick Actions FAB */}
        <AnimatePresence>
          {showQuickActions && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed bottom-safe-bottom right-4 z-50"
            >
              <div className="bg-card/90 backdrop-blur-xl rounded-2xl p-4 border border-border/50 shadow-2xl">
                <div className="space-y-3">
                  <Button className="w-full justify-start rounded-xl ios-button">
                    <Plus className="h-4 w-4 mr-3" />
                    Novo Orçamento
                  </Button>
                  <Button variant="outline" className="w-full justify-start rounded-xl ios-button">
                    <Search className="h-4 w-4 mr-3" />
                    Busca Avançada
                  </Button>
                  <Button variant="outline" className="w-full justify-start rounded-xl ios-button">
                    <TrendingUp className="h-4 w-4 mr-3" />
                    Relatórios
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Backdrop for Quick Actions */}
        <AnimatePresence>
          {showQuickActions && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              onClick={() => setShowQuickActions(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </AuthGuard>
  );
};