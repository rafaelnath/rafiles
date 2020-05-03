<template>
  <div class="admin-dashboard">
    <p>
      <span @click="goTo('dashboard')">dashboard</span>
    </p>
    <h2>Manage Users</h2>
    <input type="text" placeholder="search user..." @input="searchUser" v-model="search" />
    <table>
      <tr>
        <td>Full name</td>
        <td>Email address</td>
        <td>Role</td>
        <td>Register date</td>
        <td>Action</td>
      </tr>
      <tr v-for="(user, index) in users" :key="index">
        <td>{{user.name}}</td>
        <td>{{user.email}}</td>
        <td>{{user.role}}</td>
        <!-- <td>{{user.created_at}}</td> -->
        <td>{{user.created_at.split("T")[0]}}</td>
        <td>
          <router-link :to="'/admin/edit-user/' + user._id"><a>edit</a></router-link>&nbsp;&nbsp;
          <a @click="deleteUser(user._id)">delete</a>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import Api from "../../services/UserService";
export default {
  data() {
    return {
      users: [],
      search: "",
      debounce: null
    };
  },

  methods: {
    initData() {
      Api.getAll().then(res => {
        this.users = res.data;
        console.log(res.data);
      });
    },

    goTo(page) {
      window.location.href = `/admin/${page}`;
    },

    searchUser() {
      clearTimeout(this.debounce);
      this.debounce = setTimeout(() => {
        Api.searchUser(this.search).then(res => {
          this.users = res.data;
        });
      }, 600);
    },

    deleteUser(id) {
      if (window.confirm("Are you sure?")) {
        Api.deleteUser(id).then(() => {
          window.alert("user deleted");
          this.initData();
        });
      }
    }

  },

  created() {
    this.initData();
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
input {
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
input:focus {
  outline: none;
  opacity: 1;
  padding: 5px;
}
table {
  width: 100%;
  line-height: 30px;
}
span {
  transition: 0.1s ease-in;
}
span:hover {
  font-size: 18px;
  font-weight: bolder;
  cursor: pointer;
}
td a{
    text-decoration: none;
    color:#000;
    font-style: italic;
}
td a:hover{
    text-decoration: underline;
    cursor: pointer;
}
</style>