<template>
  <div class="login">
    <h1>Login</h1>

    <p>Email Address</p>
    <input type="email" @keyup.enter="login" placeholder="Enter your email." v-model="email" />
    <br />
    <br />

    <p>Password</p>
    <input type="password" @keyup.enter="login" placeholder="Enter your password." v-model="pwd" />
    <br />
    <br />

    <button @click.prevent="login()">LOGIN</button>
    <p>
      doesn't have an account?
      <a href="/register">register here.</a>
    </p>
  </div>
</template>

<script>
import Api from "@/services/UserService";
export default {
  data() {
    return {
      email: "",
      pwd: ""
    };
  },
  methods: {
    login() {
      Api.login({
        email: this.email,
        password: this.pwd
      })
        .then(res => {
          this.$store.commit(`login`, res.data)
          this.goToDashboard(res.data.role);
        })
        .catch(err => {
          window.alert(err.response.data.msg);
        });
    },
    goToDashboard(role) {
      if (role === "student") {
        this.$router.push('/student')
      } else if (role === "teacher") {
        this.$router.push('/teacher')
      }
    }
  },
  created() {
    if (localStorage.getItem("token")) {
      this.goToDashboard(localStorage.getItem('role'));
    }
  }
};
</script>

<style scoped>
.login {
  background: rgb(236, 236, 236);
  width: 500px;
  padding: 20px;
  border-radius: 10px;
  text-align: left;
  position:absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
}
h1{
  margin-bottom: 20px;
}
p{
  margin-bottom: 10px;
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
  margin-top: 10px;
  display: inline-block;
}
</style>