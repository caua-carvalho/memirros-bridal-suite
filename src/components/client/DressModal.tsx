import { useState } from 'react';
import { Dress } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { AppointmentForm } from './AppointmentForm';

interface DressModalProps {
  dress: Dress | null;
  open: boolean;
  onClose: () => void;
}

export function DressModal({ dress, open, onClose }: DressModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);

  if (!dress) return null;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % dress.imagens.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + dress.imagens.length) % dress.imagens.length);
  };

  if (showAppointmentForm) {
    return (
      <AppointmentForm
        open={open}
        onClose={() => {
          setShowAppointmentForm(false);
          onClose();
        }}
        dressId={dress.id}
        dressName={dress.nome}
      />
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{dress.nome}</DialogTitle>
          <DialogDescription>
            <Badge variant={dress.disponivel ? 'default' : 'secondary'} className="mt-2">
              {dress.disponivel ? 'Disponível para locação' : 'Indisponível no momento'}
            </Badge>
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="relative aspect-[3/4] bg-muted rounded-lg overflow-hidden">
              <img
                src={dress.imagens[currentImageIndex]}
                alt={`${dress.nome} - Imagem ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
              />
              {dress.imagens.length > 1 && (
                <>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute left-2 top-1/2 -translate-y-1/2"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={nextImage}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>

            {dress.imagens.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto">
                {dress.imagens.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-colors ${
                      idx === currentImageIndex ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">Descrição</h3>
              <p className="text-muted-foreground">{dress.descricao}</p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Categoria</h3>
              <p className="text-muted-foreground">{dress.categoria}</p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Tamanhos Disponíveis</h3>
              <div className="flex gap-2 flex-wrap">
                {dress.tamanhos.map((tamanho) => (
                  <Badge key={tamanho} variant="outline">
                    {tamanho}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="text-3xl font-bold text-primary mb-4">
                R$ {dress.precoAluguel.toLocaleString('pt-BR')}
              </p>
              <Button
                onClick={() => setShowAppointmentForm(true)}
                className="w-full"
                size="lg"
                disabled={!dress.disponivel}
              >
                <Calendar className="h-4 w-4 mr-2" />
                {dress.disponivel ? 'Agendar Prova' : 'Indisponível'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
