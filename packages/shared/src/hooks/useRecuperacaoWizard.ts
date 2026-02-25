import { useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  EmailStepData,
  emailStepSchema,
  CodeStepData,
  codeStepSchema,
  NewPasswordStepData,
  newPasswordStepSchema,
} from '../schemas/auth'
import { getPasswordStrength } from '../utils/security'

export type RecuperacaoStep = 'email' | 'codigo' | 'nova-senha' | 'sucesso'

export function useRecuperacaoWizard() {
  const [step, setStep] = useState<RecuperacaoStep>('email')
  const [isLoading, setIsLoading] = useState(false)
  const [emailValue, setEmailValue] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)

  const emailForm = useForm<EmailStepData>({
    resolver: zodResolver(emailStepSchema),
    mode: 'onBlur',
    defaultValues: { email: '' },
  })

  const codeForm = useForm<CodeStepData>({
    resolver: zodResolver(codeStepSchema),
    mode: 'onBlur',
    defaultValues: { codigo: '' },
  })

  const passwordForm = useForm<NewPasswordStepData>({
    resolver: zodResolver(newPasswordStepSchema),
    mode: 'onBlur',
    defaultValues: { novaSenha: '', confirmarSenha: '' },
  })

  const handleEnviarEmail = useCallback(
    async (data: EmailStepData) => {
      setIsLoading(true)
      try {
        // TODO(API-004): Replace with actual API call — POST /api/auth/forgot-password
        await new Promise((resolve) => setTimeout(resolve, 1500))
        setEmailValue(data.email)
        setStep('codigo')
      } catch {
        emailForm.setError('root', { message: 'Erro ao enviar e-mail. Tente novamente.' })
      } finally {
        setIsLoading(false)
      }
    },
    [emailForm]
  )

  const handleValidarCodigo = useCallback(
    async (_data: CodeStepData) => {
      setIsLoading(true)
      try {
        // TODO(API-005): Replace with actual API call — POST /api/auth/verify-code
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setStep('nova-senha')
      } catch {
        codeForm.setError('root', { message: 'Código inválido. Verifique e tente novamente.' })
      } finally {
        setIsLoading(false)
      }
    },
    [codeForm]
  )

  const handleRedefinirSenha = useCallback(
    async (_data: NewPasswordStepData) => {
      setIsLoading(true)
      try {
        // TODO(API-006): Replace with actual API call — POST /api/auth/reset-password
        await new Promise((resolve) => setTimeout(resolve, 1500))
        setStep('sucesso')
      } catch {
        passwordForm.setError('root', { message: 'Erro ao redefinir senha. Tente novamente.' })
      } finally {
        setIsLoading(false)
      }
    },
    [passwordForm]
  )

  const toggleMostrarSenha = useCallback(() => setMostrarSenha((prev) => !prev), [])
  const goToEmail = useCallback(() => setStep('email'), [])

  const senhaValue = passwordForm.watch('novaSenha')
  const passwordStrength = getPasswordStrength(senhaValue || '')

  return {
    step,
    isLoading,
    emailValue,
    mostrarSenha,
    emailForm,
    codeForm,
    passwordForm,
    passwordStrength,
    handleEnviarEmail,
    handleValidarCodigo,
    handleRedefinirSenha,
    toggleMostrarSenha,
    goToEmail,
  }
}
