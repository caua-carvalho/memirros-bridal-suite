import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { appointmentsAPI } from '@/services/apiMock';
import { Appointment } from '@/types';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Calendar, Clock, User, Phone, Mail, FileText, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { WhatsAppMessageModal } from '@/components/admin/WhatsAppMessageModal';

export default function AppointmentsManagement() {
  const [statusFilter, setStatusFilter] = useState('todos');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [whatsappAppointment, setWhatsappAppointment] = useState<Appointment | null>(null);
  const queryClient = useQueryClient();

  const { data: appointments, isLoading } = useQuery({
    queryKey: ['appointments', statusFilter, dateFilter],
    queryFn: () =>
      appointmentsAPI.getAll({
        status: statusFilter === 'todos' ? undefined : statusFilter,
        data: dateFilter || undefined,
      }),
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
      case 'confirmado':
        return 'default';
      case 'pendente':
        return 'secondary';
      case 'cancelado':
        return 'destructive';
      case 'concluido':
        return 'outline';
      default:
        return 'secondary';
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Gestão de Agendamentos</h1>
          <p className="text-muted-foreground">Gerencie as provas agendadas</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="confirmado">Confirmado</SelectItem>
              <SelectItem value="concluido">Concluído</SelectItem>
              <SelectItem value="cancelado">Cancelado</SelectItem>
            </SelectContent>
          </Select>

          <Input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full md:w-[200px]"
            placeholder="Filtrar por data"
          />

          {(statusFilter !== 'todos' || dateFilter) && (
            <Button
              variant="outline"
              onClick={() => {
                setStatusFilter('todos');
                setDateFilter('');
              }}
            >
              Limpar Filtros
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Carregando...</div>
        ) : appointments && appointments.length > 0 ? (
          <div className="grid gap-4">
            {appointments.map((appointment) => (
              <Card key={appointment.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold truncate">{appointment.cliente}</h3>
                      <p className="text-sm text-muted-foreground truncate">{appointment.vestidoNome}</p>
                    </div>
                    <Badge variant={getStatusVariant(appointment.status)} className="self-start">
                      {getStatusLabel(appointment.status)}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="truncate">
                        {format(new Date(appointment.data + 'T00:00:00'), "dd 'de' MMMM", {
                          locale: ptBR,
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span>{appointment.horario}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="truncate">{appointment.telefone}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white border-green-600"
                      onClick={() => setWhatsappAppointment(appointment)}
                    >
                      <MessageCircle className="h-4 w-4 mr-1" />
                      <span className="hidden sm:inline">WhatsApp</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedAppointment(appointment)}
                    >
                      Detalhes
                    </Button>
                    {appointment.status === 'pendente' && (
                      <Button
                        size="sm"
                        onClick={() =>
                          updateStatusMutation.mutate({ id: appointment.id, status: 'confirmado' })
                        }
                      >
                        Confirmar
                      </Button>
                    )}
                    {(appointment.status === 'pendente' || appointment.status === 'confirmado') && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() =>
                          updateStatusMutation.mutate({ id: appointment.id, status: 'cancelado' })
                        }
                      >
                        Cancelar
                      </Button>
                    )}
                    {appointment.status === 'confirmado' && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() =>
                          updateStatusMutation.mutate({ id: appointment.id, status: 'concluido' })
                        }
                      >
                        Concluir
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {statusFilter !== 'todos' || dateFilter
                  ? 'Nenhum agendamento encontrado com os filtros aplicados.'
                  : 'Nenhum agendamento no sistema.'}
              </p>
            </CardContent>
          </Card>
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
                  <p className="text-sm text-muted-foreground mb-1 font-medium">Status</p>
                  <Badge variant={getStatusVariant(selectedAppointment.status)}>
                    {getStatusLabel(selectedAppointment.status)}
                  </Badge>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* WhatsApp Message Modal */}
        {whatsappAppointment && (
          <WhatsAppMessageModal
            open={!!whatsappAppointment}
            onClose={() => setWhatsappAppointment(null)}
            clientName={whatsappAppointment.cliente}
            clientPhone={whatsappAppointment.telefone}
            clientEmail={whatsappAppointment.email}
          />
        )}
      </div>
    </AdminLayout>
  );
}
