import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, RotateCcw, Trash2, AlertTriangle, Clock, User, DollarSign } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
interface DeletedBudget {
  id: string;
  budget_data: any;
  created_at: string;
  deletion_reason?: string;
  can_restore: boolean;
}
interface TrashCardProps {
  item: DeletedBudget;
  onRestore: (budgetId: string) => void;
  onPermanentDelete: (budgetId: string) => void;
  isRestoring: boolean;
  isPermanentDeleting: boolean;
  className?: string;
}
export const TrashCard: React.FC<TrashCardProps> = ({
  item,
  onRestore,
  onPermanentDelete,
  isRestoring,
  isPermanentDeleting,
  className
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  const formatPrice = (price: number) => {
    return (price / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };
  const getDaysUntilDeletion = (createdAt: string) => {
    const createdDate = new Date(createdAt);
    const now = new Date();
    const diffTime = now.getTime() - createdDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, 90 - diffDays);
  };
  const daysLeft = getDaysUntilDeletion(item.created_at);
  const isExpiring = daysLeft <= 7;
  return <Card className={cn("transition-all duration-200 hover:shadow-md", "border-l-4", isExpiring ? "border-l-orange-500" : "border-l-muted", className)}>
      <CardContent className="p-4 md:p-6">
        <div className="space-y-4">
          {/* Header com informações principais */}
          <div className="flex flex-col space-y-3 md:flex-row md:items-start md:justify-between md:space-y-0">
            <div className="flex-1 space-y-3">
              <div className="flex flex-col space-y-2 md:flex-row md:items-center md:gap-3 md:space-y-0">
                <h4 className="font-semibold text-lg leading-tight">
                  {item.budget_data.device_model || 'Dispositivo não informado'}
                </h4>
                <Badge variant="outline" className="text-xs w-fit">
                  {item.budget_data.device_type || 'Tipo não informado'}
                </Badge>
              </div>
              
              <div className="flex flex-col space-y-2 md:grid md:grid-cols-2 md:gap-4 md:space-y-0 text-sm">
                <div className="flex items-center gap-2 font-medium">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span>{formatPrice(item.budget_data.total_price || 0)}</span>
                </div>
                
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{formatDate(item.created_at)}</span>
                </div>
              </div>
            </div>
            
            <Badge variant={isExpiring ? "destructive" : "secondary"} className="whitespace-nowrap w-fit md:ml-4">
              {daysLeft > 0 ? `${daysLeft} dias restantes` : 'Expirando'}
            </Badge>
          </div>


          <Separator />

          {/* Ações e informações de expiração */}
          <div className="flex flex-col space-y-3 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <Button variant="outline" size="sm" onClick={() => onRestore(item.budget_data.id)} disabled={isRestoring || isPermanentDeleting} className="flex items-center justify-center gap-2 w-full sm:w-auto">
                <RotateCcw className={cn("h-4 w-4", isRestoring && "animate-spin")} />
                <span className="hidden sm:inline">{isRestoring ? 'Restaurando...' : 'Restaurar'}</span>
                <span className="sm:hidden">{isRestoring ? 'Restaurando...' : 'Restaurar'}</span>
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" className="flex items-center justify-center gap-2 w-full sm:w-auto" disabled={isRestoring || isPermanentDeleting}>
                    <Trash2 className="h-4 w-4" />
                    <span className="hidden sm:inline">{isPermanentDeleting ? 'Excluindo...' : 'Excluir Permanentemente'}</span>
                    <span className="sm:hidden">{isPermanentDeleting ? 'Excluindo...' : 'Excluir'}</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="w-[95vw] max-w-md">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2 text-base">
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                      Exclusão Permanente
                    </AlertDialogTitle>
                    <AlertDialogDescription className="space-y-2 text-sm">
                      <p><strong>Esta ação não pode ser desfeita!</strong></p>
                      <p>O orçamento será completamente removido da base de dados e não poderá ser recuperado.</p>
                      
                      <div className="mt-4 p-3 bg-muted rounded-lg space-y-1 text-xs">
                        <p><strong>Orçamento:</strong> {item.budget_data.device_model}</p>
                        <p><strong>Cliente:</strong> {item.budget_data.client_name || 'Não informado'}</p>
                        <p><strong>Valor:</strong> {formatPrice(item.budget_data.total_price || 0)}</p>
                      </div>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                    <AlertDialogCancel className="w-full sm:w-auto">Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onPermanentDelete(item.budget_data.id)} className="bg-destructive hover:bg-destructive/90 w-full sm:w-auto" disabled={isPermanentDeleting}>
                      {isPermanentDeleting ? 'Excluindo...' : 'Confirmar Exclusão'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            
            <div className={cn("flex items-center gap-2 text-xs mt-2 md:mt-0", isExpiring ? "text-orange-600" : "text-muted-foreground")}>
              <span className="text-center md:text-left">
                {daysLeft > 0 ? `Exclusão automática em ${daysLeft} dias` : 'Programado para exclusão automática'}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>;
};