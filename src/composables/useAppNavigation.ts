import { onMounted, onUnmounted, shallowRef } from 'vue'

export type AppPage = 'home' | 'applications'

function resolvePage(): AppPage {
  const applicationsEnabled = import.meta.env.VITE_ENABLE_APPLICATIONS_PAGE !== 'false'

  if (applicationsEnabled && window.location.hash === '#/applications') {
    return 'applications'
  }

  return 'home'
}

export function useAppNavigation() {
  const page = shallowRef<AppPage>(resolvePage())

  function syncPage() {
    page.value = resolvePage()
  }

  onMounted(() => {
    window.addEventListener('hashchange', syncPage)
  })

  onUnmounted(() => {
    window.removeEventListener('hashchange', syncPage)
  })

  return {
    page,
  }
}
