Vue.use(VueRouter)

// 1. Define route components.
// These can be imported from other files
const ViewDashboard = { template: '<view-dashboard />' }
const ViewJobDetails = { template: '<view-job-details />' }

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const router = new VueRouter({
  routes: [
    {
      path: '/',
      component: ViewDashboard,
    },
    {
      path: '/job/:id',
      component: ViewJobDetails,
    },
  ],
})

// 4. Create and mount the root instance.
// Make sure to inject the router with the router option to make the
// whole app router-aware.
console.log('APP STARTED')
new Vue({
  router
}).$mount('#app')