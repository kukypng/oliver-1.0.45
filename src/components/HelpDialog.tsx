import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Zap, FileText, Settings, Users, BarChart2, HelpCircle } from 'lucide-react';
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
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-6">
            {helpSections.map((section, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-center">
                  {section.icon}
                  <h3 className="text-lg font-semibold text-foreground">{section.title}</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed pl-8">
                  {section.description}
                </p>
              </div>
            ))}
            
            <div className="border-t pt-6 mt-8">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <HelpCircle className="h-5 w-5 mr-3 text-primary" />
                Perguntas Frequentes
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">Como criar meu primeiro orçamento?</h4>
                  <p className="text-sm text-muted-foreground">Acesse "Novo Orçamento" no menu, preencha os dados do cliente e dispositivo, adicione os serviços e valores desejados.</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">Como compartilhar orçamentos via WhatsApp?</h4>
                  <p className="text-sm text-muted-foreground">Na lista de orçamentos, clique no botão do WhatsApp ao lado do orçamento desejado. O link será enviado automaticamente.</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">Como personalizar minha empresa nos orçamentos?</h4>
                  <p className="text-sm text-muted-foreground">Vá em Configurações, depois Dados da Empresa e preencha suas informações. Elas aparecerão automaticamente em todos os orçamentos.</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">Como acompanhar o faturamento?</h4>
                  <p className="text-sm text-muted-foreground">No Dashboard você vê o resumo do mês atual. Para relatórios detalhados, use a seção de Gestão de Dados.</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">O que significam os status dos orçamentos?</h4>
                  <p className="text-sm text-muted-foreground">Rascunho (em criação), Enviado (compartilhado com cliente), Aprovado (cliente aceitou), Rejeitado (cliente recusou), Concluído (serviço finalizado).</p>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Entendi</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>;
};