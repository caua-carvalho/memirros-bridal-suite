import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LogOut, LayoutDashboard, ShoppingBag, Calendar as CalIcon, Users } from 'lucide-react';
import { Logo } from '@/components/ui/logo';
import { SidebarProvider } from '../ui/sidebar';
import { AppSidebar } from '../ui/AppSidebarAdmin';
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
      <div className="min-h-screen bg-background w-full">
        {isMobile && <AppSidebar />}
        <header className="border-b bg-card sticky top-0 z-50">
          <div className="w-full px-3 sm:px-4 py-3 sm:py-4">
            <div className="flex items-center justify-between gap-2">
              <Link to="/admin" className="flex items-center shrink-0">
                <Logo className="h-10 sm:h-14 w-auto" alt="Memirros Noivas" />
              </Link>

              <div className="flex items-center gap-1 sm:gap-3">
                <span className="text-xs sm:text-sm text-muted-foreground hidden lg:block truncate max-w-[120px]">
                  {user?.nome}
                </span>
                <ThemeToggle />
                <Button variant="outline" size="sm" onClick={handleLogout} className="h-8 sm:h-9">
                  <LogOut className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Sair</span>
                </Button>
                {isMobile && <SidebarTrigger />}
              </div>
            </div>
          </div>
        </header>

        <div className="flex w-full">
          <aside className="hidden md:block w-56 lg:w-64 border-r bg-card/50 backdrop-blur-sm min-h-[calc(100vh-73px)] sticky top-[73px]">
            <nav className="p-3 lg:p-4 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg transition-all font-medium text-sm ${isActive(item.path)
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                      }`}
                  >
                    <Icon className="h-4 w-4 lg:h-5 lg:w-5 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>

          <main className="flex-1 p-3 sm:p-4 lg:p-8 min-w-0 w-full overflow-x-hidden">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
