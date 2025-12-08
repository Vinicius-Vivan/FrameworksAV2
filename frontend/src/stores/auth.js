import { defineStore } from "pinia";
import { supabase } from "../plugins/supabase";

let listenerBound = false;

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    session: null,
    loading: false,
    loaded: false
  }),
  getters: {
    isAuthenticated: (state) => !!state.user
  },
  actions: {
    async signInWithGoogle() {
      this.loading = true;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: window.location.origin }
      });
      this.loading = false;
      if (error) throw error;
    },
    async signOut() {
      await supabase.auth.signOut();
      this.user = null;
      this.session = null;
    },
    async restoreSession() {
      this.loading = true;
      const { data } = await supabase.auth.getSession();
      this.session = data.session;
      this.user = data.session?.user || null;
      this.loading = false;
      this.loaded = true;

      if (!listenerBound) {
        supabase.auth.onAuthStateChange((_event, session) => {
          this.session = session;
          this.user = session?.user || null;
        });
        listenerBound = true;
      }
    }
  }
});
