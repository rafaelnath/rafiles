<template>
  <div class="edit-book">
    <p id="nav">
      <span @click="goTo('dashboard')">dashboard</span> /
      <span @click="goTo('books')">manage book</span>
    </p>
    <h2>Edit Books</h2>

    <form @submit.prevent="upload" enctype="multipart/form-data">
      <p>Title</p>
      <input type="text" v-model="book.title" />

      <p>Author</p>
      <input type="text" v-model="book.author" />

      <p>Description</p>
      <input type="text" v-model="book.description" />

      <p>Change file</p>
      <input type="file" @change="selectFile" ref="file" />
      <br />

      <p>File name</p>
      <p class="info">{{book.filename}}</p>
      <br />
      <br />

      <button>UPDATE</button>
    </form>
  </div>
</template>

<script>
import Api from "@/services/BookService";
import RealApi from "@/services/Api";

export default {
  data() {
    return {
      book: [],
      file: ""
    };
  },

  methods: {
    goTo(page){
        this.$router.push(`/admin/${page}`)
    },
    selectFile() {
      //why files[0], because the input field always store the file to the collection called files
      const file = this.$refs.file.files[0];
      // const MAX_SIZE = 200000;
      const allowedTypes = ["application/pdf"];
      // const tooLarge = file.size > MAX_SIZE;

      if (!allowedTypes.includes(file.type)) {
        window.alert(`only pdf allowed!`);
        return;
      }
      // if(!allowedTypes.includes(file.type) || tooLarge){
      //     window.alert(
      //         tooLarge ? `nah, file is too large! Max: ${MAX_SIZE / 1000}Kb.` : `only images are allowed!`
      //     )
      //     return;
      // }

      this.file = file;
    },

    upload() {
      let { title, author, description, filename, size } = this.book;

      if (!this.file) {
          console.log('ga ada file, update biasa deh')
        this.update(title, author, description, size, filename);
      } else {
        const formData = new FormData();
        formData.append("file", this.file);

        RealApi()
          .post("book/upload", formData, {
            onUploadProgress: e =>
              (this.progress = Math.round((e.loaded * 100) / e.total))
          })
          .then(res => {
              console.log(`buku dah upload ni ${res.data.fileName}`);
            this.update(title, author, description, this.file.size, res.data.fileName);
          })
          .catch(err => {
              console.log('error dari line 99 bang');
            window.alert(err);
          });
      }
    },
    update(title, author, desc, size, filename) {
      Api.update({
        bookId: this.$route.params.id,
        title: title,
        author: author,
        description: desc,
        size: size,
        filename: filename
      })
        .then(() => {
          if (filename !== this.book.filename) {
              console.log(`bukunya beda nih, apus yang lama`);
              this.deleteFile(this.book.filename);
          } else{
              console.log(`bukunya sama, data udah ke update`)
            window.alert("book updated");
            this.goTo("books");
          }
        })
        .catch(err => {
          window.alert(err.response.data.msg);
              console.log('error dari line 123 bang');
        });
    },
    deleteFile(filename){
        Api.deleteFile(filename)
            .then(()=>{
                console.log(`file lama dah di delete yak`);
                window.alert("book updated");
                this.goTo("books");
            })
            .catch(err =>{
                window.alert(err.response.data.msg);
            })
    }
  },

  created() {
    //   console.log(this.$route.params);
    Api.get(this.$route.params.id).then(res => {
      this.book = res.data.data;
    });
  }
};
</script>

<style scoped>
.edit-book {
  background: #f1f1f1;
  width: calc(75% - 40px);
  padding: 20px;
  margin: 0 auto;
  border-radius: 20px;
}
#nav{
  margin-bottom: 10px;
}
h2{
  margin-bottom: 20px;
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
table {
  width: 100%;
  line-height: 30px;
}
span {
  transition: 0.1s ease-in;
}
span:hover {
  letter-spacing: 2px;
  font-weight: bolder;
  cursor: pointer;
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
</style>