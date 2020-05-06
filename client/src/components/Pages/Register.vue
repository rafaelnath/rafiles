<template>
  <div class="register">
    <div class="header">
      <div class="back" @click="back"/><h1>Register</h1>
    </div>
    
<!-- --------------------------------------PART 1 -->
    <div class="part1" v-if="part === 1">
      <crop-picture @cropped="setUPic" :imgUrl="upic"/>
      <p :class="{error: error && !fullname}">Full name*</p>
      <input type="text" v-model="fullname" />
      <br />
      <br />

      <p :class="{error: error && !email}">Email Address*</p>
      <input type="email" v-model="email" />
      <br />
      <br />

      <p :class="{error: error && !nationality}">Nationality*</p>
      <!-- <input type="text" v-model="nationality" /> -->
      <select v-model="nationality">
        <option value="" disabled selected>Choose country</option>
        <option v-for="(ctry, index) in countries" :key="index" :value="ctry.name">{{ctry.name}}</option>
      </select>
      <br />
      <br />

      <p :class="{error: error && !gender}">Gender*</p>
      <input type="radio" name="gender" value="male" v-model="gender" /><span>Male</span>
      <input type="radio" name="gender" value="female" v-model="gender" /><span>Female</span>
      <br />
      <br />
      <br />

      <button @click="next">Next</button>
    </div>

<!-- --------------------------------------PART 2 -->
    <div class="part2" v-if="part === 2">
      <p :class="{error: error && !pwd}">Password</p>
      <input type="password" placeholder="Enter your password." v-model="pwd" />
      <br />
      <br />

      <p :class="{error: error && !cpwd || pwd !== cpwd}">Confirm Password</p>
      <input type="password" placeholder="Re-enter your password." v-model="cpwd" />
      <br />
      <br />


      <p :class="{error: error && (!bd.day || !bd.month || !bd.year)}">Birth date</p>
      <!-- <input type="text" placeholder="Enter your birth date." v-model="birthdate" /> -->
      <select v-model="bd.day">
        <option value="" disabled selected>Day</option>
        <option v-for="(day, index) in days" :key="index" :value="day">{{day}}</option>
      </select>
      <select v-model="bd.month">
        <option value="" disabled selected>Month</option>
        <option v-for="(month, index) in months" :key="index" :value="index+1">{{month}}</option>
      </select>
      <select v-model="bd.year" class="last">
        <option value="" disabled selected>Year</option>
        <option v-for="(year, index) in years" :key="index" :value="year">{{year}}</option>
      </select>
      <br />
      <br />

      <p :class="{error: error && !role}">
        Register as
        <span style="fontWeight:bold; fontStyle:italic">{{role}}</span>
      </p>
      <br />
      <p class="role" @click.prevent="role = 'student'">student</p>
      <p class="role" @click.prevent="role = 'teacher'">teacher</p>
      <br />
      <br />
      <br />
    <button @click.prevent="register()">REGISTER</button>
    </div>
    <p>
      have an account?
      <a href="/login">login here</a>.
    </p>
  </div>
</template>

<script>
import axios from 'axios';
import Api from "@/services/UserService";
import CropPicture from "../CropPicture";

export default {

  components:{
    CropPicture
  },

  data() {
    return {
      upic:'',
      fullname: "",
      email: "",
      pwd: "",
      cpwd: "",
      nationality: "",
      gender: "",
      bd: {
        day:'',
        month:'',
        year:''
      },
      role: "student",
      part: 1,
      error: false,

      countries: null,
      years: [],
      months:['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      days: []
    };
  },
  methods: {
    initData(){
      //Getting Countries
      axios.get(`https://restcountries.eu/rest/v2/all`).then(res =>{
        this.countries = res.data;
      }).catch(() =>{
        window.alert(`failed to retrieve countries data :(`);
      })

      //Getting Years
      let thisYear = new Date().getFullYear();
      let max = thisYear;
      let min = thisYear - 99;
      for(let i = max; i >= min; i--){
        this.years.push(i);
      }

      //Getting Days
      for(let i = 1; i <= 31; i++){
        this.days.push(i);
      }
    },
    register() {
      if(!this.pwd || !this.cpwd || !this.bd.day || !this.bd.month || !this.bd.year || !this.role){
        window.alert(`please fill all the empty field!`);
        this.error = true;
      } else if(this.pwd !== this.cpwd){
        window.alert(`Confirm password doesn't match with your password`);
      } else{
          // let binpic = new Buffer(this.upic.split(",")[1],'base64');
          Api.register({
          name: this.fullname,
          email: this.email,
          password: this.pwd,
          nationality: this.nationality,
          gender: this.gender,
          birthdate: `${this.bd.day}-${this.bd.month}-${this.bd.year}`,
          role: this.role,
          upic: this.upic
        })
          .then(res => {
            window.alert("register succeed.");
            this.$router.push('/login');
          })
          .catch(err => {
            window.alert(err.response.data.msg);
          });
      }
    },
    next(){
      if(!this.fullname || !this.email || !this.nationality || !this.gender){
        window.alert(`please fill all the empty field!`);
        this.error = true;
      } else{
        this.part = 2;
      }
    },
    back(){
      if(this.part === 2){
        this.part = 1;
      } else{
        if(this.fullname || this.email || this.nationality || this.gender){
          if(window.confirm(`Are you sure? Your info won't be saved if you leave this page.`)){
            this.$router.push('/');
          }
        } else{
            this.$router.push('/');
        }
      }
    },
    setUPic(img){
      this.upic = img;
    },
    test(){
      console.log(`${this.bd.day}-${this.bd.month}-${this.bd.year}`)
    }

  },

  created(){
    this.initData()
  }
};
</script>

<style scoped>
.register {
  width: 500px;
  position: absolute;
  left:50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: rgb(236, 236, 236);
  padding: 20px;
  border-radius: 10px;
  text-align: left;
}

.header{
  padding-bottom: 10px;
  border-bottom: 2px solid #888;
  margin-bottom: 20px;
}
.back, .header h1{
  display: inline-block;
  vertical-align: middle;
}
.back{
  background: grey;
  width: 25px;
  height: 25px;
  margin-right: 10px;
}

p{
  font-size: 14px;
  margin-bottom: 10px;
  font-weight: bold;
  letter-spacing: 0.5px;
}

.register input[type="text"],
input[type="password"],
input[type="email"] {
  width: calc(100% - 5px);
  font-size: 20px;
  line-height: 30px;
  padding-left: 5px;
  background:none;
  border: 0;
  border-bottom: 2px solid #ccc;
}

input[type="radio"]{
  margin-right: 10px;
}

select{
  width: 100%;
  padding: 5px;
}

.part1 span{
  margin-right: 20px;
}


.role {
  width: 49.5%;
  display: inline-block;
  text-align: center;
  background: rgb(196, 196, 196);
  padding: 20px 0;
}

.role:hover {
  background: rgb(156, 156, 156);
  cursor: pointer;
}

button {
  width: 100%;
  line-height: 50px;
  margin-bottom: 10px;
}

.error{
  color: red;
}

.part2 select{
  width:30%;
  margin-right: 3%;
}

.last{
  margin: 0!important;
}

</style>