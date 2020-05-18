<template>
  <div class="class">
    <template v-if="uclass">
      <div class="header">
        <h1>{{uclass.majorName}} - {{uclass.name}}</h1>
      </div>
      <div class="courses">
        <input type="text" placeholder="Search course, teacher..." />
        <p>*double-click to open course</p>
        <div class="list">
          <div
            class="course"
            v-for="(course, index) in courses"
            :key="index"
            @dblclick="openCourse(course._id)"
            @click="peekCourse(course.books)"
          >
            <!-- @click="peekCourse(course.users)" -->
            <div class="info">
              <p class="title">{{course.name}}</p>Teacher:
              <p class="teacher" v-for="(user, indx) in course.users" :key="indx">
                <span v-if="user.role === 'teacher'">
                  <span v-if="course.users.length > 2">
                    <span v-if="indx < 2">{{user.name}}{{indx == 1 ? ' ...' : ','}}&nbsp;</span>
                  </span>
                  <span v-else>{{user.name}}{{indx === (course.users.length - 1) ? ' ' : ','}}&nbsp;</span>
                </span>
              </p>
            </div>
          </div>
        </div>
      </div><div class="members">
        <div class="members-container">
          <template v-if="peek">
            <!-- <h2>Extra Students</h2> -->
            <h2>Text Books</h2>
            <!-- <template v-if="students.length !== 0"> -->
            <template v-if="books.length !== 0">
              <!-- <div class="member" v-for="(std, index) in students" :key="index"> -->
              <div class="member" v-for="(book, index) in books" :key="index">
                <!-- <div class="m-pic">
                    <template v-if="std.displaypic">
                        <img :src="`http://localhost:8082/${std.displaypic}`"/>
                    </template>
                    <template v-else>
                        <template v-if="std.role === 'teacher'">
                            <img src="../../assets/teacher-def.png"/>
                        </template>
                        <template v-else>
                            <img src="../../assets/student-def.png"/>
                        </template>
                    </template>
                </div> -->
                <p>{{book.title}}</p>
              </div>
            </template>
            <template v-else>
              <p class="msg">None</p>
            </template>
          </template>
          <template v-else>
            <p class="msg">Select a course</p>
          </template>
        </div>
      </div>
    </template>
    <template v-else>
        <p>Oof.. You haven't joined any class yet</p>
        <p>browse class</p>
    </template>
  </div>
</template>

<script>
import UserApi from "@/services/UserService";
import ClassApi from "@/services/ClassService";

export default {
  data() {
    return {
      uclass: "",
      courses: [],
      students: [],
      peek: false,
      role: '',
      cid: '',
      books: [],
    };
  },

  created() {
    this.uId = localStorage.getItem("userId");

    this.role = localStorage.getItem("role");

    if(this.role === 'teacher'){
      // window.alert(`boom`);
      this.cid = this.$route.query.cid;
    }

    this.initData();
  },

  methods: {
    goTo(page) {
      window.location.href = page;
    },
    initData() {
      this.peek = false;
      if(this.role === 'teacher'){
        ClassApi.getClass(this.cid)
          .then(res =>{
            this.uclass = res.data;
          }).catch(err =>{
            window.alert(`something went wrong`);
            console.log(err.response.data ? err.response.data : err);
          })
        this.initCourses(this.cid);
      }else{
        UserApi.get(this.uId).then(user => {
          this.uclass = user.data.class[0];
          this.initCourses(this.uclass._id);
        });
      }
    },
    initCourses(cId) {
      ClassApi.getAllCourse(cId).then(courses => {
        this.courses = courses.data;
        // console.log(this.courses);
      });
    },
    peekCourse(books) {
      this.peek = true;
      this.books = books;
      console.log(books);
    },
    // peekCourse(users) {
    //   this.peek = true;
    //   this.students = [];
    //   users.forEach(user => {
    //     if (user.role === "student") {
    //       this.students.push(user);
    //     }
    //   });
    // },
    openCourse(cId) {
      this.$router.push({ path: "course", query: { cId: cId } });
    }
  }
};
</script>

<style scoped>
.class {
  padding-top: 50px;
  width: 88%;
  margin: 0 auto;
  /* background: lavender; */
}
.header {
  margin-bottom: 40px;
  /* background: rgb(139, 139, 139); */
}
.header h1 {
  font-size: 40px;
}

.courses,
.members {
  display: inline-block;
  vertical-align: top;
}

.courses {
  width: 55%;
}

input {
  width: 88%;
  border-radius: 30px;
  padding: 0px 20px;
  font-size: 20px;
  line-height: 50px;
  border: 0;
  background: rgb(192, 192, 192);
  opacity: 0.5;
  transition: 0.3s ease-in-out;
  margin-bottom: 20px;
}
input:focus {
  outline: none;
  opacity: 1;
}

.list {
  height: 500px;
  /* background: rgb(248, 189, 189); */
  padding-top: 10px;
  padding-right: 20px;
  border-radius: 20px;
  max-height: 500px;
  overflow: auto;
}

.course {
  background: #fff;
  padding: 20px 30px;
  border-radius: 20px;
  margin-bottom: 30px;
  transition: 0.3s ease-in-out;
}
.course:hover {
  cursor: pointer;
  box-shadow: 0 8px 6px rgba(0, 0, 0, 0.171);
  transform: translateY(-5px);
}
.info .title {
  font-weight: bold;
  font-size: 28px;
  margin-bottom: 6px;
}
.info .teacher {
  font-size: 15px;
}

.members {
  /* background: #fff; */
  width: 45%;
}

.members-container {
  float: right;
  background: #fff;
  width: 64%;
  margin: 0 auto;
  padding: 30px 20px 20px 40px;
  border-radius: 20px;
  min-height: 500px;
  max-height: 500px;
  /* overflow: auto; */
}
.members h2 {
  font-size: 26px;
  margin-bottom: 40px;
}

.member {
  margin-bottom: 30px;
}
.member p,
.m-pic {
  display: inline-block;
  vertical-align: middle;
}


.m-pic{
    width: 45px;
    height: 45px;
    border-radius: 100%;
    border: 1px solid #999;
    margin-right: 15px;
    position: relative;
}
.m-pic img{
    width: 40px;
    height: 40px;
    border-radius: 100%;
    position: absolute;
    top:50%;
    left:50%;
    transform: translate(-50%, -50%);
}
.member p {
  font-size: 22px;
}

.teacher {
  display: inline-block;
}
</style>