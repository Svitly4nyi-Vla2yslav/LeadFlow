type Translate = (key: string) => string;

/**
 * Приймає невідомий виняток запуску та функцію перекладу, повертаючи безпечне локалізоване повідомлення.
 * Окремо розпізнає заблоковане popup-вікно й відсутню production-конфігурацію;
 * для решти причин повертає загальний fallback і не показує користувачеві технічні деталі.
 */
export const voiceAgentLaunchError = (exception: any, t: Translate) => {
  if (exception?.message === 'popup_blocked') return t('errors.popupBlocked');
  if (exception?.response?.data?.error === 'voice_agent_app_not_configured') {
    return t('voiceAgent.productionNotConfigured');
  }
  return t('voiceAgent.unavailable');
};
