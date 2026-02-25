import { useAuthStore } from '@/src/stores/auth.store';
import { mobileAuthService } from '@/src/services/mobile.auth.service';
import { clearTokens, getToken } from '@/src/lib/api-client';

jest.mock('@/src/services/mobile.auth.service');
jest.mock('@/src/lib/api-client', () => ({
  apiClient: { post: jest.fn(), get: jest.fn(), patch: jest.fn() },
  saveTokens: jest.fn(),
  clearTokens: jest.fn(),
  getToken: jest.fn(),
}));

const mockMe = mobileAuthService.me as jest.Mock;
const mockLogout = mobileAuthService.logout as jest.Mock;
const mockGetToken = getToken as jest.Mock;

describe('useAuthStore', () => {
  beforeEach(() => {
    // Reset store state
    useAuthStore.setState({
      cliente: null,
      isAuthenticated: false,
      isLoading: true,
    });
    jest.clearAllMocks();
  });

  describe('setCliente', () => {
    it('sets cliente and marks authenticated', () => {
      useAuthStore.getState().setCliente({
        id: 1,
        nome: 'Test',
        email: 'test@example.com',
        cpf: '12345678901',
        telefone: null,
        avatar_url: null,
        created_at: '',
        updated_at: '',
      });

      const state = useAuthStore.getState();
      expect(state.cliente?.nome).toBe('Test');
      expect(state.isAuthenticated).toBe(true);
    });

    it('clears auth when set to null', () => {
      useAuthStore.getState().setCliente(null);

      const state = useAuthStore.getState();
      expect(state.cliente).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('initialize', () => {
    it('loads user from token', async () => {
      mockGetToken.mockResolvedValue('valid-token');
      mockMe.mockResolvedValue({ id: 1, nome: 'Test', email: 'test@example.com' });

      await useAuthStore.getState().initialize();

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(true);
      expect(state.isLoading).toBe(false);
    });

    it('handles no token', async () => {
      mockGetToken.mockResolvedValue(null);

      await useAuthStore.getState().initialize();

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);
    });

    it('handles API error and clears tokens', async () => {
      mockGetToken.mockResolvedValue('expired-token');
      mockMe.mockRejectedValue(new Error('Unauthorized'));

      await useAuthStore.getState().initialize();

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(clearTokens).toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('clears state on logout', async () => {
      useAuthStore.setState({
        cliente: { id: 1, nome: 'Test' } as any,
        isAuthenticated: true,
      });
      mockLogout.mockResolvedValue(undefined);

      await useAuthStore.getState().logout();

      const state = useAuthStore.getState();
      expect(state.cliente).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });
  });
});
