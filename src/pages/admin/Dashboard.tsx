import { useQuery } from '@tanstack/react-query';
import { dressesAPI, appointmentsAPI } from '@/services/apiMock';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { StatsCard } from '@/components/admin/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shirt, Calendar, CheckCircle2, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function Dashboard() {
  const { data: dresses } = useQuery({
    queryKey: ['dresses'],
    queryFn: () => dressesAPI.getAll(),
  });

  const { data: appointments } = useQuery({
    queryKey: ['appointments'],
    queryFn: () => appointmentsAPI.getAll(),
  });

  const availableDresses = dresses?.filter((d) => d.disponivel).length || 0;
  const upcomingAppointments =
    appointments?.filter((a) => {
      const appointmentDate = new Date(a.data);
      return appointmentDate >= new Date() && a.status !== 'cancelado';
    }) || [];

  const confirmedAppointments = appointments?.filter((a) => a.status === 'confirmado').length || 0;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral do sistema Memirros Noivas</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total de Vestidos"
            value={dresses?.length || 0}
            icon={Shirt}
            description="No catálogo"
          />
          <StatsCard
            title="Vestidos Disponíveis"
            value={availableDresses}
            icon={CheckCircle2}
            description="Prontos para alugar"
          />
          <StatsCard
            title="Próximas Provas"
            value={upcomingAppointments.length}
            icon={Calendar}
            description="Agendamentos futuros"
          />
          <StatsCard
            title="Provas Confirmadas"
            value={confirmedAppointments}
            icon={Clock}
            description="Aguardando realização"
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Próximos Agendamentos</CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingAppointments.length > 0 ? (
              <div className="space-y-4">
                {upcomingAppointments.slice(0, 5).map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="space-y-1">
                      <p className="font-medium">{appointment.cliente}</p>
                      <p className="text-sm text-muted-foreground">{appointment.vestidoNome}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(appointment.data + 'T00:00:00'), "dd/MM/yyyy", {
                            locale: ptBR,
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {appointment.horario}
                        </span>
                      </div>
                    </div>
                    <Badge
                      variant={appointment.status === 'confirmado' ? 'default' : 'secondary'}
                    >
                      {appointment.status === 'confirmado' ? 'Confirmado' : 'Pendente'}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                Nenhum agendamento futuro no momento.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
