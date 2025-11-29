import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { appointmentsAPI } from '@/services/apiMock';
import { useAuth } from '@/contexts/AuthContext';
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
import { toast } from 'sonner';

interface AppointmentFormProps {
  open: boolean;
  onClose: () => void;
  dressId: string;
  dressName: string;
}

// ----------------------------------------------
// Helper para salvar no localStorage
// ----------------------------------------------
function saveToLocalStorage(agendamento: any) {
  const key = "AgendamentosClient";

  const existing = JSON.parse(localStorage.getItem(key) || "[]");

  const payload = {
    ...agendamento,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  const updated = [...existing, payload];

  localStorage.setItem(key, JSON.stringify(updated));
}

export function AppointmentForm({ open, onClose, dressId, dressName }: AppointmentFormProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    nome: user?.nome || '',
    telefone: '',
    email: user?.email || '',
    data: '',
    horario: '',
    observacoes: '',
  });

  const createMutation = useMutation({
    mutationFn: appointmentsAPI.create,
    onSuccess: (_, variables) => {
      // Salva no localStorage junto com o retorno
      saveToLocalStorage(variables);

      toast.success('Prova agendada com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      onClose();
    },
    onError: () => {
      toast.error('Erro ao agendar prova. Tente novamente.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome || !formData.telefone || !formData.data || !formData.horario) {
      toast.error('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const defaultStatus = "pendente" as const;

    const payload = {
      cliente: formData.nome,
      clienteId: user?.id,
      telefone: formData.telefone,
      email: formData.email,
      data: formData.data,
      horario: formData.horario,
      vestidoId: dressId,
      vestidoNome: dressName,
      status: defaultStatus,
      observacoes: formData.observacoes,
    };

    createMutation.mutate(payload);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Agendar Prova</DialogTitle>
          <DialogDescription>
            Vestido selecionado: <strong>{dressName}</strong>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome Completo *</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              placeholder="Seu nome completo"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefone">Telefone *</Label>
            <Input
              id="telefone"
              value={formData.telefone}
              onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
              placeholder="(11) 99999-9999"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="seu@email.com"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="data">Data *</Label>
              <Input
                id="data"
                type="date"
                value={formData.data}
                onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="horario">Horário *</Label>
              <Input
                id="horario"
                type="time"
                value={formData.horario}
                onChange={(e) => setFormData({ ...formData, horario: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={formData.observacoes}
              onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              placeholder="Alguma informação adicional?"
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Agendando...' : 'Confirmar Agendamento'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
