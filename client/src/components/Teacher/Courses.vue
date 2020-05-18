<template>
  <div class="class">
    <div class="header">
      <h1>My Courses</h1>
    </div>
    <div class="courses">
      <input type="text" placeholder="Search courses ..." @input="searchCourse" v-model="search" />
      <p class="msg">*double click to open course</p>
      <div class="list">
        <div
          class="course"
          v-for="(course, index) in courses"
          :key="index"
          @dblclick="openCourse(course._id)"
          @click="peekCourse(course._id)"
        >
          <div class="info">
            <p class="title">{{course.name}}</p>
            <p class="teacher" v-for="(clss, indx) in course.class" :key="indx">
              <span v-if="course.class.length > 2">
                <span
                  v-if="indx < 2"
                >{{clss.majorName}}&nbsp;{{clss.name}}{{indx == 1 ? ' ...' : ','}}&nbsp;</span>
              </span>
              <span
                v-else
              >{{clss.majorName}}&nbsp;{{clss.name}}{{indx === (course.class.length - 1) ? ' ' : ','}}&nbsp;</span>
            </p>
          </div>
        </div>
      </div>
    </div
    ><div class="members">
      <div class="members-container">
        <h2>{{coursename}}</h2>
        <h3>Members</h3>
        <template v-if="users.length !== 0">
          <!-- Select a course to see the students -->
          <div class="member" v-for="(user, index) in users" :key="index">
            <div class="m-pic">
                <template v-if="user.displaypic">
                    <img :src="`http://localhost:8082/${user.displaypic}`"/>
                </template>
                <template v-else>
                    <template v-if="user.role === 'teacher'">
                        <img src="../../assets/teacher-def.png"/>
                    </template>
                    <template v-else>
                        <img src="../../assets/student-def.png"/>
                    </template>
                </template>
            </div>
            <p>{{user.name}}</p>
          </div>
        </template>
        <template v-else>
          <p>(Select a course)</p>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import Api from "@/services/UserService";
import ClassApi from "@/services/ClassService";
import CourseApi from "@/services/CourseService";

export default {
  data() {
    return {
      hovered: false,
      uid: "",
      courses: [],
      courseIds: [],
      search: "",
      users:[],
      coursename: '',
    };
  },

  created() {
    this.uid = localStorage.getItem("userId");
    this.initData();
  },

  methods: {
    openCourse(cId) {
      this.$router.push({path:'course', query:{cId: cId}});
    },
    initData() {
      this.courses = [];
      Api.get(this.uid)
        .then(user => {
          let courses = user.data.courses;
          courses.forEach(crs =>{
            this.courseIds.push(crs._id);
          })
          this.initCourse(this.courseIds);
        })
        .catch(err => {
          window.alert(err.response.data.msg ? err.response.data.msg : err);
        });
    },
    initCourse(courses) {
      ClassApi.allCourse()
        .then(res => {
          res.data.forEach(course => {
            if (courses.includes(course._id)) {
              this.courses.push(course);
            }
          });
          console.log(this.courses);
        })
        .catch(err => {
          window.alert(err.response.data.msg ? err.response.data.msg : err);
        });
    },
    searchCourse() {
      clearTimeout(this.debounce);
      this.debounce = setTimeout(() => {
        ClassApi.searchCourse(this.search).then(res => {
          this.courses = [];
          res.data.forEach(course => {
            if (this.courseIds.includes(course._id)) {
              this.courses.push(course);
            }
          });
        });
      }, 600);
    },
    peekCourse(cId){
        CourseApi.getCourse(cId)
            .then(res =>{
                // console.log(res.data);
                this.users = res.data.users;
                this.coursename = res.data.name;
            })
            .catch(err =>{
                console.log(err);
            })
    },

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

.teacher {
  display: inline-block;
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
  height: 500px;
  /* overflow: auto; */
}
.members h2 {
  font-size: 26px;
  margin-bottom: 40px;
}

.members h3{
    font-size: 20px;
    margin-bottom: 20px;
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
</style>