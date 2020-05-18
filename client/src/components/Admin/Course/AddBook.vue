<template>
  <div class="add-book">
    <input type="text" placeholder="search titles, authors..." @input="searchBook" v-model="search" />
    <div class="container">
      <div class="courses" v-for="(book, index) in books" :key="index">
        <div class="cLeft">
          <p class="cName">{{book.title}}</p>
          <div class="teacher">
            <p>Author:</p>
            <p v-if="book.author">{{book.author}}</p>
            <p v-else>none</p>
          </div>
        </div
        ><div class="cRight">
          <p class="mini-button accept" @click="add(book._id)">add</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Api from "@/services/CourseService";
import BookApi from "@/services/BookService";

import _ from "lodash";

export default {
  data() {
    return {
      books: [],
      search: "",
      debounce: null
    };
  },

  props:{
    cid: String,
  },

  created() {
    if(this.$route.params.id){
      this.cid = this.$route.params.id;
    }
    this.initData();
  },

  methods: {
    goTo(page) {
      window.location.href = `/admin/${page}`;
    },

    add(id) {
      Api.addBookToCourse({
        courseId: this.cid,
        bookId: id
      })
        .then(() => {
          this.addCB(this.cid, id);
        })
        .catch(err => {
          window.alert(err.response.data.msg);
        });
    },

    addCB(courseId, bookId) {
      Api.addCourseToBook({
        courseId: courseId,
        bookId: bookId
      })
        .then(() => {
          window.alert("book added.");
          this.initData();
          this.$parent.initData();
        })
        .catch(err => {
          window.alert(err.response.data.msg);
        });
    },

    initData() {
      BookApi.getAll().then(res => {
        this.books = [];
        _.forEach(res.data.data, book => {
          if (!book.courses.includes(this.cid)) {
            this.books.push(book);
          }
        });
      });
    },

    searchBook() {
      clearTimeout(this.debounce);
      this.debounce = setTimeout(() => {
        BookApi.searchBook(this.search).then(res => {
          this.books = [];
          _.forEach(res.data.data, book => {
            if (!book.courses.includes(this.cid)) {
              this.books.push(book);
            }
          });
        });
      }, 600);
    }
  }
};
</script>

<style scoped>
.add-book {
  background: #fff;
  width: 70%;
  margin-top: 20px;
  border-radius: 20px;
  padding: 20px;
  height: 320px;
  min-height: 280px;
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
  padding: 6px;
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

.container{
  height: 260px;
  overflow: auto;
  /* background: darkgoldenrod; */
}

.courses {
  background: #ccc;
  border-radius: 10px;
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
  width: 85%;
}
.cRight{
  width: 15%;
  text-align: center;
}

.cName {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 5px;
}
.teacher p {
  display: inline-block;
  font-size: 15px;
}
.teacher p:nth-child(1) {
  margin-right: 10px;
}
</style>