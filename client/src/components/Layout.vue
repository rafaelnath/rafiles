<template>
  <div class="layout">
    <div class="sidebar">
      <div class="container">
        <h1>raFiles</h1>
        <a :class="{active: menu === 'dashboard'}" @click="goTo('dashboard')">Dashboard</a>

        <template v-if="role === 'teacher'">
          <a :class="{active: menu === 'courses'}" @click="goTo('courses')">My Courses</a>
        </template>

        <template v-else-if="role === 'student'">
          <a :class="{active: menu === 'class'}" @click="goTo('class')">My Class</a>
        </template>

        <a :class="{active: menu === 'browse'}" @click="goTo('browse')">Browse</a>
      </div>
      <a class="logout" @click="logout">Logout</a>
    </div
    ><div class="content">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
        menu: '',
        role: ''
    };
  },

  created(){
    this.role = localStorage.getItem('role');
    if(this.$route.path === '/teacher/dashboard'){
      this.menu = 'dashboard'
    }
    else if(this.$route.path === '/teacher/courses'){
      this.menu = 'courses'
    }
    else if(this.$route.path === '/teacher/browse'){
      this.menu = 'browse'
    }

    if(this.$route.path === '/student/dashboard'){
      this.menu = 'dashboard'
    }
    else if(this.$route.path === '/student/class'){
      this.menu = 'courses'
    }
    else if(this.$route.path === '/student/browse'){
      this.menu = 'browse'
    }
  },

  methods: {
    goTo(page){
      this.$router.push(page);
      this.menu = page;
    },
    logout(){
      this.$store.commit('logout');
      this.$router.push('/login');
    }
  }
};
</script>

<style scoped>
.layout {
  width: 100%;
  height: 100vh;
}
.sidebar,
.content {
  display: inline-block;
  vertical-align: top;
}

.sidebar {
  background: rgb(201, 201, 201);
  width: 14%;
  /* max-width: 276.5px; */
  height: 100vh;
  position: relative;
}
.container {
  padding-top: 50px;
  width: 63%;
  /* background: rgb(255, 224, 224); */
  margin: 0 auto;
}
.container h1 {
  text-align: center;
  font-size: 35px;
  margin-bottom: 130px;
}
.container a {
  display: block;
  margin-bottom: 100px;
  font-size: 22px;
  letter-spacing: 1px;
  color: #000;
  text-decoration: none;
}
.container a:hover{
  cursor: pointer;
}
.active{
    font-weight: bold;
}

.logout {
  position: absolute;
  bottom: 20px;
  font-size: 18px;
  left: 20px;
  transition: 0.3s ease-in-out;
}

.logout:hover{
  cursor: pointer;
  font-weight: bold;
  letter-spacing: 2px;
}

.content{
    width: 86%;
    height: 100vh;
  background: rgb(241, 241, 241);
}
</style>