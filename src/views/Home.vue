<template>

  <div class="background"></div>

  <section>
    <div class="container">
      <b-input-group prepend="Right">
        <b-form-input type="number" placeholder="Kp" v-model.number=values[0] step="10"></b-form-input>
        <b-form-input type="number"  placeholder="Ki" v-model.number="values[1]" step="10"></b-form-input>
        <b-form-input type="number" placeholder="Kd" v-model.number="values[2]" step="10"></b-form-input>
        <b-form-input type="number" placeholder="Setpoint" v-model.number="values[3]" step="0.1"></b-form-input>
      </b-input-group>

      <b-input-group prepend="Left">
        <b-form-input type="number" placeholder="Kp" v-model.number="values[4]" step="10"></b-form-input>
        <b-form-input type="number" placeholder="Ki" v-model.number="values[5]" step="10"></b-form-input>
        <b-form-input type="number" placeholder="Kd" v-model.number="values[6]" step="10"></b-form-input>
        <b-form-input type="number" placeholder="Setpoint" step="0.1" v-model.number="values[7]"></b-form-input>
      </b-input-group>

      <div class="button-group">
        <b-button variant="success" @click="save">Save</b-button>
        <b-button variant="primary" @click="getValues">Read Current Values</b-button>
      </div>
    </div>

    <b-toast class="bottom-right-toast" v-model="showingToast" :no-close-button="true" :autohide="true" :delay="100" variant="success">
      Updated the parameters.
    </b-toast>
  </section>

</template>
<script>

import {computed, inject, onMounted, onUnmounted, ref} from "vue";
import mqttUtils from "@/composables/mqttUtils.mjs";

export default {
  name: "Home",
  setup(){
    let values = ref([]);

    /**
     * Create an mqttUtils instance with arguments the client and a callback to update data
     * @type {MqttUtils}
     */
    const mqttUtil = new mqttUtils(inject('mqttClient'), (topic, message) => {callback(topic, message)})

    const showingToast = ref(false);
    const showToast = () => {
      showingToast.value = true;
    };

    mqttUtil.subscribeTo(["feedback", "currParams"])
    function callback(topic, message){
      if( topic==="feedback" && message.toString() === "Updated the tunings"){
        showToast();
      } else if (topic==="currParams") {
        values.value = JSON.parse(message)
      }
    }

    const save = () => {
      mqttUtil.send("params", JSON.stringify(values.value))
    }

    const getValues = () => {
      mqttUtil.send("send", "hi")
    }

    return {showingToast, showToast, values, save, getValues}
  }
}

</script>

<style scoped>

*{
  margin: 0;
  padding: 0;
}

.background {
  position: absolute;
  object-fit: cover;
  background: url("@/assets/blackbg.jpg") no-repeat center;
  background-size: cover;
  min-height: 100vh;
  width: 100%;
}

section{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.container {
  width: 50%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}

.button-group{
  display: flex;
  gap: 0.5rem;
  width: 50%;
  justify-content: space-around;
}

.bottom-right-toast {
  position: fixed;
  bottom: 10px;
  right: 10px;
}

</style>
