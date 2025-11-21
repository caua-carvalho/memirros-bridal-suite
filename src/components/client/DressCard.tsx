import { Dress } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye } from 'lucide-react';

interface DressCardProps {
  dress: Dress;
  onView: (dress: Dress) => void;
}

export function DressCard({ dress, onView }: DressCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-[3/4] overflow-hidden bg-muted">
        <img
          src={dress.imagens[0]}
          alt={dress.nome}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg text-foreground">{dress.nome}</h3>
          <Badge variant={dress.disponivel ? 'default' : 'secondary'}>
            {dress.disponivel ? 'Disponível' : 'Alugado'}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mb-2">{dress.categoria}</p>
        <p className="text-xl font-bold text-primary">
          R$ {dress.precoAluguel.toLocaleString('pt-BR')}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button onClick={() => onView(dress)} className="w-full" variant="outline">
          <Eye className="h-4 w-4 mr-2" />
          Ver Detalhes
        </Button>
      </CardFooter>
    </Card>
  );
}
