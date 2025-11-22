import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { dressesAPI } from '@/services/apiMock';
import { Dress } from '@/types';
import { ClientLayout } from '@/components/layouts/ClientLayout';
import { DressCard } from '@/components/client/DressCard';
import { DressModal } from '@/components/client/DressModal';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Catalog() {
  const [selectedDress, setSelectedDress] = useState<Dress | null>(null);
  const [search, setSearch] = useState('');
  const [categoria, setCategoria] = useState('Todas');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [showFilters, setShowFilters] = useState(false);

  const { data: allDresses, isLoading } = useQuery({
    queryKey: ['dresses'],
    queryFn: () => dressesAPI.getAll(),
  });

  const filteredDresses = allDresses?.filter(dress => {
    const matchesSearch = dress.nome.toLowerCase().includes(search.toLowerCase()) ||
      dress.descricao.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoria === 'Todas' || dress.categoria === categoria;
    const matchesPrice = dress.precoAluguel >= priceRange[0] && dress.precoAluguel <= priceRange[1];
    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <ClientLayout>
      <div className="space-y-6">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Encontre o Vestido dos Seus Sonhos
          </h1>
          <p className="text-lg text-muted-foreground">
            Descubra nossa coleção exclusiva de vestidos para o seu momento especial
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Buscar vestidos por nome ou descrição..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>
          <Button
            variant="outline"
            className="md:w-auto h-12"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="h-5 w-5 mr-2" />
            Filtros
            {(categoria !== 'Todas' || priceRange[0] > 0 || priceRange[1] < 5000) && (
              <Badge variant="default" className="ml-2">
                {[categoria !== 'Todas', priceRange[0] > 0 || priceRange[1] < 5000].filter(Boolean).length}
              </Badge>
            )}
          </Button>
        </div>

        {showFilters && (
          <div className="grid md:grid-cols-2 gap-6 p-6 border rounded-lg bg-card">
            <div className="space-y-3">
              <label className="text-sm font-medium">Categoria</label>
              <Select value={categoria} onValueChange={setCategoria}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todas">Todas as Categorias</SelectItem>
                  <SelectItem value="Noiva">Noiva</SelectItem>
                  <SelectItem value="Madrinha">Madrinha</SelectItem>
                  <SelectItem value="Formatura">Formatura</SelectItem>
                  <SelectItem value="Debutante">Debutante</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium">
                Faixa de Preço: R$ {priceRange[0]} - R$ {priceRange[1]}
              </label>
              <Slider
                value={priceRange}
                onValueChange={setPriceRange}
                min={0}
                max={5000}
                step={100}
                className="pt-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>R$ 0</span>
                <span>R$ 5.000</span>
              </div>
            </div>

            {(categoria !== 'Todas' || priceRange[0] > 0 || priceRange[1] < 5000) && (
              <div className="md:col-span-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setCategoria('Todas');
                    setPriceRange([0, 5000]);
                  }}
                  className="w-full"
                >
                  <X className="h-4 w-4 mr-2" />
                  Limpar todos os filtros
                </Button>
              </div>
            )}
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-muted rounded-lg mb-4"></div>
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : filteredDresses && filteredDresses.length > 0 ? (
          <>
            <div className="text-sm text-muted-foreground">
              {filteredDresses.length} {filteredDresses.length === 1 ? 'vestido encontrado' : 'vestidos encontrados'}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredDresses.map((dress) => (
                <DressCard key={dress.id} dress={dress} onView={setSelectedDress} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">👗</div>
            <p className="text-lg text-muted-foreground mb-2">Nenhum vestido encontrado</p>
            <p className="text-sm text-muted-foreground">
              Tente ajustar os filtros de busca
            </p>
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
