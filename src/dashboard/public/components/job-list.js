Vue.component('job-list', {
  props: {
    jobs: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    getLinkDetails(job) {
      return `/jobs/${job.id}`
    },
    getDateHour(jobDate) {
      return jobDate
        ? new Intl.DateTimeFormat('pt-BR', {
            dateStyle: 'short',
            timeStyle: 'medium',
          }).format(Date.parse(jobDate))
        : ''
    },
  },
  template: `
  <table class="job-list">
    <thead>
      <tr>
        <th class="sortable">Name</th>
        <th>Cron</th>
        <th>Status</th>
        <th>Started At</th>
        <th>Finished At</th>
        <th>Duration (ms)</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="job in jobs"
        :key="job.id"
        class="job-list-item"
        >
          <td>
            <router-link :to="getLinkDetails(job)">
              {{ job.name }}
            </router-link>
          </td>
          <td>{{ job.scheduleRule }}</td>
          <td>
            <job-tag-status :job="job" />
          </td>
          <td>
            {{ getDateHour(job.startedAt) || '-' }}
          </td>
          <td>
            {{ getDateHour(job.finishedAt) || '-' }}
          </td>
          <td>
            {{ job.durationMs || '-' }}
          </td>
        </tr>
      </tr>
    </tbody>
  </table>
  `,
})
