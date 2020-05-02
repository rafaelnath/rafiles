<template>
  <div class="class">
    <div class="header">
        <a href="class">back</a>
      <h1>{{course.name}}</h1>
    </div>
    <div class="books">
        <input type="text" placeholder="Search book title, author..." @input="searchBook" v-model="search" >
        <div class="list">
            <div class="book" v-for="(book, index) in books" :key="index">
                <div class="cover">
                    <div class="cover-container">
                        <p class="title">{{book.title}}</p>
                        <p class="author">by {{book.author}}</p>
                    </div>
                </div
                ><div class="desc">
                    <div class="desc-container">
                        <h3>Description</h3>
                        <p>{{book.description}}</p>
                        <div class="buttons">
                            <a class="button read" @click="readBook(book._id)">Read</a>
                            <a class="button pin">Pin</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div
    ><div class="members">
        <div class="members-container">
            <div class="m-wrapper">
                <div class="teachers" v-if="teachers.length !== 0">
                    <h2>Teacher</h2>
                    <div class="member" v-for="(tch, index) in teachers" :key="index">
                        <div class="m-pic"></div>
                        <p class="uname">{{tch.name}}</p>
                    </div>
                </div>

                <div class="students" v-if="students.length !== 0"  >
                <h2>Students</h2>
                    <div class="group" v-for="(stds, index) in students" :key="index">
                        <template v-if="stds.users.length > 0">
                            <h3>{{stds.group}}</h3>
                            <div class="member" v-for="(std, indx) in stds.users" :key="indx">
                                <div class="m-pic"></div>
                                <p class="uname">{{std.name}}</p>
                            </div>
                        </template>
                    </div>
                </div>
            </div>
            <p class="msg" v-if="teachers.length === 0 && students.length === 0">No user.</p>
        </div>
    </div>
  </div>
</template>

<script>
import Api from "@/services/CourseService";
import BookApi from "@/services/BookService";
export default {
  data() {
    return {
        menu:'',
        cId: '',
        course: [],
        students:[],
        teachers:[],
        books:[],
        debounce: null,
        bookIds: [],
        search: '',
    };
  },

    created(){
        this.cId = this.$route.query.cId;
        this.initData();
    },

  methods: {
      initData(){
          Api.getCourse(this.cId)
            .then(res =>{
                this.course = res.data;
                this.books = res.data.books;

                this.books.forEach(book =>{
                    this.bookIds.push(book._id);
                })
                
                //Users from class
                let classes = res.data.class;
                classes.forEach(clss =>{
                    let stdObj = {
                        group: `${clss.majorName} - ${clss.name}`,
                        users: clss.users
                    }
                    this.students.push(stdObj);
                })
                //----------------------------------

                //Users from course
                let users = res.data.users;
                let obj = {
                            group: 'Others',
                            users: []
                        }
                users.forEach(user =>{
                    if (user.role === "student") {
                        obj.users.push(user);
                    } else if (user.role === "teacher") {
                        this.teachers.push(user);
                    }
                })
                this.students.push(obj);
                //----------------------------------

            })
            .catch(err =>{
                console.log(err);
            })
      },
      readBook(bId){
          this.$router.push({path: 'bookviewer', query:{bId: bId}});
      },
      searchBook() {
        clearTimeout(this.debounce);
        this.debounce = setTimeout(() => {
            BookApi.searchBook(this.search).then(res => {
            this.books = [];
            res.data.data.forEach(book =>{
                if(this.bookIds.includes(book._id)){
                    this.books.push(book);
                }
            })
            });
        }, 600);
        },
  }
};
</script>

<style scoped>
.class {
  padding-top: 50px;
  width: 88%;
  margin: 0 auto;
  /* background: lavender; */
}
.header {
    margin-bottom: 20px;
  /* background: rgb(139, 139, 139); */
}
.header h1 {
  font-size: 40px;
}

.books, .members{
    display: inline-block;
    vertical-align: top;
}

.books{
    width: 55%;
}

.books .mini-button{
    background: #ccc;
    margin: 0 10px;
    padding: 2px 10px;
    border-radius: 20px;
}
.books .mini-button:hover{
    background: #aaa;
    cursor: pointer;
}

input {
  width: 60%;
  border-radius: 30px;
  padding: 0px 20px;
  font-size: 20px;
  line-height: 50px;
  border: 0;
  background: rgb(192, 192, 192);
  opacity: 0.5;
  transition: 0.3s ease-in-out;
  margin-bottom: 20px;
}
input:focus {
  outline: none;
  opacity: 1;
}

.list{
    height: 500px;
    /* background: rgb(248, 189, 189); */
    padding-top: 10px;
    padding-right: 20px;
    border-radius: 20px;
    max-height: 500px;
    overflow: auto;
}

.book{
    background: #fff;
    padding:20px 30px;
    border-radius: 20px;
    margin-bottom: 30px;
    transition: 0.3s ease-in-out;
    position: relative;
}
.book:hover{
    box-shadow: 0 8px 6px rgba(0, 0, 0, 0.171);
    transform: translateY(-5px);
}
.cover{
    background:rgb(255, 228, 78);
    width: 35%;
    height: 280px;
    border-radius: 10px;
}
.cover, .desc{
    display: inline-block;
    vertical-align: top;
}

.cover-container{
    width: 80%;
    margin:0 auto;
    padding:20px 0px;
    /* background: #000; */
}
.cover .title{
    font-size: 24px;
    /* width: 80%; */
    font-weight: bold;
    margin-bottom: 20px;
}

.desc{
    width: 65%;
}

.desc-container{
    width: 92%;
    float: right;
}

.desc h3{
    margin-bottom: 20px;
    font-size: 22px;
}
.desc p{
    font-size: 20px;
}

.desc .buttons{
    position: absolute;
    bottom:40px;
}

.desc .button{
    border-radius: 10px;
    font-size: 20px;
}
.desc .button:hover{
    cursor: pointer;
    opacity: 0.8;
}

.desc .read{
    background:#ccc;
    padding: 15px 60px;
    margin-right: 10px;
}

.desc .pin{
    background:#bbb;
    padding: 15px 20px;
}

.members{
    /* background: #fff; */
    width: 45%;
}

.members-container{
    float: right;
    background: #fff;
    width:64.5%;
    margin: 0 auto;
    padding: 30px 20px 20px 25px;
    border-radius: 20px;
    height:500px;
    overflow: hidden;
}
.m-wrapper{
    overflow: auto;
    height: 500px;
}

.teachers{
    margin-bottom: 40px;
}

.members h2{
    font-size: 26px;
    margin-bottom: 30px;
}
.group{
    padding-bottom: 10px;
    padding-left: 15px;
}
.members h3{
    margin-bottom: 25px;
}

.member{
    margin-bottom: 20px;
}
.member .m-info, .m-pic, .uname{
    display: inline-block;
    vertical-align: middle;
}

.m-info .role{
    font-size: 14px;
    font-style: italic;
    margin-right: 20px;
}

.role, .minibuttons{
    display: inline-block;
}

.m-pic{
    width: 45px;
    height: 45px;
    border-radius: 100%;
    background: #eee;
    margin-right: 15px;
}

.member p{
    font-size: 20px;
}

.msg{
    font-size: 18px;
}

.member .mini-button{
    background: #ccc;
    margin-right: 10px;
    padding: 0 10px;
    border-radius: 20px;
}

.member .mini-button:hover{
    cursor: pointer;
    opacity: 0.5;
}
</style>