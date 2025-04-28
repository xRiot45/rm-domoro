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

# Untuk menjalankan fungsi Laravel Reverb menggunakan metode pembayaran midtrans, jangan lupa hubungkan project ini dengan ngrok, kemudian copy link yang telah diberikan oleh ngrok dan masukkan ke dalam Notification URL di web midtrans nya.
