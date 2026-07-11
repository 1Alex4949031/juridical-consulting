export interface LegalIntakeGoal {
  id: string
  title: string
  isOther?: boolean
}

export interface LegalIntakeSituation {
  id: string
  title: string
  isOther?: boolean
  goals: LegalIntakeGoal[]
}

export interface LegalIntakeDirection {
  id: string
  title: string
  isOther?: boolean
  situations: LegalIntakeSituation[]
}

export interface LegalIntakeArea {
  id: string
  title: string
  description: string
  isOther?: boolean
  directions: LegalIntakeDirection[]
}

const standardGoals: LegalIntakeGoal[] = [
  { id: 'consultation', title: 'Получить консультацию' },
  { id: 'risk-map', title: 'Оценить риски' },
  { id: 'documents', title: 'Подготовить документы' },
  { id: 'claim', title: 'Составить претензию' },
  { id: 'court', title: 'Подготовиться к суду' },
  { id: 'negotiations', title: 'Сопроводить переговоры' },
  { id: 'other', title: 'Другое', isOther: true },
]

const otherSituation: LegalIntakeSituation = {
  id: 'other',
  title: 'Другое',
  isOther: true,
  goals: standardGoals,
}

function situation(id: string, title: string, goals = standardGoals): LegalIntakeSituation {
  return { id, title, goals }
}

function direction(id: string, title: string, situations: LegalIntakeSituation[]): LegalIntakeDirection {
  return {
    id,
    title,
    situations: [...situations, otherSituation],
  }
}

function otherDirection(): LegalIntakeDirection {
  return {
    id: 'other',
    title: 'Другое',
    isOther: true,
    situations: [otherSituation],
  }
}

