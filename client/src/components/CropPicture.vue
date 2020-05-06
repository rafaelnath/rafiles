<template>
  <div class="crop-picture">
    <div class="img-container" v-if="!imgUrl" @click="toggleShow">
        <p>Upload Picture</p>
    </div>
    <div class="img-container" v-else>
        <img :src="imgUrl"/>
        <div class="overlay" @click="toggleShow">
            <p>Change Picture</p>
        </div>
    </div>
    <image-crop
      field="img"
      @crop-success="cropSuccess"
      @crop-upload-success="cropUploadSuccess"
      @crop-upload-fail="cropUploadFail"
      @src-file-set="srcFileSet"
      v-if="show"
      v-model="show"
      :width="300"
      :height="300"
      img-format="png"
      lang-type="en"
    />
    <!-- :params="params"
    :headers="headers"-->
  </div>
</template>

<script>
import ImageCrop from "vue-image-crop-upload";

export default {
  name: "CropPicture",
  data() {
    return {
      show: false,
      imgUrl: ""
    };
  },

  props:{
    imgUrl: String
  },

  methods: {
    toggleShow() {
      this.show = !this.show;
    },
    srcFileSet(fname, ftype, fsize){
      console.log(fsize);
      if(fsize > 5000000){
        window.alert(`image can't be more than 5mb`);
        this.show = false;
      }
    },
    cropSuccess(imgUrl, field) {
      this.imgUrl = imgUrl;
      this.$emit('cropped', this.imgUrl);
      console.log(`----crop success----`);
      console.log(field);
    },
    cropUploadSuccess(jsonData, field) {
      console.log(`----upload success----`);
      console.log(jsonData);
      console.log(field);
    },
    cropUploadFail(status, field) {
      console.log(`----upload failed----`);
      console.log(status);
      console.log(field);
    }
  },

  components: {
    ImageCrop
  }
};
</script>

<style scoped>
    .crop-picture{
      margin-bottom: 20px;
    }
    .img-container, img, .overlay{
        width: 150px;
        height: 150px;
        border-radius: 100%;
    }
    .img-container{
        background: grey;
        margin: 0 auto;
        position: relative;
    }
    .img-container:hover{
        cursor: pointer;
    }
    .img-container p{
        font-size: 14px;
        text-align: center;
        position: absolute;
        top:50%;
        left:50%;
        transform: translate(-50%, -50%);
    }
    img{
        margin: 0 auto;
        display: block;
    }
    .overlay{
        background: #999;
        opacity: 0;
        position: absolute;
        top:0;
        bottom:0;
        transition: 0.3s ease-out;
    }
    .overlay:hover{
        opacity: 0.8;
    }
    .overlay p{
        font-size: 16px;
    }
</style>