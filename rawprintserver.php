<?php
$socket = socket_create( AF_INET, SOCK_STREAM, 0 ) or die( "Sockerr\r\n" );
$result = socket_connect( $socket, "127.0.0.1", $_REQUEST['port'] ? $_REQUEST['port'] : 2481 ) or die( "Connerr\r\n" );
if ( isset( $_REQUEST['data'] ) )
	$message = preg_replace_callback( "/\{([0-9A-F][0-9A-F])\}/", function( $m ){
		return pack( 'H*', $m[1] );
	}, $_REQUEST['data'] );
else
	$message = $_REQUEST[q];
socket_write( $socket, $message, strlen( $message ) ) or die( "Senderr\r\n" );
socket_close( $socket );
echo strlen( $message );
die();
?>
<form method=post action=rawprintserver.php >
<h1>Raw Print Server</h1>
Port: <input name=port value=2482 size=4 /><br/>
Data:<br/>
<textarea name=data rows=20 cols=80>
{1B}{4D}{01}Hello, world!
{1B}{21}{30}Double-height double-width
{1B]{21}{01}Font-B
{1B]{21}{00}Normal
</textarea><br/>
<button type=submit >Print</button>
</form>
