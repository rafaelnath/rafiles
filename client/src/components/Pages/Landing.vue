<template>
  <div class="landing-page">
    <!-- -----------------------------------[GREETINGS SECTION] -->
    <div class="greets">
      <div class="container">
        <div class="header">
          <h2>raFiles</h2>
          <a href="/login">Login</a>
          <div style="clear:both"/>
        </div>
        <div class="content-left">
          <p>Tired carrying heavy textbooks <br> to school every day?</p>
          <p style="marginTop:20px; marginBottom:5px">Don't worry.</p>
          <h1>We Got Your "Back" !</h1>
          <a href="/register">GET STARTED</a>
        </div>
        <div class="content-right">
            <img src="@/assets/illustration-01.png" alt="">
        </div>
      </div>
    </div>
    <!-- -----------------------------------[FEATURES SECTION] -->
    <div class="features">
      <div class="container">
        <!-- main features with icon -->
        <h1>Features</h1>
            <ul>
              <li>Awesome Todos</li>
              <li>Efficient File Sharing</li>
              <li>Modern Classroom</li>
            </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },

  methods: {}
};
</script>

<style scoped>
.landing-page {
  width: 100%;
}
.container{
    width: 78%;
    margin: 0 auto;
}
.greets {
  background: #fff;
  padding-top:30px;
  /* height: 100vh; */
}

.content-left p{
    font-size: 23px;
    letter-spacing: 2px;
    line-height: 31px;
}
.content-left h1{
    font-size: 48px;
    margin-bottom: 30px;
}
.content-left a{
    background: #0091AC;
    padding:14px 20px;
    color: #fff;
    /* font-weight: bold; */
    letter-spacing: 1px;
    border-radius:50px;
    text-decoration: none;
}
.content-left a:hover{
    opacity: 0.8;
    cursor: pointer;
}

.content-right img{
    width: 43%;
    /* max-width: 533px; */
    position: absolute;
    bottom: 70px;
    right:8%;
}
.header{
    /* background:white; */
    margin-bottom: 160px;
}
.header h2{
    float:left;
    font-weight: bolder;
}
.header a{
    float:right;
    color:#000;
    text-decoration: none;
    letter-spacing: 1px;
}
.features{
    position:absolute;
    width: 100%;
    top:100%;
    background:burlywood;
}
</style>