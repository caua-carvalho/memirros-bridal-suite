import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { dressesAPI } from '@/services/apiMock';
import { Dress } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Upload, X } from 'lucide-react';
import { toast } from 'sonner';

interface DressFormProps {
  open: boolean;
  onClose: () => void;
  dress?: Dress;
}

export function DressForm({ open, onClose, dress }: DressFormProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    nome: '',
    categoria: 'Noiva' as Dress['categoria'],
    precoAluguel: '',
    descricao: '',
    disponivel: true,
    imagens: [] as string[],
    tamanhos: '',
  });

  useEffect(() => {
    if (dress) {
      setFormData({
        nome: dress.nome,
        categoria: dress.categoria,
        precoAluguel: dress.precoAluguel.toString(),
        descricao: dress.descricao,
        disponivel: dress.disponivel,
        imagens: dress.imagens,
        tamanhos: dress.tamanhos.join(', '),
      });
    } else {
      setFormData({
        nome: '',
        categoria: 'Noiva',
        precoAluguel: '',
        descricao: '',
        disponivel: true,
        imagens: [],
        tamanhos: '',
      });
    }
  }, [dress, open]);

  const createMutation = useMutation({
    mutationFn: dressesAPI.create,
    onSuccess: () => {
      toast.success('Vestido cadastrado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['dresses'] });
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Dress> }) => dressesAPI.update(id, data),
    onSuccess: () => {
      toast.success('Vestido atualizado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['dresses'] });
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const dressData = {
      nome: formData.nome,
      categoria: formData.categoria,
      precoAluguel: parseFloat(formData.precoAluguel),
      descricao: formData.descricao,
      disponivel: formData.disponivel,
      imagens: formData.imagens,
      tamanhos: formData.tamanhos.split(',').map((t) => t.trim()).filter(Boolean),
    };

    if (dress) {
      updateMutation.mutate({ id: dress.id, data: dressData });
    } else {
      createMutation.mutate(dressData);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{dress ? 'Editar Vestido' : 'Novo Vestido'}</DialogTitle>
          <DialogDescription>
            {dress ? 'Atualize as informações do vestido' : 'Adicione um novo vestido ao catálogo'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome do Vestido *</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="categoria">Categoria *</Label>
              <Select
                value={formData.categoria}
                onValueChange={(value) =>
                  setFormData({ ...formData, categoria: value as Dress['categoria'] })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Noiva">Noiva</SelectItem>
                  <SelectItem value="Madrinha">Madrinha</SelectItem>
                  <SelectItem value="Formatura">Formatura</SelectItem>
                  <SelectItem value="Debutante">Debutante</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="preco">Preço de Aluguel (R$) *</Label>
              <Input
                id="preco"
                type="number"
                step="0.01"
                value={formData.precoAluguel}
                onChange={(e) => setFormData({ ...formData, precoAluguel: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição *</Label>
            <Textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Imagens do Vestido *</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {formData.imagens.map((img, idx) => (
                <div key={idx} className="relative aspect-[3/4] rounded-lg overflow-hidden border bg-muted group">
                  <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => {
                      const newImages = [...formData.imagens];
                      newImages.splice(idx, 1);
                      setFormData({ ...formData, imagens: newImages });
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <div className="aspect-[3/4] border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-3 bg-muted/30 hover:bg-muted/50 transition-colors">
                <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                <span className="text-xs text-center text-muted-foreground mb-2">Cole a URL</span>
                <Input
                  type="text"
                  placeholder="URL da imagem"
                  className="text-xs h-8"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const input = e.currentTarget;
                      if (input.value.trim()) {
                        setFormData({
                          ...formData,
                          imagens: [...formData.imagens, input.value.trim()]
                        });
                        input.value = '';
                      }
                    }
                  }}
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Cole as URLs das imagens e pressione Enter
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tamanhos">Tamanhos (separados por vírgula) *</Label>
            <Input
              id="tamanhos"
              value={formData.tamanhos}
              onChange={(e) => setFormData({ ...formData, tamanhos: e.target.value })}
              placeholder="36, 38, 40, 42"
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="disponivel"
              checked={formData.disponivel}
              onCheckedChange={(checked) => setFormData({ ...formData, disponivel: checked })}
            />
            <Label htmlFor="disponivel">Disponível para locação</Label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {dress ? 'Atualizar' : 'Cadastrar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
