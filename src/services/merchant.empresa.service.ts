import { apiClient, saveTokens } from "@/src/lib/api-client";
import type { Empresa, SwitchEmpresaResponse } from "@/src/types/merchant";

const PREFIX = "/api/v1";

export const merchantEmpresaService = {
  async getEmpresas(): Promise<Empresa[]> {
    const res = await apiClient.get<{ data: Empresa[] }>(`${PREFIX}/empresas`);
    return res.data.data;
  },

  async switchEmpresa(empresaId: number): Promise<SwitchEmpresaResponse> {
    const res = await apiClient.post<SwitchEmpresaResponse>(`${PREFIX}/auth/switch-empresa`, {
      empresa_id: empresaId,
    });
    await saveTokens(res.data.token);
    return res.data;
  },
};
