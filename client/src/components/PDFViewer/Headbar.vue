<template>
  <div class="headbar">
    <div class="pdf-zoom">
      <a class="z-in" @click.prevent.stop="zoomIn" :disabled="isDisabled">
        <img src="../../assets/zoom in.png" alt />
      </a>
      <a class="z-out" @click.prevent.stop="zoomOut" :disabled="isDisabled">
        <img src="../../assets/zoom out.png" alt />
      </a>
      <div class="pdf-paginator">
        <template v-if="pageCount">
          <input type="number" :value="value" @input="input" min="1" :max="pageCount" /> /
          <span>{{pageCount}}</span>
        </template>
        <input v-else type="number" />
      </div>
      <a @click.prevent.stop="fitWidth" :disabled="isDisabled">
          <img src="../../assets/width.png" alt />
      </a>
      <a @click.prevent.stop="fitAuto" :disabled="isDisabled">
          <img src="../../assets/height.png" alt />
      </a>
      <div class="pdf-note" @click="toggleNote"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Headbar",

  props: {
    scale: {
      type: Number
    },
    increment: {
      type: Number,
      default: 0.25
    },
    value: Number,
    pageCount: Number
  },

  computed: {
    isDisabled() {
      //disabled if no scale value
      return !this.scale;
    }
  },

  methods: {
    updateScale(scale) {
      this.$emit("change", { scale });
    },
    zoomIn() {
      this.updateScale(this.scale + this.increment);
    },
    zoomOut() {
      if (this.scale <= this.increment) return;
      this.updateScale(this.scale - this.increment);
    },
    fitWidth() {
      this.$emit("fit", "width");
    },
    fitAuto() {
      this.$emit("fit", "auto");
    },
    input(event) {
      this.$emit("input", parseInt(event.target.value, 10));
    },
    toggleNote() {
        this.$parent.toggleNote();
    }
  },

  watch: {
    pageCount() {
      //if there's no value on pageCount
      this.$emit("input", 1);
    }
  }
};
</script>

<style scoped>
.headbar {
  /* background: blue; */
  line-height: 50px;
  text-align: center;
}
.pdf-zoom,
.pdf-paginator,
.pdf-note {
  display: inline-block;
  vertical-align: middle;
}
.pdf-note {
  height: 20px;
  width: 20px;
  background: grey;
}

img{
    width: 20px;
    height: 20px;
    vertical-align: middle;
}

input{
    line-height: 20px;
    padding: 0 5px;
    width: 40px;
    text-align: center;
}

a, .pdf-paginator {
    margin-right: 60px;
}
</style>