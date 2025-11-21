export interface Dress {
  id: string;
  nome: string;
  categoria: 'Noiva' | 'Madrinha' | 'Formatura' | 'Debutante';
  precoAluguel: number;
  imagens: string[];
  descricao: string;
  disponivel: boolean;
  tamanhos: string[];
}

export interface Appointment {
  id: string;
  cliente: string;
  clienteId?: string;
  telefone: string;
  email?: string;
  data: string;
  horario: string;
  vestidoId: string;
  vestidoNome?: string;
  status: 'pendente' | 'confirmado' | 'cancelado' | 'concluido';
  observacoes?: string;
}

export interface Client {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  historicoAlugueis: {
    vestidoId: string;
    vestidoNome: string;
    data: string;
    valor: number;
  }[];
  historicoProvas: string[];
}

export type UserRole = 'client' | 'admin';

export interface User {
  id: string;
  nome: string;
  email: string;
  role: UserRole;
}
