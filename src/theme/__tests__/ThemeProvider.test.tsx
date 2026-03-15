import React from 'react';
import { describe, it, expect, beforeEach } from '@jest/globals';
import { renderHook, act } from '@testing-library/react-native';
import * as RN from 'react-native';
import { ThemeProvider, useTheme } from '../ThemeProvider';
import { colors } from '../tokens';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

describe('ThemeProvider / useTheme', () => {
  beforeEach(() => {
    jest.spyOn(RN, 'useColorScheme').mockReturnValue('light');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // C1: Estado inicial correto (mode=system, isDark depende do sistema)
  it('deve fornecer estado inicial correto (mode=system, light)', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.mode).toBe('system');
    expect(result.current.isDark).toBe(false);
    expect(result.current.colors.background.default).toBe(colors.background.default.light);
    expect(result.current.colors.text.primary).toBe(colors.text.primary.light);
    expect(result.current.colors.primary.main).toBe(colors.primary.main);
    expect(result.current.setMode).toBeInstanceOf(Function);
  });

  // C2: Sistema em dark mode
  it('deve resolver isDark=true quando sistema está em dark mode', () => {
    jest.spyOn(RN, 'useColorScheme').mockReturnValue('dark');
    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.mode).toBe('system');
    expect(result.current.isDark).toBe(true);
    expect(result.current.colors.background.default).toBe(colors.background.default.dark);
    expect(result.current.colors.text.primary).toBe(colors.text.primary.dark);
  });

  // C3: setMode altera o modo corretamente
  it('deve alterar para dark quando setMode("dark")', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    act(() => {
      result.current.setMode('dark');
    });

    expect(result.current.mode).toBe('dark');
    expect(result.current.isDark).toBe(true);
    expect(result.current.colors.background.default).toBe(colors.background.default.dark);
  });

  // C4: setMode("light") força light independente do sistema
  it('deve forçar light quando setMode("light") mesmo com sistema dark', () => {
    jest.spyOn(RN, 'useColorScheme').mockReturnValue('dark');
    const { result } = renderHook(() => useTheme(), { wrapper });

    act(() => {
      result.current.setMode('light');
    });

    expect(result.current.mode).toBe('light');
    expect(result.current.isDark).toBe(false);
    expect(result.current.colors.background.default).toBe(colors.background.default.light);
  });

  // C5: Voltar para "system" respeita o esquema do sistema
  it('deve voltar a seguir o sistema quando setMode("system")', () => {
    jest.spyOn(RN, 'useColorScheme').mockReturnValue('dark');
    const { result } = renderHook(() => useTheme(), { wrapper });

    act(() => {
      result.current.setMode('light');
    });
    expect(result.current.isDark).toBe(false);

    act(() => {
      result.current.setMode('system');
    });
    expect(result.current.isDark).toBe(true);
  });

  // C6: Cores semânticas e cashback sempre disponíveis
  it('deve incluir cores semânticas e cashback independente do tema', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.colors.semantic).toEqual(colors.semantic);
    expect(result.current.colors.cashback).toEqual(colors.cashback);
  });

  // C7: useTheme fora do Provider lança erro
  it('deve lançar erro quando useTheme é usado fora do ThemeProvider', () => {
    expect(() => {
      renderHook(() => useTheme());
    }).toThrow('useTheme must be used within a ThemeProvider');
  });

  // C8: Todas as cores são resolvidas corretamente para cada variant
  it('deve resolver todas as cores de border e primary por variant', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    // Light
    expect(result.current.colors.border.default).toBe(colors.border.default.light);
    expect(result.current.colors.primary.dark).toBe(colors.primary.dark.light);
    expect(result.current.colors.primary.surface).toBe(colors.primary.surface.light);

    // Switch to dark
    act(() => {
      result.current.setMode('dark');
    });

    expect(result.current.colors.border.default).toBe(colors.border.default.dark);
    expect(result.current.colors.primary.dark).toBe(colors.primary.dark.dark);
    expect(result.current.colors.primary.surface).toBe(colors.primary.surface.dark);
  });
});
