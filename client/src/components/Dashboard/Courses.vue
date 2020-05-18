<template>
  <div class="courses">
      <template v-if="courses.length === 0">
          <div class="none">
            <p>You haven't joined any extra courses yet.</p>
            <a @click="browse">Click here to browse.</a>
          </div>
      </template>
      <template v-else>
        <div class="container">
            <div class="list" v-for="(crs, index) in courses" :key="index" @click="peek(crs._id)" :class="{active: currentCourse === crs._id}">
                <div class="wrapper">
                    <p class="name">{{crs.name}}</p>
                    <p class="class">
                        <span v-for="(clss, indx) in crs.class" :key="indx">
                            <template v-if="crs.class.length > 1">
                            <template v-if="indx === crs.class.length - 1">
                                {{clss.majorName}} - {{clss.name}}
                            </template>
                            <template v-else>
                                {{clss.majorName}} - {{clss.name}},&nbsp;
                            </template>
                            </template>
                        <template v-else>
                            {{clss.majorName}} - {{clss.name}}
                        </template>
                        </span>
                    </p>
                </div>
            </div>
        </div
        ><div class="info">
            <div class="i-container">
                <template v-if="isPeek">
                    <template v-if="users.teachers.length > 0">
                        <h1>Teacher</h1>
                        <div class="teachers">
                            <p v-for="(teacher, index) in users.teachers" :key="index">{{teacher.name}}</p>
                        </div>
                    </template>
                    <div style="paddingTop: 25px"/>
                    <template v-if="users.students.length > 0">
                        <h1>Student</h1>
                        <div class="students">
                            <p v-for="(student, index) in users.students" :key="index">{{student.name}}</p>
                        </div>
                    </template>
                    <template v-if="users.teachers.length === 0 && users.students.length === 0">
                        <p>No user yet.</p>
                    </template>
                    <div class="buttons">
                        <p class="btn open" @click="enter">Enter</p
                        ><p class="btn leave" @click="leave">Leave</p>
                    </div>
                </template>
                <template v-else>
                    <p>Click a course.</p>
                </template>
            </div>
        </div>
      </template>
  </div>
</template>

<script>
import Api from '@/services/CourseService'
import UserApi from '@/services/UserService'
export default {
    data(){
        return{
            mycrs:[],
            users:{
                teachers: [],
                students: []
            },
            isPeek: false,
            currentCourse: '',
        }
    },
    props:{
        courses: Array
    },
    methods:{
        browse(){
            this.$router.push(`browse`);
        },
        peek(id){
            this.currentCourse = id;
            this.isPeek = true;
            this.users = {
                teachers: [],
                students: []
            }
            Api.getCourse(id).then(res => {
                let users = res.data.users;
                users.forEach(user => {
                    if(user.role === 'teacher'){
                        this.users.teachers.push(user);
                    } else{
                        this.users.students.push(user);
                    }
                });
            }).catch(err =>{
                window.alert(err.response.data ? err.response.data.msg : err);
            })
        },
        leave(){
            if(window.confirm(`Are you sure?\nYou'll have to request to join this course again.`)){
                UserApi.removeCourse({
                    userId: localStorage.getItem(`userId`),
                    courseId: this.currentCourse
                }).then(res =>{
                    this.leaveCB(localStorage.getItem(`userId`), this.currentCourse);
                }).catch(err =>{
                    console.log(err.response.data ? err.response.data : err);
                    window.alert(`Can't do that at the moment, please try again later :(`);
                })
            }
        },
        leaveCB(uid, cid){
            Api.removeUserFromCourse({
                userId: uid,
                courseId: cid
            }).then(res =>{
                window.alert(`done :)`);
                this.$parent.initData();
            }).catch(err =>{
                console.log(err.response.data ? err.response.data : err);
                window.alert(`Can't do that at the moment, please try again later :(`);
            })
        },
        enter(){
            this.$router.push({ path: "course", query: { cId: this.currentCourse } });
        }
    },

    created(){
    }
};
</script>

<style scoped>
.courses{
    width: 100%;
    /* background: #fff; */
    height: 430px;
    position: relative;
}
.none{
  position: absolute;
  top:50%;
  left:50%;
  transform: translate(-50%, -50%);
  text-align: center;
}
.none p{
  font-size: 22px;
  margin-bottom: 10px;
}
.none a:hover{
    text-decoration: underline;
    cursor: pointer;
}

.container, .info{
    display: inline-block;
    vertical-align: top;
}
.container{
    width: calc(50% - 20px);
    height: 420px;
    overflow: auto;
    /* background: lavender; */
    padding-top: 20px;
    padding-right: 20px;
}
.list{
    width: 100%;
    height: 100px;
    background: #fff;
    position: relative;
    border-radius: 20px;
    margin-bottom: 25px;
    transition: 0.3s ease-in-out;
    /* background: chocolate; */
}
.list:hover, .active{
  cursor: pointer;
  box-shadow: 0 8px 6px rgba(0, 0, 0, 0.171);
  transform: translateY(-5px);
}

.active{
    background: rgb(192, 192, 192);
}

.wrapper{
    /* background: chartreuse; */
    width: 92%;
    display: inline-block;
    position: absolute;
    top:50%;
    left:50%;
    overflow: hidden;
    transform: translate(-50%, -50%);
    
}
.name{
    font-size: 28px;
    font-weight: bold;
    margin-bottom: 5px;
}
.class{
    font-size: 14px;
}
.rmv{
    width: calc(16% - 20px);
    margin-left: 20px;
    line-height: 35px;
    border-radius: 10px;
    background: red;
    text-align: center;
}

.info{
    width: calc(50% - 200px);
    background: #ffffff;;
    height: 440px;
    margin-left: 200px;
    border-radius: 15px;
    position:relative;
}
.i-container{
    /* background: salmon; */
    width: 90%;
    height: 400px;
    position: absolute;
    top:50%;
    left:50%;
    overflow: hidden;
    transform: translate(-50%, -50%);
}

.info h1{
    margin-bottom: 15px;
}
.info p{
    margin-bottom: 5px;
    font-size: 18px;
}

.students, .teachers{
    margin-left: 20px;
    overflow: auto;
}

.teachers{
    height: 80px;
    /* background: blue; */
}
.students{
    height: 100px;
    /* background: lime; */
}
.buttons{
    position: absolute;
    bottom:0;
    /* background:crimson; */
    width: 100%;
}
.btn{
    display: inline-block;
    width: calc(50% - 5px);
    text-align: center;
    line-height: 60px;
    border-radius: 10px;
}
.btn:hover{
    cursor: pointer;
    opacity: 0.8;
}
.open{
    background: rgb(192, 192, 192);
    margin-right: 10px;
}
.leave{
    color:rgb(230, 230, 230);
    background: rgb(109, 109, 109);
}


</style>