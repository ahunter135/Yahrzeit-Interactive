<?php

$directoryTest = str_replace('\\', '/', __DIR__ );
//
//echo $directoryTest;

if (strpos($directoryTest, "yahrzeit_master")) {
  // We are on localhost machine
  //$HOMEDIRECTORY = "https://localhost/yahrzeit_master/";
  $HOMEDIRECTORY = $_SERVER['DOCUMENT_ROOT'] . "/yahrzeit_master/";
  $APPDIRECTORY = "yahrzeit_testing/";
  $testAccount = "testing";
} else {

  if(strpos($directoryTest, "yahrzeit_testing")) {
    $HOMEDIRECTORY = $_SERVER['DOCUMENT_ROOT'] . "/";
    $APPDIRECTORY = "yahrzeit_testing/";
    $testAccount = "testing";
  } else {
    $HOMEDIRECTORY = $_SERVER['DOCUMENT_ROOT'] . "/";
    $APPDIRECTORY = "yahrzeit/";
    $testAccount = "none";
  }

}

$HOMEDIRECTORY = str_replace('\\', '/', $HOMEDIRECTORY);

//var_dump($_COOKIE);

if (isset($_COOKIE['"yikiosk"']) ) {
  $cookieToken = $_COOKIE['"yikiosk"'];
} else {
  $cookieToken = false;
}

if ($cookieToken) {
// We have a COOKIE
// There is a Token in the cookie.
//var_dump($_COOKIE);
//echo "WE HAVE A COOKIE TOKEN <br>";
echo '<script type="text/javascript">
           window.location = "../yahrzeit_testing/yahrzeit.php"
      </script>';
die("This should redirect");

} // End if CookieToken

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

  <!-- VENDOR -->
<script src="js/jquery-3.6.1.min.js"></script>
<script src="js/bootstrap.min.js"></script>
<!-- PLUGINS -->
<script src="js/keyboard.js"></script>

<!-- EXTENSION -->
<script src="js/extension-api.js"></script>

  <link rel="stylesheet" href="css/all.css">
  <link href="css/bootstrap.css" rel="stylesheet">
  <link rel="stylesheet" href="css/keyboard.css">
  <link rel="stylesheet" href="style.css">

	<!-- Javscript
	<script>
		if ("serviceWorker" in navigator) {
			window.addEventListener("load", () => {
				navigator.serviceWorker && navigator.serviceWorker.register("./sw.js");
			});
		}


	</script>
	<script defer src="./main3.js"></script> -->
 </head>

 <body>
   <?php var_dump($_COOKIE);?>
  <div class="container login-container">
    <div class="row">
      <div class="col col-12 login-wrapper">
        <div id="signinReturn"></div>
           <form id="usersignin" class="form-signin" name="usersignin" method="post" action="../yahrzeit_testing/yahrzeit_includes/checkLogin.php">
             <input form="usersignin" name="token" id="token" type="hidden">
             <input form="usersignin" name="type" type="hidden" value="kiosk">
             <input form="usersignin" class="use-keyboard-input" name="myusername" type="text" placeholder="Username">
             <input form="usersignin" class="use-keyboard-input" name="mypassword" id="password" type="password" class="yar-input keyboard-trigger" placeholder="Password" autocomplete="new-password">
             <button form="usersignin" name="Submit" id="submit" class="btn-simple" type="submit">Sign in</button>
           </form>
       </div>
     </div>
   </div>


		<div class="container-fluid text-center">
      <div class="row">
        <div class="col col-12">
			   <a href="#" class="logo" aria-label="Logo">
			    <img src="logo.png" alt="Logo">
			   </a>
        </div>
        <div class="col col-12 mt-4">
			    <h1 class="text-center">Yahrzeit Interactive Kiosk v0.6</h1>
        </div>
      </div>
		</div>


<script>

$("form#usersignin").submit(function (e) {
		e.preventDefault();
	  var form = $(this);
		$.ajax({
				type: form.attr('method'),
				url: form.attr('action'),
				data: form.serialize(),
				success: function (data) {
						console.log('Submission was successful.');
						console.log(data);
            if (data.includes("Thanks for signing in as an Administrator")) {
              document.getElementById("signinReturn").innerHTML = data;
              location.assign("admin.php");
            } else if (data.includes("Thanks for signing in")) {
							console.log('Sign In Data Correct');
              document.getElementById("signinReturn").innerHTML = data;
              location.assign("<?php echo '../yahrzeit_testing/yahrzeit.php' ?>");
            } else {
            document.getElementById("signinReturn").innerHTML = data;
          }
				},
				error: function (data) {
					document.getElementById("signinReturn").innerHTML = data;
						console.log('An error occurred.');
				},
		});
});
</script>
<script>

    // Just for testing
   function deviceDataCb(deviceData, err) {
        if (err) {
        alert(err);
        return;
        } 
        alert(deviceData.deviceAssetId + deviceData.deviceSerialNumber);
    }
    getDeviceData(deviceDataCb);
    log("WOWOWOWOW")
    restart();
</script>
 </body>

 </html>
