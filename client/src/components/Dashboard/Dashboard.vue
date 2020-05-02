<template>
  <div class="dashboard">
    <div class="userbar">
      <div class="picture"></div>
      <div class="info">
        <div class="info-wrapper">
          <div class="name">
            <h1>{{user.name}}</h1>
            <p>{{user.role}}</p>
          </div
          ><div class="details">
            <div class="left">
              <!-- -----------------------Birthdate -->
              <div class="detail">
                <div class="icon"></div>
                <p class="data">{{user.birthdate.split("T")[0]}}</p>
              </div>
              <!-- ------------------------->
              <!-- -----------------------Email -->
              <div class="detail">
                <div class="icon"></div>
                <p class="data">{{user.email}}</p>
              </div>
              <!-- -------------------------->
            </div
            ><div class="right">
              <!-- -----------------------Nationality -->
              <div class="detail">
                <div class="icon"></div>
                <p class="data">{{user.nationality}}</p>
              </div>
              <!-- -------------------------->
              <!-- -----------------------Edit Info -->
              <div class="button">
                <div class="icon"></div>
                <p>Edit info</p>
              </div>
              <!-- -------------------------->
            </div>
            <div style="clear:both" />
          </div>
        </div>
      </div>
      <div style="clear:both" />
    </div>
    <div class="tab">
      <p :class="{bright: tab === 'bp'}" @click="tab = 'bp'">Backpack</p>
      <div class="bg bp" :class="{active: tab === 'bp'}"/>
    </div>
    <div class="tab">
      <p :class="{bright: tab === 'nt'}" @click="tab = 'nt'">Notes</p>
      <div class="bg nt" :class="{active: tab === 'nt', next: tab === 'cr'}"/>
    </div>
    <div class="tab">
      <p :class="{bright: tab === 'cr'}" @click="tab = 'cr'">Courses</p>
      <div class="bg cr" :class="{active: tab === 'cr', cr2: tab === 'bp'}"/>
    </div>
    <Backpack :books="user.backpack" :uId="uId"/>
  </div>
</template>

<script>
import Backpack from "./Backpack";
import Api from "@/services/UserService";
export default {
  data() {
    return {
      uId: "",
      user: "",
      tab: 'bp',
    };
  },

  components:{
    Backpack,
  },

  created() {
    this.uId = localStorage.getItem("userId");
    this.initData();
  },

  methods: {
    initData() {
      Api.get(this.uId).then(user => {
        this.user = user.data;
      });
    }
  }
};
</script>

<style scoped>
.dashboard {
  padding-top: 50px;
  width: 88%;
  margin: 0 auto;
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
}
.info-wrapper{
  /* background: #000; */
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
}
.name,
.details {
  display: inline-block;
  vertical-align: middle;
}
.name{
  width: 50%;
}
.details{
  width:50%;
  /* background:lavender; */
}
.name h1 {
  font-size: 45px;
  margin-bottom: 5px;
}
.name p {
  font-size: 28px;
}
.right{
  float:right;
  /* background:#000; */
  width: 30%;
}
.left{
  float:left;
  width:68%;
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
  background: grey;
  margin-right: 10px;
}
.data{
  font-size: 20px;
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
.button .icon{
  background: #fff;
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