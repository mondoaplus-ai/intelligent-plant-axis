import { useState } from 'react';
import { Upload, Download, FileSpreadsheet, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

interface ProductImportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (data: any[]) => void;
}

export const ProductImportModal = ({ open, onOpenChange, onImport }: ProductImportModalProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
    } else {
      toast.error('Por favor, selecione um arquivo CSV válido');
    }
  };

  const handleDownloadTemplate = () => {
    const headers = [
      'codigo',
      'nome',
      'categoria',
      'tipo',
      'unidade',
      'status',
      'estoque_atual',
      'estoque_minimo',
      'estoque_maximo',
      'custo_medio',
      'ncm',
      'codigo_barras'
    ];
    
    const example = [
      'PROD-001',
      'Produto Exemplo',
      'Produto Acabado',
      'Fabricado',
      'UN',
      'Ativo',
      '100',
      '50',
      '500',
      '10.50',
      '1234.56.78',
      '7891234567890'
    ];

    const csv = [headers.join(','), example.join(',')].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'template-importacao-produtos.csv';
    link.click();
    toast.success('Template baixado com sucesso!');
  };

  const parseCSV = (text: string): any[] => {
    const lines = text.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim());
    
    const products = lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim());
      const product: any = {};
      
      headers.forEach((header, index) => {
        product[header] = values[index];
      });
      
      return {
        code: product.codigo || '',
        name: product.nome || '',
        category: product.categoria || 'Produto Acabado',
        type: product.tipo || 'Fabricado',
        unit: product.unidade || 'UN',
        status: product.status || 'Ativo',
        currentStock: parseInt(product.estoque_atual) || 0,
        minStock: parseInt(product.estoque_minimo) || 0,
        maxStock: parseInt(product.estoque_maximo) || 0,
        avgCost: parseFloat(product.custo_medio) || 0,
        ncm: product.ncm || '',
        barcode: product.codigo_barras || '',
      };
    });

    return products;
  };

  const handleImport = async () => {
    if (!file) {
      toast.error('Selecione um arquivo para importar');
      return;
    }

    setImporting(true);
    
    try {
      const text = await file.text();
      const products = parseCSV(text);
      
      if (products.length === 0) {
        toast.error('Nenhum produto encontrado no arquivo');
        return;
      }

      onImport(products);
      toast.success(`${products.length} produtos importados com sucesso!`);
      onOpenChange(false);
      setFile(null);
    } catch (error) {
      toast.error('Erro ao processar arquivo CSV');
      console.error(error);
    } finally {
      setImporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Importar Produtos
          </DialogTitle>
          <DialogDescription>
            Importe produtos em lote através de um arquivo CSV
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              O arquivo deve estar no formato CSV com as colunas corretas. 
              Baixe o template para ver o formato esperado.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleDownloadTemplate}
            >
              <Download className="mr-2 h-4 w-4" />
              Baixar Template CSV
            </Button>
          </div>

          <div className="border-2 border-dashed rounded-lg p-8">
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 rounded-full bg-muted">
                <Upload className="h-8 w-8 text-muted-foreground" />
              </div>
              
              <div className="text-center">
                <p className="text-sm font-medium">
                  {file ? file.name : 'Selecione o arquivo CSV'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Clique no botão abaixo para selecionar o arquivo
                </p>
              </div>

              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
                id="csv-upload"
              />
              <label htmlFor="csv-upload">
                <Button variant="secondary" asChild>
                  <span>Selecionar Arquivo</span>
                </Button>
              </label>
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="text-sm font-medium mb-2">Formato do CSV:</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• codigo, nome, categoria, tipo, unidade</li>
              <li>• status, estoque_atual, estoque_minimo, estoque_maximo</li>
              <li>• custo_medio, ncm, codigo_barras</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              setFile(null);
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleImport}
            disabled={!file || importing}
          >
            {importing ? 'Importando...' : 'Importar Produtos'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
