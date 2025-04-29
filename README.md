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

# Perintah untuk menjalankan schedule di laravel

```bash
# sekali jalan semua yang due.
$ php artisan schedule:run

# standby dan otomatis terus cek job yang due (tanpa perlu cron server).
$ php artisan schedule:work

# perintah untuk melihat list dari schedule
$ php artisan schedule:list

# Jika testing schedule sudah oke jangan lupa ganti kode di console.php seperti ini (Fungsi kode untuk mengenerate report setiap jam 12 malam)
Schedule::command('app:report-generate-command')->dailyAt('00:00');

```

# Saat di production

- Gunakan crontab untuk menjalankan perintah php artisan schedule:run di production, jangan gunakan php artisan schedule:work di production

# Untuk menjalankan fungsi Laravel Reverb menggunakan metode pembayaran midtrans, jangan lupa hubungkan project ini dengan ngrok, kemudian copy link yang telah diberikan oleh ngrok dan masukkan ke dalam Notification URL di web midtrans nya.
