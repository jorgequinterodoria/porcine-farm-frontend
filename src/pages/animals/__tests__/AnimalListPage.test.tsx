import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../test/helpers';
import userEvent from '../test/helpers';
import { AnimalListPage } from '../pages/animals/AnimalListPage';
import { createMockAnimal, createMockAnimal } from '../test/helpers';


vi.mock('../api/axiosInstance', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

vi.mock('../api/infrastructure', () => ({
  getPens: vi.fn(),
}));

vi.mock('../api/animals', () => ({
  updateAnimal: vi.fn(),
}));


vi.mock('../components/animals/AnimalForm', () => ({
  AnimalForm: ({ isOpen, onClose, onSubmit, isLoading, pens, initialData }: any) => (
    isOpen ? (
      <div data-testid="animal-form">
        <div data-testid="form-is-open">true</div>
        <div data-testid="form-is-loading">{String(isLoading)}</div>
        <button data-testid="form-close" onClick={onClose}>
          Close
        </button>
        <button 
          data-testid="form-submit" 
          onClick={() => onSubmit(initialData || { internalCode: 'TEST-001' })}
        >
          Submit
        </button>
      </div>
    ) : null
  ),
}));

vi.mock('../components/animals/AnimalDetailsModal', () => ({
  AnimalDetailsModal: ({ animal, onClose, getPenCode, getStatusInfo, getStageInfo }: any) => (
    <div data-testid="animal-details-modal">
      <div data-testid="modal-animal-id">{animal?.id}</div>
      <button data-testid="modal-close" onClick={onClose}>
        Close
      </button>
    </div>
  ),
}));

describe('AnimalListPage Integration Tests', () => {
  const mockAnimals = [
    createMockAnimal({
      id: 'animal-1',
      internalCode: 'ANIMAL-001',
      sex: 'male',
      currentStatus: 'active',
      currentPenId: 'pen-1',
      birthWeight: 1.5,
      birthDate: '2024-01-01',
    }),
    createMockAnimal({
      id: 'animal-2',
      internalCode: 'ANIMAL-002',
      sex: 'female',
      currentStatus: 'sold',
      currentPenId: null,
      birthWeight: 1.2,
      birthDate: '2024-02-01',
    }),
  ];

  const mockPens = [
    { id: 'pen-1', name: 'Pen A', code: 'PA' },
    { id: 'pen-2', name: 'Pen B', code: 'PB' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    
    
    vi.mocked(require('../api/axiosInstance').default.get).mockResolvedValue({
      data: { data: mockAnimals },
    });
    
    vi.mocked(require('../api/infrastructure').getPens).mockResolvedValue(mockPens);
  });

  describe('Page Rendering', () => {
    it('should render the animal list page correctly', () => {
      render(<AnimalListPage />);
      
      expect(screen.getByText('Inventario de Animales')).toBeInTheDocument();
      expect(screen.getByText('Gestiona y rastrea el historial de tu ganado')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Agregar Animal/ })).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Buscar por código o ID electrónico...')).toBeInTheDocument();
    });

    it('should render filter dropdown correctly', () => {
      render(<AnimalListPage />);
      
      expect(screen.getByDisplayValue('Todos los Estados')).toBeInTheDocument();
      expect(screen.getByText('Todos los Estados')).toBeInTheDocument();
    });

    it('should render table headers correctly', () => {
      render(<AnimalListPage />);
      
      expect(screen.getByText('Código Interno')).toBeInTheDocument();
      expect(screen.getByText('Sexo')).toBeInTheDocument();
      expect(screen.getByText('Peso (kg)')).toBeInTheDocument();
      expect(screen.getByText('Corral')).toBeInTheDocument();
      expect(screen.getByText('Edad')).toBeInTheDocument();
      expect(screen.getByText('Estado')).toBeInTheDocument();
      expect(screen.getByText('Acciones')).toBeInTheDocument();
    });
  });

  describe('Data Loading', () => {
    it('should display loading skeleton while fetching data', () => {
      
      vi.mocked(require('@tanstack/react-query').useQuery).mockReturnValueOnce({
        data: undefined,
        isLoading: true,
      } as any);

      render(<AnimalListPage />);
      
      
      const skeletonElements = document.querySelectorAll('.animate-pulse');
      expect(skeletonElements.length).toBeGreaterThan(0);
    });

    it('should display animals when data is loaded', async () => {
      render(<AnimalListPage />);
      
      await waitFor(() => {
        expect(screen.getByText('ANIMAL-001')).toBeInTheDocument();
        expect(screen.getByText('ANIMAL-002')).toBeInTheDocument();
        expect(screen.getByText('Macho')).toBeInTheDocument();
        expect(screen.getByText('Hembra')).toBeInTheDocument();
      });
    });

    it('should display empty state when no animals found', async () => {
      vi.mocked(require('../api/axiosInstance').default.get).mockResolvedValue({
        data: { data: [] },
      });

      render(<AnimalListPage />);
      
      await waitFor(() => {
        expect(screen.getByText('No se encontraron animales')).toBeInTheDocument();
        expect(screen.getByText('Intenta ajustar tus filtros o términos de búsqueda')).toBeInTheDocument();
      });
    });
  });

  describe('Search Functionality', () => {
    it('should filter animals by search term', async () => {
      render(<AnimalListPage />);
      
      await waitFor(() => {
        expect(screen.getByText('ANIMAL-001')).toBeInTheDocument();
        expect(screen.getByText('ANIMAL-002')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText('Buscar por código o ID electrónico...');
      await userEvent.clear(searchInput);
      await userEvent.type(searchInput, 'ANIMAL-001');

      await waitFor(() => {
        expect(screen.getByText('ANIMAL-001')).toBeInTheDocument();
        expect(screen.queryByText('ANIMAL-002')).not.toBeInTheDocument();
      });
    });

    it('should show no results for non-matching search', async () => {
      render(<AnimalListPage />);
      
      await waitFor(() => {
        expect(screen.getByText('ANIMAL-001')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText('Buscar por código o ID electrónico...');
      await userEvent.clear(searchInput);
      await userEvent.type(searchInput, 'NONEXISTENT');

      await waitFor(() => {
        expect(screen.getByText('No se encontraron animales')).toBeInTheDocument();
      });
    });
  });

  describe('Filter Functionality', () => {
    it('should filter animals by status', async () => {
      render(<AnimalListPage />);
      
      await waitFor(() => {
        expect(screen.getByText('ANIMAL-001')).toBeInTheDocument();
        expect(screen.getByText('ANIMAL-002')).toBeInTheDocument();
      });

      const statusFilter = screen.getByDisplayValue('Todos los Estados');
      await userEvent.selectOptions(statusFilter, 'active');

      await waitFor(() => {
        
        expect(screen.getByText('ANIMAL-001')).toBeInTheDocument();
        expect(screen.queryByText('ANIMAL-002')).not.toBeInTheDocument();
      });
    });

    it('should call API with correct parameters when filtering', async () => {
      const mockGet = vi.mocked(require('../api/axiosInstance').default.get);
      
      render(<AnimalListPage />);
      
      const statusFilter = screen.getByDisplayValue('Todos los Estados');
      await userEvent.selectOptions(statusFilter, 'sold');

      await waitFor(() => {
        expect(mockGet).toHaveBeenCalledWith('/animals', {
          params: { status: 'sold' },
        });
      });
    });
  });

  describe('Animal Actions', () => {
    it('should open animal form when clicking Add Animal button', async () => {
      render(<AnimalListPage />);
      
      const addButton = screen.getByRole('button', { name: /Agregar Animal/ });
      await userEvent.click(addButton);

      expect(screen.getByTestId('animal-form')).toBeInTheDocument();
      expect(screen.getByTestId('form-is-open')).toBeInTheDocument();
    });

    it('should open dropdown menu when clicking actions button', async () => {
      render(<AnimalListPage />);
      
      await waitFor(() => {
        expect(screen.getByText('ANIMAL-001')).toBeInTheDocument();
      });

      
      const actionsButtons = screen.getAllByRole('button').filter(button => 
        button.querySelector('svg') && !button.textContent?.includes('Agregar')
      );
      const firstActionsButton = actionsButtons.find(button => 
        button.closest('tr')?.textContent?.includes('ANIMAL-001')
      );

      if (firstActionsButton) {
        await userEvent.click(firstActionsButton);

        await waitFor(() => {
          expect(screen.getByText('Ver Detalles')).toBeInTheDocument();
          expect(screen.getByText('Editar Animal')).toBeInTheDocument();
          expect(screen.getByText('Eliminar')).toBeInTheDocument();
        });
      }
    });

    it('should close dropdown when clicking outside', async () => {
      render(<AnimalListPage />);
      
      await waitFor(() => {
        expect(screen.getByText('ANIMAL-001')).toBeInTheDocument();
      });

      const actionsButton = screen.getAllByRole('button').find(button => 
        button.closest('tr')?.textContent?.includes('ANIMAL-001') && 
        button.querySelector('svg')
      );

      if (actionsButton) {
        await userEvent.click(actionsButton);

        await waitFor(() => {
          expect(screen.getByText('Ver Detalles')).toBeInTheDocument();
        });

        
        fireEvent.click(document.body);

        await waitFor(() => {
          expect(screen.queryByText('Ver Detalles')).not.toBeInTheDocument();
        });
      }
    });
  });

  describe('Form Integration', () => {
    it('should open form in edit mode when clicking edit action', async () => {
      render(<AnimalListPage />);
      
      await waitFor(() => {
        expect(screen.getByText('ANIMAL-001')).toBeInTheDocument();
      });

      
      const actionsButton = screen.getAllByRole('button').find(button => 
        button.closest('tr')?.textContent?.includes('ANIMAL-001')
      );

      if (actionsButton) {
        await userEvent.click(actionsButton);

        await waitFor(() => {
          const editButton = screen.getByText('Editar Animal');
          expect(editButton).toBeInTheDocument();
        });

        await userEvent.click(screen.getByText('Editar Animal'));

        await waitFor(() => {
          expect(screen.getByTestId('animal-form')).toBeInTheDocument();
        });
      }
    });

    it('should close form when calling handleClose', async () => {
      render(<AnimalListPage />);
      
      
      const addButton = screen.getByRole('button', { name: /Agregar Animal/ });
      await userEvent.click(addButton);

      await waitFor(() => {
        expect(screen.getByTestId('animal-form')).toBeInTheDocument();
      });

      
      await userEvent.click(screen.getByTestId('form-close'));

      await waitFor(() => {
        expect(screen.queryByTestId('animal-form')).not.toBeInTheDocument();
      });
    });

    it('should handle form submission correctly', async () => {
      const mockPost = vi.mocked(require('../api/axiosInstance').default.post);
      mockPost.mockResolvedValue({ data: { success: true } });

      render(<AnimalListPage />);
      
      
      const addButton = screen.getByRole('button', { name: /Agregar Animal/ });
      await userEvent.click(addButton);

      await waitFor(() => {
        expect(screen.getByTestId('animal-form')).toBeInTheDocument();
      });

      
      await userEvent.click(screen.getByTestId('form-submit'));

      await waitFor(() => {
        expect(mockPost).toHaveBeenCalledWith('/animals', {
          internalCode: 'TEST-001',
        });
      });
    });
  });

  describe('Details Modal Integration', () => {
    it('should open details modal when clicking view action', async () => {
      render(<AnimalListPage />);
      
      await waitFor(() => {
        expect(screen.getByText('ANIMAL-001')).toBeInTheDocument();
      });

      
      const actionsButton = screen.getAllByRole('button').find(button => 
        button.closest('tr')?.textContent?.includes('ANIMAL-001')
      );

      if (actionsButton) {
        await userEvent.click(actionsButton);

        await waitFor(() => {
          const viewButton = screen.getByText('Ver Detalles');
          expect(viewButton).toBeInTheDocument();
        });

        await userEvent.click(screen.getByText('Ver Detalles'));

        await waitFor(() => {
          expect(screen.getByTestId('animal-details-modal')).toBeInTheDocument();
          expect(screen.getByTestId('modal-animal-id')).toHaveTextContent('animal-1');
        });
      }
    });

    it('should close details modal when calling handleClose', async () => {
      render(<AnimalListPage />);
      
      await waitFor(() => {
        expect(screen.getByText('ANIMAL-001')).toBeInTheDocument();
      });

      
      const actionsButton = screen.getAllByRole('button').find(button => 
        button.closest('tr')?.textContent?.includes('ANIMAL-001')
      );

      if (actionsButton) {
        await userEvent.click(actionsButton);

        await waitFor(() => {
          const viewButton = screen.getByText('Ver Detalles');
          expect(viewButton).toBeInTheDocument();
        });

        await userEvent.click(screen.getByText('Ver Detalles'));

        await waitFor(() => {
          expect(screen.getByTestId('animal-details-modal')).toBeInTheDocument();
        });

        
        await userEvent.click(screen.getByTestId('modal-close'));

        await waitFor(() => {
          expect(screen.queryByTestId('animal-details-modal')).not.toBeInTheDocument();
        });
      }
    });
  });

  describe('Data Display', () => {
    it('should display animal information correctly', async () => {
      render(<AnimalListPage />);
      
      await waitFor(() => {
        expect(screen.getByText('ANIMAL-001')).toBeInTheDocument();
        expect(screen.getByText('Macho')).toBeInTheDocument();
        expect(screen.getByText('1.5 kg')).toBeInTheDocument();
        expect(screen.getByText('PA')).toBeInTheDocument();
        expect(screen.getByText('Activo')).toBeInTheDocument();
      });
    });

    it('should display correct status and stage badges', async () => {
      render(<AnimalListPage />);
      
      await waitFor(() => {
        
        const activeBadge = screen.getByText('Activo');
        expect(activeBadge).toHaveClass('bg-green-50', 'text-green-700');

        
        const soldBadge = screen.getByText('Vendido');
        expect(soldBadge).toHaveClass('bg-gray-50', 'text-gray-700');
      });
    });

    it('should display correct pen information', async () => {
      render(<AnimalListPage />);
      
      await waitFor(() => {
        
        expect(screen.getByText('PA')).toBeInTheDocument();
        
        
        expect(screen.getByText('Sin asignar')).toBeInTheDocument();
      });
    });

    it('should format birth date correctly', async () => {
      render(<AnimalListPage />);
      
      await waitFor(() => {
        const birthDate = screen.getByText('1/1/2024'); 
        expect(birthDate).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle API errors gracefully', async () => {
      vi.mocked(require('../api/axiosInstance').default.get).mockRejectedValue(
        new Error('Network error')
      );

      render(<AnimalListPage />);
      
      
      await waitFor(() => {
        expect(screen.getByText('No se encontraron animales')).toBeInTheDocument();
      });
    });
  });
});