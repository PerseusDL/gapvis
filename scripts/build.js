var r = require('request-json');
var fs = require('fs');

/*
var book = '../books/1.json';
var out = '../books/out.json';
*/

/*
write( out, 'Party!' );
open( book );
pleiades( process.argv[2] );
*/

var src = dir_data( '../data/perseids' );
make_vis_data( src, '../data/gapvis' );


// Retrieve pleiades data

function pleiades( id ){
	var host = 'http://pleiades.stoa.org';
	var path = '/places/'+id;
	var cli = r.createClient( host );
	
	cli.get( path+'/json', function( err, res, json ){
		return {
			id: json.id,
			title: json.title,
			uri: host+path,
			ll: json.reprPoint
		}
	});
}


// Grab all files in directory

function dir_data( path ){
	var dir = fs.readdirSync( path );
	var data = [];
	for ( var i=0; i<dir.length; i++ ){
		data.push( open_json( path+'/'+dir[i] ) );
	}
	return data;
}


// Open a json file

function open_json( file ){
	return JSON.parse( fs.readFileSync( file ) );
}


// Write the file

function write( file, data ){
	fs.writeFile( file, JSON.stringify( data, null, 2 ),
	function( err ){
		if ( err ){
			console.log( err );
		}
		else {
			console.log( file+' saved!' );
		}
	});
}


// social network

function make_vis_data( data, dir ){
	
	var character = {};
	var cts_map = {};
	var place = {};
	
	for ( var i=0; i<data.length; i++ ){
		var d = data[i];
		var body = d.hasBody;
		var char = {};
		
		// Grab the CTS
		
		var cts = d.hasTarget.hasSource['@id'];
		
		// Character
		
		if ( '@graph' in body ) {
			var s = body['@graph'][0]['@id'];
			var p = body['@graph'][1]['@type'];
			var o = body['@graph'][1]['snap:bond-with']['@id'];
			var nam = d.hasTarget.hasSelector.exact;
			cts_map[s] = cts;
			if(!( s in character )){
				character[s] = { name: '', rel:[] };
			}
			character[s]['rel'].push( { name: nam, type: p, id: o } );
		}
		
		// Place
		
		else {
			var s = body[0]['@id'];
			if (!( cts in place )){
				place[cts] = [];
			}
			place[cts].push( s );
		}
	}
	
	// Write json files
	
	write( dir+'/characters.json', character );
	write( dir+'/cts_map.json', cts_map );
	write( dir+'/places.json', place );
	
}

// Build book from separate files

function build_book(){
	
}