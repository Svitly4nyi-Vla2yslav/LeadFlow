import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import { api } from '../api/client';
import { Client, Message } from '../types';

export default function Messages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [error, setError] = useState('');
  useEffect(() => {
    Promise.all([api.get('/api/messages'), api.get('/api/clients')])
      .then(([messageResponse, clientResponse]) => { setMessages(messageResponse.data); setClients(clientResponse.data); })
      .catch(() => setError('Kontaktjournal konnte nicht geladen werden.'));
  }, []);
  const names = useMemo(() => Object.fromEntries(clients.map(client => [client.id, client.company])), [clients]);
  return <Card>
    <h2 style={{ marginTop: 0 }}>Kontaktjournal</h2>
    <p style={{ opacity: .7 }}>Dokumentierte Inbound- und Outbound-Aktivitäten. Statuswechsel werden separat im Lead-Profil bestätigt.</p>
    {error && <p role="alert">{error}</p>}
    <div className="timeline">{messages.map(message => <div key={message.id}><strong><Link to={`/clients/${message.clientId}`}>{names[message.clientId] || 'Unbekannter Lead'}</Link> · {message.direction === 'out' ? 'Outbound' : 'Inbound'} · {message.channel}</strong><small>{new Date(message.createdAt).toLocaleString('de-DE')}</small><p>{message.body}</p></div>)}</div>
    {!messages.length && !error && <p>Noch keine Kontakte protokolliert.</p>}
  </Card>;
}
