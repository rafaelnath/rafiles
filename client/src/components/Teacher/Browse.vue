<template>
  <div class="browse">
    <div class="header">
      <div class="crs" :class="{active: tab === 'course'}" @click="changeTab('course')">
        <p>Course</p>
        <div class="line" :class="{active: tab === 'course'}" />
      </div>
      <div class="clss" :class="{active: tab === 'class'}" @click="changeTab('class')">
        <p>Class</p>
        <div class="line2" :class="{active: tab === 'class'}" />
      </div>
      <br />
    </div>
    <browse-course v-if="tab === 'course'"/>
    <browse-class v-if="tab === 'class'"/>
  </div>
</template>

<script>
import BrowseCourse from './BrowseCourse'
import BrowseClass from './BrowseClass'
export default {
  data() {
    return {
      tab: "course"
    };
  },

  components:{
    BrowseCourse,
    BrowseClass,
  },

  created(){
    if(this.$route.query.tab){
      this.tab = this.$route.query.tab;
    }
  },

  methods: {
    changeTab(tab) {
      this.tab = tab;
    }
  }
};
</script>

<style scoped>
.browse {
  padding-top: 50px;
  width: 88%;
  margin: 0 auto;
}
.crs,
.clss {
  display: inline-block;
  font-size: 32px;
  letter-spacing: 3px;
  line-height: 50px;
  opacity: 0.6;
  position: relative;
}
.crs:hover,
.clss:hover {
  cursor: pointer;
}

.crs {
  margin-right: 80px;
}

.line {
  background: rgb(146, 146, 146);
  height: 8px;
  width: 100%;
  position: absolute;
  border-radius: 20px;
  left: 0;
  opacity: 0;
  transition: 0.3s ease-in-out;
  transform: translateX(100%);
}
.line2 {
  border-radius: 20px;
  background: rgb(146, 146, 146);
  height: 8px;
  width: 100%;
  position: absolute;
  left: 0;
  opacity: 0;
  transform: translateX(-100%);
  transition: 0.3s ease-in-out;
}
.active {
  opacity: 1;
  transform: none;
}
.browse::-webkit-scrollbar-thumb{
  background:#000;
  border-radius: 20px;
}
</style>