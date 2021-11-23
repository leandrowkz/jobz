Vue.component('app-pagination', {
  props: {
    pages: {
      type: Number,
      default: 0,
    },
    current: {
      type: Number,
      default: 0,
    },
    edgeSize: {
      type: Number,
      default: 3,
    }
  },
  computed: {
    isEnd() {
      return this.current >= this.pages
    },
    isStart() {
      return this.current <= 1
    },
    prevPages() {
      const start = this.current - this.edgeSize <= 0
        ? 1
        : this.current - this.edgeSize

      return arrayRange(start, this.current)
    },
    nextPages() {
      const end = this.current + this.edgeSize > this.pages
        ? this.pages
        : this.current + this.edgeSize

      return arrayRange(this.current + 1, end + 1)
    }
  },
  methods: {
    getBlockClass(page) {
      return ['block', { 'current': page === this.current }]
    },
    prev() {
      this.$emit('prev')
    },
    navigate(page) {
      this.$emit('paginate', page)
    },
    next() {
      this.$emit('next')
    },
  },
  template: `
  <div class="app-pagination">
    <div
      :class="isStart ? 'disabled' : ''"
      class="block"
      @click="prev()"
    >
      &lt;
    </div>
    <div
      v-if="pages"
      :class="isStart ? 'disabled' : ''"
      class="block control"
      @click="navigate(1)"
    >
      First
    </div>
    <div
      v-for="page in prevPages"
      :key="page"
      class="block"
      @click="navigate(page)"
    >
      {{ page }}
    </div>
    <div
      class="block current"
      @click="navigate(current)"
    >
      {{ current }}
    </div>
    <div
      v-for="page in nextPages"
      :key="page"
      class="block"
      @click="navigate(page)"
    >
      {{ page }}
    </div>
    <div
      v-if="pages"
      :class="isEnd ? 'disabled' : ''"
      class="block control"
      @click="() => navigate(this.pages)"
    >
      Last
    </div>
    <div
      :class="isEnd ? 'disabled' : ''"
      class="block"
      @click="next()"
    >
      &gt;
    </div>
  </div>
  `,
});
