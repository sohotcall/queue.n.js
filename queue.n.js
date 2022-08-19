// SETUP: mkdir /var/tmp/queue-logs
let terbilang = ( x ) => {
	let satuan = [ '', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan' ]
	let ribuan = [ '', 'ribu', 'juta', 'miliar', 'triliun' ]
	let result = []
	;( x + '' ).replace( /(\d)(?=(\d\d\d)+$)/g, "$1_" ).split("_").reverse().forEach( ( v, k ) => {
		result[k] = ""
		if ( v == 0 ){
			if ( x == 0 )
				result[k] = `nol`
		} else if ( k * v == 1 ) {
			result[k] = `seribu `
		} else if ( +v ){
			let tigaan = ( 1000 + +v + '' ).substr( 1, 3 )
			if ( tigaan[0] == 1 )
				result[k] = `seratus `
			else if ( +tigaan[0] )
				result[k] = `${ satuan[ +tigaan[0] ] } ratus `
			if ( tigaan[1] == 1 && tigaan[2] == 0 )
				result[k] += `sepuluh `
			else if ( tigaan[1] == 1 && tigaan[2] == 1 )
				result[k] += `sebelas `
			else if ( tigaan[1] == 1 )
				result[k] += `${ satuan[ +tigaan[2] ] } belas `
			else {
				if ( +tigaan[1] )
					result[k] += `${ satuan[ +tigaan[1] ] } puluh `
				if ( +tigaan[2] )
					result[k] += `${ satuan[ +tigaan[2] ] } `
			}
			if ( k )
				result[k] += `${ ribuan[k] } `
		}
	} )
	return result.reverse().join('').trim()
}

let operators = {
	"andi" : {
		operatorName: "Andi",
		operatorPassword:"andi123",
		operatorLevel: "Administrator",
		},
	"budi" : {
		operatorName: "Budi",
		operatorPassword: "budi123",
		operatorLevel: "Operator",
		},
	"ceri" : {
		operatorName: "Ceri",
		operatorPassword: "ceri123",
		operatorLevel: "Operator",
		},
	"dodi" : {
		operatorName: "Dodi",
		operatorPassword: "dodi123",
		operatorLevel: "Operator",
		},
	"eli" : {
		operatorName: "Eli",
		operatorPassword: "eli123",
		operatorLevel: "Operator",
		},
	"fina" : {
		operatorName: "Fina",
		operatorPassword: "fina123",
		operatorLevel: "Operator",
		}
}

let tellers = {
	"teller-1" : {
		tellerName: "Teller 1",
		tellerAudio: "teller satu",
		category: "teller",
		categoryName: "Teller",
		_ticket: 0,
		_ticketAudio: "",
		_operator: "",
		_operatorName: "",
		_operatorLevel: ""
	},
	"teller-2" : {
		tellerName: "Teller 2",
		tellerAudio: "teller dua",
		category: "teller",
		categoryName: "Teller",
		_ticket: 0,
		_ticketAudio: "",
		_operator: "",
		_operatorName: "",
		_operatorLevel: ""
	},
	"teller-3" : {
		tellerName: "Teller 3",
		tellerAudio: "teller tiga",
		category: "teller",
		categoryName: "Teller",
		_ticket: 0,
		_ticketAudio: "",
		_operator: "",
		_operatorName: "",
		_operatorLevel: ""
	},
	"teller-4" : {
		tellerName: "Customer Service 1",
		tellerAudio: "customer-service satu",
		category: "cs",
		categoryName: "Customer Service",
		_ticket: 0,
		_ticketAudio: "",
		_operator: "",
		_operatorName: "",
		_operatorLevel: ""
	}
}

let categories = {
	"teller" : {
		categoryName: "Teller",
		categoryOffset: 0,
		_ticketPrint: 0,
		_ticketPrintAudio: "",
		_ticketCall: 0,
		_ticketCallAudio: "",
		active: true,
	},
	"cs" : {
		categoryName: "Customer Service",
		categoryOffset: 800,
		_ticketPrint: 0,
		_ticketPrintAudio: "",
		_ticketCall: 0,
		_ticketCallAudio: "",
		active: false,
	},
}

let _queues = {
	/*0:{
		ticketAudio: "nol",
		category: "teller",
		categoryName: "Teller",
		printTs:  new Date( ts ).toLocaleString( 'sv' ).slice( 0, 19 ),
	}*/
}

const PORT = 8080
const LOGDIR = `${__dirname}/logs`
const url = require( 'url' )
const fs = require( 'fs' )

// logs
// ts: new Date().toLocaleString( 'sv' ).slice( 0, 19 )
// {ts:"2022-08-09 11:50:00", action:"print", ticket:1, category:"air"}
// {ts:"2022-08-09 11:50:00", action:"login", operator:"andi", teller:"teller-1"}
// {ts:"2022-08-09 11:50:00", action:"logout", teller:"teller-1"}
// {ts:"2022-08-09 11:50:00", action:"call", ticket:1, teller:"teller-1", operator:"andi"}
let ymd = new Date().toLocaleString( 'sv' ).slice( 0, 10 )
fs.existsSync( `${LOGDIR}/${ymd}.txt` ) && require( 'readline' ).createInterface( {
	input: fs.createReadStream( `${LOGDIR}/${ymd}.txt` ),
} ).on( 'line', ( line ) => {
	line = line.trim()
	if ( ! line )
		return
	let msg = JSON.parse( line )
	if ( msg.action == "login" ){
		//tellers[ msg.teller ]._ticket = 0
		//tellers[ msg.teller ]._ticketAudio = ""
		tellers[ msg.teller ]._operator = msg.operator
		tellers[ msg.teller ]._operatorName = operators[ msg.operator ].operatorName
		tellers[ msg.teller ]._operatorLevel = operators[ msg.operator ].operatorLevel
	} else if ( msg.action == "logout" ){
		tellers[ msg.teller ]._ticket = 0
		tellers[ msg.teller ]._ticketAudio = ""
		tellers[ msg.teller ]._operator = ""
		tellers[ msg.teller ]._operatorName = ""
		tellers[ msg.teller ]._operatorLevel = ""
	} else if ( msg.action == "print" ){
		categories[ msg.category ]._ticketPrint = msg.ticket
		categories[ msg.category ]._ticketPrintAudio = terbilang( msg.ticket )
		_queues[ msg.ticket ] = {}
		_queues[ msg.ticket ].ticketAudio = terbilang( msg.ticket )
		_queues[ msg.ticket ].category = msg.category
		_queues[ msg.ticket ].categoryName = categories[ msg.category ].categoryName
		_queues[ msg.ticket ].printTs = msg.ts
	} else if ( msg.action == "call" ){
		tellers[ msg.teller ]._ticket = msg.ticket
		tellers[ msg.teller ]._ticketAudio = terbilang( msg.ticket )
		msg.category = tellers[ msg.teller ].category
		categories[ msg.category ]._ticketCall = msg.ticket
		categories[ msg.category ]._ticketCallAudio = terbilang( msg.ticket )
		delete _queues[ msg.ticket ]
	}
} )

let logFile = {}
logFile.log = ( obj ) => {
	let ymd = new Date().toLocaleString( 'sv' ).slice( 0, 10 )
	if ( logFile.ymd != ymd ){
		logFile.ymd = ymd
		logFile.stream && logFile.stream.end()
		logFile.stream = fs.createWriteStream( `${LOGDIR}/${ymd}.txt`, { flags: 'a' } )
	}
	logFile.stream.write( `${ JSON.stringify( obj ) }\n` )
}

let printTs = Date.now()
let displayTs = Date.now()
let pendingRequests = []
let webserver = require( 'http' ).createServer( function( req, res ){
	let q = url.parse( req.url, true ).query
	if ( [ 'antrean-nomor.oga', 'satu.oga', 'dua.oga', 'tiga.oga', 'empat.oga', 'lima.oga', 'enam.oga', 'tujuh.oga',
			'delapan.oga', 'sembilan.oga', 'sepuluh.oga', 'sebelas.oga', 'belas.oga', 'puluh.oga', 'seratus.oga',
			'ratus.oga', 'seribu.oga', 'ribu.oga', 'di.oga', 'teller.oga', 'customer-service.oga',
			'video.mp4','video.webm'
			].includes( q.asset ) ){
		if ( /ogg/.test( q.asset ) )
			res.writeHead( 200, { "Content-Type" : "audio/ogg", "Access-Control-Allow-Origin": "*" } )
		else if ( /mp4/.test( q.asset ) )
			res.writeHead( 200, { "Content-Type" : "video/mp4", "Access-Control-Allow-Origin": "*" } )
		else if ( /webm/.test( q.asset ) )
			res.writeHead( 200, { "Content-Type" : "video/webm", "Access-Control-Allow-Origin": "*" } )
		fs.readFile( `${__dirname}/assets/${q.asset}`, ( error, content ) => {
			res.write( content, 'binary' )
			res.end()
		} )
	} else if ( q.mode == "display" ){
		res.writeHead( 200, { "Content-Type" : "text/html", "Access-Control-Allow-Origin": "*" } )
		res.write( String.raw`<!doctype html>
			<style>
			html { font-size:13pt; height:100%; }
			body { background:#003; color:#CCF; height:100%; }
			.item { border:0.25rem solid #CCF; border-radius:0.5rem; text-align:center; margin: 0 0.5rem 0.25rem; }
			[data-operatorName] { background:grey; color:black; font-size:0.6rem; }
			[data-categoryName] { background:black; color:#CCF; font-size:0.75rem;}
			[data-ticket] { background:#EEF; color:black; font-size:3rem; }
			[data-tellerName] { background:black; color:#CCF; }
			.wrapper { display:grid; grid-template-columns:250px 1fr; grid-template-rows:1fr 3rem; height:100%; }
			video { object-fit: contain;  max-width:100%; min-height: 100%; margin:0 auto; display:block; }
			.running-text { position:relative; grid-column:1/3; overflow-x:hidden; }
			.running-text p { white-space:nowrap; position:absolute; animation: slide 20s linear infinite; left:100%;}
			@keyframes slide {
				0% { transform:translateX(0); }
				100% { transform:translateX(-100%); }
			}
			</style>
			<div class=wrapper>
				<div class=box>
					<div class=item data-teller="" >
						<div data-operatorName ></div>
						<div data-categoryName ></div>
						<div data-ticket ></div>
						<div data-tellerName ></div>
					</div>
				</div>
				<div style="position:relative; overflow:hidden; ">
					<video src="http://localhost:49268/?asset=video.webm" autoplay loop controls ></video>
				</div>
				<div class=running-text >
					<p>Running Text 1 |
						Running Text 2 |
						Running Text 3 |
						et cetera
						<span style="display:inline-block; width:100vw;">&nbsp;</span>
					</p>
				</div>
			</div>
			<audio data-audio=antrean-nomor src=?asset=antrean-nomor.oga ></audio>
			<audio data-audio=satu src=?asset=satu.oga ></audio>
			<audio data-audio=dua src=?asset=dua.oga ></audio>
			<audio data-audio=tiga src=?asset=tiga.oga ></audio>
			<audio data-audio=empat src=?asset=empat.oga ></audio>
			<audio data-audio=lima src=?asset=lima.oga ></audio>
			<audio data-audio=enam src=?asset=enam.oga ></audio>
			<audio data-audio=tujuh src=?asset=tujuh.oga ></audio>
			<audio data-audio=delapan src=?asset=delapan.oga ></audio>
			<audio data-audio=sembilan src=?asset=sembilan.oga ></audio>
			<audio data-audio=sepuluh src=?asset=sepuluh.oga ></audio>
			<audio data-audio=sebelas src=?asset=sebelas.oga ></audio>
			<audio data-audio=belas src=?asset=belas.oga ></audio>
			<audio data-audio=puluh src=?asset=puluh.oga ></audio>
			<audio data-audio=seratus src=?asset=seratus.oga ></audio>
			<audio data-audio=ratus src=?asset=ratus.oga ></audio>
			<audio data-audio=seribu src=?asset=seribu.oga ></audio>
			<audio data-audio=ribu src=?asset=ribu.oga ></audio>
			<audio data-audio=di src=?asset=di.oga ></audio>
			<audio data-audio=teller src=?asset=teller.oga ></audio>
			<audio data-audio=customer-service src=?asset=customer-service.oga ></audio>
			<script>
			let caller = []
			caller.isPlaying = false
			caller.call = () => {
				if ( caller.isPlaying || ! caller.length )
					return
				caller.isPlaying = true
				let audio = document.querySelector('[data-audio="' + caller.shift() + '"]')
				audio.currentTime = 0
				audio.play()
				setTimeout( () => {
					caller.isPlaying = false
					caller.call()
				}, 1000 * audio.duration )
			}
			
			let box = document.querySelector( '.box' )
			let master = document.querySelector( '.item' )
			box.removeChild( master )
			let displayTs = 0
			let lastSentences = {}
			let refresh = () => {
				fetch( "?get=display&displayTs=" + displayTs ).then( s => s.json() ).then( data => {
					displayTs = data.displayTs
					box.innerHTML = ""
					for ( let key in data.tellers ){
						value = data.tellers[key]
						let item = master.cloneNode( true )
						item.setAttribute( 'data-teller', key )
						item.querySelector( '[data-operatorName]' ).innerHTML = value._operatorName
						item.querySelector( '[data-categoryName]' ).innerHTML = value.categoryName
						item.querySelector( '[data-ticket]' ).innerHTML = ( 1000 + +value._ticket + '' ).substr( 1, 3 )
						item.querySelector( '[data-tellerName]' ).innerHTML = value.tellerName
						box.appendChild( item )
						let sentence = value._ticket ? "antrean-nomor " + value._ticketAudio + " di " + value.tellerAudio : ""
						console.log( displayTs + " " + lastSentences[key] + " vs " + sentence )
						if ( lastSentences[key] != sentence ){
							lastSentences[key] = sentence
							sentence.split(' ').forEach( part => {
								if ( part )
									caller.push( part )
							} )
							caller.call()
						}
							
					}
					setTimeout( refresh, 1000 )
				} ).catch( error => {
				  console.log( error )
				  setTimeout( refresh, 10000 )
				} )
			}
			setTimeout( refresh, 1000 )
			</script>
		` )
		res.end()
	} else if ( q.get == "tellers" ){
		res.writeHead( 200, { "Content-Type" : "application/json", "Access-Control-Allow-Origin": "*" } )
		res.write( JSON.stringify( tellers ) )
		res.end()
	} else if ( q.get == "operators" ){
		res.writeHead( 200, { "Content-Type" : "application/json", "Access-Control-Allow-Origin": "*" } )
		res.write( JSON.stringify( operators ) )
		res.end()
	} else if ( q.mode == "teller" ){
		res.writeHead( 200, { "Content-Type" : "text/html", "Access-Control-Allow-Origin": "*" } )
		res.write( String.raw`<!doctype html>
			<!-- DO NOT USE BACKTICK -->
			<style>
			html { font-size:12pt; height:100%; }
			body { background:#003; color:#CCF; height:100%; }
			.wrapper { width:250px; margin:0 auto; }
			h1 { text-align:center; }
			h2 { font-size:1.25rem; text-align:center; }
			.box { text-align:center; }
			.item { border:0.25rem solid #CCF; border-radius:0.5rem; text-align:center; margin: 0 0.5rem 0.25rem; width:250px; display:inline-block; }
			[data-categoryName] { background:black; color:#CCF; font-size:0.75rem; }
			[data-ticket] { background:#EEF; color:black; font-size:3rem; }
			</style>
			<DIV class=wrapper>
			<h1>Teller Antrean</h1>
			<div class="login-form item" >
				<h2>Login Form</h2>
				<table align=center >
					<tr><td>Teller<td>:<td><select name=teller ></select>
					<tr><td>Operator<td>:<td><select name=operator ></select>
					<tr><td>Password<td>:<td><input type=password name=password size=12 />
					<tr><td colspan=3 align=center><button type=button name=submit >Login</button>
				</table>
			</div>
			<div class="teller item" data-teller="" data-category="" data-operator="" >
				<h2>Teller Antrean</h2>
				<div data-tellerName ></div>
				<div data-categoryName ></div>
				<div data-operatorName ></div>
				<div data-ticket ></div>
				<button type=button name=call >Call</button>
				<button type=button name=logout >Logout</button>
			</div>
			</DIV>
			<script>
			let session = {}
			fetch( "?get=tellers" ).then( s => s.json() ).then( tellers => {
				for ( const teller in tellers )
				document.querySelector( '.login-form select[name=teller]' ).innerHTML +=
					'<option value="' + teller + '">' + teller + '</option>'
			} )
			fetch( "?get=operators" ).then( s => s.json() ).then( operators => {
				for ( const operator in operators )
				document.querySelector( '.login-form select[name=operator]' ).innerHTML +=
					'<option value="' + operator + '">' + operator + '</option>'
			} )
			document.querySelector( '.login-form' ).style.display = ""
			document.querySelector( '.teller' ).style.display = "none"
			document.querySelector( '.login-form button[name="submit"]' ).addEventListener( 'click', e => {
				fetch( "?do=login&teller=" + document.querySelector( '.login-form [name=teller]' ).value
						+ "&operator=" + document.querySelector( '.login-form [name=operator]' ).value
						+ "&password=" + document.querySelector( '.login-form [name=password]' ).value
						).then( s => s.json() ).then( data => {
					if ( data.teller ){
						session.teller = data.teller
						session.operator = data.operator
						document.querySelector( '.teller' ).setAttribute( 'data-teller', data.teller )
						document.querySelector( '.teller' ).setAttribute( 'data-category', data.category )
						document.querySelector( '.teller' ).setAttribute( 'data-operator', data.operator )
						document.querySelector( '.teller [data-tellerName]' ).innerHTML = data.tellerName
						document.querySelector( '.teller [data-categoryName]' ).innerHTML = data.categoryName
						document.querySelector( '.teller [data-operatorName]' ).innerHTML = data.operatorName
						document.querySelector( '.teller [data-ticket]' ).innerHTML = ( 1000 + +data.ticket + '').substr( 1, 3 )
						document.querySelector( '.login-form [name=password]' ).value = ""
						document.querySelector( '.login-form' ).style.display = "none"
						document.querySelector( '.teller' ).style.display = ""
					} else {
						alert( "Login gagal, bye!" )
					}
				} )
			} )
			document.querySelector( '.teller button[name="logout"]' ).addEventListener( 'click', e => {
				fetch( "?do=logout&teller=" + session.teller ).then( s => s.json() ).then( data => {
					document.querySelector( '.teller' ).setAttribute( 'data-teller', "" )
					document.querySelector( '.teller' ).setAttribute( 'data-category', "" )
					document.querySelector( '.teller' ).setAttribute( 'data-operator', "" )
					document.querySelector( '.teller [data-tellerName]' ).innerHTML = ""
					document.querySelector( '.teller [data-categoryName]' ).innerHTML = ""
					document.querySelector( '.teller [data-operatorName]' ).innerHTML = ""
					document.querySelector( '.teller [data-ticket]' ).innerHTML = "000"
					document.querySelector( '.login-form' ).style.display = ""
					document.querySelector( '.teller' ).style.display = "none"
				} )
			} )
			document.querySelector( '.teller button[name="call"]' ).addEventListener( 'click', e => {
				fetch( "?do=call&teller=" + session.teller + '&operator=' + session.operator ).then( s => s.json() ).then( data => {
					document.querySelector( '.teller [data-ticket]' ).innerHTML = ( 1000 + +data.ticket + '').substr( 1, 3 )
					if ( ! data.ticket ){
						alert( "Antrean habis, Anda belum beruntung, silakan coba lagi nanti!" )
					}
				} )
			} )
			</script>
		` )
		res.end()
	} else if ( q.do == "call" ){
		displayTs = Date.now()
		q.category = tellers[q.teller].category
		let found = false
		res.writeHead( 200, { "Content-Type" : "application/json", "Access-Control-Allow-Origin": "*" } )
		for ( const ticket in _queues ){
			if ( _queues[ticket].category == q.category ){
				found = true
				res.write( JSON.stringify( {
					displayTs: displayTs,
					ticket: ticket,
					ticketAudio: terbilang( ticket ),
				} ) )
				logFile.log( {
					ts: new Date( displayTs ).toLocaleString( 'sv' ).slice( 0, 19 ),
					action: "call",
					ticket: ticket,
					teller: q.teller,
					operator: q.operator,
				} )
				tellers[ q.teller ]._ticket = ticket
				tellers[ q.teller ]._ticketAudio = terbilang( ticket )
				categories[ q.category ]._ticketCall = ticket
				categories[ q.category ]._ticketCallAudio = terbilang( ticket )
				delete _queues[ticket]
				break;
			}
		}
		if ( ! found ){
			res.write( JSON.stringify( {
				displayTs: displayTs,
				ticket: 0,
				ticketAudio: "",
			} ) )
			logFile.log( {
				ts: new Date( displayTs ).toLocaleString( 'sv' ).slice( 0, 19 ),
				action: "call",
				ticket: 0,
				teller: q.teller,
				operator: q.operator,
			} )
			tellers[ q.teller ]._ticket = 0
			tellers[ q.teller ]._ticketAudio = ""
			categories[ q.category ]._ticketCall = 0
			categories[ q.category ]._ticketCallAudio = ""
		}
		res.end()
	} else if ( q.do == "login" ){
		res.writeHead( 200, { "Content-Type" : "application/json", "Access-Control-Allow-Origin": "*" } )
		if ( operators[ q.operator] && tellers[q.teller] && operators[ q.operator].operatorPassword == q.password ){
			//tellers[ q.teller ]._ticket = 0
			//tellers[ q.teller ]._ticketAudio = ""
			tellers[ q.teller ]._operator = q.operator
			tellers[ q.teller ]._operatorName = operators[ q.operator ].operatorName
			tellers[ q.teller ]._operatorLevel = operators[ q.operator ].operatorLevel
			displayTs = Date.now()
			res.write( JSON.stringify( {
				displayTs: displayTs,
				operator: q.operator,
				operatorName: operators[ q.operator ].operatorName,
				operatorLevel: operators[ q.operator ].operatorLevel,
				ticket: tellers[ q.teller ]._ticket,
				ticketAudio: tellers[ q.teller ]._ticketAudio,
				teller: q.teller,
				tellerName: tellers[ q.teller ].tellerName,
				tellerAudio: tellers[ q.teller ].tellerAudio,
				category: tellers[ q.teller ].category,
				categoryName: tellers[ q.teller ].categoryName,
			} ) )
			logFile.log( {
				ts: new Date( ).toLocaleString( 'sv' ).slice( 0, 19 ),
				action: "login",
				operator: q.operator,
				teller: q.teller,
			} )
		} else
			res.write( "{}" )
		res.end()
	} else if ( q.do == "logout" ){
		displayTs = Date.now()
		tellers[ q.teller ]._ticket = 0
		tellers[ q.teller ]._ticketAudio = ""
		tellers[ q.teller ]._operator = ""
		tellers[ q.teller ]._operatorName = ""
		tellers[ q.teller ]._operatorLevel = ""
		res.writeHead( 200, { "Content-Type" : "application/json", "Access-Control-Allow-Origin": "*" } )
		res.write( "{}" )
		res.end()
		logFile.log( {
			ts: new Date( displayTs ).toLocaleString( 'sv' ).slice( 0, 19 ),
			action: "logout",
			teller: q.teller,
		} )
	} else if ( q.mode == "print" ){
		res.writeHead( 200, { "Content-Type" : "text/html", "Access-Control-Allow-Origin": "*" } )
		res.write( String.raw`<!doctype html>
			<!-- DO NOT USE BACKTICK -->
			<style>
			html {font-size:15pt; height:100%; }
			body {background:#003; color:#CCF; height:100%; }
			h1 { text-align:center; }
			.box { text-align:center; }
			.item { border:0.25rem solid #CCF; border-radius:0.5rem; text-align:center; margin: 0 0.5rem 0.25rem; width:250px; display:inline-block; }
			[data-categoryName] { background:black; color:#CCF; font-size:0.75rem; }
			[data-ticket] { background:#EEF; color:black; font-size:3rem; }
			</style>
			<h1>Print Tiket Antrean</h1>
			<div class=box >
				<div class=item data-category="" >
					<div data-ticket></div>
					<div data-categoryName></div>
				</div>
			</div>
			<script>
			/// DO NOT USE BACKTICK ///
			let taagify = x => { // text-to-ascii-art (but in this case, integer-to-ascii-art)
				/// case when double-width-double-height then
				return "   {1B}{21}{30}" + x + "{1B}{21}{00}"
				/// when text-to-ascii-art then
				let glyph = [
					 '  __  ', ' _ ',' ___ ',' ____', ' _ _  ',' ___ ', '  __ ', ' ____ ', ' ___ ',  ' ___ ',
					 ' /  \\ ','/ |','|_  )','|__ /', '| | | ','| __|', ' / / ', '|__  |', '( _ )',  '/ _ \\',
					 '| () |', '| |',' / / ',' |_ \\','|_  _|','|__ \\','/ _ \\','  / / ', '/ _ \\','\\_  /',
					' \\__/ ', '|_|','/___|','|___/', '  |_| ','|___/','\\___/', ' /_/  ','\\___/',  ' /_/ ',
					]
				let result = [ '  ', '  ', '  ', '  ' ]
				;(x+'').split('').forEach( x=>{
					result[0] += glyph[ +x ]
					result[1] += glyph[ 10 + +x ]
					result[2] += glyph[ 20 + +x ]
					result[3] += glyph[ 30 + +x]
				} )
				return result.join( "\n" )
				/// end case
			}
			let box = document.querySelector( '.box' )
			let master = document.querySelector( '.item' )
			box.removeChild( master )
			let printTs = 0
			let refresh = () => {
				fetch( "?get=print&printTs=" + printTs ).then( s => s.json() ).then( data => {
					printTs = data.printTs
					box.innerHTML = ""
					for ( let key in data.categories ){
						value = data.categories[key]
						let item = master.cloneNode( true )
						item.setAttribute( 'data-category', key )
						item.querySelector( '[data-ticket]' ).innerHTML = ( 1000 + +value._ticketPrint + '' ).substr( 1, 3 )
						item.querySelector( '[data-categoryName]' ).innerHTML = value.categoryName
						box.appendChild( item )
					}
					setTimeout( refresh, 1000 )
				} ).catch( error => {
				  console.log( error )
				  setTimeout( refresh, 10000 )
				} )
			}
			setTimeout( refresh, 1000 )
			let print = function( str ){
				let formData = new FormData()
				formData.append( "data", str )
				formData.append( "port", "2482" )
				fetch( "http://localhost/rawprintserver.php", {
					method: 'POST',
					body: formData,
				} )
			}
			document.querySelector( '.box' ).addEventListener( 'click', e => {
				let item = e.target
				while ( ! item.classList.contains( 'item' ) && item.parentNode ){
					item = item.parentNode
					console.log( item )
				}
				if ( item.classList.contains( 'item' ) ){
					document.querySelector( '.box' ).style.display = 'none'
					setTimeout( () => {
						document.querySelector( '.box' ).style.display = ''
					}, 2500 )
					fetch( "?do=print&category=" + item.getAttribute( 'data-category' ) ).then( s => s.json() ).then( data => {
						console.log( data )
						let taag = taagify( ( 1000 + +data.ticket + '' ).substr( 1, 3 ) )
						//       12345678901234567890123456789012
						print(  "{1B}{21}{00}   Perumda Tirta Amertha Buana\n" +
							"   " + data.printTs + "\n" +
							"   " + data.categoryName + "\n" +
							taag + "\n" +
							"   #Antrean nomor\n" +
							"   " + data.ticketAudio + "#\n" +
							"\n\n\n\n\n\n\n{1D}{56}{01}\n"
						 )
					} )
				}
			} )
			</script>
		` )
		res.end()
	} else if ( q.do == "print" ){
		printTs = Date.now()
		let ticket = ( +categories[ q.category ]._ticketPrint || +categories[ q.category ].categoryOffset )  + 1
		categories[ q.category ]._ticketPrint = ticket
		categories[ q.category ]._ticketPrintAudio = terbilang( ticket )
		_queues[ ticket ] = {
			ticketAudio: terbilang( ticket ),
			category: q.category,
			categoryName: categories[ q.category ].categoryName,
			printTs: new Date( printTs ).toLocaleString( 'sv' ).slice( 0, 19 ),
		}
		logFile.log( {
			ts: new Date( printTs ).toLocaleString( 'sv' ).slice( 0, 19 ),
			action: "print",
			ticket: categories[ q.category ]._ticketPrint,
			category: q.category,
		} )
		res.writeHead( 200, { "Content-Type" : "application/json", "Access-Control-Allow-Origin": "*" } )
		res.write( JSON.stringify( {
			ticket: ticket,
			ticketAudio: terbilang( ticket ),
			category: q.category,
			categoryName: categories[ q.category ].categoryName,
			printTs: new Date( printTs ).toLocaleString( 'sv' ).slice( 0, 19 ),
		} ) )
		res.end()
	} else if ( q.get == "print" ){
		pendingRequests.push( {
			type: 'get-print',
			printTs: q.printTs,
			res: res,
			expired: Date.now() + 300_000, // 5 minutes = 300_000 ms
			result: {
				printTs: printTs,
				categories: categories,
			},
		} )
	} else if ( q.get == "display" ){
		pendingRequests.push( {
			type: 'get-display',
			displayTs: q.displayTs,
			res: res,
			expired: Date.now() + 300_000, // 5 minutes = 300_000 ms
			result: {
				displayTs: displayTs,
				tellers: tellers,
			},
		} )
	} else {
		res.writeHead( 200, { "Content-Type" : "text.html", "Access-Control-Allow-Origin": "*" } )
		res.write( String.raw`<!doctype html>
			<h1>Menu Antrean</h1>
			<ul>
				<li><a href="?mode=print" >Cetak Ticket Antrean</a>
				<li><a href="?mode=display" >Display Antrean</a>
				<li><a href="?mode=teller" >Teller Antrean</a>
			</ul>
			<hr/>
			<h2>Debug</h2>
			<ul>
				<li>
		` )
		;[ 'antrean-nomor.oga', 'satu.oga', 'dua.oga', 'tiga.oga', 'empat.oga', 'lima.oga', 'enam.oga', 'tujuh.oga',
			'delapan.oga', 'sembilan.oga', 'sepuluh.oga', 'sebelas.oga', 'belas.oga', 'puluh.oga', 'seratus.oga',
			'ratus.oga', 'seribu.oga', 'ribu.oga', 'di.oga', 'teller.oga', 'customer-service.oga',
			'video.mp4'
				].forEach( asset => {
			res.write( String.raw`<a href=?asset=${asset} >${asset}</a> ` )
		} )
		res.write( String.raw`
			</ul>
		`)
		res.end()
	}
} ).listen( PORT ).on( 'connection', function( socket ){
	socket.setTimeout( 600_000 ); // bigger than any pendingRequests expired
} )

pendingRequests.process = () => {
	let now = Date.now()
	for ( let i = pendingRequests.length - 1; i >= 0; i-- ){
		let request = pendingRequests[i]
		if ( request.type == "get-print" && request.printTs != printTs ){
			request.expired = 0
			request.result = {
				printTs: printTs,
				categories: categories,
			}
		} else if ( request.type == "get-display" && request.displayTs != displayTs ){
			request.expired = 0
			request.result = {
				displayTs: displayTs,
				tellers: tellers,
			}
		}
		if ( request.expired < now ){
			request.res.writeHead( 200, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } )
			request.res.write( JSON.stringify( request.result ) )
			request.res.end()
			pendingRequests.splice( i, 1 )
		}
	}
	setTimeout( pendingRequests.process, 2_500 )
}
pendingRequests.process()
