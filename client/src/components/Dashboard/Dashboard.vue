<template>
  <div class="dashboard">
    <div class="userbar">
      <div class="picture" :class="{hide: showEdit}">
        <template v-if="!showEdit">
          <template v-if="dp">
            <img :src="dp"/>
          </template>
          <template v-else>
            <template v-if="user.role === `teacher`">
              <img src="../../assets/teacher-def.png"/>
            </template>
            <template v-else>
              <img src="../../assets/student-def.png"/>
            </template>
          </template>

          <div class="overlay" @click="show = !show">
              <p>Change Picture</p>
          </div>
        </template>
        <image-crop
          field="img"
          @crop-success="cropSuccess"
          @crop-upload-success="cropUploadSuccess"
          @crop-upload-fail="cropUploadFail"
          @src-file-set="srcFileSet"
          v-if="show"
          v-model="show"
          :width="300"
          :height="300"
          img-format="png"
          lang-type="en"
        />
      </div>
      <div class="info" :class="{editing: showEdit}">
        <div class="info-wrapper" v-if="!showEdit">
          <div class="name">
            <h1>{{user.name.length > 16 ? user.name.substring(0, 16) + '...' : user.name}}</h1>
            <p>{{user.role}}</p>
          </div
          ><div class="details">
            <div class="left">
              <!-- -----------------------Birthdate -->
              <div class="detail">
                <div class="icon">
                  <img src="../../assets/bday.png"/>
                </div>
                <p class="data">{{user.birthdate}}</p>
              </div>
              <!-- ------------------------->
              <!-- -----------------------Email -->
              <div class="detail">
                <div class="icon">
                  <img src="../../assets/mail.png"/>
                </div>
                <p class="data">{{user.email}}</p>
              </div>
              <!-- -------------------------->
            </div
            ><div class="right">
              <!-- -----------------------Nationality -->
              <div class="detail">
                <div class="icon"><img src="../../assets/globe.png"/></div>
                <p class="data">{{user.nationality.length > 27 ? user.nationality.substring(0, 27) + '...' : user.nationality}}</p>
                <!-- <p class="data">{{`United States of Americaaaa`}}</p> -->
              </div>
              <!-- -------------------------->
              <!-- -----------------------Edit Info -->
              <div class="button" @click="showEdit = true">
                <div class="icon">
                  <img src="../../assets/settings.png"/>
                </div>
                <p>Edit info</p>
              </div>
              <!-- -------------------------->
            </div>
            <div style="clear:both" />
          </div>
        </div>
        <div class="info-wrapper" v-else>
          <edit-user @close="showEdit = false" :user="user" :uId="uId"/>
        </div>
      </div>
      <div style="clear:both" />
    </div>
    <template v-if="!showEdit">
      <div class="tab">
        <p :class="{bright: tab === 'bp'}" @click="tab = 'bp'">Backpack</p>
        <div class="bg bp" :class="{active: tab === 'bp'}"/>
      </div>
      <div class="tab">
        <p :class="{bright: tab === 'nt'}" @click="tab = 'nt'">Notes</p>
        <div class="bg nt" :class="{active: tab === 'nt', next: tab === 'cr'}"/>
      </div>
      <div class="tab" v-if="user.role === 'student'">
        <p :class="{bright: tab === 'cr'}" @click="tab = 'cr'">Courses</p>
        <div class="bg cr" :class="{active: tab === 'cr', cr2: tab === 'bp'}"/>
      </div>
      <div class="tab" v-else>
        <p :class="{bright: tab === 'cr'}" @click="tab = 'cr'">Classes</p>
        <div class="bg cr" :class="{active: tab === 'cr', cr2: tab === 'bp'}"/>
      </div>
      
      <div style="width:100%;height:20px;"/>
      <Backpack :books="user.backpack" :uId="uId" v-if="tab === 'bp'"/>
      <Notes :uId="uId" v-if="tab === 'nt'"/>
      <Courses :uId="uId" :courses="user.courses" v-if="tab === 'cr' && user.role === 'student'"/>
      <Classes :uId="uId" :classes="user.class" v-if="tab === 'cr' && user.role === 'teacher'"/>
    </template>
  </div>
</template>

<script>
import Backpack from "./Backpack";
import Notes from "./Notes";
import Courses from "./Courses";
import Classes from "./Classes";
import EditUser from "./EditUser";
import ImageCrop from "vue-image-crop-upload";
import Api from "@/services/UserService";
export default {
  data() {
    return {
      uId: "",
      user: "",
      tab: 'bp',
      dp: null,
      show: false,
      showEdit: false,
    };
  },

  components:{
    Backpack,
    ImageCrop,
    EditUser,
    Notes,
    Courses,
    Classes,
  },

  created() {
    this.uId = localStorage.getItem("userId");
    this.initData();
  },

  methods: {
    initData() {
      Api.get(this.uId).then(user => {
        this.user = user.data;
        if(this.user.displaypic){
          this.dp = `http://localhost:8082/${this.user.displaypic}`;
        }

        console.log(this.user)
      });
    },
    srcFileSet(fname, ftype, fsize){
      console.log(fsize);
      if(fsize > 5000000){
        window.alert(`image can't be more than 5mb`);
        this.show = false;
      }
    },
    cropSuccess(imgUrl, field) {
      console.log(`----crop success----`);
      Api.updatePic({
        id: this.uId,
        uname: this.user.name,
        oldpic: this.user.displaypic,
        newpic: imgUrl.split(';base64,').pop()
      }).then(res =>{
        window.alert('updated :)');
        this.initData();
      }).catch(err =>{
          err.response.data ? window.alert(err.response.data) :
          window.alert(err);
      })
    },
    cropUploadSuccess(jsonData, field) {
      console.log(`----upload success----`);
      console.log(jsonData);
      console.log(field);
    },
    cropUploadFail(status, field) {
      console.log(`----upload failed----`);
      console.log(status);
      console.log(field);
    }
  }
};
</script>

