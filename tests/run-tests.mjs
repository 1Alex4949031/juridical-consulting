import assert from 'node:assert/strict'
import { createServer } from 'vite'

const server = await createServer({
  root: process.cwd(),
  configFile: false,
  envFile: false,
  appType: 'custom',
  logLevel: 'silent',
  server: {
    middlewareMode: true,
  },
})

try {
  const { formatRussianPhoneInput, normalizeRussianPhone, getRussianPhoneError } = await server.ssrLoadModule(
    '/src/domain/phone.ts',
  )

  assert.equal(formatRussianPhoneInput('9131234567'), '+7 913 123 45 67')
  assert.equal(formatRussianPhoneInput('8 (913) 123-45-67'), '+7 913 123 45 67')
  assert.equal(normalizeRussianPhone('+7 (913) 123-45-67'), '+79131234567')
  assert.equal(normalizeRussianPhone('8 913 123 45 67'), '+79131234567')
  assert.equal(normalizeRussianPhone('9131234567'), null)
  assert.equal(normalizeRussianPhone('@telegram'), null)
  assert.match(getRussianPhoneError('123'), /11 цифр/)

  const { ApplicationMapper } = await server.ssrLoadModule('/src/mappers/ApplicationMapper.ts')
  const mappedApplications = ApplicationMapper.fromClient({
    id: 5,
    full_name: 'Иван Иванов',
    phone_number: '+79130000000',
    email: 'ivan@example.ru',
    forms: [
      {
        payload: { request_topic: 'Проверка договора' },
        created_at: '2026-07-20T08:30:00.000Z',
        updated_at: '2026-07-20T09:30:00.000Z',
      },
    ],
  })

  assert.equal(mappedApplications.length, 1)
  assert.equal(mappedApplications[0].clientId, 5)
  assert.equal(mappedApplications[0].payload.request_topic, 'Проверка договора')
  assert.equal(mappedApplications[0].createdAt.toISOString(), '2026-07-20T08:30:00.000Z')

  const { ApplicationsModel } = await server.ssrLoadModule('/src/models/ApplicationsModel.ts')
  const applicationsApi = {
    async getClients() {
      return [{ id: 1 }, { id: 2 }]
    },
    async getClient(id) {
      if (id === 2) {
        throw new Error('Недоступно')
      }

      return {
        id,
        full_name: 'Клиент',
        phone_number: '+79130000000',
        forms: [
          {
            payload: { mode: 'quick' },
            created_at: '2026-07-21T10:00:00.000Z',
            updated_at: '2026-07-21T10:00:00.000Z',
          },
        ],
      }
    },
  }
  const applicationsModel = new ApplicationsModel(applicationsApi)

  await applicationsModel.load()

  assert.equal(applicationsModel.totalApplications, 1)
  assert.match(applicationsModel.warning, /1/)
  assert.equal(applicationsModel.error, '')

  const { FormModel } = await server.ssrLoadModule('/src/models/FormModel.ts')
  let submittedRequest = null
  const formApi = {
    async getAreas() {
      return []
    },
    async getDirections() {
      return []
    },
    async getSituations() {
      return []
    },
    async getExpectedResults() {
      return []
    },
    async createForm(request) {
      submittedRequest = request
      return { id: 17 }
    },
    async getClients() {
      return []
    },
    async getClient() {
      throw new Error('Не используется')
    },
  }
  const formModel = new FormModel([{ id: 'business', title: 'Бизнес' }], formApi)
  formModel.name = 'Анна Смирнова'
  formModel.phone = '8 (913) 123-45-67'
  formModel.situation = 'Проверить договор'
  formModel.consent = true

  await formModel.submit()

  assert.equal(submittedRequest.client.phone_number, '+79131234567')
  assert.match(formModel.submitSuccess, /17/)

  console.log('Passed: phone, mapper, applications model, form submission')
} finally {
  await server.close()
}
