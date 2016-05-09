<?php
    session_start();


if(!isset($_SESSION['code'])){
    $_SESSION['code'] = generateRandomString();
}
if(!isset($_SESSION['submits'])){
    $_SESSION['submits'] = 0;
}
$_SESSION['submits']++;
if($_SESSION['submits'] > 20){
    exit('You have passed the maximum number of submissions. Please try again later');
}
function getCurlData($url)
{
		$curl = curl_init();
		curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($curl, CURLOPT_TIMEOUT, 10);
		$curlData = curl_exec($curl);
		curl_close($curl);
		return $curlData;
}
function generateRandomString($length = 10) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, strlen($characters) - 1)];
    }
    return $randomString;
}
if($_POST['code'] == $_SESSION['code']){
    if (isset($_POST['name']) && trim($_POST['name']) != '' && count($_POST['name']) < 100 && isset($_POST['email']) && trim($_POST['email']) != '' && count($_POST['email']) < 100 && filter_var($_POST['email'], FILTER_VALIDATE_EMAIL) && isset($_POST['message']) && trim($_POST['message']) != '' && count($_POST['message']) < 100){
        
        $recaptcha = $_POST['gcaptcha'];
        if (!empty($recaptcha)){
            $google_url = "https://www.google.com/recaptcha/api/siteverify";
            $secret = '6LchegMTAAAAAKmPsU9pfroaqZW0uK3qJDdhc98i';
            $ip = $_SERVER['REMOTE_ADDR'];
            $url = $google_url . "?secret=" . $secret . "&response=" . $recaptcha . "&remoteip=" . $ip;
            $res = getCurlData($url);
            $res = json_decode($res, true);
        }
        if(!$res['success']){
            exit( 'Security check failed. Please refresh the page and try again.');       
        }
        $message = '
            <table>
                <tbody>
                    <tr><td><strong>Name: </strong></td><td>'.htmlspecialchars(trim($_POST['name'])).'</td></tr>
                    <tr><td><strong>Email: </strong></td><td>'.htmlspecialchars(trim($_POST['email'])).'</td></tr>
                    <tr><td><strong>Message: </strong></td><td>'.htmlspecialchars(trim($_POST['message'])).'</td></tr>
                    <tr><td><strong>IP: </strong></td><td>'.$_SERVER['REMOTE_ADDR'].'</td></tr>
                    <tr><td><strong>UserAgent: </strong></td><td>'.htmlspecialchars(trim($_SERVER['HTTP_USER_AGENT'])).'</td></tr>
                </tbody>
            </table>
        ';

        $headers = "From: queries@kevinpei.com\r\n";
        $headers  = 'MIME-Version: 1.0' . "\r\n";
        $headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
        if ( mail('kevin-pei@hotmail.com','Site Query: '.htmlspecialchars(trim($_POST['name'])),$message,$headers) ) {
           exit( "success");
            $_SESSION['code'] = generateRandomString();
        } else {
           exit( "There was an error, please try again later");
        }
    }else{
        exit('Please ensure that all fields have been filled in properly');
    }
}else{
    $_SESSION['code'] = generateRandomString();
    exit( 'Security check failed. Please refresh the page and try again.');   
}
?>