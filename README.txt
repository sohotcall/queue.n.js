ASSETS
======
Folder assets/ berisikan file-file audio *.oga untuk pemanggilan antrean.
Saat ini dibuat sekedarnya dengan espeak dan ffmpeg, seperti ini:
$ espeak "antrean-nomor" -v id -w antrean-nomor.wav
$ ffmpeg -i antrean-nomor.wav -c:a libvorbis -b:a 64k antrean-nomor.oga
Silakan sediakan dan ganti dengan audio yang lebih layak.

Di folder assets/ juga terdapat file video.webm.
Video ini akan diputar loop di pendisplay antrean.
Sumber: https://commons.wikimedia.org/wiki/File:Small_tortoises_mating.webm
Silakan diganti juga bila perlu.

SETUP
=====
Ada 4 macam komputer
0) Untuk Server Antrean
1) Untuk Cetak Ticket Antrean
2) Untuk Display Antrean
3) Untuk Teller Antrean
Bisa saja digabung, misal komputermu multidisplay atau bagaimana.

Server Antrean
--------------
1. Install nodejs
2. Edit queue.n.js
    Sesuaikan bagian operators dan tellers
    Sesuaikan bagian running-text
3. Jalankan queue.n.js
   > node path/to/queue.n.js

Cetak Ticket Antrean
--------------------
1. Install printer struk
2. Download dan extract RawPrintServer
3. Install RawPrintServer service on port 2482
   Command Prompt as Administrator
   > path/to/RawPrintServer.exe INSTALL "<Printer Name>" 2482
4. Download dan extract php
5. Edit php.ini untuk mengaktifkan extension php_sockets
5. Jalankan php built in web server
   > path/to/php.exe -S 127.0.0.1:80 -t path/to/queue.n.js
   atau taruh file rawprintserver.php ke htdocs dan restart web server
6. Buka browser
   http://localhost/rawprintserver.php
7. Coba test print
8. Buka browser
   http://<server-antrean>:8080/
9. Klik link Cetak Ticket Antrean

Display Antrean
---------------
1. Buka browser
   http://<server-antrean>:8080/
2. Klik link Display Antrean
3. Izinkan autoplay video/audio bila perlu

Teller Antrean
--------------
Di masing-masing teller,
1. Buka browser
   http://<server-antrean>:8080/
2. Klik link Teller Antrean

