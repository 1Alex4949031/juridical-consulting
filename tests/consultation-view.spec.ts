import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ConsultationPanel from '../src/components/ConsultationPanel.vue'
import BaseInput from '../src/features/consultation/view/BaseInput.vue'

const services = [
  {
    id: 'business',
    title: 'Бизнес и договоры',
    summary: '',
    detail: '',
    badge: 'B2B',
    tone: 'primary' as const,
    span: 'xl' as const,
  },
]

describe('ConsultationPanel', () => {
  it('renders quick and detailed request modes', async () => {
    const wrapper = mount(ConsultationPanel, {
      props: { services },
    })

    await flushPromises()

    expect(wrapper.text()).toContain('Быстрая заявка')
    expect(wrapper.find('#quick-phone').attributes('placeholder')).toBe('+7 900 000 00 00')

    await wrapper.get('[role="tab"]:last-child').trigger('click')

    expect(wrapper.text()).toContain('01. Область права')
    expect(wrapper.text()).toContain('Другое')
  })

  it('applies the Russian phone mask in the base input', async () => {
    const wrapper = mount(BaseInput, {
      props: {
        id: 'phone',
        name: 'phone',
        label: 'Телефон',
        modelValue: '',
        mask: '+7 ### ### ## ##',
        'onUpdate:modelValue': (value: string) => wrapper.setProps({ modelValue: value }),
      },
    })

    const input = wrapper.get('input')
    await input.setValue('9131234567')

    expect((input.element as HTMLInputElement).value).toBe('+7 913 123 45 67')
  })
})
