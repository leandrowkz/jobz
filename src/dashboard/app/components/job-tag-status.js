Vue.component('job-tag-status', {
  props: {
    job: {
      type: Object,
      default: () => ({}),
    }
  },
  computed: {
    computedTitle() {
      return this.job.failReason || this.job.status.toUpperCase()
    },
    computedClasses() {
      return [
        'job-tag-status', 
        `job-tag-status-${this.job.status}`
      ]
    },
  },
  template: `
  <span
    :alt="computedTitle"
    :title="computedTitle"
    :class="computedClasses">
    {{ job.status }}
  </span>
  `,
});
