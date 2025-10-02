import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-9xl font-poppins font-bold text-primary">404</h1>
          <h2 className="text-2xl font-poppins font-semibold text-foreground">
            Página Não Encontrada
          </h2>
          <p className="text-muted-foreground max-w-md">
            Desculpe, a página que você está procurando não existe ou foi movida.
          </p>
        </div>

        <div className="flex items-center justify-center gap-4">
          <Button asChild variant="default">
            <Link to="/" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Voltar ao Dashboard
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="javascript:history.back()" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
