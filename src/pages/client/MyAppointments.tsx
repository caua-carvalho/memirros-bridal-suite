import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { appointmentsAPI } from '@/services/apiMock';
import { useAuth } from '@/contexts/AuthContext';
import { ClientLayout } from '@/components/layouts/ClientLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Shirt, X } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function MyAppointments() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: appointments, isLoading } = useQuery({
    queryKey: ['appointments', user?.id],
    queryFn: () => appointmentsAPI.getByClientId(user?.id || ''),
  });

  const cancelMutation = useMutation({
    mutationFn: appointmentsAPI.cancel,
    onSuccess: () => {
      toast.success('Prova cancelada com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
    onError: () => {
      toast.error('Erro ao cancelar prova.');
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
    switch (status) {
      case 'confirmado':
        return 'Confirmado';
      case 'pendente':
        return 'Pendente';
      case 'cancelado':
        return 'Cancelado';
      case 'concluido':
        return 'Concluído';
      default:
        return status;
    }
  };

  return (
    <ClientLayout>
      <div className="space-y-6 w-full px-2 sm:px-4 md:px-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Minhas Provas</h1>
          <p className="text-muted-foreground text-sm sm:text-base">Acompanhe seus agendamentos</p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-32 bg-muted rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : appointments && appointments.length > 0 ? (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <Card key={appointment.id} className="w-full">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                    <CardTitle className="text-lg sm:text-xl break-words max-w-full">{appointment.vestidoNome}</CardTitle>
                    <Badge variant={getStatusVariant(appointment.status)}>
                      {getStatusLabel(appointment.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-muted-foreground text-sm flex-wrap">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {format(new Date(appointment.data + 'T00:00:00'), "dd 'de' MMMM 'de' yyyy", {
                            locale: ptBR,
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground text-sm flex-wrap">
                        <Clock className="h-4 w-4" />
                        <span>{appointment.horario}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground text-sm flex-wrap">
                        <Shirt className="h-4 w-4" />
                        <span>Vestido ID: {appointment.vestidoId}</span>
                      </div>
                    </div>

                    {appointment.observacoes && (
                      <div>
                        <p className="text-sm font-medium mb-1">Observações:</p>
                        <p className="text-sm text-muted-foreground break-words">{appointment.observacoes}</p>
                      </div>
                    )}
                  </div>

                  {appointment.status === 'pendente' || appointment.status === 'confirmado' ? (
                    <div className="mt-4 flex flex-col sm:flex-row justify-end gap-2">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => cancelMutation.mutate(appointment.id)}
                        disabled={cancelMutation.isPending}
                        className="w-full sm:w-auto"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancelar Prova
                      </Button>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="w-full">
            <CardContent className="text-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">Você ainda não tem provas agendadas.</p>
              <Button onClick={() => (window.location.href = '/')} className="w-full sm:w-auto">Ver Catálogo</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </ClientLayout>
  );
}
