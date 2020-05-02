<template>
  <div class="browse-course">
    <div class="courses">
      <input type="text" placeholder="Search major..." @input="searchCourse" v-model="search" />
      <div class="list">
        <div class="course" v-for="(major, index) in majors" :key="index" @click="seeInfo(major._id)">
          <div class="info">
            <p class="title">{{major.name}}</p>
          </div>
        </div>
      </div>
    </div
    ><div class="course-info">
        <div class="ci-container">
            <h2 v-if="major">{{major.name}}</h2>
            <p class="msg" v-if="major.length === 0">Click a major.</p>
            <div class="ci-wrapper">
                <div class="member" v-for="(cls, index) in major.classes" :class="{active: cId === cls._id}" :key="index" @click="selectClass(cls._id)">
                    <p>{{cls.name}}</p>
                </div>
                <p class="msg" v-if="major.length !== 0 && major.classes.length === 0">No class.</p>
            </div>
                <template v-if="cId">
                    <p @click="join()" v-if="!requested && !joined" class="join">Join</p>
                    <p v-else-if="requested" class="join requested">Requested</p>
                    <p v-else-if="joined" class="join requested">Joined</p>
                </template>
        </div>
    </div>
  </div>
</template>

<script>
import Api from "@/services/ClassService";
import CourseApi from "@/services/CourseService";
export default {
  data() {
    return {
        majors: [],
        major: [],
        debounce: null,
        search: '',
        uId: '',
        requested: false,
        joined: false,
        cId: '',
    };
  },

  methods: {
    initData() {
        this.requested = false;
        this.joined = false;
      Api.getAll().then(res => {
        this.majors = res.data.data;
      });
    },
    searchCourse() {
      clearTimeout(this.debounce);
      this.debounce = setTimeout(() => {
        Api.search(this.search).then(res => {
          this.majors = res.data.data;
        });
      }, 600);
    },
    seeInfo(mId){
        this.cId = '';
        Api.get(mId)
            .then(res =>{
                this.major = res.data;
            })
            .catch(err =>{
                window.alert(err.response.data.msg);
            })
    },
    selectClass(cId){
        this.requested = false;
        this.joined = false;
        this.cId = cId;
        Api.getClass(cId)
            .then(res =>{
                let users = res.data.users;
                users.forEach(user =>{
                    if(user._id === this.uid){
                        this.joined = true;
                    }
                })

                let requests = res.data.requests;
                requests.forEach(req =>{
                    if(req._id === this.uid){
                        this.requested = true;
                    }
                })
            })
    },

    join(){
        Api.joinClass({
            classId: this.cId,
            userId: this.uid
        })
        .then(res =>{
            this.selectClass(this.cId);
        })
        .catch(err=>{
            window.alert(err.response.data.msg ? err.response.data.msg : err);
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
  border-radius: 50px;
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
    height: 360px;
    padding-right: 10px;
    border-radius: 20px;
    /* background: #000; */
    overflow: auto;
}

.ci-container h2{
    font-size: 32px;
    margin-bottom: 40px;
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
    width: 50px;
    height: 50px;
    border-radius: 100%;
    background: #eee;
    margin-right: 15px;
}

.member{
    margin-bottom: 30px;
    background: rgb(226, 226, 226);
    text-align: center;
    line-height: 50px;
    border-radius: 30px;
    transition: 0.3s ease-in-out;
}

.member:hover{
    font-weight: bold;
    cursor: pointer;
    letter-spacing: 3px;
    background: rgb(165, 165, 165);
}
.active{
    font-weight: bold;
    letter-spacing: 3px;
    background: rgb(165, 165, 165);
}
.active:hover{
    cursor: initial;
}

.teachers{
    margin-bottom: 30px;
}

</style>