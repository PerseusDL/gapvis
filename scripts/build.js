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

var data = dir_data( '../data/perseids' );
soc_net( data, '../data/gapvis/soc_net.json' );

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
	fs.writeFile( file, data,
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

function soc_net( data, file ){
	var output = { characters:[] };
	for ( var i=0; i<data.length; i++ ){
		var char = data[i];
		output.characters.push( char );
	}
	write( file, JSON.stringify( output, null, 2 ));
}


// book

function book( data, file ){
	var output = {};
	for ( var i=0; i<data.length; i++ ){
		
	}
	write( file, JSON.stringify( output, null, 2 ));
}