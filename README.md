# DjangoChat

## Зависимости

Frontend:
Typescript, Fetch, UIkit

Backend:
Django


## Установка

### Backend
1) Создание виртуального окружения
```
python -m venv env
```
2) Активация виртуального окружения
3) Установка зависимостей
```
pip install -r requirements.txt
```
4) Миграция БД
```
python .\manage.py migrate
```

### Frontend
1) Установка зависимостей
```
npm i
```
2) Установка gulp (таскранер, нужен для сборки)
```
npm i -g gulp
```
3) Сборка фронтенда из исходников
```
gulp build
```


## Запуск

1) Активация виртуального окружения
2) python .\manage.py runserver

## Возможные улучшения

1) Сделать чат на вебсокетах (тогда он станет реалтайм)
2) Добавить контент редактор (к примеру тот же tinymce)
3) Упаковать в докер (чтобы автоматически проходить установку выше)
