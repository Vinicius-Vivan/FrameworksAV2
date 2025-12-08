<template>
  <v-card elevation="6">
    <v-card-title class="text-h6 font-weight-bold">
      {{ form.id ? "Editar item" : "Novo item" }}
    </v-card-title>
    <v-card-subtitle class="text-body-2 text-medium-emphasis">
      Informe um titulo, adicione contexto e selecione o status.
    </v-card-subtitle>
    <v-divider class="my-2" />
    <v-card-text>
      <v-form @submit.prevent="submit" ref="formRef" class="d-flex flex-column gap-4">
        <v-text-field
          v-model="form.title"
          label="Titulo"
          :rules="[v => !!v || 'Obrigatorio']"
          variant="outlined"
          color="primary"
        />
        <v-textarea
          v-model="form.description"
          label="Descricao"
          auto-grow
          rows="3"
          variant="outlined"
          color="primary"
        />
        <v-select
          v-model="form.status"
          label="Status"
          :items="statusOptions"
          variant="outlined"
          color="primary"
        />
      </v-form>
    </v-card-text>
    <v-card-actions class="justify-end">
      <v-btn variant="text" @click="cancel">Cancelar</v-btn>
      <v-btn color="primary" @click="submit">{{ form.id ? "Atualizar" : "Salvar" }}</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { STATUSES } from "../constants/status";

const props = defineProps({
  initialItem: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(["saved", "cancel"]);
const statusOptions = computed(() => STATUSES.map((status) => ({ title: status.label, value: status.value })));
const formRef = ref(null);

const empty = { title: "", description: "", status: STATUSES[0].value, id: null };
const form = ref({ ...empty });

watch(
  () => props.initialItem,
  (value) => {
    form.value = value ? { ...value } : { ...empty };
  },
  { immediate: true }
);

const submit = async () => {
  const valid = await formRef.value?.validate();
  if (valid?.valid === false) return;
  emit("saved", { ...form.value });
};

const cancel = () => {
  form.value = { ...empty };
  emit("cancel");
};
</script>
