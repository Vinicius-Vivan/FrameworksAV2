<template>
  <v-card elevation="6">
    <v-card-title class="d-flex justify-space-between align-center">
      <div>
        <p class="text-overline mb-1 text-medium-emphasis">Itens cadastrados</p>
        <h2 class="text-h6 font-weight-bold mb-0">Painel de acompanhamento</h2>
      </div>
      <v-chip color="primary" variant="flat">
        {{ items.length }} {{ items.length === 1 ? "registro" : "registros" }}
      </v-chip>
    </v-card-title>
    <v-divider />
    <v-data-table
      :items="items"
      :headers="headers"
      :loading="loading"
      loading-text="Carregando..."
      no-data-text="Nenhum item cadastrado ainda"
      items-per-page-text="Itens por pagina"
      hover
      class="text-body-2"
    >
      <template #item.status="{ item }">
        <v-chip size="small" :color="statusColor(item.status)" variant="tonal">
          {{ statusLabel(item.status) }}
        </v-chip>
      </template>
      <template #item.description="{ item }">
        <span class="text-medium-emphasis">{{ item.description || "Sem descricao" }}</span>
      </template>
      <template #item.actions="{ item }">
        <v-btn icon="mdi-pencil" variant="text" @click="$emit('edit', item)" />
        <v-btn icon="mdi-delete" variant="text" color="error" @click="$emit('delete', item)" />
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup>
import { statusColor, statusLabel } from "../constants/status";

defineProps({
  items: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false }
});

defineEmits(["edit", "delete"]);

const headers = [
  { title: "Titulo", key: "title" },
  { title: "Descricao", key: "description" },
  { title: "Status", key: "status", width: 140 },
  { title: "Acoes", key: "actions", sortable: false, width: 110 }
];
</script>
