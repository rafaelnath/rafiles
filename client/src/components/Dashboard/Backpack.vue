<template>
  <div class="backpack">
    <template v-if="books.length > 0">
      <div class="book" v-for="(book,index) in books" :key="index">
          <div class="book-container">
            <div class="cover">
                <div class="cover-container">
                  <p class="title">{{book.title}}</p>
                  <p class="author">by {{book.author}}</p>
                </div>
            </div>
            <div class="desc">
                <div class="desc-container">
                  <h3>Description</h3>
                  <p>{{book.description}}</p>
                  <div class="buttons">
                      <a class="button read" @click="readBook(book._id)">Read</a>
                      <a class="button love" @click="removeBook(book._id)">Remove</a>
                  </div>
                </div>
            </div>
          </div>
      </div>
    </template>
    <template v-else>
      <p class="none">There is no textbook in your backpack yet.</p>
    </template>
  </div>
</template>

<script>
import Api from "@/services/UserService";
export default {
  data() {
    return {};
  },
  props: {
      books:{
          type:Array
      },
      uId:{
        type: String
      }
  },
  created(){
      console.log(this.books);
  },
  methods: {
    readBook(bId){
        this.$router.push({path: 'bookviewer', query:{bId: bId}});
    },
    removeBook(bId){
      Api.removeBook({bookId: bId, userId: this.uId})
        .then(res =>{
          window.alert('one book has been removed from your backpack.');
          this.$parent.initData();
        })
        .catch(err =>{
          window.alert(err.response.data.msg);
        })
    }
  }
};
</script>

<style scoped>
.backpack {
  height: 400px;
  /* background: rgb(248, 189, 189); */
  padding-top: 10px;
  padding-right: 20px;
  border-radius: 20px;
  max-height: 500px;
  overflow: auto;
  position: relative;
  /* background:indianred */
}

.none{
  position: absolute;
  top:50%;
  left:50%;
  transform: translate(-50%, -50%);
  font-size: 22px;
}

.book {
  width: 48%;
  height:280px;
  background: #fff;
  border-radius: 20px;
  margin-bottom: 45px;
  transition: 0.3s ease-in-out;
  position: relative;
  float:left;
}
.book:nth-child(even){
    float:right;
}
.book:hover {
  box-shadow: 0 8px 6px rgba(0, 0, 0, 0.171);
  transform: translateY(-5px);
}
.book-container{
    /* background: salmon; */
    width: 90%;
    height: 230px;
    position: absolute;
    top:50%;
    left:50%;
    transform: translate(-50%, -50%);
}
.cover {
  background: rgb(255, 228, 78);
  width: 35%;
  height: 230px;
  border-radius: 10px;
}
.cover,
.desc {
  display: inline-block;
  vertical-align: top;
}

.cover-container {
  width: 85%;
  margin: 0 auto;
  padding: 20px 0px;
  /* background: #000; */
}
.cover .title {
  font-size: 22px;
  /* width: 80%; */
  font-weight: bold;
  margin-bottom: 10px;
}

.cover .author{
    font-size: 13px;
    font-weight: bold;
}

.desc {
  width: 55%;
  /* background: lavender; */
}

.desc-container {
  width: 92%;
  float: right;
}

.desc h3 {
  margin-bottom: 20px;
  font-size: 22px;
}
.desc p {
  font-size: 20px;
  max-height: 110px;
  overflow: auto;
}

.desc .buttons {
  position: absolute;
  bottom: 15px;
}

.desc .button {
  border-radius: 10px;
  font-size: 20px;
}
.desc .button:hover {
  cursor: pointer;
  opacity: 0.8;
}

.desc .read {
  background: #ccc;
  padding: 15px 60px;
  margin-right: 10px;
}

.desc .pin {
  background: #bbb;
  padding: 15px 20px;
}
</style>