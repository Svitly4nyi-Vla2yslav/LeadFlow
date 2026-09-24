import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import { api } from '../api/client';
import { Client, Message } from '../types';
import { useTranslation } from 'react-i18next';

const channelKeys: Record<string,string> = { email:'contactChannel.email', 'contact form':'contactChannel.contactForm', LinkedIn:'contactChannel.linkedin', WhatsApp:'contactChannel.whatsapp', 'phone/cold call':'contactChannel.phone' };

export default function Messages() {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [error, setError] = useState('');
  useEffect(() => {
    Promise.all([api.get('/api/messages'), api.get('/api/clients')])
      .then(([messageResponse, clientResponse]) => { setMessages(messageResponse.data); setClients(clientResponse.data); })
      .catch(() => setError(t('errors.messagesLoad')));
  }, [t]);
  const names = useMemo(() => Object.fromEntries(clients.map(client => [client.id, client.company])), [clients]);
  return <Card>
    <h1>{t('messages.title')}</h1>
    <p className="muted">{t('messages.subtitle')}</p>
    {error && <p role="alert">{error}</p>}
    <div className="timeline">{messages.map(message => <div key={message.id}><strong><Link to={`/clients/${message.clientId}`}>{names[message.clientId] || t('lead.unknown')}</Link> · {t(`direction.${message.direction}`)} · {t(channelKeys[message.channel])}</strong><small>{new Date(message.createdAt).toLocaleString(i18n.language)}</small><p>{message.body}</p></div>)}</div>
    {!messages.length && !error && <p>{t('messages.empty')}</p>}
  </Card>;
}
