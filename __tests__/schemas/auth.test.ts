import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateProfileSchema,
  changePasswordSchema,
  deleteAccountSchema,
  oauthSchema,
} from '@/src/schemas/auth';

describe('loginSchema', () => {
  it('validates correct login data', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      senha: '123456',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid email', () => {
    const result = loginSchema.safeParse({
      email: 'invalid',
      senha: '123456',
    });
    expect(result.success).toBe(false);
  });

  it('rejects short password', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      senha: '123',
    });
    expect(result.success).toBe(false);
  });
});

describe('registerSchema', () => {
  it('validates correct register data', () => {
    const result = registerSchema.safeParse({
      nome: 'João Silva',
      email: 'joao@example.com',
      cpf: '12345678901',
      senha: '123456',
      senha_confirmation: '123456',
    });
    expect(result.success).toBe(true);
  });

  it('rejects mismatched passwords', () => {
    const result = registerSchema.safeParse({
      nome: 'João Silva',
      email: 'joao@example.com',
      cpf: '12345678901',
      senha: '123456',
      senha_confirmation: '654321',
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid CPF format', () => {
    const result = registerSchema.safeParse({
      nome: 'João Silva',
      email: 'joao@example.com',
      cpf: '123',
      senha: '123456',
      senha_confirmation: '123456',
    });
    expect(result.success).toBe(false);
  });
});

describe('forgotPasswordSchema', () => {
  it('validates correct email', () => {
    const result = forgotPasswordSchema.safeParse({
      email: 'test@example.com',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid email', () => {
    const result = forgotPasswordSchema.safeParse({ email: '' });
    expect(result.success).toBe(false);
  });
});

describe('resetPasswordSchema', () => {
  it('validates correct reset data', () => {
    const result = resetPasswordSchema.safeParse({
      email: 'test@example.com',
      token: 'abc123',
      senha: '123456',
    });
    expect(result.success).toBe(true);
  });

  it('rejects empty token', () => {
    const result = resetPasswordSchema.safeParse({
      email: 'test@example.com',
      token: '',
      senha: '123456',
    });
    expect(result.success).toBe(false);
  });
});

describe('updateProfileSchema', () => {
  it('validates partial update', () => {
    const result = updateProfileSchema.safeParse({ nome: 'Maria' });
    expect(result.success).toBe(true);
  });

  it('validates email-only update', () => {
    const result = updateProfileSchema.safeParse({
      email: 'new@example.com',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid email in update', () => {
    const result = updateProfileSchema.safeParse({ email: 'invalid' });
    expect(result.success).toBe(false);
  });

  it('validates empty object (no changes)', () => {
    const result = updateProfileSchema.safeParse({});
    expect(result.success).toBe(true);
  });
});

describe('changePasswordSchema', () => {
  it('validates correct data', () => {
    const result = changePasswordSchema.safeParse({
      senha_atual: 'oldpass',
      nova_senha: 'newpass',
    });
    expect(result.success).toBe(true);
  });

  it('rejects empty current password', () => {
    const result = changePasswordSchema.safeParse({
      senha_atual: '',
      nova_senha: 'newpass',
    });
    expect(result.success).toBe(false);
  });

  it('rejects short new password', () => {
    const result = changePasswordSchema.safeParse({
      senha_atual: 'oldpass',
      nova_senha: '12',
    });
    expect(result.success).toBe(false);
  });
});

describe('deleteAccountSchema', () => {
  it('validates with password only', () => {
    const result = deleteAccountSchema.safeParse({ senha: 'mypassword' });
    expect(result.success).toBe(true);
  });

  it('validates with password and reason', () => {
    const result = deleteAccountSchema.safeParse({
      senha: 'mypassword',
      motivo: 'Não uso mais o app',
    });
    expect(result.success).toBe(true);
  });

  it('rejects empty password', () => {
    const result = deleteAccountSchema.safeParse({ senha: '' });
    expect(result.success).toBe(false);
  });
});

describe('oauthSchema', () => {
  it('validates Google OAuth', () => {
    const result = oauthSchema.safeParse({
      provider: 'google',
      id_token: 'google-token-abc',
    });
    expect(result.success).toBe(true);
  });

  it('validates Apple OAuth with nonce', () => {
    const result = oauthSchema.safeParse({
      provider: 'apple',
      id_token: 'apple-token-abc',
      nonce: 'random-nonce',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid provider', () => {
    const result = oauthSchema.safeParse({
      provider: 'facebook',
      id_token: 'token',
    });
    expect(result.success).toBe(false);
  });

  it('rejects empty token', () => {
    const result = oauthSchema.safeParse({
      provider: 'google',
      id_token: '',
    });
    expect(result.success).toBe(false);
  });
});
