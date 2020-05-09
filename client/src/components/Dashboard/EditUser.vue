<template>
  <div class="edit-user">
    <div class="info" v-if="!editPwd">
      <h1>Edit Info</h1>
      <table>
        <tr>
          <td>
            <p>Full Name</p>
            <input type="text" v-model="user.name" />
          </td>
          <td>
            <p>Email Address</p>
            <input type="email" v-model="user.email" />
          </td>
        </tr>
        <tr>
          <td>
            <p>Gender</p>
            <input type="radio" name="gender" value="male" v-model="user.gender" />
            <span>Male</span>
            <input type="radio" name="gender" value="female" v-model="user.gender" />
            <span>Female</span>
          </td>
          <td>
            <p>Nationality</p>
            <select class="nation" v-model="user.nationality">
              <option value disabled selected>Choose country</option>
              <option
                v-for="(ctry, index) in countries"
                :key="index"
                :value="ctry.name"
              >{{ctry.name}}</option>
            </select>
          </td>
        </tr>
        <tr>
          <td>
            <p>Birthdate</p>
            <select v-model="bd.day">
              <option value disabled selected>Day</option>
              <option v-for="(day, index) in days" :key="index" :value="day">{{day}}</option>
            </select>
            <select v-model="bd.month">
              <option value disabled selected>Month</option>
              <option v-for="(month, index) in months" :key="index" :value="month">{{month}}</option>
            </select>
            <select v-model="bd.year" class="last">
              <option value disabled selected>Year</option>
              <option v-for="(year, index) in years" :key="index" :value="year">{{year}}</option>
            </select>
          </td>
          <td>
            <p>Password</p>
            <a @click="editPwd = true">change</a>
          </td>
        </tr>
      </table>
      <div class="buttons">
        <p class="button" @click="update">Update</p>
        <p class="button" @click="cancel">Cancel</p>
      </div>
    </div>
    <edit-password v-else @close="editPwd = false" :uId="this.uId"/>

  </div>
</template>

<script>
import axios from "axios";
import EditPassword from "./EditPassword";
import Api from "@/services/UserService";

export default {
  components:{
    EditPassword
  },
  data() {
    return {
      bd: {
        day: "",
        month: "",
        year: ""
      },

      editPwd: false,

      countries: null,
      years: [],
      months: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ],
      days: []
    };
  },

  props: {
    user: {
      type: Object
    },
    uId: {
      type: String
    }
  },

  methods: {
    initData() {
      //Setting up user birthday
      let bdate = this.user.birthdate.split("-");
      this.bd.day = bdate[0];
      this.bd.month = bdate[1];
      this.bd.year = bdate[2];
      //Getting Countries
      axios
        .get(`https://restcountries.eu/rest/v2/all`)
        .then(res => {
          this.countries = res.data;
        })
        .catch(() => {
          window.alert(`failed to retrieve countries data :(`);
        });

      //Getting Years
      let thisYear = new Date().getFullYear();
      let max = thisYear;
      let min = thisYear - 99;
      for (let i = max; i >= min; i--) {
        this.years.push(i);
      }

      //Getting Days
      for (let i = 1; i <= 31; i++) {
        this.days.push(i);
      }
    },

    update() {
      if (
        !this.user.name ||
        !this.user.email ||
        !this.user.nationality ||
        !this.user.gender ||
        !this.bd.day ||
        !this.bd.month ||
        !this.bd.year
      ) {
        window.alert(`please fill all the empty field!`);
      } else {
        Api.update({
          userId: this.uId,
          name: this.user.name,
          email: this.user.email,
          nationality: this.user.nationality,
          gender: this.user.gender,
          birthdate: `${this.bd.day}-${this.bd.month}-${this.bd.year}`
        })
          .then(res => {
            window.alert(`updated`);
            this.$parent.initData();
            this.$emit("close");
          })
          .catch(err => {
            err.response.data
              ? window.alert(err.response.data.msg)
              : window.alert(err);
          });
      }
    },

    cancel() {
      this.$emit(`close`);
      this.$parent.initData();
    }
  },

  created() {
    this.initData();
  }
};
</script>

<style scoped>
h1 {
  margin-bottom: 20px;
}
table {
  width: 100%;
  border-spacing: 10px 25px;
  margin-bottom: 30px;
}

td p {
  margin-bottom: 10px;
}

input[type="text"],
input[type="email"] {
  width: calc(100% - 20px);
  font-size: 20px;
  line-height: 30px;
  background: none;
  border: 0;
  border-bottom: 2px solid #ccc;
  font-size: 25px;
}

select {
  font-size: 16px;
  padding: 5px;
  border-radius: 5px;
  /* border: 0; */
  border: 2px solid #ccc;
}
.info a {
  text-decoration: underline;
  transition: .3s ease-in-out;
}
.info a:hover{
  cursor: pointer;
  opacity: 0.8;
  letter-spacing: 1px;
}

.buttons {
  float: right;
}
.button {
  display: inline-block;
  background: #666;
  line-height: 50px;
  width: 100px;
  text-align: center;
  color: white;
  margin-left: 20px;
}
.button:hover {
  cursor: pointer;
  opacity: 0.8;
}
</style>