<template>
  <div class="class">
    <template v-if="uclass">
      <div class="header">
        <h1>{{uclass.majorName}} - {{uclass.name}}</h1>
      </div>
      <div class="courses">
        <input type="text" placeholder="Search course, teacher..." />
        <div class="list">
          <div
            class="course"
            v-for="(course, index) in courses"
            :key="index"
            @dblclick="openCourse(course._id)"
            @click="peekCourse(course.users)"
          >
            <div class="pic"></div>
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
          <template v-if="students.length !== 0">
            <h2>Students</h2>
            <template v-if="students.length !== 0">
              <div class="member" v-for="(std, index) in students" :key="index">
                <div class="m-pic">
                  <img :src="std.displaypic"/>
                </div>
                <p>{{std.name}}</p>
              </div>
            </template>
            <template v-else>
              <p class="msg">No user</p>
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
      peek: false
    };
  },

  created() {
    this.uId = localStorage.getItem("userId");
    this.initData();
  },

  methods: {
    goTo(page) {
      window.location.href = page;
    },
    initData() {
      this.peek = false;
      UserApi.get(this.uId).then(user => {
        this.uclass = user.data.class[0];
        this.initCourses(this.uclass._id);
      });
    },
    initCourses(cId) {
      ClassApi.getAllCourse(cId).then(courses => {
        this.courses = courses.data;
        console.log(this.courses);
      });
    },
    peekCourse(users) {
      this.peek = true;
      this.students = [];
      users.forEach(user => {
        if (user.role === "student") {
          this.students.push(user);
        }
      });
    },
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
.pic,
.info {
  display: inline-block;
  vertical-align: middle;
}
.pic {
  width: 80px;
  height: 80px;
  background: #eee;
  border-radius: 100%;
  margin-right: 30px;
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

.m-pic {
  width: 50px;
  height: 50px;
  border-radius: 100%;
  background: #eee;
  margin-right: 15px;
}

.member p {
  font-size: 22px;
}

.teacher {
  display: inline-block;
}
</style>