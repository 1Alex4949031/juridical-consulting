# Линия Права

Сайт юридических услуг на Vue 3, TypeScript и Vite.

Данные привелены в качестве примера

## Запуск

```bash
npm install
npm run dev
```

## API

Настройки находятся в `.env`:

```dotenv
VITE_BASE_API_URL=/api
VITE_API_MODE=mock
```

`VITE_API_MODE=mock` использует локальные данные. Для подключения бекенда укажите его базовый URL и переключите режим:

```dotenv
VITE_BASE_API_URL=https://example.ru/api
VITE_API_MODE=api
```

После изменения `.env` перезапустите dev-сервер. Для GitHub Pages добавьте одноименные Repository Variables в `Settings → Secrets and variables → Actions → Variables`. Укажите абсолютный HTTPS URL бекенда, доступный из браузера.

## Сборка

```bash
npm run build
```
