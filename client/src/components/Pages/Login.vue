<template>
  <div class="login">
    <h1>Login</h1>

    <p>Email Address</p>
    <input type="email" placeholder="Enter your email." v-model="email" />
    <br />
    <br />

    <p>Password</p>
    <input type="password" placeholder="Enter your password." v-model="pwd" />
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
          window.alert("ciao ~");
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("userId", res.data.userId);
          localStorage.setItem("role", res.data.role);
          this.goToDashboard(res.data.role);
        })
        .catch(err => {
          window.alert(err.response.data.msg);
        });
    },
    goToDashboard(role) {
      if (role === "student") {
        window.location.href = '/student'
      } else if (role === "teacher") {
        window.location.href = '/teacher'
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