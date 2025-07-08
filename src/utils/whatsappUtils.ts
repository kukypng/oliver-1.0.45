interface BudgetData {
  id: string;
  device_model: string;
  part_type: string;
  brand?: string;
  cash_price: number;
  installment_price?: number;
  installments?: number;
  warranty_months: number;
  includes_delivery: boolean;
  includes_screen_protector: boolean;
  created_at: string;
  valid_until: string;
}

export const generateWhatsAppMessage = (budget: BudgetData): string => {
  const createdDate = new Date(budget.created_at).toLocaleDateString('pt-BR');
  const validUntil = new Date(budget.valid_until).toLocaleDateString('pt-BR');
  
  const cashPrice = (budget.cash_price / 100).toLocaleString('pt-BR', { 
    minimumFractionDigits: 2,
    maximumFractionDigits: 2 
  });
  
  let priceSection = `À vista: R$ ${cashPrice}`;
  
  if (budget.installment_price && budget.installments && budget.installments > 1) {
    const installmentPrice = (budget.installment_price / 100).toLocaleString('pt-BR', { 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 
    });
    priceSection += `\nParcelado: R$ ${installmentPrice} em até ${budget.installments}x no cartão`;
  }

  const warrantyText = budget.warranty_months === 1 
    ? `${budget.warranty_months} mês` 
    : `${budget.warranty_months} meses`;

  let additionalServices = '';
  if (budget.includes_delivery || budget.includes_screen_protector) {
    additionalServices = '\n';
    if (budget.includes_delivery) {
      additionalServices += '\n* Buscamos e entregamos o seu aparelho';
    }
    if (budget.includes_screen_protector) {
      additionalServices += '\n* Película 3D de brinde';
    }
  }

  let serviceSpecification = '';
  if (budget.brand && budget.brand.trim()) {
    serviceSpecification = `\nEspecificação: ${budget.brand}`;
  }

  const message = `*Criado em: ${createdDate} | Válido até: ${validUntil}*

*ORÇAMENTO*
Aparelho: *${budget.device_model}*

*PREÇOS*
${priceSection}

*DETALHES*
Serviço: ${budget.part_type}
Obs: ${serviceSpecification}
Garantia de: ${warrantyText}

*Garantia não cobre quebrado ou molhado*${additionalServices}`;

  return message;
};

export const shareViaWhatsApp = (message: string) => {
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
  window.open(whatsappUrl, '_blank');
};

export const sharePDFViaWhatsApp = async (pdfBlob: Blob, message: string) => {
  try {
    // Verificar se a Web Share API está disponível
    if (navigator.share && navigator.canShare) {
      const file = new File([pdfBlob], 'orcamento.pdf', { type: 'application/pdf' });
      
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'Orçamento',
          text: message,
          files: [file]
        });
        return;
      }
    }

    // Fallback: criar URL temporária para download e abrir WhatsApp
    const pdfUrl = URL.createObjectURL(pdfBlob);
    const downloadLink = document.createElement('a');
    downloadLink.href = pdfUrl;
    downloadLink.download = `orcamento-${new Date().toISOString().split('T')[0]}.pdf`;
    downloadLink.style.display = 'none';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    // Aguardar um pouco e abrir WhatsApp
    setTimeout(() => {
      const encodedMessage = encodeURIComponent(`${message}\n\n `);
      const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
      window.open(whatsappUrl, '_blank');
      URL.revokeObjectURL(pdfUrl);
    }, 1000);
    
  } catch (error) {
    console.error('Erro ao compartilhar PDF:', error);
    // Fallback para o método tradicional
    shareViaWhatsApp(message);
  }
};
