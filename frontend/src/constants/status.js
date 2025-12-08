export const STATUSES = [
  { value: "pendente", label: "Pendente", color: "grey-darken-1" },
  { value: "em_andamento", label: "Em andamento", color: "blue-darken-1" },
  { value: "concluido", label: "Concluido", color: "green-darken-1" }
];

export const statusLabel = (value) => STATUSES.find((s) => s.value === value)?.label || "Desconhecido";
export const statusColor = (value) => STATUSES.find((s) => s.value === value)?.color || "grey";
