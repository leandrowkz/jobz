Vue.component('view-dashboard', {
  data: () => ({
    jobs: [],
    pagination: {
      pages: 0,
      current: 1,
      pageSize: 100,
    },
  }),
  methods: {
    async fetchData(payload = {}) {
      try {
        const toPage = payload.page || this.pagination.current
        const pageSize = payload.pageSize || this.pagination.pageSize
        const url = `api/jobs?page=${toPage}&pageSize=${pageSize}`
        
        const response = await axios.get(url)
        const result = response.data

        this.jobs = result.data

        this.pagination.pages = result.meta.pagination.pages
        this.pagination.current = result.meta.pagination.current
        this.pagination.pageSize = result.meta.pagination.pageSize
      } catch (e) {
        console.error(e)
      }
    },

    async paginate(page) {
      this.fetchData({
        page,
        pageSize: this.pagination.pageSize
      })
    },
  },
  created() {
    return this.fetchData()
  },
  template: `
  <main role="main" class="view-dashboard">
    <app-header />
    <app-content>
      <job-list-filters
        @filter=""
      />
      <job-list :jobs="jobs" />
      <app-pagination
        :pages="pagination.pages"
        :current="pagination.current"
        @paginate="paginate"
        @prev="paginate(pagination.current - 1)"
        @next="paginate(pagination.current + 1)"
      />
    </app-content>
  </main>
  `,
})
