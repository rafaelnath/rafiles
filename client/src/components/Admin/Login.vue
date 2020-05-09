<template>
  <div class="login">
    <h1>Login</h1>

    <p>Username</p>
    <input type="text" placeholder="Enter your username." v-model="uname" />
    <br />
    <br />

    <p>Password</p>
    <input type="password" placeholder="Enter your password." v-model="pwd" />
    <br />
    <br />

    <button @click.prevent="login()">LOGIN</button>
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
    }
  }
};
</script>

<style scoped>
.login {
  background: rgb(236, 236, 236);
  width: 500px;
  margin: 0 auto;
  padding: 20px;
  border-radius: 10px;
  text-align: left;
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
}
</style>