<template>
  <div class="manage-class">
    <p id="nav">
      <span @click="goTo('dashboard')">dashboard</span>
    </p>
    <h2>Manage Classes</h2>
    <input type="text" placeholder="search majors..." @input="searchMajor" v-model="search" />
    <a class="menu" @click="goTo('classes/add-major')">add major</a>

    <div class="class-container">
      <div class="class" v-for="(major, index) in majors" :key="index">
        <div class="left">
          <p class="major-name">{{major.name}}</p>
          <p class="addclass" @click="goTo(`classes/add/${major._id}/${major.name}`)">add class</p>
        </div>
        <div class="right">
          <p @click="goTo(`classes/class/${value._id}`)" class="classes" v-for="(value, index) in major.classes" :key="index">{{value.name}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Api from "@/services/ClassService";
export default {
  data() {
    return {
      majors: null,
      classes: null,
      search: ""
    };
  },

  methods: {
    initData() {
      Api.getAll().then(res => {
        this.majors = res.data.data;
      });
    },

    goTo(page){
        this.$router.push(`/admin/${page}`)
    },

    searchMajor() {
      clearTimeout(this.debounce);
      this.debounce = setTimeout(() => {
        Api.search(this.search).then(res => {
          this.majors = res.data.data;
        });
      }, 600);
    }
  },

  created() {
    this.initData();
  }
};
</script>

<style scoped>
.manage-class {
  background: #f1f1f1;
  width: calc(75% - 40px);
  padding: 20px;
  margin: 0 auto;
  border-radius: 20px;
  height: 520px;
}
#nav{
  margin-bottom: 10px;
}
h2{
  margin-bottom: 20px;
}
input {
  margin-bottom: 20px;
  width: 60%;
  padding: 0px 5px;
  font-size: 20px;
  line-height: 30px;
  border: 0;
  background: none;
  border-bottom: 2px solid rgb(97, 97, 97);
  opacity: 0.5;
  transition: 0.3s ease-in-out;
}
input:focus {
  outline: none;
  opacity: 1;
  padding: 5px;
}

.menu {
  margin-left: 20px;
}
.menu:hover {
  cursor: pointer;
  text-decoration: underline;
}

span {
  transition: 0.1s ease-in;
}
span:hover {
  letter-spacing: 2px;
  font-weight: bolder;
  cursor: pointer;
}
.class-container {
  max-height: 350px;
  /* background: red; */
  overflow: auto;
  border-radius: 20px;
}
.class {
  background: rgb(185, 185, 185);
  margin-bottom: 20px;
  padding: 15px 20px;
  border-radius: 20px;
}
.left,
.right {
  display: inline-block;
  vertical-align: middle;
  width: 46%;
}
.major-name {
  font-size: 25px;
  font-weight: bold;
  margin-bottom: 5px;
}
.classes {
  font-size: 20px;
  width: 30%;
  text-align: center;
  /* background: white; */
  display: inline-block;
  transition: 0.2s ease-in-out;
}
.classes:hover {
  cursor: pointer;
  transform: scale(1.3);
  background: rgb(207, 207, 207);
  border-radius: 20px;
  box-shadow: 0 5px 5px rgba(0, 0, 0, 0.199);
}
.addclass {
  transition: 0.3s ease-in-out;
}
.addclass:hover {
  text-decoration: underline;
  cursor: pointer;
  transform: translateX(10px);
}
</style>