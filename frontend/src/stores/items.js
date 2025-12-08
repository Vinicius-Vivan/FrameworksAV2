import { defineStore } from "pinia";
import { api } from "../services/api";
import { useAuthStore } from "./auth";

export const useItemsStore = defineStore("items", {
  state: () => ({
    items: [],
    loading: false,
    error: null,
    selected: null
  }),
  actions: {
    async fetchItems() {
      this.loading = true;
      this.error = null;
      try {
        const auth = useAuthStore();
        const token = auth.session?.access_token;
        this.items = await api("/items", { token });
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    selectItem(item) {
      this.selected = { ...item };
    },
    clearSelection() {
      this.selected = null;
    },
    async createItem(payload) {
      const auth = useAuthStore();
      const token = auth.session?.access_token;
      const created = await api("/items", { method: "POST", body: payload, token });
      this.items = [created, ...this.items];
      return created;
    },
    async updateItem(id, payload) {
      const auth = useAuthStore();
      const token = auth.session?.access_token;
      const updated = await api(`/items/${id}`, { method: "PUT", body: payload, token });
      this.items = this.items.map((item) => (item.id === id ? updated : item));
      return updated;
    },
    async deleteItem(id) {
      const auth = useAuthStore();
      const token = auth.session?.access_token;
      await api(`/items/${id}`, { method: "DELETE", token });
      this.items = this.items.filter((item) => item.id !== id);
    }
  }
});
