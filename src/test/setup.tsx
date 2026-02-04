import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';


afterEach(() => {
  cleanup();
});


Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), 
    removeListener: vi.fn(), 
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});


global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));


global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));


window.scroll = vi.fn();
window.scrollTo = vi.fn();


const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
vi.stubGlobal('localStorage', localStorageMock);


const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
vi.stubGlobal('sessionStorage', sessionStorageMock);


global.fetch = vi.fn();


vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useParams: () => ({}),
    useLocation: () => ({ pathname: '/' }),
    Link: ({ children, ...props }: any) => <a {...props}>{children}</a>,
  };
});


vi.mock('@/store/useAuthStore', () => ({
  useAuthStore: () => ({
    user: null,
    token: null,
    login: vi.fn(),
    logout: vi.fn(),
    isAuthenticated: false,
    isLoading: false,
  }),
}));


vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
  useMutation: vi.fn(),
  useQueryClient: () => ({
    invalidateQueries: vi.fn(),
    refetchQueries: vi.fn(),
  }),
}));


vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    form: ({ children, ...props }: any) => <form {...props}>{children}</form>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));


vi.mock('lucide-react', () => ({
  User: () => <div data-testid="user-icon"></div>,
  Menu: () => <div data-testid="menu-icon"></div>,
  X: () => <div data-testid="close-icon"></div>,
  Plus: () => <div data-testid="plus-icon"></div>,
  Edit: () => <div data-testid="edit-icon"></div>,
  Trash: () => <div data-testid="trash-icon"></div>,
  Search: () => <div data-testid="search-icon"></div>,
  Filter: () => <div data-testid="filter-icon"></div>,
  Eye: () => <div data-testid="eye-icon"></div>,
  EyeOff: () => <div data-testid="eye-off-icon"></div>,
  ChevronDown: () => <div data-testid="chevron-down-icon"></div>,
  ChevronUp: () => <div data-testid="chevron-up-icon"></div>,
  ArrowLeft: () => <div data-testid="arrow-left-icon"></div>,
  ArrowRight: () => <div data-testid="arrow-right-icon"></div>,
  Home: () => <div data-testid="home-icon"></div>,
  Settings: () => <div data-testid="settings-icon"></div>,
  LogOut: () => <div data-testid="logout-icon"></div>,
  PlusCircle: () => <div data-testid="plus-circle-icon"></div>,
  Save: () => <div data-testid="save-icon"></div>,
  XCircle: () => <div data-testid="x-circle-icon"></div>,
  Check: () => <div data-testid="check-icon"></div>,
  AlertCircle: () => <div data-testid="alert-circle-icon"></div>,
  Download: () => <div data-testid="download-icon"></div>,
  Upload: () => <div data-testid="upload-icon"></div>,
  Calendar: () => <div data-testid="calendar-icon"></div>,
  Clock: () => <div data-testid="clock-icon"></div>,
  FileText: () => <div data-testid="file-text-icon"></div>,
  Users: () => <div data-testid="users-icon"></div>,
  Building: () => <div data-testid="building-icon"></div>,
  MapPin: () => <div data-testid="map-pin-icon"></div>,
  Phone: () => <div data-testid="phone-icon"></div>,
  Mail: () => <div data-testid="mail-icon"></div>,
  Lock: () => <div data-testid="lock-icon"></div>,
  Unlock: () => <div data-testid="unlock-icon"></div>,
}));