<template>
  <div class="new-course">
    <p>Course Name</p>
    <input type="text" v-model="name" placeholder="Enter course name" />
    <button @click="createCourse">Create</button>
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
  border-radius: 20px;
  margin-top: 10px;
}
</style>