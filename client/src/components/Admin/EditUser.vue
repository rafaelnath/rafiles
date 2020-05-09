<template>
  <div class="admin-dashboard">
    <p id="nav"><span @click="goTo('dashboard')">dashboard</span> / <span @click="goTo('users')">manage user</span></p>
    <h2>Edit Users</h2>
    <p>Full Name</p>
    <input type="text" v-model="user.name">
    <p>Email Address</p>
    <input type="text" v-model="user.email">
    <p>Nationality</p>
    <select v-model="user.nationality">
      <option value="" disabled selected>Choose country</option>
      <option v-for="(ctry, index) in countries" :key="index" :value="ctry.name">{{ctry.name}}</option>
    </select>
    <p>Gender</p>
      <input type="radio" name="gender" value="male" v-model="user.gender" /><span>Male</span>
      <input type="radio" name="gender" value="female" v-model="user.gender" /><span>Female</span>
    <p>Birthdate</p>
      <select v-model="bd.day">
        <option value="" disabled selected>Day</option>
        <option v-for="(day, index) in days" :key="index" :value="day">{{day}}</option>
      </select>
      <select v-model="bd.month">
        <option value="" disabled selected>Month</option>
        <option v-for="(month, index) in months" :key="index" :value="month">{{month}}</option>
      </select>
      <select v-model="bd.year" class="last">
        <option value="" disabled selected>Year</option>
        <option v-for="(year, index) in years" :key="index" :value="year">{{year}}</option>
      </select>

    <button @click="update">UPDATE</button>
  </div>
</template>

<script>
import Api from "../../services/UserService";
import axios from 'axios';
export default {
  data() {
    return {
      user: [],
      bd: {
        day:'',
        month:'',
        year:''
      },
      countries: null,
      years: [],
      months:['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      days: []
    };
  },

  methods: {
    goTo(page){
        this.$router.push(`/admin/${page}`)
    },
    update(){
        Api.update({
            userId: this.$route.params.id,
            name: this.user.name,
            email: this.user.email,
            nationality: this.user.nationality,
            gender: this.user.gender,
            birthdate: `${this.bd.day}-${this.bd.month}-${this.bd.year}`,
        }).then(() =>{
            window.alert('user updated');
            this.goTo('users');
        }).catch(err =>{
            window.alert(err.response.data.msg);
        })
    },
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
  },

  created() {
    //   console.log(this.$route.params);
    Api.get(this.$route.params.id).then(res => {
      this.user = res.data;
      //Setting up user birthday
      let bdate = this.user.birthdate.split("-");
      this.bd.day = bdate[0];
      this.bd.month = bdate[1];
      this.bd.year = bdate[2];
    })
    this.initData();
  }
};
</script>

<style scoped>
.admin-dashboard {
  background: #f1f1f1;
  width: calc(75% - 40px);
  padding: 20px;
  margin: 0 auto;
  border-radius: 20px;
}
p{
  margin-bottom: 10px;
}
#nav{
  margin-bottom: 5px;
}
h2{
  margin-bottom: 20px;
}
input[type="text"]{
    margin-bottom: 20px;
    width: calc(100% - 10px);
    padding: 0px 5px;
    font-size: 22px;
    line-height: 30px;
    border: 0;
    background: none;
    border-bottom: 2px solid rgb(97, 97, 97);
    opacity: 0.5;
    transition: 0.3s ease-in-out;
}
input[type="text"]:focus{
    outline: none;
    opacity: 1;
    padding: 5px;
}
select{
    margin-bottom: 20px;
}

span{
  margin-right: 20px;
  margin-left: 10px;
}

input[type="radio"]{
  margin-bottom: 20px;
}
  
#nav span{
    transition: 0.3s ease-in-out;
    margin: 0;
}
#nav span:hover {
  letter-spacing: 2px;
  font-weight: bolder;
  cursor: pointer;
}

button{
    width: 100%;
    line-height: 50px;
    background: rgb(199, 199, 199);
    font-size: 18px;
    border:0;
    color:rgb(73, 73, 73);
    border-radius: 10px;
    margin-top: 20px;
}
button:hover{
    background: rgb(161, 161, 161);
    cursor: pointer;
}
</style>