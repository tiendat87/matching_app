import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import "./style.css"; // Tailwind CSS
import "@fontsource/inter/index.css";

import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { MotionPlugin } from "@vueuse/motion";
import type { Plugin } from "vue";

const app = createApp(App);
const pinia = createPinia();

app.component("VueDatePicker", VueDatePicker);
app.component("font-awesome-icon", FontAwesomeIcon);
app.use(pinia);
app.use(router);
app.use(MotionPlugin as unknown as Plugin<[], []>);

app.mount("#app");
