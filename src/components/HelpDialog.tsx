import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Zap, FileText, Settings, Users, BarChart2 } from 'lucide-react';
interface HelpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
const helpSections = [{
  icon: <BarChart2 className="h-5 w-5 mr-3 text-primary" />,
  title: 'Dashboard',
  description: 'Aqui você tem uma visão geral do seu negócio. Acompanhe o faturamento, ticket médio, orçamentos recentes e outras métricas importantes para tomar decisões inteligentes.'
}, {
  icon: <FileText className="h-5 w-5 mr-3 text-primary" />,
  title: 'Orçamentos',
  description: 'Nesta seção, você pode visualizar todos os seus orçamentos, filtrar por status, editar, gerar PDF e compartilhar com seus clientes via WhatsApp. Mantenha tudo organizado e acessível.'
}, {
  icon: <Zap className="h-5 w-5 mr-3 text-primary" />,
  title: 'Novo Orçamento',
  description: 'Crie orçamentos de forma rápida e profissional. Preencha as informações do dispositivo, serviço, valores e observações. Ao finalizar, você pode gerar um PDF ou compartilhar diretamente.'
}, {
  icon: <Users className="h-5 w-5 mr-3 text-primary" />,
  title: 'Clientes',
  description: 'Gerencie sua base de clientes. Cadastre novos clientes, edite informações e tenha um histórico de todos os orçamentos associados a cada um deles.'
}, {
  icon: <Settings className="h-5 w-5 mr-3 text-primary" />,
  title: 'Configurações',
  description: 'Personalize o aplicativo de acordo com suas necessidades. Configure informações da sua empresa, logotipo, termos de garantia e condições de pagamento que aparecerão nos seus orçamentos.'
}];
export const HelpDialog = ({
  open,
  onOpenChange
}: HelpDialogProps) => {
  return <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Como usar o Oliver?</DialogTitle>
          <DialogDescription>
            Um guia rápido para você aproveitar ao máximo todas as funcionalidades.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center text-center py-8 space-y-4">
            <div className="text-6xl mb-4">🍪</div>
            <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">
                    Sistema de Ajuda em Desenvolvimento
                </h3>
                <p className="text-muted-foreground max-w-md">
                    Desculpe, estamos trabalhando duro para criar o sistema de ajuda. Enquanto isso, você aceita um cookie? 🍪
                </p>
                
            </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Entendi</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>;
};