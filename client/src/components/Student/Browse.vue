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

    <div class="courses" v-if="tab === 'course'">
        <input type="text" placeholder="Search course, teacher...">
        <div class="list">
            <div class="course">
                <div class="pic"></div>
                <div class="info">
                    <p class="title">Advanced Database</p>
                    <p class="class">Software Engineering 2016, E-Commerce 2016</p>
                </div>
            </div>
            <!-- DUMMY -->
            <div class="course">
                <div class="pic"></div>
                <div class="info">
                    <p class="title">Advanced Java</p>
                    <p class="class">Software Engineering 2017</p>
                </div>
            </div>
            <div class="course">
                <div class="pic"></div>
                <div class="info">
                    <p class="title">Software Testing</p>
                    <p class="class">Software Engineering 2016</p>
                </div>
            </div>
            <div class="course">
                <div class="pic"></div>
                <div class="info">
                    <p class="title">HSK 5</p>
                    <p class="class">Software Engineering 2017, E-Commerce 2017</p>
                </div>
            </div>
        </div>
    </div
    >
  </div>
</template>

<script>
export default {
  data() {
    return {
      tab: "course"
    };
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

.courses{
    width: 55%;
}

input {
  width: 88%;
  border-radius: 30px;
  padding: 0px 20px;
  font-size: 20px;
  line-height: 50px;
  border: 0;
  background: rgb(192, 192, 192);
  opacity: 0.5;
  transition: 0.3s ease-in-out;
  margin-bottom: 20px;
  margin-top: 40px;
}
input:focus {
  outline: none;
  opacity: 1;
}

.list{
    height: 500px;
    /* background: rgb(248, 189, 189); */
    padding: 0 10px;
    border-radius: 20px;
    max-height: 500px;
    overflow: auto;
}

.course{
    background: #fff;
    padding:20px 30px;
    border-radius: 20px;
    margin-bottom: 30px;
    transition: 0.3s ease-in-out;
}
.course:hover{
    cursor: pointer;
    box-shadow: 0 8px 6px rgba(0, 0, 0, 0.171);
    transform: translateY(-5px);
}
.pic, .info{
    display: inline-block;
    vertical-align: middle;
}
.pic{
    width: 80px;
    height: 80px;
    background: #eee;
    border-radius: 100%;
    margin-right: 30px;
}
.info .title{
    font-weight: bold;
    font-size: 28px;
    margin-bottom: 3px;
}
.info .teacher{
    font-size: 15px;
}
.info .class{
    margin-bottom: 3px;
}

</style>