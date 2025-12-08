<template>
  <v-container class="py-8">
    <v-row class="mb-6 align-center">
      <v-col cols="12" md="8">
        <p class="text-overline mb-2 opacity-60">Area autenticada</p>
        <h1 class="text-h4 font-weight-bold">Dashboard</h1>
        <p class="text-body-1 mb-4">
          Bem-vindo(a), {{ auth.user?.user_metadata?.full_name || auth.user?.email }}.
          Abaixo estao os indicadores do seu CRUD protegido.
        </p>
        <v-btn color="primary" class="mr-3" to="/items">Acessar CRUD</v-btn>
        <v-btn color="error" variant="tonal" @click="logout" prepend-icon="mdi-logout">Sair</v-btn>
      </v-col>
      <v-col cols="12" md="4" class="d-flex justify-end">
        <v-avatar size="112">
          <v-img :src="auth.user?.user_metadata?.avatar_url" alt="avatar" />
        </v-avatar>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="3">
        <v-card elevation="6" class="pa-6">
          <p class="text-overline mb-1 text-medium-emphasis">Registros</p>
          <h2 class="text-h4 font-weight-bold mb-1">{{ stats.total }}</h2>
          <p class="text-body-2 text-medium-emphasis">Itens totais cadastrados</p>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card elevation="6" class="pa-6">
          <p class="text-overline mb-1 text-medium-emphasis">Pendente</p>
          <h2 class="text-h4 font-weight-bold mb-1">{{ stats.pendente }}</h2>
          <p class="text-body-2 text-medium-emphasis">Aguardando acao</p>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card elevation="6" class="pa-6">
          <p class="text-overline mb-1 text-medium-emphasis">Em andamento</p>
          <h2 class="text-h4 font-weight-bold mb-1">{{ stats.em_andamento }}</h2>
          <p class="text-body-2 text-medium-emphasis">Executando agora</p>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card elevation="6" class="pa-6">
          <p class="text-overline mb-1 text-medium-emphasis">Concluido</p>
          <h2 class="text-h4 font-weight-bold mb-1">{{ stats.concluido }}</h2>
          <p class="text-body-2 text-medium-emphasis">Finalizados</p>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { useItemsStore } from "../stores/items";

const router = useRouter();
const auth = useAuthStore();
const items = useItemsStore();

onMounted(() => {
  if (!items.items.length) {
    items.fetchItems();
  }
});

const stats = computed(() => ({
  total: items.items.length,
  pendente: items.items.filter((item) => item.status === "pendente").length,
  em_andamento: items.items.filter((item) => item.status === "em_andamento").length,
  concluido: items.items.filter((item) => item.status === "concluido").length
}));

const logout = async () => {
  await auth.signOut();
  router.push({ name: "login" });
};
</script>
