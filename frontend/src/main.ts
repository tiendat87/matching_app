import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import "./style.css"; // Tailwind CSS
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

const app = createApp(App);
const pinia = createPinia();

app.component("VueDatePicker", VueDatePicker);
app.component("font-awesome-icon", FontAwesomeIcon);
app.use(pinia);
app.use(router);

app.mount("#app");
