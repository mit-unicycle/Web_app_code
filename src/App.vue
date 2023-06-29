<template>
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>

</template>

<script>
import {provide} from "vue";
import mqttUtils from "@/composables/mqttUtils.mjs";
import Home from "@/views/Home";

export default {
  components: {Home},
  setup() {
    let mqttClient = mqttUtils.getMqttClient()
    provide('mqttClient', mqttClient) //provide the client to components that need it (import via inject(key)
  },
}
</script>

<style>

:root {
  all: unset;
  font-family: 'Fira sans', sans-serif;

  --contours: #41434a;
  --primary: #686868;
  --primary-dark: #222326;
  --secondary: #c22e2e;
  --title_color: white;
  --text_color: white;
  --h4_color: #ffbf4e;
}

#app {
  font-size: 15px;
  color: var(--text_color);
}

router-view{
  min-height: 600px;
  height: auto !important;
}

</style>
