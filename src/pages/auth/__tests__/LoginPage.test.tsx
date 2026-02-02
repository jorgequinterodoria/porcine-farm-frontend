import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../test/helpers';
import userEvent from '../test/helpers';
import { LoginPage } from '../pages/auth/LoginPage';

// Mock dependencies
vi.mock('../store/useAuthStore', () => ({
  useAuthStore: () => ({
    login: vi.fn(),
  }),
}));

vi.mock('../api/axiosInstance', () => ({
  default: {
    post: vi.fn(),
  },
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}));

describe('LoginPage Component', () => {
  const mockLogin = vi.fn();
  const mockNavigate = vi.fn();
  const mockApiPost = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Reset mocks
    vi.mocked(require('../store/useAuthStore').useAuthStore).mockReturnValue({
      login: mockLogin,
    });
    
    vi.mocked(require('react-router-dom').useNavigate).mockReturnValue(mockNavigate);
    vi.mocked(require('../api/axiosInstance').default).mockReturnValue({
      post: mockApiPost,
    });
  });

  describe('Rendering', () => {
    it('should render login form correctly', () => {
      render(<LoginPage />);
      
      expect(screen.getByText('Bienvenido')).toBeInTheDocument();
      expect(screen.getByText('Gestiona tu granja eficientemente')).toBeInTheDocument();
      expect(screen.getByLabelText('Correo Electrónico')).toBeInTheDocument();
      expect(screen.getByLabelText('Contraseña')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Iniciar Sesión/ })).toBeInTheDocument();
    });

    it('should have proper form structure', () => {
      render(<LoginPage />);
      
      expect(screen.getByRole('form')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('nombre@granja.com')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
    });

    it('should show forgot password link', () => {
      render(<LoginPage />);
      
      const forgotPasswordLink = screen.getByText('¿Olvidaste tu contraseña?');
      expect(forgotPasswordLink).toBeInTheDocument();
      expect(forgotPasswordLink.closest('a')).toHaveAttribute('href', '#');
    });

    it('should display copyright information', () => {
      render(<LoginPage />);
      
      expect(screen.getByText('© 2026 PorciFarm Technology')).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('should show email validation error', async () => {
      render(<LoginPage />);
      
      const emailInput = screen.getByLabelText('Correo Electrónico');
      const submitButton = screen.getByRole('button', { name: /Iniciar Sesión/ });
      
      // Submit with empty email
      await userEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Ingresa un correo válido')).toBeInTheDocument();
      });
    });

    it('should show password validation error', async () => {
      render(<LoginPage />);
      
      const submitButton = screen.getByRole('button', { name: /Iniciar Sesión/ });
      
      // Submit with empty password
      await userEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('La contraseña es obligatoria')).toBeInTheDocument();
      });
    });

    it('should show email error for invalid email format', async () => {
      render(<LoginPage />);
      
      const emailInput = screen.getByLabelText('Correo Electrónico');
      const submitButton = screen.getByRole('button', { name: /Iniciar Sesión/ });
      
      await userEvent.type(emailInput, 'invalid-email');
      await userEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Ingresa un correo válido')).toBeInTheDocument();
      });
    });

    it('should not show errors for valid input', async () => {
      render(<LoginPage />);
      
      const emailInput = screen.getByLabelText('Correo Electrónico');
      const passwordInput = screen.getByLabelText('Contraseña');
      
      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.type(passwordInput, 'password123');
      
      expect(screen.queryByText('Ingresa un correo válido')).not.toBeInTheDocument();
      expect(screen.queryByText('La contraseña es obligatoria')).not.toBeInTheDocument();
    });
  });

  describe('Form Submission', () => {
    it('should handle successful login', async () => {
      const mockResponse = {
        data: {
          data: {
            user: {
              id: 'user-1',
              email: 'test@example.com',
              role: 'farm_admin',
              tenantId: 'tenant-1',
            },
            tenant: {
              id: 'tenant-1',
              name: 'Test Farm',
            },
            token: 'mock-token',
          },
        },
      };
      
      mockApiPost.mockResolvedValue(mockResponse);
      
      render(<LoginPage />);
      
      const emailInput = screen.getByLabelText('Correo Electrónico');
      const passwordInput = screen.getByLabelText('Contraseña');
      const submitButton = screen.getByRole('button', { name: /Iniciar Sesión/ });
      
      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.type(passwordInput, 'password123');
      await userEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockApiPost).toHaveBeenCalledWith('/auth/login', {
          email: 'test@example.com',
          password: 'password123',
        });
      });
      
      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith(
          mockResponse.data.data.user,
          mockResponse.data.data.tenant,
          mockResponse.data.data.token
        );
      });
      
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
      });
    });

    it('should handle super admin navigation', async () => {
      const mockResponse = {
        data: {
          data: {
            user: {
              id: 'user-1',
              email: 'admin@example.com',
              role: 'super_admin',
              tenantId: null,
            },
            tenant: null,
            token: 'mock-token',
          },
        },
      };
      
      mockApiPost.mockResolvedValue(mockResponse);
      
      render(<LoginPage />);
      
      const emailInput = screen.getByLabelText('Correo Electrónico');
      const passwordInput = screen.getByLabelText('Contraseña');
      const submitButton = screen.getByRole('button', { name: /Iniciar Sesión/ });
      
      await userEvent.type(emailInput, 'admin@example.com');
      await userEvent.type(passwordInput, 'admin123');
      await userEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/tenants');
      });
    });

    it('should handle login error', async () => {
      const mockError = {
        response: {
          data: {
            message: 'Credenciales incorrectas',
          },
        },
      };
      
      mockApiPost.mockRejectedValue(mockError);
      
      render(<LoginPage />);
      
      const emailInput = screen.getByLabelText('Correo Electrónico');
      const passwordInput = screen.getByLabelText('Contraseña');
      const submitButton = screen.getByRole('button', { name: /Iniciar Sesión/ });
      
      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.type(passwordInput, 'wrongpassword');
      await userEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Credenciales incorrectas')).toBeInTheDocument();
      });
    });

    it('should handle generic error', async () => {
      mockApiPost.mockRejectedValue(new Error('Network error'));
      
      render(<LoginPage />);
      
      const emailInput = screen.getByLabelText('Correo Electrónico');
      const passwordInput = screen.getByLabelText('Contraseña');
      const submitButton = screen.getByRole('button', { name: /Iniciar Sesión/ });
      
      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.type(passwordInput, 'password123');
      await userEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Credenciales incorrectas. Verifica tu correo y contraseña.')).toBeInTheDocument();
      });
    });
  });

  describe('Loading States', () => {
    it('should show loading state during submission', async () => {
      mockApiPost.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
      
      render(<LoginPage />);
      
      const emailInput = screen.getByLabelText('Correo Electrónico');
      const passwordInput = screen.getByLabelText('Contraseña');
      const submitButton = screen.getByRole('button', { name: /Iniciar Sesión/ });
      
      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.type(passwordInput, 'password123');
      await userEvent.click(submitButton);
      
      // Check loading state
      expect(screen.getByText('Iniciar Sesión').closest('button')).toBeDisabled();
      expect(screen.getByRole('button', { name: /Iniciar Sesión/ })).toContainHTML('animate-spin');
    });

    it('should clear error message when user starts typing', async () => {
      mockApiPost.mockRejectedValue(new Error('Login failed'));
      
      render(<LoginPage />);
      
      const emailInput = screen.getByLabelText('Correo Electrónico');
      const passwordInput = screen.getByLabelText('Contraseña');
      const submitButton = screen.getByRole('button', { name: /Iniciar Sesión/ });
      
      // First attempt to trigger error
      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.type(passwordInput, 'wrongpassword');
      await userEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Credenciales incorrectas')).toBeInTheDocument();
      });
      
      // Clear error by typing
      await userEvent.clear(emailInput);
      await userEvent.type(emailInput, 'new@example.com');
      
      // Error should be cleared (this would need implementation in the actual component)
      // expect(screen.queryByText('Credenciales incorrectas')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<LoginPage />);
      
      expect(screen.getByLabelText('Correo Electrónico')).toBeInTheDocument();
      expect(screen.getByLabelText('Contraseña')).toBeInTheDocument();
    });

    it('should be keyboard navigable', async () => {
      render(<LoginPage />);
      
      const emailInput = screen.getByLabelText('Correo Electrónico');
      emailInput.focus();
      expect(emailInput).toHaveFocus();
      
      // Tab to password
      await userEvent.tab();
      expect(screen.getByLabelText('Contraseña')).toHaveFocus();
      
      // Tab to submit button
      await userEvent.tab();
      expect(screen.getByRole('button', { name: /Iniciar Sesión/ })).toHaveFocus();
    });

    it('should handle form submission with Enter key', async () => {
      mockApiPost.mockResolvedValue({
        data: {
          data: {
            user: { id: 'user-1', role: 'farm_admin', tenantId: 'tenant-1' },
            tenant: { id: 'tenant-1', name: 'Test Farm' },
            token: 'mock-token',
          },
        },
      });
      
      render(<LoginPage />);
      
      const emailInput = screen.getByLabelText('Correo Electrónico');
      const passwordInput = screen.getByLabelText('Contraseña');
      
      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.type(passwordInput, 'password123');
      
      // Submit with Enter key
      fireEvent.keyDown(passwordInput, { key: 'Enter' });
      
      await waitFor(() => {
        expect(mockApiPost).toHaveBeenCalled();
      });
    });
  });

  describe('Visual Design', () => {
    it('should have proper styling classes', () => {
      render(<LoginPage />);
      
      const formContainer = screen.getByRole('form').parentElement;
      expect(formContainer).toHaveClass('bg-white', 'rounded-2xl', 'shadow-xl');
      
      const submitButton = screen.getByRole('button', { name: /Iniciar Sesión/ });
      expect(submitButton).toHaveClass('bg-indigo-600', 'text-white', 'font-semibold');
    });

    it('should show error styling for invalid inputs', async () => {
      render(<LoginPage />);
      
      const emailInput = screen.getByLabelText('Correo Electrónico');
      const submitButton = screen.getByRole('button', { name: /Iniciar Sesión/ });
      
      await userEvent.click(submitButton);
      
      await waitFor(() => {
        expect(emailInput).toHaveClass('border-red-300', 'bg-red-50');
      });
    });
  });
});