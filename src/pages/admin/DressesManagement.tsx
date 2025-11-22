import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dressesAPI } from '@/services/apiMock';
import { Dress } from '@/types';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { DressForm } from '@/components/admin/DressForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function DressesManagement() {
  const [formOpen, setFormOpen] = useState(false);
  const [selectedDress, setSelectedDress] = useState<Dress | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [dressToDelete, setDressToDelete] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: dresses, isLoading } = useQuery({
    queryKey: ['dresses'],
    queryFn: () => dressesAPI.getAll(),
  });

  const deleteMutation = useMutation({
    mutationFn: dressesAPI.delete,
    onSuccess: () => {
      toast.success('Vestido removido com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['dresses'] });
      setDeleteDialogOpen(false);
    },
  });

  const handleEdit = (dress: Dress) => {
    setSelectedDress(dress);
    setFormOpen(true);
  };

  const handleDelete = (id: string) => {
    setDressToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (dressToDelete) {
      deleteMutation.mutate(dressToDelete);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Gestão de Vestidos</h1>
            <p className="text-muted-foreground">Gerencie o catálogo de vestidos</p>
          </div>
          <Button
            onClick={() => {
              setSelectedDress(undefined);
              setFormOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Vestido
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-muted"></div>
                <CardContent className="p-4">
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : dresses && dresses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {dresses.map((dress) => (
              <Card key={dress.id} className="overflow-hidden hover:shadow-lg transition-all group">
                <div className="aspect-[3/4] overflow-hidden bg-muted relative">
                  <img
                    src={dress.imagens[0]}
                    alt={dress.nome}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge 
                    variant={dress.disponivel ? 'default' : 'secondary'}
                    className="absolute top-3 right-3"
                  >
                    {dress.disponivel ? 'Disponível' : 'Indisponível'}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <div className="mb-3">
                    <h3 className="font-semibold text-lg text-foreground mb-1">{dress.nome}</h3>
                    <p className="text-sm text-muted-foreground">{dress.categoria}</p>
                  </div>
                  <p className="text-xl font-bold text-primary mb-4">
                    R$ {dress.precoAluguel.toLocaleString('pt-BR')}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(dress)}
                      className="flex-1"
                    >
                      <Pencil className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(dress.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">Nenhum vestido cadastrado ainda.</p>
            </CardContent>
          </Card>
        )}

        <DressForm
          open={formOpen}
          onClose={() => {
            setFormOpen(false);
            setSelectedDress(undefined);
          }}
          dress={selectedDress}
        />

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja remover este vestido? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete}>Confirmar</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
}
