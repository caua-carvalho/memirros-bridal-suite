import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LogOut, LayoutDashboard, ShoppingBag, Calendar as CalIcon, Users } from 'lucide-react';
import { Logo } from '@/components/ui/logo';
import { SidebarProvider } from '../ui/sidebar';
import { AppSidebar } from '../ui/AppSidebar';
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isMobile = useIsMobile();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const isDashboard = location.pathname === "/admin";

  const isActive = (path: string) => {
    if (path === "/admin") return isDashboard;
    return location.pathname.startsWith(path);
  };


  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/vestidos', label: 'Vestidos', icon: ShoppingBag },
    { path: '/admin/agendamentos', label: 'Lista', icon: CalIcon },
    { path: '/admin/calendario', label: 'Calendário', icon: CalIcon },
    { path: '/admin/clientes', label: 'Clientes', icon: Users },
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background w-screen">
        {isMobile && <AppSidebar />}
        <header className="border-b bg-card sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link to="/admin" className="flex items-center gap-3">
                <Logo className="h-14 w-auto" alt="Memirros Noivas" />
              </Link>

              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground hidden md:block">
                  {user?.nome}
                </span>
                <ThemeToggle />
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </Button>
                {isMobile && <SidebarTrigger />}
              </div>
            </div>
          </div>
        </header>

        <div className="flex">
          <aside className="hidden md:block w-64 border-r bg-card/50 backdrop-blur-sm min-h-[calc(100vh-89px)] sticky top-[89px]">
            <nav className="p-4 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${isActive(item.path)
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                      }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>

          <main className="flex-1 p-4 md:p-8">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
