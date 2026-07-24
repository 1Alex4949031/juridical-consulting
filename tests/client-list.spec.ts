import { mount, RouterLinkStub } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ClientList from '../src/features/clients/view/ClientList.vue'

describe('ClientList', () => {
  it('links every client to a separate profile route', () => {
    const wrapper = mount(ClientList, {
      props: {
        clients: [
          {
            id: 12,
            fullName: 'Мария Соколова',
            phone: '+79130000000',
            email: 'maria@example.ru',
          },
        ],
      },
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })

    expect(wrapper.text()).toContain('Мария Соколова')
    expect(wrapper.getComponent(RouterLinkStub).props('to')).toEqual({
      name: 'client-details',
      params: { clientId: 12 },
    })
  })
})
