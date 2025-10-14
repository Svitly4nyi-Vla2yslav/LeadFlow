import Card from "../components/ui/Card";
export default function Dashboard() {
  return (
    <div
      style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(3,1fr)" }}
    >
      <Card>Today: pipeline, нові ліди</Card>
      <Card>Завдання</Card>
      <Card>Швидкі дії</Card>
    </div>
  );
}
