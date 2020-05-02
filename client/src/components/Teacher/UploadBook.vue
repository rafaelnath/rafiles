<template>
  <div class="upload-book">
    <p><span @click="goTo('dashboard')">dashboard</span> / <span @click="goTo('books')">manage book</span></p>
    
    <form @submit.prevent="upload" enctype="multipart/form-data">
      <h1>Upload Book</h1>
      <p>Book title</p>
      <input type="text" v-model="title" placeholder="title" />
      <br />
      <br />
      <p>Book author</p>
      <input type="text" v-model="author" placeholder="author" />
      <br />
      <br />
      <p>Book description</p>
      <input type="text" v-model="desc" placeholder="description" />
      <br />
      <br />
      <p>Select file</p>
      <input type="file" @change="selectFile" ref="file" />
      <br />
      <br />
      <button>{{this.progress ? `uploading ${this.progress}%` : `upload`}}</button>
    </form>
  </div>
</template>

<script>
import Api from "@/services/BookService";
import RealApi from "@/services/Api";
import MultiUpload from "./MultiUpload";

export default {
  data() {
    return {
      file: "",
      title: "",
      author: "",
      desc: "",
      progress: 0
    };
  },

  components: {
    MultiUpload
  },

  methods: {
    goTo(page) {
      window.location.href = `/admin/${page}`;
    },
    downloadFile() {
      window.open("http://localhost:8082/download");
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
      if (!this.file) {
        window.alert(`uploading nothing :)`);
        return;
      }

      const formData = new FormData();
      formData.append("file", this.file);

      let { title, author, desc } = this;

      RealApi()
        .post("book/upload", formData, {
          onUploadProgress: e =>
            (this.progress = Math.round((e.loaded * 100) / e.total))
        })
        .then(res => {
          this.addbook(title, author, desc, this.file.size, res.data.fileName);
          // this.progress = 0;
        })
        .catch(err => {
          window.alert(err.response.data.msg);
        });
    },
    addbook(title, author, desc, size, name) {
      Api.addbook({
        courseId: "5e8ad0f56ea7af44b4ff757c",
        title: title,
        author: author,
        description: desc,
        size: size,
        filename: name
      })
        .then(res => {
          this.file = "";
          window.alert("book added!");
        })
        .catch(err => {
          console.log(err.response);
          window.alert(err.response.data.msg);
        });
    }
  }
};
</script>

<style scoped>
.upload-book {
  background: #f1f1f1;
  width: 70%;
  margin: 0 auto;
  padding: 20px;
  border-radius: 20px;
}
input[type="text"] {
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
  font-size: 18px;
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