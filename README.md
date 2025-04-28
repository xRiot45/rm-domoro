# Menjalankan Project

```bash
# Menjalankan 2 perintah sekaligus (php artisan serve & npm run dev)
$ composer run dev
```

```bash
# Menjalankan worker yang mendengarkan dan memproses antrian (queue).
$ php artisan queue:listen
```

```bash
# Menjalankan server websocket yang disediakan oleh laravel reverb
$ php artisan reverb:start
```

# Perintah untuk menjalankan project laravel 12 & React JS di satu jaringan yang sama

```bash
# Laravel 12
$ php artisan serve --host=<your-ip-address> --port=8000

# React JS
$ npm run dev -- --host=<your-ip-address> --port=5173
```
