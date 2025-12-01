import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { MessageCircle, Send } from 'lucide-react';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { dressesAPI } from '@/services/apiMock';

interface WhatsAppMessageModalProps {
  open: boolean;
  onClose: () => void;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
}

const messageTemplates = {
  catalog: {
    label: '1. Envio de Catálogo',
    content: (clientName: string) => 
      `Olá ${clientName}! 👋\n\nConforme solicitado, aqui está nosso catálogo completo de vestidos! ✨\n\nAcesse pelo link: [link-catalogo]\n\nQualquer dúvida, estou à disposição!\n\nMemirros Noivas 💐`,
  },
  suggestions: {
    label: '2. Sugestões Personalizadas',
    content: (clientName: string, dresses?: string[]) =>
      `Oi ${clientName}! 😊\n\nSeparei alguns vestidos especialmente para você:\n\n${dresses?.map(d => `• ${d}`).join('\n') || '• [Vestido sugerido]'}\n\nGostaria de agendar uma prova?\n\nMemirros Noivas 💐`,
  },
  followup: {
    label: '3. Follow-up Imediato',
    content: (clientName: string) =>
      `Oi ${clientName}! 💕\n\nNotei que você se interessou por um dos nossos vestidos. Gostaria de tirar alguma dúvida ou agendar uma prova?\n\nEstou aqui para ajudar!\n\nMemirros Noivas 💐`,
  },
  reschedule: {
    label: '4. Reagendamento',
    content: (clientName: string) =>
      `Olá ${clientName}! 📅\n\nPrecisamos remarcar sua prova devido a um imprevisto.\n\nPodemos reagendar para [nova data/horário]?\n\nAguardo sua confirmação!\n\nMemirros Noivas 💐`,
  },
  documents: {
    label: '5. Solicitação de Documentos',
    content: (clientName: string) =>
      `Oi ${clientName}! 📄\n\nPara finalizarmos o processo de aluguel, precisamos dos seguintes documentos:\n\n• RG ou CNH\n• CPF\n• Comprovante de residência\n\nPode enviar por aqui mesmo?\n\nMemirros Noivas 💐`,
  },
  adjustments: {
    label: '6. Comunicação sobre Ajustes',
    content: (clientName: string) =>
      `Oi ${clientName}! ✂️\n\nSeu vestido está pronto! Os ajustes ficaram perfeitos.\n\nVocê pode retirar a partir de [data].\n\nQualquer dúvida, estou à disposição!\n\nMemirros Noivas 💐`,
  },
  promotion: {
    label: '7. Notificação de Promoção',
    content: (clientName: string) =>
      `Oi ${clientName}! 🎉\n\nTemos uma promoção especial só para você!\n\n✨ [Detalhes da promoção]\n\nAproveite essa oportunidade única!\n\nMemirros Noivas 💐`,
  },
  confirmation: {
    label: '8. Confirmação Personalizada',
    content: (clientName: string) =>
      `Olá ${clientName}! ✅\n\nSua prova está confirmada para:\n\n📅 Data: [data]\n🕐 Horário: [horário]\n📍 Local: [endereço]\n\nNos vemos em breve!\n\nMemirros Noivas 💐`,
  },
  faq: {
    label: '9. Dúvidas Gerais',
    content: (clientName: string) =>
      `Oi ${clientName}! 📍\n\nEstamos localizados em: [endereço]\n\n🕐 Horário: [horário de funcionamento]\n💰 Valores: a partir de R$ [valor]\n\nPrecisa de mais alguma informação?\n\nMemirros Noivas 💐`,
  },
  thanks: {
    label: '10. Agradecimento',
    content: (clientName: string) =>
      `${clientName}, muito obrigada! 💕\n\nFoi um prazer atendê-la! Esperamos que tenha uma experiência incrível.\n\nConte conosco sempre que precisar!\n\nMemirros Noivas 💐`,
  },
};

export function WhatsAppMessageModal({ 
  open, 
  onClose, 
  clientName, 
  clientPhone,
  clientEmail 
}: WhatsAppMessageModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [message, setMessage] = useState('');
  const [selectedDresses, setSelectedDresses] = useState<string[]>([]);

  const { data: dresses } = useQuery({
    queryKey: ['dresses'],
    queryFn: () => dressesAPI.getAll(),
  });

  const handleTemplateChange = (templateKey: string) => {
    setSelectedTemplate(templateKey);
    const template = messageTemplates[templateKey as keyof typeof messageTemplates];
    if (template) {
      if (templateKey === 'suggestions') {
        setMessage(template.content(clientName, selectedDresses.length > 0 ? selectedDresses : undefined));
      } else {
        setMessage(template.content(clientName));
      }
    }
  };

  const handleDressSelection = (dressName: string) => {
    const updated = selectedDresses.includes(dressName)
      ? selectedDresses.filter(d => d !== dressName)
      : [...selectedDresses, dressName];
    setSelectedDresses(updated);
    
    if (selectedTemplate === 'suggestions') {
      const template = messageTemplates.suggestions;
      setMessage(template.content(clientName, updated.length > 0 ? updated : undefined));
    }
  };

  const handleSend = () => {
    const phoneNumber = clientPhone.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/55${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
    
    toast.success('Mensagem preparada! WhatsApp aberto.', {
      description: `Mensagem para ${clientName}`,
    });
    
    onClose();
    setSelectedTemplate('');
    setMessage('');
    setSelectedDresses([]);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-green-600" />
            Enviar Mensagem WhatsApp
          </DialogTitle>
          <DialogDescription>
            Envie mensagens personalizadas para {clientName} ({clientPhone})
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="template">Selecionar Template</Label>
            <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
              <SelectTrigger id="template">
                <SelectValue placeholder="Escolha um template de mensagem" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(messageTemplates).map(([key, template]) => (
                  <SelectItem key={key} value={key}>
                    {template.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedTemplate === 'suggestions' && dresses && (
            <div className="space-y-2">
              <Label>Vestidos para Sugerir (opcional)</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[200px] overflow-y-auto border rounded-lg p-3">
                {dresses.map((dress) => (
                  <label
                    key={dress.id}
                    className="flex items-center gap-2 cursor-pointer hover:bg-accent p-2 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={selectedDresses.includes(dress.nome)}
                      onChange={() => handleDressSelection(dress.nome)}
                      className="h-4 w-4"
                    />
                    <span className="text-sm">{dress.nome}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="message">Mensagem</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Escreva sua mensagem personalizada aqui..."
              rows={12}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              {message.length} caracteres
            </p>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button 
              onClick={handleSend} 
              disabled={!message.trim()}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <Send className="h-4 w-4 mr-2" />
              Abrir WhatsApp
            </Button>
          </div>

          <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground">
            <p className="font-semibold mb-1">💡 Demonstração</p>
            <p>Esta é uma funcionalidade de demonstração. Ao clicar em "Abrir WhatsApp", a mensagem será preparada e o WhatsApp Web/App será aberto com o número do cliente.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}