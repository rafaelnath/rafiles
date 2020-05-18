<template>
  <div class="add-major">
    <div class="left">
      <p id="nav">
        <span @click="goTo('dashboard')">dashboard</span> /
        <span @click="goTo('classes')">manage class</span>
      </p>

      <h1>{{title}}</h1>
      <p id="className">Class name</p>
      <input type="text" v-model="cData.name" placeholder="Enter class's name" />

      <p style="fontWeight:bold; fontSize:28px; marginBottom:10px">Courses</p>
      <a :class="{active: menu === 'new'}" @click="openMenu('new')">new course</a>
      <a :class="{active: menu === 'add'}" @click="openMenu('add')">add course</a>
      <br />
      <div v-if="menu === 'new'" class="newCourse">
        <new-course />
      </div>
      <div v-if="menu === 'add'" class="addCourse">
        <add-course />
      </div>

      <div class="course-container" v-else-if="menu === ''">
        <div class="courses" v-for="(course, index) in courses" :key="index">
          <div class="cLeft">
            <p class="cName" @click="goTo(`courses/course/${course._id}`)">{{course.name}}</p>
            <!-- <div class="teacher" v-if="course.users.length !== 0"> -->
            <div class="teacher">
              <p>Teacher:</p>
              <template v-if="course.users.length !== 0">
                <p v-for="(user, indx) in course.users" :key="indx">
                  <span v-if="user.role === 'teacher'">
                    {{user.name}},&nbsp;
                  </span>
                </p>
              </template>
              <p v-else>none</p>
            </div>
          </div>
          <div class="cRight">
            <p @click="confirmRemove(course._id, course.name)">remove</p>
          </div>
        </div>
      </div>

    </div><div class="right">
      <p style="fontWeight:bold; fontSize:28px; marginBottom:10px">Users</p>
      <p class="adduser" @click="goTo(`classes/add-user/${cData._id}/${title}`)">add user</p>

      <template v-if="students.length === 0 && teachers.length === 0">
        <p style="marginLeft:5px; fontSize:14px">(no user yet.)</p>
      </template>

      <template v-if="students.length !== 0">
        <p style="fontWeight:bold;">Student</p>
        <ul>
          <li v-for="(user, index) in students" :key="index">
            {{user.name}}
            <a
              @click="removeUser(user._id, user.name)"
              class="mini-button remove"
            >remove</a>
          </li>
        </ul>
      </template>

      <template v-if="teachers.length !== 0">
        <p style="fontWeight:bold;">Teacher</p>
        <ul>
          <li v-for="(user, index) in teachers" :key="index">
            {{user.name}}
            <a
              @click="removeUser(user._id, user.name)"
              class="mini-button remove"
            >remove</a>
          </li>
        </ul>
      </template>

      <p style="fontWeight:bold;">Requests</p>
      <template v-if="requests.length !== 0">
        <ul>
          <li v-for="(request, index) in requests" :key="index">
            {{request.name}}
            <a class="mini-button accept" @click="addUser(request._id)">accept</a>
            <a class="mini-button reject" @click="reject(request._id)">reject</a>
          </li>
        </ul>
      </template>
      <template v-else>
        <p style="marginLeft:5px; fontSize:14px">(no request yet.)</p>
      </template>
    </div>
  </div>
</template>

<script>
import Api from "@/services/ClassService";
import CourseApi from "@/services/CourseService";
import NewCourse from "./NewCourse";
import AddCourse from "./AddCourse";

