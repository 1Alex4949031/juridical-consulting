# Линия Права

Сайт юридической клиники на Vue 3, TypeScript и Vite.

## Требования

- Node.js 24
- pnpm 11.9

## Локальный запуск

```bash
pnpm install
pnpm dev
```

Основная страница доступна по `/juridical-consulting/#/`, страница клиентов — по
`/juridical-consulting/#/clients`. Старый адрес `#/applications` перенаправляется
на `#/clients`.

## Архитектура

Форма консультации разделена на три слоя:

- `view` — Vue-компоненты без бизнес-правил;
- `controller` — composable, который создает реактивную модель и связывает ее с жизненным циклом Vue;
- `model` — поля, валидация, каскад юридических справочников и подготовка API-запроса.

API подключается через абстрактный `ApiService`. Реализация выбирается в
`createApiService` между `MockApiService` и `HttpApiService`.

## Переменные окружения

```dotenv
VITE_BASE_API_URL=/api
VITE_API_MODE=mock
VITE_BASE_PATH=/juridical-consulting/
```

- `VITE_API_MODE=mock` использует локальные данные.
- `VITE_API_MODE=api` отправляет запросы на `VITE_BASE_API_URL`.
- `VITE_BASE_PATH` задает публичный путь Vite.

Переменные Vite встраиваются во время сборки. После их изменения нужно
перезапустить dev-сервер или пересобрать приложение.

Страница клиентов отображает персональные данные. Перед подключением реального
API ее необходимо защитить серверной авторизацией.

## Проверки

```bash
pnpm typecheck
pnpm test
pnpm build
```

## Docker Compose

```bash
docker compose up --build
```

Сайт откроется по адресу `http://localhost:8080`. Порт можно изменить переменной
`FRONTEND_PORT`, а публичный путь контейнерной сборки — переменной
`COMPOSE_VITE_BASE_PATH`.

## GitHub Pages

Workflow `.github/workflows/deploy.yml` собирает приложение с
`VITE_BASE_PATH=/juridical-consulting/` и публикует каталог `dist`.
`VITE_API_MODE` и `VITE_BASE_API_URL` задаются через Repository Variables.
