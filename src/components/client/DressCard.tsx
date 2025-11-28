import { Dress } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Heart, Sparkles } from 'lucide-react';

interface DressCardProps {
  dress: Dress;
  onView: (dress: Dress) => void;
}

export function DressCard({ dress, onView }: DressCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 group border-0 bg-card">
      <div className="aspect-[3/4] overflow-hidden bg-gradient-to-br from-muted/30 to-muted/50 relative">
        <img
          src={dress.imagens[0]}
          alt={dress.nome}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <Badge 
          variant={dress.disponivel ? 'default' : 'secondary'}
          className="absolute top-4 right-4 shadow-lg backdrop-blur-sm"
        >
          {dress.disponivel ? '✓ Disponível' : 'Indisponível'}
        </Badge>

        {dress.disponivel && (
          <Button
            size="icon"
            variant="secondary"
            className="absolute top-4 left-4 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
          >
            <Heart className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <CardContent className="p-5 space-y-4">
        <div>
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-bold text-xl text-foreground leading-tight group-hover:text-primary transition-colors">
              {dress.nome}
            </h3>
            <Sparkles className="h-5 w-5 text-primary flex-shrink-0 ml-2" />
          </div>
          <p className="text-sm text-muted-foreground font-medium">{dress.categoria}</p>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-primary">
            R$ {dress.precoAluguel.toLocaleString('pt-BR')}
          </span>
          <span className="text-sm text-muted-foreground">/dia</span>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={() => onView(dress)} 
            variant="outline"
            className="flex-1 h-11 text-base font-semibold transition-all"
            disabled={!dress.disponivel}
          >
            <Eye className="h-5 w-5 mr-2" />
            Ver Detalhes
          </Button>
        </div>

        {dress.disponivel && (
          <Button
            onClick={() => onView(dress)}
            size="lg"
            className="w-full h-12 text-base font-bold shadow-lg hover:shadow-xl transition-all"
          >
             Garanta Este Vestido
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
