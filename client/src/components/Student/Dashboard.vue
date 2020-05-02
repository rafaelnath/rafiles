<template>
  <div class="dashboard">
    <h1>{{user.name}}</h1>
    <h3>Pinned books</h3>
    <div class="list">
      <table>
        <tr>
          <td>
            <div class="book">
              <div class="cover">
                <div class="cover-container">
                  <p class="title">JavaScript for Impatient Programmer</p>
                  <p class="author">by Prof. John D</p>
                </div>
              </div><div class="desc">
                <div class="desc-container">
                  <h3>Description</h3>
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Aliquam eius repudiandae suscipit dolore sint eaque corrupti.
                  </p>
                  <div class="buttons">
                    <a class="button read">Read</a>
                    <a class="button love">Unpin</a>
                  </div>
                </div>
              </div>
            </div>
          </td>
          <td>
            <div class="book">
              <div class="cover">
                <div class="cover-container">
                  <p class="title">JavaScript for Impatient Programmer</p>
                  <p class="author">by Prof. John D</p>
                </div>
              </div><div class="desc">
                <div class="desc-container">
                  <h3>Description</h3>
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Aliquam eius repudiandae suscipit dolore sint eaque corrupti.
                  </p>
                  <div class="buttons">
                    <a class="button read">Read</a>
                    <a class="button love">Unpin</a>
                  </div>
                </div>
              </div>
            </div>
          </td>
          <td>
            <div class="book">
              <div class="cover">
                <div class="cover-container">
                  <p class="title">JavaScript for Impatient Programmer</p>
                  <p class="author">by Prof. John D</p>
                </div>
              </div><div class="desc">
                <div class="desc-container">
                  <h3>Description</h3>
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Aliquam eius repudiandae suscipit dolore sint eaque corrupti.
                  </p>
                  <div class="buttons">
                    <a class="button read">Read</a>
                    <a class="button love">Unpin</a>
                  </div>
                </div>
              </div>
            </div>
          </td>
          <td>
            <div class="book">
              <div class="cover">
                <div class="cover-container">
                  <p class="title">JavaScript for Impatient Programmer</p>
                  <p class="author">by Prof. John D</p>
                </div>
              </div><div class="desc">
                <div class="desc-container">
                  <h3>Description</h3>
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Aliquam eius repudiandae suscipit dolore sint eaque corrupti.
                  </p>
                  <div class="buttons">
                    <a class="button read">Read</a>
                    <a class="button love">Unpin</a>
                  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import Api from "@/services/UserService";
export default {
  data() {
    return {
      uId: '',
      user: ''
    };
  },

  created(){
    this.uId = localStorage.getItem('userId');
    this.initData();
  },

  methods: {
    initData(){
      Api.get(this.uId)
        .then(user => {
          this.user = user.data;
        })
    }
  }
};
</script>

<style scoped>
.dashboard {
  padding-top: 50px;
  width: 88%;
  margin: 0 auto;
}

h1{
  margin-bottom: 50px;
}

h3{
  font-size: 22px;
  margin-bottom: 10px;
}

.list {
  width: 100%;
  /* background: rgb(248, 189, 189); */
  padding-top: 10px;
  border-radius: 20px;
  max-height: 500px;
  overflow: auto;
}

table{
  width: 2000px;
}

td{
  /* background: rosybrown; */
  width: 100px;
  padding-right: 30px;
}

.book {
  /* width: 0%; */
  background: #fff;
  padding: 20px;
  border-radius: 20px;
  margin-bottom: 15px;
  transition: 0.3s ease-in-out;
  display: inline-block;
  position: relative;
}
.book:hover {
  cursor: pointer;
  box-shadow: 0 8px 6px rgba(0, 0, 0, 0.171);
  transform: translateY(-5px);
}
.cover {
  background: rgb(255, 228, 78);
  width: 35%;
  height: 197px;
  border-radius: 10px;
}
.cover,
.desc {
  display: inline-block;
  vertical-align: top;
}

.cover-container {
  width: 70%;
  margin-left: 20px;
  padding: 20px 0px;
}
.cover .title {
  font-size: 18px;
  width: 80%;
  font-weight: bold;
  margin-bottom: 10px;
}

.cover .author{
  font-size: 14px;
}

.desc {
  width: 65%;
}

.desc-container {
  width: 92%;
  float: right;
}

.desc h3 {
  margin-bottom: 10px;
  font-size: 23px;
}
.desc p {
  font-size: 16px;
}

.desc .buttons {
  position: absolute;
  bottom: 40px;
}

.desc .button {
  border-radius: 10px;
  font-size: 20px;
}

.desc .read {
  background: #ccc;
  padding: 15px 60px;
  margin-right: 10px;
}

.desc .love {
  background: #bbb;
  padding: 15px;
}

.members {
  /* background: #fff; */
  width: 45%;
}
</style>