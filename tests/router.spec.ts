import { describe, expect, it } from 'vitest'
import { router } from '../src/router'

describe('router', () => {
  it('provides separate home, clients and client profile routes', () => {
    expect(router.hasRoute('home')).toBe(true)
    expect(router.hasRoute('clients')).toBe(true)
    expect(router.hasRoute('client-details')).toBe(true)
    expect(router.resolve({ name: 'clients' }).href).toContain('#/clients')
    expect(router.resolve({ name: 'clients' }).meta.robots).toBe('noindex, nofollow')
    expect(router.resolve({
      name: 'client-details',
      params: { clientId: 15 },
    }).href).toContain('#/clients/15')
  })

  it('keeps a redirect for the legacy applications route', () => {
    const legacyRoute = router.getRoutes().find((route) => route.path === '/applications')

    expect(legacyRoute?.redirect).toEqual({ name: 'clients' })
  })
})
