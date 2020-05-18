<template>
  <div class="notes">
    <template v-if="notes.length > 0">
      <div class="list" v-for="(note, index) in notes" :key="index">
        <div class="left">
          <p class="btitle">{{note.btitle}}</p>
        </div>
        <div class="right">
          <div class="notelist" v-for="(list, indx) in note.notes" :key="indx" @click="open(note.bid, list.page[0])">
            <div class="list-container">
              <div class="l-left">
                <p class="title">{{list.title}}</p>
              </div
              ><div class="l-right">
                  <p class="pages">
                  page:&nbsp;
                  <span v-for="(pg, i) in list.page" :key="i">
                      {{list.page.length > 1 ?
                      i === (list.page.length - 1) ?
                      pg : `${pg}, ` : pg}}
                  </span>
                  </p>
              </div>
            </div>
          </div>
        </div>
        <div style="clear:both" />
      </div>
    </template>
    <template v-else>
      <p class="none">You haven't made any notes yet.</p>
    </template>

  </div>
</template>

<script>
import Api from "@/services/NoteService";
import _ from "lodash";
export default {
  data() {
    return {
      notes: []
    };
  },

  props: {
    uId: String
  },

  methods: {
    initData() {
      Api.getByAuthor(this.uId)
        .then(res => {
          let notes = res.data;
          notes.forEach(note => {
            if (this.notes.some(el => el.btitle === note.book.title)) {
              this.notes.forEach(x => {
                if (x.bid === note.book._id) {
                  x.notes.push({
                    id: note._id,
                    title: note.title,
                    content: note.content,
                    page: note.page
                  });
                }
              });
            } else {
              let noteObj = {
                btitle: note.book.title,
                bid: note.book._id,
                notes: [
                  {
                    id: note._id,
                    title: note.title,
                    content: note.content,
                    page: note.page
                  }
                ]
              };
              this.notes.push(noteObj);
            }
          });
          // console.log(this.notes);
        })
        .catch(err => {
          err.response.data
            ? window.alert(err.response.data)
            : window.alert(err);
        });
    },
    open(bid, page){
      this.$router.push({path: `bookviewer`, query:{bId: bid, page: parseInt(page)}})
    }
  },

  created() {
    this.initData();
  }
};
</script>

<style scoped>
.notes {
    width: 100%;
  /* background: lavender; */
  padding: 20px;
  height: 360px;
  overflow: auto;
  position: relative;
}

.none{
  position: absolute;
  top:50%;
  left:50%;
  transform: translate(-50%, -50%);
  font-size: 22px;
}

.list {
  margin-bottom: 30px;
}

.left {
  float: left;
  width: 40%;
  margin-right: 50px;
    height: 200px
  /* background: salmon; */
}
.btitle {
  font-size: 35px;
  font-weight: bold;
}
.right {
  float: right;
  width: calc(60% - 50px);
  overflow: auto;
  padding-top: 10px;
  height: 190px;
}
.notelist {
  margin-bottom: 15px;
  background: #fff;
  position: relative;
  height: 50px;
  margin-right: 20px;
  width: calc(100% - 20px);
  border-radius: 10px;
  transition: .3s ease-in-out;
}
.notelist:hover{
    transform: translateY(-5px);
    box-shadow: 0 8px 6px rgba(0, 0, 0, 0.171);
    cursor: pointer;
}
.list-container {
  position: absolute;
  width: 96%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  /* background: red; */
}
.l-left, .l-right {
  display: inline-block;
  vertical-align: middle;
}
.l-left{
    width: 50%;
    /* background: blue; */
}
.l-right{
    width: 50%;
    /* background: red; */
}
.title {
  font-size: 25px;
}
.pages {
  font-size: 14px;
}
</style>