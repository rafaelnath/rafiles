<template>
  <div class="layout">
      <div class="menubar">
          <div class="left">
            <h3>Rafiles</h3>
            <p>Admin Page</p>
          </div>
          <div class="right">
            <p class="time" ref="time"/>
            <p id="logout" @click.prevent="logout">logout</p>
          </div>
          <div style="clear:both"/>
      </div>
      <router-view/>
  </div>
</template>

<script>
export default {
  data(){
    return{
    }
  },
  methods:{
    logout(){
      this.$store.commit('adminLogout');
      this.$router.push('login');
    },
    getTime(){
      window.setInterval(() =>{
        let now = new Date();
        this.$refs.time.innerHTML = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
      }, 1000)
    }
  },
  mounted(){
    this.getTime();
  }
}
</script>

<style scoped>
  .menubar{
    width: calc(75% - 40px);
    margin: 30px auto;
    background: rgb(216, 216, 216);
    padding: 20px;
    border-radius: 20px;
  }
  .left{
    float:left
  }
  .right{
    float:right;
    text-align: right;
  }
  #logout:hover{
    cursor: pointer;
    text-decoration: underline;
  }
</style>