<template>
  <div class="add-course">
    <div class="left">
      <p>
        <span @click="goTo('dashboard')">dashboard</span> /
        <span @click="goTo('classes')">manage class</span>
      </p>

      <h1>{{course.name}}</h1>
      <p v-for="clss in classes" :key="clss._id">{{clss.majorName}} - {{clss.name}}</p>
      <h3>Books</h3>
      <a :class="{active: menu === 'upload'}" @click="openMenu('upload')">upload book</a>
      <a :class="{active: menu === 'add'}" @click="openMenu('add')">add book</a>

      <!-- ----------------------------------------------[Add Book] -->
      <div v-if="menu === 'add'" class="addCourse">
        <add-book />
      </div>

      <!-- ----------------------------------------------[Upload Book] -->
      <div v-if="menu === 'upload'" class="addCourse">
        <upload-book />
      </div>

      <!-- ----------------------------------------------[Book List] -->
      <template v-else-if="menu === ''">
        <template v-if="this.books.length !== 0">
          <div class="courses" v-for="(book, index) in books" :key="index">
            <div class="cLeft">
              <p class="cName">{{book.title}}</p>
              <div class="teacher">
                <p>by {{book.author}}</p>
              </div>
            </div>
            <div class="cRight">
              <p @click="removeBook(book._id, book.title)">remove</p>
            </div>
          </div>
        </template>
        <template v-else>
          <p style="fontStyle:italic; fontSize:14px; marginTop:50px">no book yet.</p>
        </template>
      </template>
    </div>

    <div class="right">
      <p style="fontWeight:bold; fontSize:28px; marginBottom:10px">Users</p>
      <p class="adduser" @click="goTo(`courses/add-user/${courseId}/${course.name}`)">add user</p>

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
import Api from "@/services/CourseService";
import AddBook from "./AddBook";
import UploadBook from "./UploadBook";
import _ from 'lodash';

export default {
  data() {
    return {
      course: [],
      courseId: null,
      students: [],
      teachers: [],
      books: [],
      menu: "",
      classes:[],
    };
  },

  components: {
    AddBook,
    UploadBook
  },

  created() {
    this.courseId = this.$route.params.id;
    this.initData();
  },

  methods: {
    goTo(page) {
      window.location.href = `/admin/${page}`;
    },

    openMenu(menu) {
      if (this.menu != menu) {
        this.menu = menu;
      } else {
        this.menu = "";
      }
    },

    getMajorName(id){
      Api.getMajorName(id)
        .then(res =>{
          // console.log(res.data.data.name);
          return res.data.data.name;
        })
        .catch(err =>{
          // window.alert(err.response.data.msg);
          return;
        })
    },

    initData() {
      this.students = [];
      this.teachers = [];
      this.requests = [];
      this.classes = [];

      if(this.menu !== 'add'){
          this.menu = "";
      }
      
      Api.getCourse(this.courseId)
        .then(res => {
          this.course = res.data;
          console.log(this.course);

          if (this.course.requests.length !== 0) {
            this.requests = this.course.requests;
          }

          if (this.course.books.length !== 0) {
            this.books = this.course.books;
          }

          if(this.course.class.length !== 0){
            this.classes = this.course.class
          }

          this.course.users.forEach(user => {
            if (user.role === "student") {
              this.students.push(user);
            } else if (user.role === "teacher") {
              this.teachers.push(user);
            }
          });
        })
        .catch(err => {
          window.alert(err.response.data.msg);
        });
    },

    removeBook(id, book) {
      if (window.confirm(`remove ${book} from this course?`)) {
        Api.removeBookFromCourse({
          bookId: id,
          courseId: this.courseId
        })
          .then(() => {
            this.removeBookCB(this.courseId, id);
          })
          .catch(err => {
            window.alert(err.response.data.msg);
          });
      }
    },
    removeBookCB(cId, bId) {
      Api.removeCourseFromBook({
        bookId: bId,
        courseId: cId
      })
        .then(() => {
            window.alert(`book removed.`);
            this.initData();
        })
        .catch(err => {
          window.alert(err.response.data.msg);
        });
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

    removeUser(uId, user) {
      if (window.confirm(`remove "${user}" from this course?`)) {
        Api.removeUserFromCourse({
          userId: uId,
          courseId: this.courseId
        })
          .then(res => {
            this.removeUserCB(uId, this.courseId);
          })
          .catch(err => {
            window.alert(err.response.data.msg);
          });
      }
    },
    removeUserCB(uId, cId) {
      Api.removeCourseFromUser({
        userId: uId,
        courseId: cId
      })
        .then(res => {
          window.alert("A user have been removed from course.");
          this.initData();
        })
        .catch(err => {
          window.alert(err.response.data.msg);
        });
    },

    reject(uId) {
      Api.rejectUser({
        userId: uId,
        courseId: this.courseId
      })
        .then(res => {
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
.add-course {
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
  width: 30%;
  background: #c4c4c4;
  padding: 0 20px;
  border-radius: 20px;
  min-height: 400px;
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

.courses {
  background: #ccc;
  border-radius: 20px;
  padding: 0 10px;
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
  margin-bottom: -10px;
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