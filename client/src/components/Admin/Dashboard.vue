<template>
  <div class="admin-dashboard">
    <h3>Howdy, Admin</h3>
    <p>What would you like to manage?</p>
    <div class="menus">
      <div class="menu" @click="goTo('users')">
        <p id="tag">USERS</p>
      </div
      ><div class="menu" @click="goTo('classes')">
        <p id="tag">CLASSES</p>
      </div
      ><div class="menu" @click="goTo('books')">
        <p id="tag">BOOKS</p>
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
            this.$router.push(`/admin/${page}`)
        }
    }
};
</script>

<style scoped>
h3{
  margin-bottom: 10px;
  text-align: center;
}
p{
  text-align: center;
}
.admin-dashboard {
  background: #f1f1f1;
  width: calc(75% - 40px);
  padding: 20px;
  margin: 0 auto;
  border-radius: 20px;
}
.menus {
  /* background: lavender; */
  width: 100%;
  text-align: center;
}
.menu {
  margin-top: 30px;
  width: calc(33.3% - 40px);
  padding-top: calc(33.3% - 40px);
  display: inline-block;
  background: rgb(148, 148, 148);
  transition: 0.3s ease-in-out;
  position: relative;
  border-radius: 10px;
}
.menu:nth-child(even){
    margin: 0 40px;
}
.menu:hover{
  background: rgb(187, 187, 187);
  cursor: pointer;
  transform: translateY(-10px);
}
.menu:hover > #tag{
  letter-spacing: 5px;
}
.menu p {
  text-align: center;
  font-weight: bold;
  color: rgb(58, 58, 58);
  line-height: 50px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: 24px;
  letter-spacing: 1px;
  transition: .3s ease-in-out;
}
</style>