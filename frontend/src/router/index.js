import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";
import DashboardView from "../views/DashboardView.vue";
import ItemsView from "../views/ItemsView.vue";
import { useAuthStore } from "../stores/auth.js";

const routes = [
  { path: "/login", name: "login", component: LoginView, meta: { public: true } },
  { path: "/", name: "dashboard", component: DashboardView, meta: { requiresAuth: true } },
  { path: "/items", name: "items", component: ItemsView, meta: { requiresAuth: true } }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  if (!authStore.loaded) {
    await authStore.restoreSession();
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next({ name: "login" });
  }

  if (to.name === "login" && authStore.isAuthenticated) {
    return next({ name: "dashboard" });
  }

  return next();
});

export default router;
