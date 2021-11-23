Vue.component('job-output', {
  props: {
    output: {
      type: String,
      default: '',
    },
  },
  template: `<pre class="job-output">{{ output }}</pre>`,
})