<style scoped>
.dashboard {
  padding-top: 50px;
  width: 88%;
  margin: 0 auto;
  /* background: lavender; */
}

.userbar{
  margin-bottom: 50px;
}
.picture {
  width: 12%;
  height: 140px;
  border-radius: 25px;
  background: rgb(241, 241, 241);
  box-shadow: 0 12px 18px rgba(0, 0, 0, 0.219);
  float: left;
  position: relative;
  transition: .2s ease-in-out;
}
.hide{
  width: 0;
}
.picture img, .overlay, .overlay p{
  border-radius: 20px;
  position: absolute;
  top:50%;
  left:50%;
  transform: translate(-50%, -50%);
}
.picture img{
  width: 88%;
  /* background: red; */
}
.overlay{
  width: 88%;
  padding-top:88%;
  background:#999;
  opacity: 0;
  transition: 0.3s ease-out;
}
.overlay:hover{
  opacity: 0.8;
  cursor: pointer;
}
.overlay p {
  text-align: center;
  font-size: 18px;
  color:#fff;
}
.info {
  padding: 0 30px;
  float: right;
  width: 80%;
  height: 140px;
  border-radius: 25px;
  background: rgb(241, 241, 241);
  position: relative;
  box-shadow: 0 12px 18px rgba(0, 0, 0, 0.219);
  transition: .3s ease-in-out;
}
.info-wrapper{
  /* background: #000; */
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
}
.editing{
  width: 95%;
  height: 500px;
}
.name,
.details {
  display: inline-block;
  vertical-align: middle;
}
.name{
  width: 40%;
}
.details{
  width:60%;
  /* background:lavender; */
}
.name h1 {
  font-size: 35px;
  margin-bottom: 5px;
}
.name p {
  font-size: 22px;
}
.right{
  float:right;
  /* background:#000; */
  width: 50%;
}
.left{
  float:left;
  width:50%;
  /* background:red; */
}
.detail:nth-child(odd){
  margin-bottom: 20px;
}
.icon, .data, .button p{
  display: inline-block;
  vertical-align: middle;
}
.icon {
  width: 25px;
  height: 25px;
  /* background: grey; */
  margin-right: 10px;
}
.icon img{
  width: 100%;
}
.data{
  font-size: 16px;
}
.button{
  /* display: inline-block; */
  padding: 0 15px;
  border-radius: 20px;
  background: grey;
  /* line-height: 25px; */
  text-align: center;
  float: right;
}
.button:hover{
  cursor: pointer;
  opacity: 0.8;
}
.button .icon{
  /* background: #fff; */
  width:15px;
  height:15px;
  margin-right: 3px;
}
.button p{
  line-height: 25px;
  color:#fff;
  font-size: 14px;
}


.tab{
  font-size: 20px;
  display: inline-block;
  margin-right: 40px;
  position:relative;
}
.tab p {
  letter-spacing: 0.8px;
  position:relative;
  z-index: 1;
  padding:3px 20px;
  border-radius: 30px;
  /* background:#000; */
  border: 2px solid rgba(0, 0, 0, 0);
}
.tab p:hover{
  cursor: pointer;
  border: 2px solid rgba(0, 0, 0, 0.199);
}
.tab .bg{
  border-radius: 30px;
  height:35px;
  width:60%;
  position: absolute;
  top:0;
  left:0;
  z-index: 0;
  transition: 0.25s ease-in-out;
}

.cr, .nt{
  /* background:blue; */
  transform: translateX(-80%);
}

.cr2{
  transform: translateX(-280%);
  /* background: limegreen; */
}

.bp, .next{
  /* background:red; */
  transform: translateX(160%);
}

.active{
  background: grey;
  width:100%!important;
  transform: translateX(0);
}
.bright {
  color: #fff;
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

.book {
  background: #fff;
  padding: 20px 30px;
  border-radius: 20px;
  margin-bottom: 30px;
  transition: 0.3s ease-in-out;
  position: relative;
  width: 50%;
}
.book:hover {
  box-shadow: 0 8px 6px rgba(0, 0, 0, 0.171);
  transform: translateY(-5px);
}
.cover {
  background: rgb(255, 228, 78);
  width: 35%;
  height: 280px;
  border-radius: 10px;
}
.cover,
.desc {
  display: inline-block;
  vertical-align: top;
}

.cover-container {
  width: 80%;
  margin: 0 auto;
  padding: 20px 0px;
  /* background: #000; */
}
.cover .title {
  font-size: 24px;
  /* width: 80%; */
  font-weight: bold;
  margin-bottom: 20px;
}

.desc {
  width: 55%;
}

.desc-container {
  width: 92%;
  float: right;
}

.desc h3 {
  margin-bottom: 20px;
  font-size: 22px;
}
.desc p {
  font-size: 20px;
}

.desc .buttons {
  position: absolute;
  bottom: 40px;
}

.desc .button {
  border-radius: 10px;
  font-size: 20px;
}
.desc .button:hover {
  cursor: pointer;
  opacity: 0.8;
}

.desc .read {
  background: #ccc;
  padding: 15px 60px;
  margin-right: 10px;
}

.desc .pin {
  background: #bbb;
  padding: 15px 20px;
}

.members {
  /* background: #fff; */
  width: 45%;
}
</style>