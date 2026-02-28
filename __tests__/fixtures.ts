/**
 * Test fixture factories.
 *
 * Every builder returns data that conforms to both the TypeScript interfaces
 * and the Zod schemas defined in `src/schemas/api-responses.ts`.
 */

import type { CashbackEntry, CashbackSaldo, EmpresaSaldo, ExtratoEntry } from '@/src/types/cashback';
import type { ClienteResource } from '@/src/types/auth';
import type { Contestacao, ContestacaoTipo, ContestacaoStatus } from '@/src/types/contestacao';
import type { MobileNotification, NotificationType } from '@/src/types/notification';
import type { ApiResponse, CursorPaginatedResponse } from '@/src/types/api';

// ---------------------------------------------------------------------------
// Helpers – monotonically increasing ID so each call is unique
// ---------------------------------------------------------------------------

let _seq = 0;
function nextId(): number {
  return ++_seq;
}

/** Reset the internal sequence counter (useful in beforeEach). */
export function resetFixtureSequence(): void {
  _seq = 0;
}

// ---------------------------------------------------------------------------
// Domain factories
// ---------------------------------------------------------------------------

export function buildCliente(overrides: Partial<ClienteResource> = {}): ClienteResource {
  const id = overrides.id ?? nextId();
  return {
    id,
    nome: 'João Silva',
    email: `joao${id}@test.com`,
    cpf: '***.***.***-00',
    telefone: '11999999999',
    created_at: '2025-01-01T00:00:00Z',
    ...overrides,
  };
}

export function buildCashbackEntry(overrides: Partial<CashbackEntry> = {}): CashbackEntry {
  const id = overrides.id ?? nextId();
  return {
    id,
    valor: 15.5,
    status: 'confirmado',
    empresa_nome: 'Loja Teste',
    empresa_id: 1,
    created_at: '2025-06-15T10:30:00Z',
    ...overrides,
  };
}

export function buildEmpresaSaldo(overrides: Partial<EmpresaSaldo> = {}): EmpresaSaldo {
  return {
    empresa_id: overrides.empresa_id ?? nextId(),
    nome_fantasia: 'Loja Teste',
    logo_url: 'https://cdn.example.com/logo.png',
    saldo: '25.00',
    ...overrides,
  };
}

export function buildCashbackSaldo(overrides: Partial<CashbackSaldo> = {}): CashbackSaldo {
  return {
    saldo_total: 150.0,
    por_empresa: [buildEmpresaSaldo()],
    proximo_a_expirar: {
      valor: 20.0,
      quantidade: 2,
    },
    ...overrides,
  };
}

export function buildExtratoEntry(overrides: Partial<ExtratoEntry> = {}): ExtratoEntry {
  const id = overrides.id ?? nextId();
  return {
    id,
    tipo: 'compra',
    valor_compra: 100.0,
    valor_cashback: 5.0,
    status_cashback: 'confirmado',
    data_expiracao: '2025-12-31T23:59:59Z',
    created_at: '2025-06-15T10:30:00Z',
    empresa: {
      id: 1,
      nome_fantasia: 'Loja Teste',
      logo_url: 'https://cdn.example.com/logo.png',
    },
    campanha: {
      id: 1,
      nome: 'Campanha Verão',
    },
    ...overrides,
  };
}

export function buildContestacao(overrides: Partial<Contestacao> = {}): Contestacao {
  const id = overrides.id ?? nextId();
  return {
    id,
    tipo: 'valor_incorreto' as ContestacaoTipo,
    descricao: 'Valor do cashback está incorreto',
    status: 'pendente' as ContestacaoStatus,
    cashback_entry_id: `cb_${id}`,
    empresa_nome: 'Loja Teste',
    valor: 10.0,
    created_at: '2025-06-20T14:00:00Z',
    updated_at: '2025-06-20T14:00:00Z',
    ...overrides,
  };
}

export function buildNotification(overrides: Partial<MobileNotification> = {}): MobileNotification {
  const id = overrides.id ?? nextId();
  return {
    id,
    titulo: 'Cashback recebido',
    mensagem: 'Você recebeu R$ 5,00 de cashback!',
    tipo: 'cashback_recebido' as NotificationType,
    lida: false,
    dados_extras: null,
    created_at: '2025-06-20T15:00:00Z',
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Envelope helpers
// ---------------------------------------------------------------------------

/**
 * Wraps `data` in the standard API success envelope.
 *
 * Conforms to `ApiResponse<T>` and passes `apiResponseSchema` validation.
 */
export function buildApiResponse<T>(data: T, message = 'Sucesso'): ApiResponse<T> {
  return {
    status: true,
    data,
    error: null,
    message,
  };
}

/**
 * Wraps an array of items in the cursor-paginated API envelope.
 *
 * Conforms to `CursorPaginatedResponse<T>` and passes
 * `cursorPaginatedResponseSchema` validation.
 */
export function buildCursorPaginated<T>(
  items: T[],
  metaOverrides: Partial<CursorPaginatedResponse<T>['data']['meta']> = {},
  message = 'Sucesso',
): CursorPaginatedResponse<T> {
  return {
    status: true,
    data: {
      data: items,
      meta: {
        next_cursor: null,
        prev_cursor: null,
        per_page: 15,
        has_more_pages: false,
        ...metaOverrides,
      },
    },
    error: null,
    message,
  };
}
