<template>
  <div class="admin-dashboard">
    <h3>Howdy,</h3>
    <h1>Admin</h1>
    <p>What would you like to manage?</p>
    <div class="menus">
      <div class="menu" @click="goTo('users')">
        <p>USERs</p>
      </div>
      <div class="menu" @click="goTo('classes')">
        <p>CLASSes</p>
      </div>
      <div class="menu">
        <p>COURSEs</p>
      </div>
      <div class="menu" @click="goTo('books')">
        <p>BOOKs</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    data(){
        return{

        }
    },

    methods:{
        goTo(page){
            window.location.href = `/admin/${page}`
        }
    }
};
</script>

<style scoped>
.admin-dashboard {
  background: #f1f1f1;
  width: 70%;
  margin: 0 auto;
  padding: 20px;
  border-radius: 20px;
}
.menus {
  width: 100%;
}
.menu {
  width: 48%;
  display: inline-block;
  background: rgb(148, 148, 148);
  margin-bottom: 20px;
  transition: 0.2s ease-in-out;
}
.menu:nth-child(even){
    margin-left: 20px;
}
.menu:hover{
  background: rgb(187, 187, 187);
  cursor: pointer;
  transform: translateY(-5%);
}
.menu p {
  text-align: center;
  font-weight: bold;
  color: rgb(58, 58, 58);
  line-height: 50px;
}
</style>