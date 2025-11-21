import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { dressesAPI } from '@/services/apiMock';
import { Dress } from '@/types';
import { ClientLayout } from '@/components/layouts/ClientLayout';
import { DressCard } from '@/components/client/DressCard';
import { DressModal } from '@/components/client/DressModal';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

export default function Catalog() {
  const [selectedDress, setSelectedDress] = useState<Dress | null>(null);
  const [search, setSearch] = useState('');
  const [categoria, setCategoria] = useState('Todas');

  const { data: dresses, isLoading } = useQuery({
    queryKey: ['dresses', categoria, search],
    queryFn: () => dressesAPI.getAll({ categoria: categoria === 'Todas' ? undefined : categoria, search }),
  });

  return (
    <ClientLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Catálogo de Vestidos</h1>
          <p className="text-muted-foreground">
            Encontre o vestido perfeito para o seu evento especial
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar vestidos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={categoria} onValueChange={setCategoria}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todas">Todas</SelectItem>
              <SelectItem value="Noiva">Noiva</SelectItem>
              <SelectItem value="Madrinha">Madrinha</SelectItem>
              <SelectItem value="Formatura">Formatura</SelectItem>
              <SelectItem value="Debutante">Debutante</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-muted rounded-lg mb-4"></div>
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : dresses && dresses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dresses.map((dress) => (
              <DressCard key={dress.id} dress={dress} onView={setSelectedDress} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhum vestido encontrado com os filtros aplicados.</p>
          </div>
        )}

        <DressModal
          dress={selectedDress}
          open={!!selectedDress}
          onClose={() => setSelectedDress(null)}
        />
      </div>
    </ClientLayout>
  );
}
