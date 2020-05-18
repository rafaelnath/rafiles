<template>
  <div class="login">
    <h1>Admin Login</h1>

    <p>Username</p>
    <input type="text" placeholder="Enter your username." v-model="uname" @keyup.enter="login" />
    <br />
    <br />

    <p>Password</p>
    <input type="password" placeholder="Enter your password." v-model="pwd" @keyup.enter="login" />
    <br />
    <br />

    <button @click.prevent="login()">LOGIN</button>
    <a @click="gotLost">Get lost? Go back to the main page.</a>
  </div>
</template>

<script>
import Api from '@/services/UserService'
export default {
  data() {
    return {
      uname: "",
      pwd: ""
    };
  },
  methods: {
    login() {
      if (!this.uname || !this.pwd) {
        window.alert("Can't login with empty field.");
      } else {
        Api.adminLogin({
          uname: this.uname,
          pwd: this.pwd
        }).then(res =>{
          this.$store.commit(`adminLogin`, res.data.token);
          this.$router.push(`dashboard`);
        }).catch(err =>{
          window.alert(err.response.data.msg ? err.response.data.msg : err);
        })
      }
    },
    gotLost(){
      this.$router.push('/');
    }
  }
};
</script>

<style scoped>
.login {
  background: rgb(236, 236, 236);
  width: 500px;
  padding: 25px;
  border-radius: 10px;
  text-align: left;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

h1{
  margin-bottom: 20px;
}
p{
  margin-bottom: 5px;
}
input {
  width: 100%;
  line-height: 30px;
  border-radius: 10px;
  border: 0;
  padding: 5px;
}

button {
  width: 100%;
  line-height: 50px;
  margin-top: 20px;
}

a{
  font-size: 14px;
  position: absolute;
  top: 105%;
  right: 50%;
  transform: translateX(50%);
  display: block;
}
a:hover{
  cursor: pointer;
  text-decoration: underline;
}
</style>