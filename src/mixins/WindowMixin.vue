import Vue from "vue";
import { mapState } from "vuex";

export const UserMixin = Vue.extend({
  computed: {
    ...mapState("auth", ["user"]),
    profile(): Record<string, any> {
      return this.user.profile || { first_name: "", last_name: "", email: "" };
    },
    fullName(): string {
      return `${this.profile.first_name || ""} ${this.profile.last_name ||
        ""}`.trim();
    }
  }
});
