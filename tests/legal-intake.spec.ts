import { describe, expect, it } from 'vitest'
import { MockApiService } from '../src/api/MockApiService'
import { LegalIntakeModel } from '../src/features/consultation/model/LegalIntakeModel'

describe('LegalIntakeModel', () => {
  it('loads a cascade and resets dependent selections', async () => {
    const model = new LegalIntakeModel(new MockApiService())

    await model.loadAreas()
    const firstArea = model.areas.find((option) => !option.isOther)

    expect(firstArea).toBeDefined()

    await model.selectArea(firstArea?.id ?? '')
    const firstDirection = model.directions.find((option) => !option.isOther)
    await model.selectDirection(firstDirection?.id ?? '')
    const firstSituation = model.situations.find((option) => !option.isOther)
    await model.selectSituation(firstSituation?.id ?? '')
    const firstResult = model.expectedResults.find((option) => !option.isOther)
    model.selectExpectedResult(firstResult?.id ?? '')

    expect(model.expectedResult.value).toBe(firstResult?.id)

    const nextArea = model.areas.find(
      (option) => !option.isOther && option.id !== firstArea?.id,
    )
    await model.selectArea(nextArea?.id ?? 'other')

    expect(model.direction.value).toBe('')
    expect(model.situation.value).toBe('')
    expect(model.expectedResult.value).toBe('')
  })

  it('requires a custom value for the other option', async () => {
    const model = new LegalIntakeModel(new MockApiService())

    await model.loadAreas()
    await model.selectArea('other')
    await model.selectDirection('other')
    await model.selectSituation('other')
    model.selectExpectedResult('other')

    expect(model.validate()).toBe(false)
    expect(model.customArea.error).toBe('Укажите свою область права.')

    model.customArea.setValue('Миграционное право')
    model.customDirection.setValue('Получение разрешения')
    model.customSituation.setValue('Отказ ведомства')
    model.customExpectedResult.setValue('Подготовить жалобу')

    expect(model.validate()).toBe(true)
  })
})
