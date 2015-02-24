var r = require('request-json');
var fs = require('fs');
var book = '../books/1.json';
var out = '../books/out.json';


// write( out, 'Party!' );
// open( book );
// pleiades( process.argv[2] );


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


// Open a file

function open( file ){
	fs.readFile( file, 'utf8',
	function( err, data ){
		return data;
	});
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