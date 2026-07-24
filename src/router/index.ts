import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

export const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        title: 'Юридическая клиника в Новосибирске | Линия Права',
        robots: 'index, follow, max-image-preview:large',
      },
    },
    {
      path: '/clients',
      component: () => import('../views/ClientsLayoutView.vue'),
      meta: {
        robots: 'noindex, nofollow',
      },
      children: [
        {
          path: '',
          name: 'clients',
          component: () => import('../views/ClientsView.vue'),
          meta: {
            title: 'Клиенты | Линия Права',
            robots: 'noindex, nofollow',
          },
        },
        {
          path: ':clientId(\\d+)',
          name: 'client-details',
          component: () => import('../views/ClientDetailsView.vue'),
          props: (route) => ({
            clientId: Number(route.params.clientId),
          }),
          meta: {
            title: 'Карточка клиента | Линия Права',
            robots: 'noindex, nofollow',
          },
        },
      ],
    },
    {
      path: '/applications',
      redirect: { name: 'clients' },
    },
    {
      path: '/applications/:clientId(\\d+)',
      redirect: (route) => ({
        name: 'client-details',
        params: { clientId: route.params.clientId },
      }),
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: { name: 'home' },
    },
  ],
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }

    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      }
    }

    return { top: 0 }
  },
})

router.afterEach((to) => {
  const title = typeof to.meta.title === 'string' ? to.meta.title : undefined
  const robots = typeof to.meta.robots === 'string' ? to.meta.robots : undefined
  const robotsMeta = document.querySelector<HTMLMetaElement>('meta[name="robots"]')

  if (title) {
    document.title = title
  }

  if (robots && robotsMeta) {
    robotsMeta.content = robots
  }
})
