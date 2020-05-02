<template>
  <div class="layout">
      <div class="menubar">
          <h3>.SRC - School Repository Cloud</h3>
          <p>ADMIN DASHBOARD</p>
          <p @click.prevent="logout">logout</p>
      </div>
      <router-view/>
  </div>
</template>

<script>
export default {

}
</script>

<style scoped>
  .menubar{
    width: 70%;
    margin: 0 auto;
    background: rgb(216, 216, 216);
    padding: 5px 20px;
    border-radius: 20px;
    margin-bottom: 10px;
    text-align: right;
  }
</style>