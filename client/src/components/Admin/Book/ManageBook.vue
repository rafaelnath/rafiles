<template>
  <div class="manage-book">
    <p>
      <span @click="goTo('dashboard')">dashboard</span>
    </p>
    <h2>Manage Books</h2>
    <input type="text" placeholder="search books..." @input="searchBook" v-model="search" />
    <a class="menu" @click="goTo('books/upload')">upload book</a>
    <table>
      <tr>
        <td>Title</td>
        <td>Author</td>
        <td>Size</td>
        <td>Upload date</td>
        <td>Action</td>
      </tr>
      <tr v-for="(book, index) in books" :key="index">
        <td>{{book.title}}</td>
        <td>{{book.author}}</td>
        <td>{{Math.round(book.size / 1000)}} kb</td>
        <td>{{book.created_at}}</td>
        <td>
          <router-link :to="'/admin/books/edit/' + book._id">
            <a>edit</a>
          </router-link>&nbsp;&nbsp;
          <a @click="deleteBook(book._id, book.filename)">delete</a>
        </td>
      </tr>
    </table>
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

    goTo(page) {
      window.location.href = `/admin/${page}`;
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
  width: 70%;
  margin: 0 auto;
  padding: 20px;
  border-radius: 20px;
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

table {
  width: 100%;
  line-height: 30px;
}
span {
  transition: 0.1s ease-in;
}
span:hover {
  font-size: 18px;
  font-weight: bolder;
  cursor: pointer;
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