import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { appointmentsAPI } from '@/services/apiMock';
import { Appointment } from '@/types';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { CalendarView } from '@/components/admin/CalendarView';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Calendar, Clock, User, Phone, Mail, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function AppointmentsCalendar() {
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const queryClient = useQueryClient();

  const { data: appointments, isLoading } = useQuery({
    queryKey: ['appointments'],
    queryFn: () => appointmentsAPI.getAll(),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Appointment['status'] }) =>
      appointmentsAPI.updateStatus(id, status),
    onSuccess: () => {
      toast.success('Status atualizado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'confirmado': return 'default';
      case 'pendente': return 'secondary';
      case 'cancelado': return 'destructive';
      case 'concluido': return 'outline';
      default: return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      confirmado: 'Confirmado',
      pendente: 'Pendente',
      cancelado: 'Cancelado',
      concluido: 'Concluído',
    };
    return labels[status] || status;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Calendário de Agendamentos</h1>
          <p className="text-muted-foreground">Visualize as provas agendadas em calendário</p>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Carregando...</div>
        ) : appointments && appointments.length > 0 ? (
          <CalendarView 
            appointments={appointments} 
            onSelectAppointment={setSelectedAppointment}
          />
        ) : (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhum agendamento no sistema.</p>
          </div>
        )}

        <Dialog open={!!selectedAppointment} onOpenChange={() => setSelectedAppointment(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Detalhes do Agendamento</DialogTitle>
              <DialogDescription>Informações completas da prova</DialogDescription>
            </DialogHeader>

            {selectedAppointment && (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <User className="h-4 w-4" />
                    <span className="font-medium">Cliente</span>
                  </div>
                  <p>{selectedAppointment.cliente}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Phone className="h-4 w-4" />
                    <span className="font-medium">Telefone</span>
                  </div>
                  <p>{selectedAppointment.telefone}</p>
                </div>

                {selectedAppointment.email && (
                  <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Mail className="h-4 w-4" />
                      <span className="font-medium">E-mail</span>
                    </div>
                    <p>{selectedAppointment.email}</p>
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Calendar className="h-4 w-4" />
                    <span className="font-medium">Data e Horário</span>
                  </div>
                  <p>
                    {format(
                      new Date(selectedAppointment.data + 'T00:00:00'),
                      "dd 'de' MMMM 'de' yyyy",
                      { locale: ptBR }
                    )}{' '}
                    às {selectedAppointment.horario}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1 font-medium">Vestido</p>
                  <p>{selectedAppointment.vestidoNome}</p>
                </div>

                {selectedAppointment.observacoes && (
                  <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <FileText className="h-4 w-4" />
                      <span className="font-medium">Observações</span>
                    </div>
                    <p className="text-sm">{selectedAppointment.observacoes}</p>
                  </div>
                )}

                <div>
                  <p className="text-sm text-muted-foreground mb-2 font-medium">Status</p>
                  <Badge variant={getStatusVariant(selectedAppointment.status)}>
                    {getStatusLabel(selectedAppointment.status)}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-2 pt-4 border-t">
                  {selectedAppointment.status === 'pendente' && (
                    <Button
                      size="sm"
                      onClick={() =>
                        updateStatusMutation.mutate({ id: selectedAppointment.id, status: 'confirmado' })
                      }
                    >
                      Confirmar
                    </Button>
                  )}
                  {(selectedAppointment.status === 'pendente' || selectedAppointment.status === 'confirmado') && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() =>
                        updateStatusMutation.mutate({ id: selectedAppointment.id, status: 'cancelado' })
                      }
                    >
                      Cancelar
                    </Button>
                  )}
                  {selectedAppointment.status === 'confirmado' && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() =>
                        updateStatusMutation.mutate({ id: selectedAppointment.id, status: 'concluido' })
                      }
                    >
                      Concluir
                    </Button>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
