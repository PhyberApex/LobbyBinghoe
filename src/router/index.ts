import { createRouter, createWebHistory } from "vue-router";
import BingoView from "../views/BingoView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "bingo",
      component: BingoView,
    },
    {
      path: "/bingo/new",
      name: "create-bingo",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/BingoCreateView.vue"),
    },
    {
      path: "/bingo/card/:id",
      name: "bingo-details",
      props: true,
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/BingoDetailsView.vue"),
    },
    {
      path: "/faq",
      name: "faq",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/FAQView.vue"),
    },
  ],
});

export default router;
