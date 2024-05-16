<template>
  <q-layout view="hHh Lpr lff" container class="container">
    <q-page-container>
      <q-page padding>
        <router-view />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
</script>

<style lang="scss" scoped>
.container {
  min-height: 2000px;
}
</style>
