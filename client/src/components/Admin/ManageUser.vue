<template>
  <div class="admin-dashboard">
    <p id="nav">
      <span @click="goTo('dashboard')">dashboard</span>
    </p>
    <h2>Manage Users</h2>
    <input type="text" placeholder="search user..." @input="searchUser" v-model="search" />
    <table>
      <tr>
        <th>Full name</th>
        <th>Email address</th>
        <th>Role</th>
        <th>Register date</th>
        <th>Action</th>
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

    goTo(page){
        this.$router.push(`/admin/${page}`)
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
        Api.deleteUser(id).then(res => {
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
  width: calc(75% - 40px);
  padding: 20px;
  margin: 0 auto;
  border-radius: 20px;
  height: calc(100vh - 200px);
}
#nav{
  margin-bottom: 5px;
}

h2{
  margin-bottom: 20px;
}
input {
  margin-bottom: 10px;
  width: calc(100% - 10px);
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
  letter-spacing: 2px;
  font-weight: bolder;
  cursor: pointer;
}
th{
  text-align: left;
  padding-bottom: 10px;
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