<template>
  <div class="admin-dashboard">
    <p><span @click="goTo('dashboard')">dashboard</span> / <span @click="goTo('users')">manage user</span></p>
    <h2>Edit Users</h2>
    <p>Full Name</p>
    <input type="text" v-model="user.name">
    <p>Email Address</p>
    <input type="text" v-model="user.email">
    <p>Nationality</p>
    <input type="text" v-model="user.nationality">
    <p>Gender</p>
    <input type="text" v-model="user.gender">
    <p>Birthdate</p>
    <input type="text" v-model="user.birthdate">

    <button @click="update">UPDATE</button>
  </div>
</template>

<script>
import Api from "../../services/UserService";
export default {
  data() {
    return {
      user: [],
    };
  },

  methods: {
    goTo(page) {
      window.location.href = `/admin/${page}`;
    },
    update(){
        Api.update({
            userId: this.$route.params.id,
            name: this.user.name,
            email: this.user.email,
            nationality: this.user.nationality,
            gender: this.user.gender,
            birthdate: this.user.birthdate
        }).then(() =>{
            window.alert('user updated');
            this.goTo('users');
        }).catch(err =>{
            window.alert(err.response.data.msg);
        })
    },
  },

  created() {
    //   console.log(this.$route.params);
    Api.get(this.$route.params.id).then(res => {
      this.user = res.data;
    })
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
input{
    margin-bottom: 20px;
    width: 60%;
    padding: 0px 5px;
    font-size: 20px;
    line-height: 30px;
    border: 0;
    background: none;
    border-bottom: 2px solid rgb(97, 97, 97);
    opacity: 0.5;
    transition: 0.3s ease-in-out;
}
input:focus{
    outline: none;
    opacity: 1;
    padding: 5px;
}
table{
    width: 100%;
    line-height: 30px;
}
span {
    transition: 0.1s ease-in;
}
span:hover{
    font-size: 18px;
    font-weight: bolder;
    cursor: pointer;
}
button{
    width: 100%;
    line-height: 50px;
    background: rgb(199, 199, 199);
    font-size: 18px;
    border:0;
    color:rgb(73, 73, 73);
}
button:hover{
    background: rgb(161, 161, 161);
    cursor: pointer;
}
</style>