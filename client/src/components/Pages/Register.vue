<template>
  <div class="register">
    <h1>Register</h1>

    <p>Full name</p>
    <input type="text" placeholder="Enter your full name." v-model="fullname" />
    <br />
    <br />

    <p>Email Address</p>
    <input type="email" placeholder="Enter your email." v-model="email" />
    <br />
    <br />

    <p>Password</p>
    <input type="password" placeholder="Enter your password." v-model="pwd" />
    <br />
    <br />

    <p>Confirm Password</p>
    <input type="password" placeholder="Re-enter your password." v-model="cpwd" />
    <br />
    <br />

    <p>Nationality</p>
    <input type="text" placeholder="Enter your nationality." v-model="nationality" />
    <br />
    <br />

    <p>Gender</p>
    <input type="radio" name="gender" value="male" v-model="gender" /> male
    <input type="radio" name="gender" value="female" v-model="gender" /> female
    <br />
    <br />

    <p>Birth date</p>
    <input type="text" placeholder="Enter your birth date." v-model="birthdate" />
    <br />
    <br />

    <p>
      Register as
      <span style="fontWeight:bold; fontStyle:italic">{{role}}</span>
    </p>
    <br />
    <p class="role" @click.prevent="role = 'student'">student</p>
    <p class="role" @click.prevent="role = 'teacher'">teacher</p>
    <br />
    <br />
    <br />

    <button @click.prevent="register()">REGISTER</button>
    <p>
      have an account?
      <a href="/login">login here</a>.
    </p>
  </div>
</template>

<script>
import Api from "@/services/UserService";
export default {
  data() {
    return {
      fullname: "",
      email: "",
      pwd: "",
      cpwd: "",
      nationality: "",
      gender: "",
      birthdate: "",
      role: "student"
    };
  },
  methods: {
    register() {
      Api.register({
        name: this.fullname,
        email: this.email,
        password: this.pwd,
        nationality: this.nationality,
        gender: this.gender,
        birthdate: this.birthdate,
        role: this.role
      })
        .then(res => {
          window.alert("register succeed.");
        })
        .catch(err => {
          window.alert(err.response.data.msg);
        });
    }
  }
};
</script>

<style scoped>
.register {
  background: rgb(236, 236, 236);
  width: 500px;
  margin: 0 auto;
  padding: 20px;
  border-radius: 10px;
  text-align: left;
}
.register input[type="text"],
input[type="password"],
input[type="email"] {
  width: 100%;
  line-height: 30px;
  border-radius: 10px;
  border: 0;
  padding: 5px;
}

.role {
  width: 49.5%;
  display: inline-block;
  text-align: center;
  background: rgb(196, 196, 196);
  padding: 20px 0;
}

.role:hover {
  background: rgb(156, 156, 156);
  cursor: pointer;
}

button {
  width: 100%;
  line-height: 50px;
}
</style>