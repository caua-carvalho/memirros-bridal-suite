import { useState } from 'react';
import { Appointment } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, User } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, addMonths, subMonths, startOfWeek, endOfWeek, addDays, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface CalendarViewProps {
  appointments: Appointment[];
  onSelectAppointment: (appointment: Appointment) => void;
}

type ViewMode = 'month' | 'week' | 'day';

export function CalendarView({ appointments, onSelectAppointment }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('month');

  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter(apt => 
      isSameDay(new Date(apt.data + 'T00:00:00'), date)
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmado': return 'bg-primary/20 border-primary text-primary-foreground';
      case 'pendente': return 'bg-secondary/20 border-secondary text-secondary-foreground';
      case 'cancelado': return 'bg-destructive/20 border-destructive text-destructive-foreground';
      case 'concluido': return 'bg-muted border-muted-foreground text-muted-foreground';
      default: return 'bg-muted border-muted-foreground';
    }
  };

  // Visão Mensal
  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart, { locale: ptBR });
    const calendarEnd = endOfWeek(monthEnd, { locale: ptBR });
    const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

    return (
      <div className="grid grid-cols-7 gap-2">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
          <div key={day} className="text-center text-sm font-semibold text-muted-foreground py-2">
            {day}
          </div>
        ))}
        {days.map((day, idx) => {
          const dayAppointments = getAppointmentsForDate(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isToday = isSameDay(day, new Date());

          return (
            <Card 
              key={idx} 
              className={`min-h-[100px] ${!isCurrentMonth ? 'opacity-40' : ''} ${isToday ? 'ring-2 ring-primary' : ''}`}
            >
              <CardContent className="p-2">
                <div className={`text-sm font-medium mb-1 ${isToday ? 'text-primary' : ''}`}>
                  {format(day, 'd')}
                </div>
                <div className="space-y-1">
                  {dayAppointments.slice(0, 3).map(apt => (
                    <button
                      key={apt.id}
                      onClick={() => onSelectAppointment(apt)}
                      className={`w-full text-left text-xs px-1.5 py-0.5 rounded border ${getStatusColor(apt.status)} hover:opacity-80 transition-opacity`}
                    >
                      {apt.horario} - {apt.cliente.split(' ')[0]}
                    </button>
                  ))}
                  {dayAppointments.length > 3 && (
                    <div className="text-xs text-muted-foreground">
                      +{dayAppointments.length - 3} mais
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  // Visão Semanal
  const renderWeekView = () => {
    const weekStart = startOfWeek(currentDate, { locale: ptBR });
    const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

    return (
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {days.map((day) => {
          const dayAppointments = getAppointmentsForDate(day);
          const isToday = isSameDay(day, new Date());

          return (
            <Card key={day.toISOString()} className={isToday ? 'ring-2 ring-primary' : ''}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">
                  {format(day, 'EEE', { locale: ptBR })}
                  <div className={`text-2xl font-bold ${isToday ? 'text-primary' : ''}`}>
                    {format(day, 'd')}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {dayAppointments.length > 0 ? (
                  dayAppointments.map(apt => (
                    <button
                      key={apt.id}
                      onClick={() => onSelectAppointment(apt)}
                      className={`w-full text-left p-2 rounded border ${getStatusColor(apt.status)} hover:opacity-80 transition-opacity`}
                    >
                      <div className="flex items-center gap-1 text-xs mb-1">
                        <Clock className="h-3 w-3" />
                        {apt.horario}
                      </div>
                      <div className="text-sm font-medium">{apt.cliente}</div>
                      <div className="text-xs opacity-80">{apt.vestidoNome}</div>
                    </button>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground text-center py-4">
                    Nenhum agendamento
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  // Visão do Dia
  const renderDayView = () => {
    const dayAppointments = getAppointmentsForDate(currentDate).sort((a, b) => 
      a.horario.localeCompare(b.horario)
    );

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            {format(currentDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {dayAppointments.length > 0 ? (
            dayAppointments.map(apt => (
              <button
                key={apt.id}
                onClick={() => onSelectAppointment(apt)}
                className={`w-full text-left p-4 rounded-lg border-2 ${getStatusColor(apt.status)} hover:opacity-80 transition-opacity`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span className="font-semibold">{apt.horario}</span>
                  </div>
                  <Badge variant={apt.status === 'confirmado' ? 'default' : 'secondary'}>
                    {apt.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <User className="h-4 w-4" />
                  <span className="font-medium">{apt.cliente}</span>
                </div>
                <div className="text-sm text-muted-foreground">{apt.vestidoNome}</div>
                <div className="text-sm text-muted-foreground">{apt.telefone}</div>
              </button>
            ))
          ) : (
            <div className="text-center py-12">
              <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhum agendamento neste dia</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              if (viewMode === 'month') setCurrentDate(subMonths(currentDate, 1));
              else if (viewMode === 'week') setCurrentDate(addDays(currentDate, -7));
              else setCurrentDate(addDays(currentDate, -1));
            }}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="min-w-[200px] text-center">
            <h2 className="text-xl font-bold">
              {viewMode === 'month' && format(currentDate, 'MMMM yyyy', { locale: ptBR })}
              {viewMode === 'week' && `Semana de ${format(startOfWeek(currentDate, { locale: ptBR }), 'd MMM', { locale: ptBR })}`}
              {viewMode === 'day' && format(currentDate, "dd 'de' MMMM", { locale: ptBR })}
            </h2>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              if (viewMode === 'month') setCurrentDate(addMonths(currentDate, 1));
              else if (viewMode === 'week') setCurrentDate(addDays(currentDate, 7));
              else setCurrentDate(addDays(currentDate, 1));
            }}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            onClick={() => setCurrentDate(new Date())}
          >
            Hoje
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            variant={viewMode === 'month' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('month')}
          >
            Mês
          </Button>
          <Button
            variant={viewMode === 'week' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('week')}
          >
            Semana
          </Button>
          <Button
            variant={viewMode === 'day' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('day')}
          >
            Dia
          </Button>
        </div>
      </div>

      {viewMode === 'month' && renderMonthView()}
      {viewMode === 'week' && renderWeekView()}
      {viewMode === 'day' && renderDayView()}
    </div>
  );
}
