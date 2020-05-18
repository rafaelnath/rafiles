<template>
  <div class="add-course">
    <p class="title">Add from existing courses</p>
    <input type="text" placeholder="search courses..." @input="searchCourse" v-model="search" />
    <div class="course-container">
      <div class="courses" v-for="(course, index) in courses" :key="index">
        <div class="cLeft">
          <p class="cName">{{course.name}}</p>
          <!-- <div class="teacher" v-if="course.users.length !== 0"> -->
          <div class="teacher">
            <p>User:</p>
            <template v-if="course.users.length !== 0">
              <p v-for="(user, indx) in course.users" :key="indx">{{user.name}},&nbsp;</p>
            </template>
            <!-- <p v-if="course.users.length !== 0">{{course.users}}</p> -->
            <p v-else>none</p>
          </div>
        </div>
        <div class="cRight">
          <p class="mini-button accept" @click="add(course._id)">add</p>
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
      courses: [],
      search: "",
      debounce: null
    };
  },

  created() {
    this.initData();
  },

  methods: {
    goTo(page) {
      window.location.href = `/admin/${page}`;
    },

    add(id) {
      Api.addCourseToClass({
        classId: this.$route.params.id,
        courseId: id
      })
        .then(() => {
          this.addCB(id, this.$route.params.id);
        })
        .catch(err => {
          window.alert(err.response.data.msg);
        });
    },

    addCB(courseId, classId) {
      Api.addClassToCourse({
        classId: classId,
        courseId: courseId
      })
        .then(() => {
          window.alert("course added.");
          this.$parent.initData();
        })
        .catch(err => {
          window.alert(err.response.data.msg);
        });
    },

    initData() {
      Api.allCourse().then(res => {
        this.courses = [];
        res.data.forEach(course => {
          if (!course.class.includes(this.$route.params.id)) {
            this.courses.push(course);
          }
        });
      });
    },

    searchCourse() {
      clearTimeout(this.debounce);
      this.debounce = setTimeout(() => {
        Api.searchCourse(this.search).then(res => {
          this.courses = [];
          res.data.forEach(course => {
            if (!course.class.includes(this.$route.params.id)) {
              this.courses.push(course);
            }
          });
        });
      }, 600);
    }
  }
};
</script>

<style scoped>
.add-course {
  background: #fff;
  width: 70%;
  margin-top: 20px;
  border-radius: 20px;
  padding: 20px;
}
.title {
  display: inline-block;
  font-weight: bold;
  margin-block-start: 0;
  margin-block-end: 0;
  margin-bottom: 10px;
  font-size: 18px;
}
input[type="text"] {
  margin-bottom: 20px;
  width: 88%;
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

button {
  width: 100%;
  line-height: 50px;
  background: rgb(199, 199, 199);
  font-size: 18px;
  border: 0;
  color: rgb(73, 73, 73);
}
button:hover {
  background: rgb(161, 161, 161);
  cursor: pointer;
}

.mini-button {
  padding: 3px 15px;
  background: rgb(170, 170, 170);
  border-radius: 20px;
  transition: 0.2s ease-in-out;
}
.mini-button:hover {
  cursor: pointer;
}
.accept:hover {
  background: rgb(40, 161, 95);
  color: #f1f1f1;
}

.course-container{
  /* background: lavender; */
  height: 180px;
  overflow: auto;
}

.courses {
  background: #ccc;
  border-radius: 20px;
  padding: 10px 15px;
  margin-bottom: 10px;
  margin-top: 20px;
  width: 88%;
}
.cLeft,
.cRight {
  display: inline-block;
  vertical-align: middle;
}

.cLeft {
  width: 80%;
}

.cName {
  font-size: 25px;
  font-weight: bold;
  margin-bottom: 10px;
}
.teacher p {
  display: inline-block;
  font-size: 15px;
}
.teacher p:nth-child(1) {
  margin-right: 10px;
}
</style>