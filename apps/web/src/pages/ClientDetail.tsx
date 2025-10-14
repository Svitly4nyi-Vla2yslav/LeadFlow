import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Card from "../components/ui/Card";
import { api } from "../api/client";
type Client = { id: string; name: string };
type Message = { id: string; channel: string; body: string };
export default function ClientDetail() {
  const { id } = useParams();
  const [client, setClient] = useState<Client | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  useEffect(() => {
    api.get(`/api/clients/${id}`).then((r) => setClient(r.data));
    api.get(`/api/messages?clientId=${id}`).then((r) => setMessages(r.data));
  }, [id]);
  return (
    <div style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr 1fr" }}>
      <Card>
        <h3>Профіль</h3>
        <pre>{JSON.stringify(client, null, 2)}</pre>
      </Card>
      <Card>
        <h3>Листування</h3>
        <ul>
          {messages.map((m) => (
            <li key={m.id}>
              [{m.channel}] {m.body}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
