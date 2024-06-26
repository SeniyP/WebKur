# Word Template Fields Extractor

Это приложение позволяет извлекать поля для автозаполнения из шаблонов Word, заменять их данными из Excel и сохранять обновленные документы в zip-архив.
# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
## Установка

### Предварительные требования

- [Node.js](https://nodejs.org/) и npm
- [PHP](https://www.php.net/)

### Шаги установки

1. Склонируйте репозиторий или загрузите исходный код:

## Запуск

1. Перейдите в директорию пректа и запустите приложение:

    ```sh
    cd Путь до папки пректа
    npm start
    ```

    Это запустит приложение на [http://localhost:3000](http://localhost:3000).

### Запуск бэкенда

1. Перейдите в директорию `backend` и запустите PHP сервер:

    ```sh
    cd ../backend
    php -S localhost:8000
    ```

    Это запустит сервер на [http://localhost:8000](http://localhost:8000).

## Использование

1. Загрузите шаблон Word (.docx) файл.
2. Нажмите кнопку `Найти поля` для извлечения полей из шаблона (Необяязательно).
3. Загрузите Excel (.xlsx, .xls) файл с данными для замены полей.
4. Нажмите кнопку `Скачать` для замены полей в шаблоне и скачивания обновленных документов в zip-архиве.

## Примечания

- Убедитесь, что PHP доступен в вашем PATH. Это можно проверить, выполнив команду `php -v` в командной строке.
- Убедитесь, что вы используете актуальные версии Node.js и npm.

