import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("E-mail inv\u00e1lido"),
  password: z.string().min(8, "Senha deve ter no m\u00ednimo 8 caracteres"),
});

export const registerSchema = z.object({
  nome: z.string().min(3, "Nome deve ter no m\u00ednimo 3 caracteres"),
  email: z.string().email("E-mail inv\u00e1lido"),
  cpf: z.string().length(11, "CPF deve ter 11 d\u00edgitos"),
  telefone: z.string().min(10, "Telefone inv\u00e1lido"),
  password: z.string().min(8, "Senha deve ter no m\u00ednimo 8 caracteres"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Senhas n\u00e3o conferem",
  path: ["confirmPassword"],
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
