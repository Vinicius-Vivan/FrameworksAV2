<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-card class="pa-8" max-width="520" elevation="6">
      <v-card-title class="text-h5 font-weight-bold">Acesse com Google</v-card-title>
      <v-card-text class="text-body-1">
        Autentique-se para acessar o dashboard e o CRUD protegido.
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="primary"
          :loading="auth.loading"
          prepend-icon="mdi-google"
          @click="login"
        >
          Entrar com Google
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup>
import { useAuthStore } from "../stores/auth";
const auth = useAuthStore();

const login = async () => {
  try {
    await auth.signInWithGoogle();
  } catch (err) {
    alert(`Erro ao autenticar: ${err.message}`);
  }
};
</script>
