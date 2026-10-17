# Физика от SvinCompany (Android)

Приложение с задачами по физике (18 типов, решение в формате «Дано / Решение / Ответ»).
Это оболочка WebView, внутри лежит страница `app/src/main/assets/index.html`.
Работает без интернета (шрифты IBM Plex подтянутся, если сеть есть, иначе будет системный шрифт).

## Веб-версия

Та же страница лежит в `docs/index.html`. Чтобы открыть её по ссылке: Settings → Pages →
Source: Deploy from a branch → Branch: `main`, папка `/docs`.

### Установка на iPhone / iPad (PWA)

Веб-версия работает как установленное приложение и без интернета:
1. Откройте ссылку на сайт в **Safari**.
2. Нажмите «Поделиться» → «На экран “Домой”».

На Android в Chrome то же самое: меню ⋮ → «Установить приложение».

Файлы PWA лежат в `docs/`: `manifest.webmanifest`, `sw.js` (офлайн-кэш), `icons/`.
Чтобы выпустить обновление, правьте `docs/index.html` и увеличьте номер в `CACHE` в `docs/sw.js`
(например, `v1` → `v2`). Страница сначала берётся из сети, поэтому у друзей с интернетом
обновление появляется само, без переустановки. Для APK нужна отдельная сборка, а
`app/src/main/assets/index.html` держите в синхроне с `docs/index.html`.

## Как получить APK

### Вариант 1. Android Studio
1. Установите Android Studio: https://developer.android.com/studio
2. File → Open → выберите эту папку, дождитесь синхронизации Gradle.
3. Build → Build Bundle(s) / APK(s) → Build APK(s).
4. Готовый файл: `app/build/outputs/apk/debug/app-debug.apk`. Скопируйте на телефон и откройте
   (разрешите установку из неизвестных источников).

### Вариант 2. Командная строка
Нужны JDK 17+ и Android SDK (переменная ANDROID_HOME):
    ./gradlew assembleDebug        (Windows: gradlew.bat assembleDebug)

### Вариант 3. Без установки программ (GitHub)
Создайте репозиторий на GitHub, загрузите туда содержимое папки, откройте вкладку Actions →
«Build APK» → Run workflow. Через несколько минут APK можно скачать из раздела Artifacts.

Если нужно менять приложение, правьте `app/src/main/assets/index.html`.
Debug-APK подходит для личной установки. Для публикации в Google Play нужна подпись release-ключом.

## Git

Репозиторий уже создан (`git init`, ветка `main`), `.gitignore` для Android настроен.
Чтобы сохранить первую версию и отправить на GitHub (папка `.git` уже внутри):

    git add -A
    git commit -m "Физика от SvinCompany: первая версия"
    git remote add origin https://github.com/<ваш-логин>/<репозиторий>.git
    git push -u origin main

Если Git просит представиться, один раз выполните:

    git config --global user.name "Ваше имя"
    git config --global user.email "ваша@почта"
