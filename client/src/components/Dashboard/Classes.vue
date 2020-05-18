<template>
  <div class="classes">
      <template v-if="classes.length === 0">
          <div class="none">
            <p>You haven't joined any classes yet.</p>
            <a @click="browse">Click here to browse.</a>
          </div>
      </template>
      <template v-else>
        <div class="container">
            <div class="list" v-for="(cls, index) in classes" :key="index" @click="peek(cls._id)" :class="{active: currentClass === cls._id}">
                <div class="wrapper">
                    <p class="name">{{cls.majorName}} - {{cls.name}}</p>
                </div>
            </div>
        </div
        ><div class="info">
            <div class="i-container">
                <template v-if="isPeek">
                    <template v-if="courses.length > 0">
                        <h1>Courses</h1>
                        <div class="teachers">
                            <p v-for="(crs, index) in courses" :key="index">{{crs.name}}</p>
                        </div>
                    </template>
                    <template v-else>
                        <p>No courses yet.</p>
                    </template>
                    <div class="buttons">
                        <p class="btn open" @click="enter">Enter</p
                        ><p class="btn leave" @click="leave">Leave</p>
                    </div>
                </template>
                <template v-else>
                    <p>Click a class.</p>
                </template>
            </div>
        </div>
      </template>
  </div>
</template>

<script>
import Api from '@/services/ClassService'
import UserApi from '@/services/UserService'
export default {
    data(){
        return{
            courses:[],
            isPeek: false,
            currentClass: '',
        }
    },
    props:{
        classes: Array
    },
    methods:{
        browse(){
            this.$router.push({path: `browse`, query: {tab: 'class' }});
        },
        peek(id){
            this.currentClass = id;
            this.isPeek = true;
            Api.getAllCourse(id)
                .then(res => {
                    this.courses = res.data;
             }).catch(err =>{
                window.alert(err.response.data ? err.response.data.msg : err);
            })
        },
        leave(){
            if(window.confirm(`Are you sure?\nYou'll have to request to join this class again.`)){
                UserApi.removeClass({
                    userId: localStorage.getItem(`userId`),
                    classId: this.currentClass
                }).then(res =>{
                    this.leaveCB(localStorage.getItem(`userId`), this.currentClass);
                }).catch(err =>{
                    console.log(err.response.data ? err.response.data.msg : err);
                    window.alert(`Can't do that at the moment, please try again later :(`);
                })
            }
        },
        leaveCB(uid, cid){
            Api.removeUserFromClass({
                userId: uid,
                classId: cid
            }).then(res =>{
                window.alert(`done :)`);
                this.$parent.initData();
            }).catch(err =>{
                console.log(err.response.data ? err.response.data.msg : err);
                window.alert(`Can't do that at the moment, please try again later :(`);
            })
        },
        enter(){
            this.$router.push({ path: "class", query: { cid: this.currentClass } });
        }
    },

    created(){
    }
};
</script>

<style scoped>
.classes{
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