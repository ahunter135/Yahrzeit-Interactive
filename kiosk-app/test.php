<?php

$passphrase = "";

if(isset($_GET['p'])) {
  $passphrase = $_GET['p'];
}

?>

 <!DOCTYPE html>
 <html lang="en">

 <head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	<title>Yahrzeit Interactive Kiosk</title>
	<link rel="canonical" href="https://www.yahrzeitinteractive.com/yahrzeit/yahrzeit.php" />
	<meta name="viewport" content="width=device-width, initial-scale=1">

	<!-- Icons and Colors -->
	<link rel="apple-touch-icon" sizes="180x180" href="./apple-touch-icon.png">
	<link rel="icon" type="image/png" sizes="32x32" href="./favicon-32x32.png">
	<link rel="icon" type="image/png" sizes="16x16" href="./favicon-16x16.png">
	<link rel="manifest" href="./manifest.json">
	<link rel="mask-icon" href="./safari-pinned-tab.svg" color="#000000">
	<link rel="shortcut icon" href="./favicon.ico">
	<meta name="msapplication-TileColor" content="#000000">
	<meta name="msapplication-TileImage" content="./mstile-144x144.png">
	<meta name="msapplication-config" content="./browserconfig.xml">
	<meta name="theme-color" content="#000000">

	<!-- SEO and Social Sharing and SEO -->
	<meta name="description" content="Yahrzeit Interactive PWA Kiosk" />
	<meta name="robots" content="noodp" />
	<meta name="author" content="Patrick Boozer">
	<meta name="keywords" content="" />
	<meta property="og:locale" content="en_US" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="YI Kiosk" />
	<meta property="og:description" content="Yahrzeit Interactive PWA Kiosk" />
	<meta property="og:url" content="https://www.yahrzeitinteractive.com/yahrzeit/yahrzeit.php" />
	<meta property="og:site_name" content="Yahrzeit Interactive" />
	<meta property="section:publisher" content="https://www.facebook.com/simplepwa/" />
	<meta property="og:image" content="https://simplepwa.com/share.jpg" />

	<!-- Styles -->


  <link href="../vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="style.css">

	<!-- Javscript -->
	<script>
		if ("serviceWorker" in navigator) {
			window.addEventListener("load", () => {
				navigator.serviceWorker && navigator.serviceWorker.register("./sw.js");
			});
		}


	</script>
	<script defer src="./main3.js"></script>
 </head>

 <body>

	<header>
		<div class="container-fluid text-center">
      <div class="row">
        <div class="col col-12">
			<a href="#" class="logo" aria-label="Logo">
				<img src="logo.png" alt="Logo">
			</a>
        </div>
        <div class="col col-12 mt-4">
			    <h1 class="text-center">TEST PAGE Yahrzeit Interactive Kiosk</h1>
        </div>
        <div class="col col-12 mt-4">
          <p class="text-center">Test GET : <?php echo $passphrase;?></p>
          <p class="text-center"><?php echo $_SERVER['HTTP_HOST'] . " " . $_SERVER['REQUEST_URI'];?></p>

        </div>
      </div>
		</div>
	</header>

 </body>

 </html>


<script>

</script>
