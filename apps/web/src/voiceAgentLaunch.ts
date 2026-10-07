type Translate = (key: string) => string;

// voiceAgentLaunchError приймає виняток запуску та функцію перекладу, а повертає безпечне локалізоване повідомлення.
// Спочатку розрізняє заблоковане popup-вікно й відсутню production-конфігурацію, для решти причин використовує загальний fallback.
export const voiceAgentLaunchError = (exception: any, t: Translate) => {
  if (exception?.message === 'popup_blocked') return t('errors.popupBlocked');
  if (exception?.response?.data?.error === 'voice_agent_app_not_configured') {
    return t('voiceAgent.productionNotConfigured');
  }
  return t('voiceAgent.unavailable');
};
