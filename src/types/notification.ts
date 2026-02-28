/** Notification type enum */
export type NotificationType =
  | "cashback_recebido"
  | "cashback_expirado"
  | "cashback_utilizado"
  | "campanha_nova"
  | "contestacao_atualizada"
  | "sistema";

/** In-app notification */
export interface MobileNotification {
  id: number;
  titulo: string;
  mensagem: string;
  tipo: NotificationType;
  lida: boolean;
  dados_extras: Record<string, unknown> | null;
  created_at: string;
}

/** Notification list response (inner data from API envelope) */
export interface NotificationListResponse {
  notifications: MobileNotification[];
  meta: {
    total_unread: number;
    next_cursor: string | null;
    has_more_pages: boolean;
  };
}

/** Notification preferences */
export interface NotificationPreferences {
  push_enabled: boolean;
  email_enabled: boolean;
  marketing_enabled: boolean;
}
