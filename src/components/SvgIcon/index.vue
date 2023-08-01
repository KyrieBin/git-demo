<template>
  <div>
    <svg :style="{ width, height }">
      <use :href="prefix + name"></use>
    </svg>
  </div>
</template>

<script setup lang="ts">
defineProps({
  prefix: {    //动态的定义图片的前缀
    type: String,
    default: '#icon-'
  },
  name: String,
  width: String,
  height: String,
  shabi: {
    type: Number,
    default: 23,
    requied: true
  }

})
</script>

<style></style>