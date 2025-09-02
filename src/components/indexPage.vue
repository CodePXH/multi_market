<template>
  <div class="index-page">
    <router-view></router-view>
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

<style scoped lang="scss">
.index-page {
  height: 100%;
  width: 100%;
}
</style>