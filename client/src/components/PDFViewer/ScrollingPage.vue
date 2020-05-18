<script>
export default {
  name: "ScrollingPage",

  data() {
    return {
      elTop: 0,
      elHeight: 0
    };
  },

  props: {
    page: {
      type: Object,
      required: true
    },
    focusedPage: {
      type: Number,
      default: undefined
    },
    scrollTop: {
      type: Number,
      default: 0
    },
    clientHeight: {
      type: Number,
      default: 0
    },
    enablePageJump: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    isPageFocused() {
      return this.page.pageNumber === this.focusedPage;
    },

    isElementFocused() {
      //for updating the current page number while scrolling the pdf

      const { elTop, bottom, elHeight, scrollTop, clientHeight } = this;
      if (!elHeight) {
        return;
      }

      const halfHeight = elHeight / 2;
      const halfScreen = clientHeight / 2;

      //adjusting the current page change
      // depends on the pages height
      // if it shorter than half screen, then we'll use the half height as the benchmark :)
      const delta = elHeight >= halfScreen ? halfScreen : halfHeight;
      const threshold = scrollTop + delta;

      return elTop < threshold && bottom >= threshold;
    },

    bottom() {
      return this.elTop + this.elHeight;
    },

    scrollBottom() {
      return this.scrollTop + this.clientHeight;
    }
  },

  methods: {
    jumpToPage() {
      if (!this.enablePageJump || this.isElementFocused || !this.isPageFocused) {
      // if (!this.enablePageJump || this.isPageFocused) {
        return;
      }
      console.log(`jumping to scrollTop: ${this.elTop}`);

      this.$emit("page-jump", this.elTop);
    },

    updateElementBounds() {
      const { offsetTop, offsetHeight } = this.$el;

      this.elTop = offsetTop;
      this.elHeight = offsetHeight;
      console.log("updating element bounds...");
    }
  },

  watch: {
    scrollTop: "updateElementBounds",
    clientHeight: "updateElementBounds",
    isPageFocused: "jumpToPage"
  },

  created() {
    this.$on("update-visibility", this.updateElementBounds);
  },

  mounted() {
    this.updateElementBounds();
  },

  render() {
    const { isPageFocused, isElementFocused } = this;
    return this.$scopedSlots.default({
      isPageFocused,
      isElementFocused
    });
  }
};
</script>