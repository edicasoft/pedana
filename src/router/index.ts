import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Pedana from "@/components/pedana/Pedana.vue";
import TortionChart from "../components/charts/TortionChart.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Pedana
  },
  {
    path: "/tortion-chart",
    name: "TortionChart",
    component: TortionChart
  }
];

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes
});

export default router;
