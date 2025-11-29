import { Link, useLocation } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Calendar } from 'lucide-react';
import { Logo } from '@/components/ui/logo';
import { SidebarProvider } from '../ui/sidebar';
import { AppSidebar } from '../ui/AppSidebarClient';
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  const isMobile = useIsMobile();

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background flex w-full">
        {isMobile && <AppSidebar />}
        <div className="flex-1 flex flex-col min-h-screen justify-between">
          <header className="border-b bg-card sticky top-0 z-50 shadow-sm">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <Link to="/" className="flex items-center gap-3">
                  <Logo className="h-16 w-auto" alt="Memirros Noivas" />
                </Link>
                <nav className="hidden md:flex items-center gap-6">
                  <Link
                    to="/"
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      isActive('/') ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    Catálogo
                  </Link>
                  <Link
                    to="/MyAppointments"
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      isActive('/MyAppointments') ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    Meus Agendamentos
                  </Link>
                </nav>
                <div className="flex items-center gap-2">
                  <ThemeToggle />
                  {isMobile && <SidebarTrigger />}
                </div>
              </div>
            </div>
          </header>
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
          <footer className="border-t bg-card mt-16 ">
            <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
              <p>&copy; 2025 Memirros Noivas. Todos os direitos reservados.</p>
              <br />
              <Link to="/admin/login" className="flex items-center justify-center gap-2 hover:text-primary">
                <Calendar className="h-4 w-4" />
                <span>Área do Administrador</span>
              </Link>
            </div>
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
}
