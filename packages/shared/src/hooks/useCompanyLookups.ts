import { useState } from 'react'
import type { UseFormGetValues, UseFormReset } from 'react-hook-form'
import api from '../services/apiClient'
import type { CompanyFormData } from '../schemas/company'
import { maskTelefone, maskCep, onlyDigits } from '../utils/masks'

interface UseCompanyLookupsOptions {
  getValues: UseFormGetValues<CompanyFormData>
  reset: UseFormReset<CompanyFormData>
  onSuccess?: (message: string) => void
  onError?: (message: string) => void
}

export function useCompanyLookups({ getValues, reset, onSuccess, onError }: UseCompanyLookupsOptions) {
  const [isLoadingCnpj, setIsLoadingCnpj] = useState(false)
  const [isLoadingCep, setIsLoadingCep] = useState(false)

  const fetchCnpjData = async (cnpjDigits: string) => {
    setIsLoadingCnpj(true)
    try {
      const resp = await api.get(`https://publica.cnpj.ws/cnpj/${cnpjDigits}`)
      const data = resp.data as Record<string, any>
      const est = data.estabelecimento || {}
      const current = getValues()

      const updates: Partial<CompanyFormData> = {}

      if (data.razao_social) updates.razaoSocial = data.razao_social
      if (est.nome_fantasia && !current.nomeLoja) updates.nomeLoja = est.nome_fantasia
      if (est.email && !current.emailLoja) updates.emailLoja = est.email
      if (est.ddd1 && est.telefone1 && !current.telefone) {
        updates.telefone = maskTelefone(`${est.ddd1}${est.telefone1}`)
      }
      if (est.cep) {
        updates.cep = maskCep(onlyDigits(est.cep))
        if (est.logradouro) {
          updates.rua = est.tipo_logradouro ? `${est.tipo_logradouro} ${est.logradouro}` : est.logradouro
        }
        if (est.numero) updates.numero = est.numero
        if (est.complemento) updates.complemento = est.complemento
        if (est.bairro) updates.bairro = est.bairro
        if (est.cidade?.nome) updates.cidade = est.cidade.nome
        if (est.estado?.sigla) updates.estado = est.estado.sigla
      }

      reset({ ...current, ...updates }, { keepDefaultValues: true })
      onSuccess?.('CNPJ consultado com sucesso!')
    } catch {
      onError?.('Não foi possível consultar o CNPJ. Verifique o número e tente novamente.')
    } finally {
      setIsLoadingCnpj(false)
    }
  }

  const fetchCepData = async (cepDigits: string) => {
    setIsLoadingCep(true)
    try {
      const resp = await api.get(`https://viacep.com.br/ws/${cepDigits}/json/`)
      const data = resp.data as Record<string, any>
      if (data.erro) throw new Error('CEP nao encontrado')
      const current = getValues()
      const updates: Partial<CompanyFormData> = {}

      if (data.logradouro) updates.rua = data.logradouro
      if (data.complemento) updates.complemento = data.complemento
      if (data.bairro) updates.bairro = data.bairro
      if (data.localidade) updates.cidade = data.localidade
      if (data.uf) updates.estado = data.uf

      reset({ ...current, ...updates }, { keepDefaultValues: true })
      onSuccess?.('Endereço preenchido automaticamente!')
    } catch {
      onError?.('CEP não encontrado. Verifique o número e tente novamente.')
    } finally {
      setIsLoadingCep(false)
    }
  }

  return { fetchCnpjData, fetchCepData, isLoadingCnpj, isLoadingCep }
}
