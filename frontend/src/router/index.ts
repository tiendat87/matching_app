import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import ProfileForm from "../components/ProfileForm.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Home",
      component: Home,
    },
    {
      path: "/profile",
      name: "Profile",
      component: ProfileForm,
    },
  ],
});

export default router;
