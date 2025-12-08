<template>
  <v-container class="py-8">
    <v-sheet class="pa-8 mb-8 rounded-xl" color="primary" variant="tonal">
      <v-row>
        <v-col cols="12" md="8">
          <p class="text-overline mb-2 opacity-70">Operacoes internas</p>
          <h1 class="text-h4 font-weight-bold mb-2">CRUD de itens com protecao</h1>
          <p class="text-body-1 mb-4">
            Crie e mantenha registros autenticados com Google. Tudo e sincronizado com o backend Express + Supabase.
          </p>
          <v-btn color="primary" class="mr-2" @click="newItem">Novo item</v-btn>
          <v-btn variant="text" color="primary" prepend-icon="mdi-refresh" @click="items.fetchItems">
            Atualizar lista
          </v-btn>
          <v-btn variant="text" color="white" prepend-icon="mdi-home" @click="goToDashboard">
            Voltar para dashboard
          </v-btn>
          <v-btn variant="text" color="red-lighten-4" prepend-icon="mdi-logout" @click="logout">
            Sair para login
          </v-btn>
        </v-col>
        <v-col cols="12" md="4" class="d-flex flex-column justify-center gap-2">
          <v-card class="mb-4 pa-4" elevation="6">
            <div class="d-flex align-center">
              <v-avatar size="64" class="mr-4">
                <v-img :src="auth.user?.user_metadata?.avatar_url" alt="avatar" />
              </v-avatar>
              <div>
                <p class="text-overline mb-1 text-medium-emphasis">Conta logada</p>
                <h3 class="text-h6 font-weight-bold mb-0">
                  {{ auth.user?.user_metadata?.full_name || auth.user?.email }}
                </h3>
                <p class="text-caption text-medium-emphasis mb-0">{{ auth.user?.email }}</p>
              </div>
            </div>
          </v-card>
          <v-chip color="primary" variant="flat" class="text-subtitle-1">
            Total: {{ stats.total }}
          </v-chip>
          <v-chip color="grey-darken-3" variant="flat">
            Pendente: {{ stats.pendente }}
          </v-chip>
          <v-chip color="blue-darken-2" variant="flat">
            Em andamento: {{ stats.em_andamento }}
          </v-chip>
          <v-chip color="green-darken-2" variant="flat">
            Concluido: {{ stats.concluido }}
          </v-chip>
        </v-col>
      </v-row>
    </v-sheet>

    <v-alert v-if="items.error" type="error" class="mb-6" closable>{{ items.error }}</v-alert>

    <v-row>
      <v-col cols="12" md="4">
        <item-form
          :initial-item="items.selected"
          @saved="handleSave"
          @cancel="items.clearSelection"
        />
      </v-col>
      <v-col cols="12" md="8">
        <item-list
          :items="items.items"
          :loading="items.loading"
          @edit="items.selectItem"
          @delete="removeItem"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useItemsStore } from "../stores/items";
import { useAuthStore } from "../stores/auth";
import ItemForm from "../components/ItemForm.vue";
import ItemList from "../components/ItemList.vue";

const router = useRouter();
const auth = useAuthStore();
const items = useItemsStore();

onMounted(() => {
  items.fetchItems();
});

const stats = computed(() => ({
  total: items.items.length,
  pendente: items.items.filter((item) => item.status === "pendente").length,
  em_andamento: items.items.filter((item) => item.status === "em_andamento").length,
  concluido: items.items.filter((item) => item.status === "concluido").length
}));

const handleSave = async ({ id, ...payload }) => {
  if (id) {
    await items.updateItem(id, payload);
  } else {
    await items.createItem(payload);
  }
  items.clearSelection();
};

const newItem = () => items.clearSelection();

const removeItem = async (item) => {
  const ok = confirm(`Excluir "${item.title}"?`);
  if (!ok) return;
  await items.deleteItem(item.id);
};

const goToDashboard = () => {
  router.push({ name: "dashboard" });
};

const logout = async () => {
  await auth.signOut();
  router.push({ name: "login" });
};
</script>
