Окружение
-----------
* elasticsearch + русская морфология 
    [установка elastic с морфологией](https://antonshell.me/post/elastic-search-russian-morfology)
* yarn 
* nodejs ^10
* MySQL


Настройка и запуск
-----------
**crud_api** (backend)
-----------
* настраиваем конфиг для mysql в .ENV файле
* заливаем dump из папки ../database (актуально для первогой установки)
* в папке crud_api запускаем команду **yarn install**
* стартуем командной **yarn run nodemon** (для DEV), для боя можно **yarn run start**  

 
**elastic** это фронт - **актуально для DEV**
-----------
стартуем командной **yarn run dev**
