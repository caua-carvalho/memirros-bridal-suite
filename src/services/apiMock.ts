import { Dress, Appointment, Client, User } from '@/types';

// Simulação de delay de rede
const delay = (ms: number = 400) => new Promise(resolve => setTimeout(resolve, ms));

// Mock Data
let dresses: Dress[] = [
  {
    id: '1',
    nome: 'Vestido Noiva Clássico',
    categoria: 'Noiva',
    precoAluguel: 1500,
    imagens: ['https://images.unsplash.com/photo-1525562723836-dca67a71d5f1?w=800', 'https://images.unsplash.com/photo-1594552072238-82d892b7d7c4?w=800'],
    descricao: 'Modelo clássico com renda francesa, cauda longa e detalhes bordados à mão. Perfeito para cerimônias tradicionais.',
    disponivel: true,
    tamanhos: ['36', '38', '40', '42']
  },
  {
    id: '2',
    nome: 'Vestido Noiva Minimalista',
    categoria: 'Noiva',
    precoAluguel: 1800,
    imagens: ['https://images.unsplash.com/photo-1519741497674-611481863552?w=800', 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800'],
    descricao: 'Design clean e moderno, em cetim nobre. Elegância atemporal para noivas contemporâneas.',
    disponivel: true,
    tamanhos: ['36', '38', '40']
  },
  {
    id: '3',
    nome: 'Vestido Madrinha Rosa',
    categoria: 'Madrinha',
    precoAluguel: 800,
    imagens: ['https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800'],
    descricao: 'Vestido em tule rosa blush com aplicações delicadas. Perfeito para madrinhas elegantes.',
    disponivel: true,
    tamanhos: ['36', '38', '40', '42', '44']
  },
  {
    id: '4',
    nome: 'Vestido Formatura Azul Marinho',
    categoria: 'Formatura',
    precoAluguel: 600,
    imagens: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800'],
    descricao: 'Modelo midi em azul marinho com bordados em pedrarias. Sofisticado e moderno.',
    disponivel: false,
    tamanhos: ['36', '38', '40']
  },
  {
    id: '5',
    nome: 'Vestido Debutante Princesa',
    categoria: 'Debutante',
    precoAluguel: 1200,
    imagens: ['https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800'],
    descricao: 'Vestido volumoso em tule com corset bordado. O sonho de toda debutante.',
    disponivel: true,
    tamanhos: ['34', '36', '38', '40']
  },
  {
    id: '6',
    nome: 'Vestido Noiva Boho',
    categoria: 'Noiva',
    precoAluguel: 1600,
    imagens: ['https://images.unsplash.com/photo-1519657337289-077653f724ed?w=800'],
    descricao: 'Estilo boho chic com renda macramê e manga longa. Ideal para casamentos ao ar livre.',
    disponivel: true,
    tamanhos: ['36', '38', '40', '42']
  }
];

let appointments: Appointment[] = [
  {
    id: 'a1',
    cliente: 'Maria Silva',
    clienteId: 'c1',
    telefone: '11 99999-0000',
    email: 'maria@email.com',
    data: '2025-02-15',
    horario: '14:00',
    vestidoId: '1',
    vestidoNome: 'Vestido Noiva Clássico',
    status: 'confirmado',
    observacoes: 'Primeira prova'
  },
  {
    id: 'a2',
    cliente: 'Ana Costa',
    clienteId: 'c2',
    telefone: '11 98888-7777',
    email: 'ana@email.com',
    data: '2025-02-20',
    horario: '10:00',
    vestidoId: '3',
    vestidoNome: 'Vestido Madrinha Rosa',
    status: 'pendente'
  },
  {
    id: 'a3',
    cliente: 'Júlia Santos',
    clienteId: 'c3',
    telefone: '11 97777-6666',
    email: 'julia@email.com',
    data: '2025-02-18',
    horario: '16:00',
    vestidoId: '2',
    vestidoNome: 'Vestido Noiva Minimalista',
    status: 'confirmado'
  }
];

let clients: Client[] = [
  {
    id: 'c1',
    nome: 'Maria Silva',
    telefone: '11 99999-0000',
    email: 'maria@email.com',
    historicoAlugueis: [
      {
        vestidoId: '1',
        vestidoNome: 'Vestido Noiva Clássico',
        data: '2024-12-20',
        valor: 1500
      }
    ],
    historicoProvas: ['a1']
  },
  {
    id: 'c2',
    nome: 'Ana Costa',
    telefone: '11 98888-7777',
    email: 'ana@email.com',
    historicoAlugueis: [],
    historicoProvas: ['a2']
  },
  {
    id: 'c3',
    nome: 'Júlia Santos',
    telefone: '11 97777-6666',
    email: 'julia@email.com',
    historicoAlugueis: [
      {
        vestidoId: '3',
        vestidoNome: 'Vestido Madrinha Rosa',
        data: '2024-11-15',
        valor: 800
      }
    ],
    historicoProvas: ['a3']
  }
];

const users: User[] = [
  {
    id: 'c1',
    nome: 'Maria Silva',
    email: 'cliente@memirros.com',
    role: 'client'
  },
  {
    id: 'admin1',
    nome: 'Admin Memirros',
    email: 'admin@memirros.com',
    role: 'admin'
  }
];

// API Mock - Autenticação
export const authAPI = {
  login: async (email: string, password: string): Promise<User> => {
    await delay();
    const user = users.find(u => u.email === email);
    if (!user || password !== '123456') {
      throw new Error('Credenciais inválidas');
    }
    return user;
  }
};

// API Mock - Vestidos
export const dressesAPI = {
  getAll: async (filters?: { categoria?: string; search?: string }): Promise<Dress[]> => {
    await delay();
    let filtered = [...dresses];
    
    if (filters?.categoria && filters.categoria !== 'Todas') {
      filtered = filtered.filter(d => d.categoria === filters.categoria);
    }
    
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(d => 
        d.nome.toLowerCase().includes(search) || 
        d.descricao.toLowerCase().includes(search)
      );
    }
    
    return filtered;
  },
  
  getById: async (id: string): Promise<Dress | undefined> => {
    await delay();
    return dresses.find(d => d.id === id);
  },
  
  create: async (dress: Omit<Dress, 'id'>): Promise<Dress> => {
    await delay(600);
    const newDress: Dress = {
      ...dress,
      id: Date.now().toString()
    };
    dresses.push(newDress);
    return newDress;
  },
  
  update: async (id: string, dress: Partial<Dress>): Promise<Dress> => {
    await delay(600);
    const index = dresses.findIndex(d => d.id === id);
    if (index === -1) throw new Error('Vestido não encontrado');
    
    dresses[index] = { ...dresses[index], ...dress };
    return dresses[index];
  },
  
  delete: async (id: string): Promise<void> => {
    await delay(400);
    dresses = dresses.filter(d => d.id !== id);
  }
};