export default {
  data() {
    return {
      cData: [],
      title: "",
      students: [],
      teachers: [],
      requests: [],
      courses: [],
      menu: ""
    };
  },

  components: {
    NewCourse,
    AddCourse
  },

  created() {
    this.initData();
  },

  methods: {
    goTo(page){
        this.$router.push(`/admin/${page}`)
    },

    openMenu(menu) {
      if (this.menu != menu) {
        this.menu = menu;
      } else {
        this.menu = "";
      }
    },

    initData() {
      this.menu = "";
      this.students = [];
      this.teachers = [];
      this.requests = [];
      this.courses = [];
      Api.getClass(this.$route.params.id)
        .then(res => {
          this.cData = res.data;
          this.title = `${this.cData.major.name} - ${this.cData.name}`;

          if (this.cData.requests.length !== 0) {
            this.requests = this.cData.requests;
          }

          this.cData.users.forEach(user => {
            if (user.role === "student") {
              this.students.push(user);
            // } else if (user.role === "teacher") {
            } else {
              this.teachers.push(user);
            }
          });

          console.log(this.cData.users);
        })
        .catch(err => {
          window.alert(err.response.data.msg);
        });

      Api.getAllCourse(this.$route.params.id)
        .then(res => {
          this.courses = res.data;
        })
        .catch(err => {
          window.alert(err.response.data.msg);
        });
    },

    removeUser(uId, user) {
      if (window.confirm(`remove "${user}" from this class?`)) {
        Api.removeUserFromClass({
          userId: uId,
          classId: this.$route.params.id
        })
          .then(res => {
            this.removeUserCB(uId, this.$route.params.id);
          })
          .catch(err => {
            window.alert(err.response.data.msg);
          });
      }
    },
    removeUserCB(uId, cId) {
      Api.removeClassFromUser({
        userId: uId,
        classId: cId
      })
        .then(res => {
          window.alert("A user have been removed from class.");
          this.initData();
        })
        .catch(err => {
          window.alert(err.response.data.msg);
        });
    },

    addUser(userId) {
      Api.addUserToClass({
        userId: userId,
        classId: this.$route.params.id
      })
        .then(res => {
          this.addUserCB(userId, this.$route.params.id);
        })
        .catch(err => {
          window.alert(err.response.data.msg);
        });
    },
    addUserCB(uId, cId) {
      Api.addClassToUser({
        userId: uId,
        classId: cId
      })
        .then(res => {
          window.alert("user added.");
          this.initData();
        })
        .catch(err => {
          window.alert(err.response.data.msg);
        });
    },

    reject(uId) {
      Api.rejectUser({
        userId: uId,
        classId: this.$route.params.id
      })
        .then(res => {
          this.initData();
        })
        .catch(err => {
          window.alert(err.response.data.msg);
        });
    },

    confirmRemove(courseId, courseName) {
      CourseApi.getCourse(courseId).then(res =>{
        if (res.data.class.length === 1){
          if(window.confirm(`Are you sure?\n'${courseName}' will be permanently deleted because it is no longer used by any other class.`)){
            this.deleteCourse(courseId, courseName);
          }
        } else {
            if (window.confirm(`remove ${courseName} from this class?`)) {
              this.removeCourse(courseId)
            }
          }
      }).catch(err =>{
        console.log(err.response.data ? err.response.data.msg : err);
        window.alert(`Something went wrong, try again later :(`)
      })
    },
    removeCourse(courseId) {
      Api.removeCourseFromClass({
        classId: this.$route.params.id,
        courseId: courseId
      })
        .then(() => {
          this.removeCourseCB(this.$route.params.id, courseId);
        })
        .catch(err => {
          window.alert(err.response.data.msg);
        });
    },

    removeCourseCB(classId, courseId) {
      Api.removeClassFromCourse({
        classId: classId,
        courseId: courseId
      }).then(() => {
        window.alert("course removed");
        this.initData();
      });
    },

    deleteCourse(id, course) {
      Api.deleteCourse(id)
        .then(() => {
          window.alert("course deleted");
          this.initData();
        })
        .catch(err => {
          window.alert(err.response.data.msg);
        });
    }
  }
};
</script>

<style scoped>
.add-major {
  background: #f1f1f1;
  width: calc(75% - 40px);
  padding: 20px;
  margin: 0 auto;
  border-radius: 20px;
}
#nav{
  margin-bottom: 10px;
}
h1{
  margin-bottom: 20px;
}
#className{
  font-weight: bold;
  margin-bottom: 5px;
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

.left,
.right {
  display: inline-block;
  vertical-align: top;
}

.left {
  width: 62%;
}
.right {
  width: calc(38% - 80px);
  margin-left: 40px;
  background: #c4c4c4;
  padding: 20px;
  border-radius: 20px;
  height: 505px;
}
.adduser {
  text-align: right;
}
.adduser:hover {
  cursor: pointer;
  text-decoration: underline;
}

ul li {
  line-height: 30px;
  list-style-type: none;
}

.mini-button {
  padding: 2px 8px;
  background: rgb(170, 170, 170);
  margin-left: 20px;
  border-radius: 20px;
  transition: 0.2s ease-in-out;
}
.mini-button:hover {
  cursor: pointer;
}
.remove:hover {
  background: rgb(248, 36, 65);
  color: #f1f1f1;
}
.accept:hover {
  background: rgb(12, 240, 115);
}

.reject {
  margin-left: 10px;
}
.reject:hover {
  background: rgb(160, 23, 41);
  color: #f1f1f1;
}
.newCourse {
  width: 50%;
}

.course-container{
  height: 320px;
  overflow: auto;
  /* background: lavender; */
}

.courses {
  background: #ccc;
  border-radius: 20px;
  padding: 10px 15px;
  margin-bottom: 10px;
  margin-top: 20px;
  width: 88%;
}
.cLeft,
.cRight {
  display: inline-block;
  vertical-align: bottom;
}

.cLeft {
  width: 89.2%;
}

.cRight {
  width: 10%;
}

.cRight p:hover {
  cursor: pointer;
  text-decoration: underline;
}

.cName {
  font-size: 25px;
  font-weight: bold;
  margin-bottom: 3px;
}
.cName:hover{
  cursor: pointer;
  text-decoration: underline;
}

.teacher p {
  display: inline-block;
  font-size: 15px;
}
.teacher p:nth-child(1) {
  margin-right: 10px;
}

a {
  background: #ccc;
  padding: 3px 10px;
  border-radius: 20px;
  margin-right: 15px;
  opacity: 0.8;
  transition: 0.3s ease-in-out;
}

a:hover {
  opacity: 1;
  background: rgb(133, 133, 133);
  cursor: pointer;
}
.active {
  opacity: 1;
  background: rgb(133, 133, 133);
}
</style>