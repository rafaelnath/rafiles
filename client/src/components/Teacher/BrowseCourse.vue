<template>
  <div class="browse-course">
    <div class="courses">
      <input type="text" placeholder="Search course..." @input="searchCourse" v-model="search" />
      <div class="list">
        <div class="course" v-for="(course, index) in courses" :key="index" @click="seeInfo(course._id)">
          <div class="info">
            <p class="title">{{course.name}}</p>
            <p class="class" v-for="(clss, indx) in course.class" :key="indx">
                <span v-if="course.class.length > 2">
                    <span v-if="indx < 2">
                    {{clss.majorName}}&nbsp;{{clss.name}}{{indx == 1 ? ' ...' : ','}}&nbsp;
                    </span>
                </span>
                <span v-else>
                    {{clss.majorName}}&nbsp;{{clss.name}}{{indx === (course.class.length - 1) ? ' ' : ','}}&nbsp;
                </span>
            </p>
          </div>
        </div>
      </div>
    </div
    ><div class="course-info">
        <div class="ci-container">
            <h2 v-if="course">{{course.name}}</h2>
            <p class="msg" v-if="course.length === 0">Click a course.</p>
            <div class="ci-wrapper">
              <div class="teachers" v-if="teachers.length !== 0">
                  <h3>Teacher</h3>
                  <div class="member" v-for="(tch, index) in teachers" :key="index">
                      <div class="m-pic">
                          <template v-if="tch.displaypic">
                            <img :src="`http://localhost:8082/${tch.displaypic}`"/>
                          </template>
                          <template v-else>
                            <img src="../../assets/teacher-def.png"/>
                          </template>
                      </div>
                      <p>{{tch.name}}</p>
                  </div>
              </div>
              <div class="students" v-if="students.length !== 0"  >
                  <h3>Students</h3>
                  <div class="member" v-for="(std, index) in students" :key="index">
                      <div class="m-pic">
                          <template v-if="std.displaypic">
                            <img :src="`http://localhost:8082/${std.displaypic}`"/>
                          </template>
                          <template v-else>
                            <img src="../../assets/student-def.png"/>
                          </template>
                      </div>
                      <p>{{std.name}}</p>
                  </div>
              </div>
            <p class="msg" v-if="course.length !== 0 && teachers.length === 0 && students.length === 0">No user.</p>
            </div>

            <template v-if="course.length !== 0">
                <p @click="join(course._id, course.class)" v-if="!requested && !joined" class="join">Join</p>
                <p v-else-if="requested" class="join requested">Requested</p>
                <p v-else-if="joined" class="join requested">Joined</p>
            </template>
        </div>
    </div>
  </div>
</template>

<script>
import Api from "@/services/ClassService";
import UserApi from "@/services/UserService";
import CourseApi from "@/services/CourseService";
export default {
  data() {
    return {
        courses: [],
        debounce: null,
        search: '',
        students: [],
        teachers: [],
        course: [],
        uId: '',
        requested: false,
        joined: false,
    };
  },

  methods: {
    initData() {
        this.students = [];
        this.teachers = [];
        this.requested = false;
        this.joined = false;
      Api.allCourse().then(res => {
        // this.courses = res.data;
        let courses = res.data;

        UserApi.getClass(localStorage.getItem(`userId`))
        .then(usr =>{
          let uclass = usr.data;
          let isExist = false;

          courses.forEach(crs =>{
            crs.class.forEach(cls =>{
              if(uclass.includes(cls._id)){
                isExist = true;
              } else{
                isExist = false;
              }
            })
            if(!isExist){
              this.courses.push(crs);
            }
          })
        }).catch(err =>{
          window.alert(`Something went wrong. Try again later :(`);
          console.log(err.response.data ? err.response.data : err);
        })
      }).catch(err =>{
        window.alert(`Can't retrieve courses, try again later :(`);
        console.log(err.response.data ? err.response.data.msg : err);
      })
    },
    searchCourse() {
      clearTimeout(this.debounce);
      this.debounce = setTimeout(() => {
        Api.searchCourse(this.search).then(res => {
          this.courses = res.data;
        //   res.data.forEach(course => {
        //     if (!course.class.includes(this.$route.params.id)) {
        //       this.courses.push(course);
        //     }
        //   });
        });
      }, 600);
    },
    seeInfo(cId){
        this.students = [];
        this.teachers = [];
        this.requested = false;
        this.joined = false;
        CourseApi.getCourse(cId)
            .then(res =>{
                this.course = res.data;
                let users = res.data.users;
                users.forEach(user =>{
                    if(user._id === this.uid){
                        this.joined = true;
                    }

                    if (user.role === "student") {
                        this.students.push(user);
                    } else if (user.role === "teacher") {
                        this.teachers.push(user);
                    }
                })

                let requests = res.data.requests;
                    // console.log(requests);
                requests.forEach(req =>{
                    if(req._id === this.uid){
                        this.requested = true;
                    }
                })
            })
            .catch(err =>{
                window.alert(err.response.data.msg);
            })
    },

    join(cId, classes){
      CourseApi.joinCourse({
          courseId: cId,
          userId: this.uid
      })
      .then(res =>{
          this.seeInfo(cId);
      })
      .catch(err =>{
        window.alert(`Something went wrong. Try again later :(`);
        console.log(err.response.data ? err.response.data : err);
      })
    }
  },

  created(){
      this.initData();
      this.uid = localStorage.getItem('userId');
  }
};
</script>

<style scoped>
.courses, .course-info{
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
  margin-top: 40px;
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
.info .class {
  margin-bottom: 3px;
  font-size: 16px;
  letter-spacing: 0.5px;
}
.class{
    display: inline-block;
}

.course-info{
    width: 45%;
}

.ci-container{
    background: #fff;
    width:68%;
    height: 560px;
    float:right;
    border-radius: 20px;
    padding: 30px;
    position: relative;
}

.ci-wrapper{
    height: 420px;
    padding-right: 10px;
    border-radius: 0 0 20px 20px;
    overflow: auto;
}

.ci-container h2{
    font-size: 32px;
    margin-bottom: 20px;
    letter-spacing: 3px;
}

.ci-container h3{
    font-size: 22px;
    margin-bottom: 20px;
}

.ci-container p{
    font-size: 25px;
}
.ci-container p, .m-pic{
    display: inline-block;
    vertical-align: middle;
}

.ci-container .msg{
    font-size: 22px;
}

.join{
    position:absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: #ccc;
    line-height: 70px;
    width: 88%;
    border-radius: 20px;
    text-align: center;
}
.join:hover{
    cursor: pointer;
    opacity: 0.6;
}
.requested{
    opacity: 0.6;
}
.requested:hover{
    cursor:initial;
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

.member{
    margin-bottom: 15px;
}

.teachers{
    margin-bottom: 30px;
}

</style>