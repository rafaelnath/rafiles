<template>
  <div class="new-course">
    <p>Course Name</p>
    <input type="text" v-model="name" placeholder="Enter course name" @keyup.enter="createCourse"/>
    <div class="button">
      <button @click="createCourse">Create</button>
    </div>
  </div>
</template>

<script>
import Api from "@/services/ClassService";

export default {
  data() {
    return {
      name: ""
    };
  },
  methods: {
    createCourse() {
      if(!this.name){
        window.alert(`please input the course name`);
        return;
      }
      Api.createCourse({
        name: this.name,
        classId: this.$route.params.id
      }).then(res => {
        window.alert("new course created.");
        this.$parent.initData();
        this.name = '';
      })
      .catch(err =>{
        window.alert(err.response.data.msg);
      })
    }
  }
};
</script>

<style scoped>
.new-course {
  background: #fff;
  padding: 10px;
  border-radius: 10px;
  margin-top: 20px;
  display: inline-block;
}
input, .button{
  display: inline-block;
}
.container{
  margin-right: 20px;
}
p{
  margin-bottom: 5px;
  font-weight: bold;
  font-size: 18px;
}
</style>