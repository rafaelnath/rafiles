<template>
  <div class="manage-book">
    <p id="nav">
      <span @click="goTo('dashboard')">dashboard</span>
    </p>
    <h2>Manage Books</h2>
    <input type="text" placeholder="search book title or author..." @input="searchBook" v-model="search" />
    <a class="menu" @click="goTo('books/upload')">upload book</a>
    <div class="table-container">
      <table>
        <tr>
          <th>Title</th>
          <th>Author</th>
          <th>Size</th>
          <th>Upload date</th>
          <th>Action</th>
        </tr>
        <tr v-for="(book, index) in books" :key="index">
          <td>{{book.title}}</td>
          <td>{{book.author}}</td>
          <td>{{Math.round(book.size / 1000)}} kb</td>
          <td>{{book.created_at.split('T')[0]}}</td>
          <td>
            <router-link :to="'/admin/books/edit/' + book._id">
              <a>edit</a>
            </router-link>&nbsp;&nbsp;
            <a @click="deleteBook(book._id, book.filename)">delete</a>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import Api from "@/services/BookService";
import CourseApi from "@/services/CourseService";
export default {
  data() {
    return {
      books: [],
      search: "",
      debounce: null
    };
  },

  methods: {
    initData() {
      Api.getAll().then(res => {
        this.books = res.data.data;
      });
    },

    goTo(page){
        this.$router.push(`/admin/${page}`)
    },

    searchBook() {
      clearTimeout(this.debounce);
      this.debounce = setTimeout(() => {
        Api.searchBook(this.search).then(res => {
          this.books = res.data.data;
        });
      }, 600);
    },

    deleteBook(id, filename) {
      if (window.confirm("Are you sure?")) {
        Api.deleteBook(id)
          .then(res => {
            this.deleteFile(id, filename, res.data.data.courses);
          })
          .catch(err => {
            window.alert(err.response.data.msg);
          });
      }
    },

    deleteFile(id, filename, courses) {
      Api.deleteFile(filename)
        .then(() => {
          this.removeBookFromCourses(id, courses);
        })
        .catch(err => {
          window.alert(err.response.data.msg);
        });
    },

    removeBookFromCourses(id, courses) {
      CourseApi.removeBookFromManyCourses({
        bookId: id,
        courseId: courses
      })
        .then(() => {
          window.alert("book deleted");
          this.initData();
        })
        .catch(err => {
          window.alert(err.response.data.msg);
        });
    }
  },

  created() {
    this.initData();
  }
};
</script>

<style scoped>
.manage-book {
  background: #f1f1f1;
  width: calc(75% - 40px);
  padding: 20px;
  margin: 0 auto;
  border-radius: 20px;
}
#nav{
  margin-bottom: 10px;
}
input {
  margin-bottom: 20px;
  width: 60%;
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

.menu {
  margin-left: 20px;
}
.menu:hover {
  cursor: pointer;
  text-decoration: underline;
}

.table-container{
  height: 430px;
  overflow: auto;
}
  
table {
  width: 100%;
  line-height: 30px;
}
th{
  padding-bottom: 10px;
  text-align: left;
}
span {
  transition: 0.1s ease-in;
}
span:hover {
  letter-spacing: 2px;
  font-weight: bolder;
  cursor: pointer;
}
td{
  padding-bottom: 5px;
}
td a {
  text-decoration: none;
  color: #000;
  font-style: italic;
}
td a:hover {
  text-decoration: underline;
  cursor: pointer;
}
</style>