// API Mock - Agendamentos
export const appointmentsAPI = {
  getAll: async (filters?: { status?: string; data?: string }): Promise<Appointment[]> => {
    await delay();
    let filtered = [...appointments];
    
    if (filters?.status && filters.status !== 'todos') {
      filtered = filtered.filter(a => a.status === filters.status);
    }
    
    if (filters?.data) {
      filtered = filtered.filter(a => a.data === filters.data);
    }
    
    return filtered.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
  },
  
  getByClientId: async (clientId: string): Promise<Appointment[]> => {
    await delay();
    return appointments.filter(a => a.clienteId === clientId);
  },
  
  getById: async (id: string): Promise<Appointment | undefined> => {
    await delay();
    return appointments.find(a => a.id === id);
  },
  
  create: async (appointment: Omit<Appointment, 'id'>): Promise<Appointment> => {
    await delay(600);
    const dress = dresses.find(d => d.id === appointment.vestidoId);
    const newAppointment: Appointment = {
      ...appointment,
      id: Date.now().toString(),
      vestidoNome: dress?.nome,
      status: 'pendente'
    };
    appointments.push(newAppointment);
    return newAppointment;
  },
  
  updateStatus: async (id: string, status: Appointment['status']): Promise<Appointment> => {
    await delay(400);
    const index = appointments.findIndex(a => a.id === id);
    if (index === -1) throw new Error('Agendamento não encontrado');
    
    appointments[index].status = status;
    return appointments[index];
  },
  
  cancel: async (id: string): Promise<void> => {
    await delay(400);
    const index = appointments.findIndex(a => a.id === id);
    if (index !== -1) {
      appointments[index].status = 'cancelado';
    }
  }
};

// API Mock - Clientes
export const clientsAPI = {
  getAll: async (): Promise<Client[]> => {
    await delay();
    return [...clients];
  },
  
  getById: async (id: string): Promise<Client | undefined> => {
    await delay();
    return clients.find(c => c.id === id);
  },
  
  update: async (id: string, client: Partial<Client>): Promise<Client> => {
    await delay(600);
    const index = clients.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Cliente não encontrado');
    
    clients[index] = { ...clients[index], ...client };
    return clients[index];
  }
};
