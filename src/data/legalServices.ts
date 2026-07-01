export interface LegalService {
  id: string
  title: string
  summary: string
  detail: string
  badge: string
  tone: 'primary' | 'secondary' | 'surface' | 'dark'
  span: 'xl' | 'lg' | 'md' | 'sm'
}

export const legalServices: LegalService[] = [
  {
    id: 'business',
    title: 'Бизнес и договоры',
    summary: 'Сделки, поставки, аренда, подряд, NDA и корпоративные решения.',
    detail: 'Готовим документы под отрасль, переговорную позицию и судебную практику.',
    badge: 'B2B',
    tone: 'primary',
    span: 'xl',
  },
  {
    id: 'court',
    title: 'Судебная защита',
    summary: 'Арбитраж, взыскание долгов, гражданские споры и претензионная работа.',
    detail: 'Оцениваем доказательства до иска, считаем экономику процесса и ведем дело до исполнения.',
    badge: 'COURT',
    tone: 'dark',
    span: 'lg',
  },
  {
    id: 'labor',
    title: 'Трудовое право',
    summary: 'Локальные акты, увольнения, конфликты с сотрудниками и проверки.',
    detail: 'Снижаем риски штрафов и трудовых споров без перегруза HR-процессов.',
    badge: 'HR',
    tone: 'secondary',
    span: 'md',
  },
  {
    id: 'family',
    title: 'Семейные дела',
    summary: 'Раздел имущества, алименты, брачные договоры, соглашения о детях.',
    detail: 'Работаем деликатно, но с жестким контролем сроков, документов и доказательств.',
    badge: 'PRIVATE',
    tone: 'surface',
    span: 'md',
  },
  {
    id: 'estate',
    title: 'Наследство и недвижимость',
    summary: 'Права, сделки, проверки объектов и споры наследников.',
    detail: 'Проверяем цепочку прав, ограничения, риски оспаривания и налоговые последствия.',
    badge: 'ASSETS',
    tone: 'primary',
    span: 'lg',
  },
  {
    id: 'compliance',
    title: 'Комплаенс',
    summary: '152-ФЗ, оферты, регламенты и проверки контрагентов.',
    detail: 'Переводим правовые требования в рабочие правила для команды.',
    badge: 'RISK',
    tone: 'secondary',
    span: 'sm',
  },
]

export const practiceStats = [
  { value: '12+', label: 'лет практики' },
  { value: '430', label: 'закрытых дел' },
  { value: '24 часа', label: 'план после созвона' },
]
