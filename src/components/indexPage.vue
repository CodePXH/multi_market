<template>
  <div class="index-page">
    <div class="header-cla"></div>
    <div class="content-cla">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>

export default {
  name: "index-page",
  data() {
    return {
    }
  },
  created() {
    console.log('index-page created')
  }
}

</script>

<style scoped>
.index-page {
  height: 100vh;
  width: 100vw;

  .header-cla {
    width: 100%;
    height: 50px;
    background-color: #30a1f1;
  }
  .content-cla {
    width: 100%;
    height: calc(100vh - 50px);
  }
}
</style>