import { describe, expect, it } from 'vitest'
import { router } from '../src/router'

describe('router', () => {
  it('provides separate home and clients routes', () => {
    expect(router.hasRoute('home')).toBe(true)
    expect(router.hasRoute('clients')).toBe(true)
    expect(router.resolve({ name: 'clients' }).href).toContain('#/clients')
    expect(router.resolve({ name: 'clients' }).meta.robots).toBe('noindex, nofollow')
  })

  it('keeps a redirect for the legacy applications route', () => {
    const legacyRoute = router.getRoutes().find((route) => route.path === '/applications')

    expect(legacyRoute?.redirect).toEqual({ name: 'clients' })
  })
})
