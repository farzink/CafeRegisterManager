<template>
  <div>
    <Navigationbar />    
    <router-view/>    
  </div>
</template>

<script>
import Navigationbar from "@/components/Navigationbar";

// import vue2Dropzone from 'vue2-dropzone'
// import 'vue2-dropzone/dist/vue2Dropzone.css'

export default {
  name: "app",
  components: {
    Navigationbar
  },
  data() {
    return {};
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.parent {
  margin-left: 0;
  margin-right: 0;
}
.subparent {
  width: 60rem;
}
</style>