export const legalIntakeAreas: LegalIntakeArea[] = [
  {
    id: 'civil',
    title: 'Гражданское право',
    description: 'Договоры, долги, ущерб, обязательства и споры между частными лицами или организациями.',
    directions: [
      direction('contracts', 'Договоры', [
        situation('review', 'Проверить договор'),
        situation('draft', 'Подготовить договор'),
        situation('breach', 'Контрагент нарушил условия'),
      ]),
      direction('debt', 'Долги и взыскание', [
        situation('pretrial', 'Досудебное взыскание'),
        situation('court-debt', 'Взыскание через суд'),
        situation('enforcement', 'Исполнительное производство'),
      ]),
      direction('damages', 'Убытки и вред', [
        situation('property-damage', 'Повреждение имущества'),
        situation('financial-loss', 'Финансовые убытки'),
        situation('moral-damage', 'Компенсация морального вреда'),
      ]),
      otherDirection(),
    ],
  },
  {
    id: 'business',
    title: 'Бизнес и корпоративное право',
    description: 'Компании, партнеры, сделки, контрагенты, корпоративные конфликты и операционные риски.',
    directions: [
      direction('business-contracts', 'Сделки и договоры', [
        situation('supply', 'Поставка или подряд'),
        situation('lease', 'Аренда'),
        situation('nda', 'NDA или коммерческая тайна'),
      ]),
      direction('corporate', 'Корпоративные вопросы', [
        situation('company-changes', 'Изменения в компании'),
        situation('partner-conflict', 'Конфликт участников'),
        situation('share-sale', 'Продажа доли или акций'),
      ]),
      direction('counterparty', 'Спор с контрагентом', [
        situation('non-payment', 'Не платят'),
        situation('non-performance', 'Не исполняют договор'),
        situation('quality', 'Спор по качеству работ или товара'),
      ]),
      otherDirection(),
    ],
  },
  {
    id: 'court',
    title: 'Суды и споры',
    description: 'Арбитраж, гражданские дела, претензии, иски, доказательства и исполнение решений.',
    directions: [
      direction('arbitration', 'Арбитражный спор', [
        situation('claim-prep', 'Подготовить иск'),
        situation('defense', 'Подготовить отзыв или защиту'),
        situation('appeal', 'Обжаловать решение'),
      ]),
      direction('civil-court', 'Гражданский спор', [
        situation('claim-received', 'Получен иск'),
        situation('claim-needed', 'Нужно подать иск'),
        situation('settlement', 'Мировое соглашение'),
      ]),
      direction('enforcement', 'Исполнение решения', [
        situation('bailiff', 'Работа с приставами'),
        situation('debtor-assets', 'Поиск имущества должника'),
        situation('enforcement-complaint', 'Жалоба на бездействие'),
      ]),
      otherDirection(),
    ],
  },
  {
    id: 'family',
    title: 'Семейное право',
    description: 'Развод, алименты, дети, раздел имущества, брачные договоры и соглашения.',
    directions: [
      direction('divorce', 'Развод', [
        situation('divorce-with-children', 'Есть дети'),
        situation('divorce-property', 'Есть общее имущество'),
        situation('divorce-consent', 'Есть согласие сторон'),
      ]),
      direction('children', 'Вопросы о детях', [
        situation('residence', 'Место жительства ребенка'),
        situation('communication', 'Порядок общения'),
        situation('parental-rights', 'Родительские права'),
      ]),
      direction('alimony', 'Алименты', [
        situation('alimony-claim', 'Взыскать алименты'),
        situation('alimony-change', 'Изменить размер'),
        situation('alimony-debt', 'Задолженность по алиментам'),
      ]),
      direction('property-division', 'Раздел имущества', [
        situation('real-estate', 'Недвижимость'),
        situation('business-assets', 'Бизнес или доли'),
        situation('debts', 'Общие долги'),
      ]),
      otherDirection(),
    ],
  },
  {
    id: 'estate',
    title: 'Недвижимость и земля',
    description: 'Сделки, право собственности, аренда, застройщики, участки и споры по объектам.',
    directions: [
      direction('transaction', 'Сделка с недвижимостью', [
        situation('purchase-check', 'Проверить объект'),
        situation('sale-support', 'Сопроводить продажу'),
        situation('mortgage', 'Ипотека или обременение'),
      ]),
      direction('ownership', 'Право собственности', [
        situation('registration', 'Регистрация права'),
        situation('challenge', 'Оспаривание права'),
        situation('shared-ownership', 'Долевая собственность'),
      ]),
      direction('land', 'Земельный участок', [
        situation('boundaries', 'Границы участка'),
        situation('use-kind', 'Вид разрешенного использования'),
        situation('neighbor-dispute', 'Спор с соседями'),
      ]),
      otherDirection(),
    ],
  },
  {
    id: 'inheritance',
    title: 'Наследство',
    description: 'Принятие наследства, завещания, сроки, споры наследников и имущество наследодателя.',
    directions: [
      direction('acceptance', 'Принятие наследства', [
        situation('deadline', 'Пропущен срок'),
        situation('notary', 'Вопросы у нотариуса'),
        situation('documents-missing', 'Не хватает документов'),
      ]),
      direction('inheritance-dispute', 'Спор наследников', [
        situation('will-dispute', 'Оспорить завещание'),
        situation('share', 'Определить долю'),
        situation('asset-conflict', 'Спор по имуществу'),
      ]),
      otherDirection(),
    ],
  },
  {
    id: 'labor',
    title: 'Трудовое право',
    description: 'Увольнение, зарплата, локальные акты, конфликты с работником или работодателем.',
    directions: [
      direction('employee', 'Работник', [
        situation('dismissal', 'Увольнение'),
        situation('salary', 'Невыплата зарплаты'),
        situation('discipline', 'Дисциплинарное взыскание'),
      ]),
      direction('employer', 'Работодатель', [
        situation('local-acts', 'Локальные акты'),
        situation('staff-conflict', 'Конфликт с сотрудником'),
        situation('inspection', 'Проверка или жалоба'),
      ]),
      otherDirection(),
    ],
  },
  {
    id: 'tax',
    title: 'Налоги',
    description: 'Проверки, требования ФНС, доначисления, налоговые риски и сопровождение бизнеса.',
    directions: [
      direction('tax-audit', 'Проверка ФНС', [
        situation('requirement', 'Получено требование'),
        situation('additional-charge', 'Доначисления'),
        situation('appeal-tax', 'Обжалование решения'),
      ]),
      direction('tax-planning', 'Налоговые риски', [
        situation('deal-risk', 'Риск по сделке'),
        situation('contractor-risk', 'Проверка контрагента'),
        situation('model-risk', 'Оценка модели работы'),
      ]),
      otherDirection(),
    ],
  },
  {
    id: 'consumer',
    title: 'Защита прав потребителей',
    description: 'Возвраты, некачественные товары или услуги, претензии продавцам и исполнителям.',
    directions: [
      direction('goods', 'Товар', [
        situation('return', 'Возврат или обмен'),
        situation('defect', 'Недостаток товара'),
        situation('warranty', 'Гарантийный спор'),
      ]),
      direction('services', 'Услуга или работа', [
        situation('bad-service', 'Некачественная услуга'),
        situation('deadline-service', 'Нарушены сроки'),
        situation('refund-service', 'Нужен возврат денег'),
      ]),
      otherDirection(),
    ],
  },
  {
    id: 'administrative',
    title: 'Административные вопросы',
    description: 'Штрафы, госорганы, проверки, предписания и обжалование административных решений.',
    directions: [
      direction('fines', 'Штрафы', [
        situation('fine-received', 'Получен штраф'),
        situation('fine-appeal', 'Нужно обжаловать'),
        situation('deadline-missed', 'Пропущен срок'),
      ]),
      direction('authorities', 'Госорганы', [
        situation('refusal', 'Отказ в услуге'),
        situation('inspection-admin', 'Проверка'),
        situation('complaint', 'Жалоба или обращение'),
      ]),
      otherDirection(),
    ],
  },
  {
    id: 'ip',
    title: 'Интеллектуальная собственность',
    description: 'Товарные знаки, авторские права, контент, лицензии и защита от нарушений.',
    directions: [
      direction('trademark', 'Товарный знак', [
        situation('registration-tm', 'Регистрация'),
        situation('tm-conflict', 'Спор по знаку'),
        situation('brand-check', 'Проверка бренда'),
      ]),
      direction('copyright', 'Авторские права', [
        situation('content-copy', 'Копирование контента'),
        situation('license', 'Лицензия или договор'),
        situation('claim-ip', 'Претензия нарушителю'),
      ]),
      otherDirection(),
    ],
  },
  {
    id: 'criminal',
    title: 'Уголовно-правовые вопросы',
    description: 'Проверочные мероприятия, заявления, защита и сопровождение по уголовным рискам.',
    directions: [
      direction('defense', 'Защита', [
        situation('summons', 'Вызов на опрос или допрос'),
        situation('search', 'Обыск или выемка'),
        situation('case-opened', 'Возбуждено дело'),
      ]),
      direction('victim', 'Заявление или потерпевший', [
        situation('statement', 'Подать заявление'),
        situation('inaction', 'Бездействие органов'),
        situation('damage-criminal', 'Возмещение ущерба'),
      ]),
      otherDirection(),
    ],
  },
  {
    id: 'other',
    title: 'Другое',
    description: 'Если вопрос не подходит ни под одну область или пока сложно определить направление.',
    isOther: true,
    directions: [otherDirection()],
  },
]
