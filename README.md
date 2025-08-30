# DarkStore Delivery Platform

Клиент-серверное приложение для сервиса быстрой доставки товаров из темного склада (dark store). Проект реализован в рамках буткемпа.

## 📖 О проекте

Система состоит из нескольких частей:
*   **Backend (API)** — Ядро системы на Java Spring Boot. Обрабатывает логику заказов, товаров, пользователей и склада.
*   **Frontend** — Пользовательский интерфейс для покупателей (React).
*   **Admin Panel** — Панель управления для сотрудников компании (администраторов, курьеров) (React).
*   **UI-Kit** — Библиотека переиспользуемых React-компонентов.

## 🛠 Стек технологий

### Backend
*   **Язык:** Java 17 (или 11)
*   **Фреймворк:** Spring Boot
*   **Сборка:** Maven
*   **База данных:** PostgreSQL (развернута в облачном сервисе Kintsugu)
*   **Кэширование:** Redis (если использовали)

### Frontend & Admin Panel
*   **Язык:** JavaScript / TypeScript
*   **Фреймворк:** React
*   **Сборка:** Vite / Webpack
*   **Стилизация:** [Укажите, например: CSS Modules, TailwindCSS, Styled Components]

## ⚙️ Установка и запуск

Для локального запуска необходим установленный:
*   **Java 17+** (для бэкенда)
*   **Maven** (для бэкенда)
*   **Node.js** и **npm** (для фронтенда)
*   **Подключение к БД PostgreSQL в Kintsugu** (или запущенная локально БД)

1.  **Клонируйте репозиторий:**
    ```bash
    git clone https://github.com/your_github/darkstore-delivery-platform.git
    cd darkstore-delivery-platform
    ```

2.  **Запуск Backend (API):**
    ```bash
    cd backend
    # Установите зависимости и запустите приложение
    mvn spring-boot:run
    ```
    Бэкенд будет доступен по адресу: `http://localhost:8080` (порт может быть другим, проверьте `application.properties`)

3.  **Запуск Frontend:**
    ```bash
    cd ../frontend
    npm install    # Установка зависимостей
    npm start      # Запуск dev-сервера
    ```
    Приложение будет доступно по адресу: `http://localhost:3000`

4.  **Запуск Admin Panel:**
    ```bash
    cd ../admin-panel
    npm install
    npm start
    ```
    Панель управления будет доступна по адресу: `http://localhost:3001`

**Важно:** Для работы бэкенда необходимы переменные окружения или файл `application.properties` с данными для подключения к БД. Этот файл с чувствительными данными (логин, пароль) в репозиторий не выложен.

## 📁 Структура проекта

darkstore-delivery-platform/
├── backend/ # Бэкенд-приложение на Go
│ ├── cmd/ # Точки входа в приложение
│ ├── internal/ # Внутренняя логика приложения (модели, хендлеры, сервисы)
│ ├── pkg/ # Код, который можно использовать в других проектах
│ └── Dockerfile
├── frontend/ # Пользовательский интерфейс
├── admin-panel/ # Панель администратора
├── ui-kit/ # Библиотека UI-компонентов
└── README.md



## 👨‍💻 Автор

Иззетов Тимур 
*   Telegram: [@zetrus_TL]
*   Почта: izzetovt@mail.ru
*   GitHub: [https://github.com/zetrusTL]