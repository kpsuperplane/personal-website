<?php require ('data.php'); $v=1.7; ?>
<!DOCTYPE HTML>
<html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
        <script src="https://use.typekit.net/upz7elf.js"></script>
        <script>try{Typekit.load({ async: true });}catch(e){}</script>
        <script src="//cdn.jsdelivr.net/emojione/2.1.4/lib/js/emojione.min.js"></script>
        <link rel="stylesheet" href="//cdn.jsdelivr.net/emojione/2.1.4/assets/css/emojione.min.css"/>
        <link href="css/main.css?v=<?php echo $v; ?>" rel="stylesheet" />
    </head>
    <body>
        <div id="loader">
            <div class="loader-message" id="loader-old-message"></div>
            <div class="loader-message" id="loader-main-message"></div>
        </div>
        <script src="js/app.js?v=<?php echo $v; ?>" type="text/javascript"></script>
    </body>
</html>