<template>
  <div class="add-major">
    <p>
      <span @click="goTo('dashboard')">dashboard</span> /
      <span @click="goTo('classes')">manage classes</span> /
      <span @click="goTo(`courses/course/${courseId}`)">{{this.$route.params.cName}}</span>
    </p>

    <h1>Add User</h1>
    <input
      type="text"
      placeholder="Search user's full name or email ..."
      @input="searchUser"
      v-model="search"
    />

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
        <td>{{user.created_at}}</td>
        <td>
          <template v-if="!user.courses.includes(courseId)">
            <a class="button" @click="addUser(user._id)">add</a>
          </template>
          <template v-else>
            <a class="button disable">added</a>
          </template>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import Api from "@/services/CourseService";
import UserApi from "@/services/UserService";
import ClassApi from "@/services/ClassService";

export default {
  data() {
    return {
      search: "",
      users: [],
      debounce: null,
      courseId: null
    };
  },

  created() {
    this.courseId = this.$route.params.cId;
    this.initData();
  },

  methods: {
    goTo(page) {
      window.location.href = `/admin/${page}`;
    },

    initData() {
      UserApi.getAll().then(res => {
        this.users = res.data;
      });

      ClassApi.getAllClass()
        .then(res=>{
          console.log(res.data);
        })
    },

    searchUser() {
      clearTimeout(this.debounce);
      this.debounce = setTimeout(() => {
        UserApi.searchUser(this.search).then(res => {
          this.users = res.data;
        });
      }, 600);
    },

    addUser(userId) {
      Api.addUserToCourse({
        userId: userId,
        courseId: this.courseId
      })
        .then(res => {
          this.addUserCB(userId, this.courseId);
        })
        .catch(err => {
          window.alert(err.response.data.msg);
        });
    },
    addUserCB(uId, cId) {
      Api.addCourseToUser({
        userId: uId,
        courseId: cId
      })
        .then(res => {
          window.alert("user added.");
          this.initData();
        })
        .catch(err => {
          window.alert(err.response.data.msg);
        });
    },
  }
};
</script>

<style scoped>
.add-major {
  background: #f1f1f1;
  width: 70%;
  margin: 0 auto;
  padding: 20px;
  border-radius: 20px;
}
input[type="text"] {
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
  line-height: 38px;
}
span {
  transition: 0.1s ease-in;
}
span:hover {
  font-size: 18px;
  font-weight: bolder;
  cursor: pointer;
}
button {
  width: 100%;
  line-height: 50px;
  background: rgb(199, 199, 199);
  font-size: 18px;
  border: 0;
  color: rgb(73, 73, 73);
}
button:hover {
  background: rgb(161, 161, 161);
  cursor: pointer;
}
.button {
  padding: 5px 29px;
  background: rgb(131, 131, 131);
  color: #fff;
  border-radius: 20px;
}
.button:hover {
  opacity: 0.7;
  cursor: pointer;
}

.disable {
  opacity: 0.5;
  padding: 5px 20px;
}
.disable:hover{
    cursor:not-allowed;
    opacity: 0.5;
}
</style>