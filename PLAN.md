# GapVis-JOTH development plan
## Getting started developing.

Built on-top of backbone.js

* Uses backbone-spf submodule
	* After cloning run
	
			git submodule update --init
			npm install

It uses ant to build app

Running OSX?

	brew install ant

Otherwise install ant and modify path to ant-contrib in `build.xml`

    <!-- define ant-contrib tasks -->
    <taskdef resource="net/sf/antcontrib/antlib.xml">
        <classpath>
            <pathelement location="/usr/local/Cellar/ant-contrib/1.0b3/libexec/ant-contrib-1.0b3.jar"/>
        </classpath>
    </taskdef>

If node.js and grunt is installed you can run...

	grunt watch

So ant build task is run whenever app .js and .css files are changed.


## hypothes.is data accessibility

Bridget

JSON Index of all JOTH annotation links.  Like this one.

	http://sosol.perseids.org/sosol/publications/7922/oa_cite_identifiers/10122/convert?resource=https%3A%2F%2Fhypothes.is%2Fa%2FNlP4CyExRfS1gUR_hgTqXg&format=json

Index and annotation JSON must be accessible without login credentials for conversion scripts to build data that drives GapVis display, unless there is a way to pass credentials from a node.js script running in the shell.


## Data Conversion

Adam

node.js conversion scripts.
Run from terminal window as shell scripts currently,
but could potentially be used in browser.

Running from shell currently for speed issues... 
many requests to Pleiades...
GapVis display data doesn't need to be built dynamically...
only updated periodically.

	/scripts

Retrieve hypothes.is annotation JSON from Perseids.
Retrieve lat-lon for pleiades places.
Massage data into structure that drives GapVis.

## Reader View

Adam

Use Capitains-Sparrow to retrieve CTS texts and update reader view.

	http://perseusdl.github.io/Capitains-Sparrow/doc_html/api/

Getting cts.js to work with require.js is difficult.
Old version of require.js.
Couldn't sort out shim config.

Just using like so.

	var settings = {
	  "endpoint": "http://sosol.perseids.org/exist/rest/db/xq/CTS.xq?",
		"inventory": "annotsrc",
		"urn": "urn:cts:greekLit:tlg0003.tlg001.perseus-eng6:4"
	};
	
	function passage( opt ){
		return new CTS.text.Passage( opt[0], opt[1], opt[2] )
	}
	
	var psg = passage([ 
		settings.urn, 
		settings.endpoint, 
		settings.inventory
	]);
	
	function success( xml ){
		console.log( xml );
	}
	
	psg.retrieve({
		success: function(){
			success( psg.getXml() );
		},
		error: function( err ){
			console.log( err );
		}
	});

Not that difficult...

Next task.
Tie this into Backbone

	there is ready() function.

Next task.
I'll have to transform the TEI XML returned by cts.js.

Here's sample mark-up of Page HTML as used in Herodotus Histories


	<div class="text-en" lang="en">
		This is the display of the inquiry of Herodotus of <span data-token-id="11" class="place" data-place-id="462">Halicarnassus</span>, so that things done by man not be forgotten in time, and that great and marvelous deeds, some displayed by the Hellenes, some by the barbarians, not lose their glory, including among others what was the cause of their waging war on each other.<br>
		<br>
		The Persian learned men say that the Phoenicians were the cause of the dispute. These (they say) came to our seas from the sea which is called Red, and having settled in the country which they still occupy, at once began to make long voyages. Among other places to which they carried Egyptian and Assyrian merchandise, they came to <span data-token-id="129" class="place" data-place-id="336">Argos</span>, which was at that time preeminent in every way among the people of what is now called <span data-token-id="148" class="place" data-place-id="665">Hellas</span>. The Phoenicians came to <span data-token-id="154" class="place" data-place-id="336">Argos</span>, and set out their cargo.<br>
		<br>
		On the fifth or sixth day after their arrival, when their wares were almost all sold, many women came to the shore and among them especially the daughter of the king, whose name was Io (according to Persians and Greeks alike), the daughter of Inachus.<br>
		<br>
		As these stood about the stern of the ship bargaining for the wares they liked, the Phoenicians incited one another to set upon them. Most of the women escaped: Io and others were seized and thrown into the ship, which then sailed away for <span data-token-id="262" class="place" data-place-id="604">Egypt</span>.
	</div>

## Social Network View

Thibault

Social Network View

Selecting character node will return that character id and ids of immediately adjacent nodes... used for filtering rest of display.

Thibault's social network selector could use it's own data structure.
Changes emit event.
Returns selected character ids.
Could be...

	[ 'alcathoe-1', 'penelope-1', 'helena-1' ]

or

	[
		'http://data.perseus.org/people/smith:alcathoe-1#this',
		'http://data.perseus.org/people/smith:penelope-1#this',
		'http://data.perseus.org/people/smith:helena-1#this'
	]

Room has been made for the Social Network View.

important files

	app/templates/social-network-template.html
	app/views/SocialNetworkView.js

layout config

	app/config.js: views['social-network-view']


## GapVis's data structure

Here's abbreviated GapVis data.

	{
	    "author": "Analysed by the Edina/Unlock GeoParser",
	    "id": "1",
	    "pages": [
	        {
	            "id": "1",
	            "places": [
	                "462",
	                "336",
	                "665",
	                "336",
	                "604"
	            ]
	        },
	        {
	            "id": "2",
	            "places": [
	                "604",
	                "522",
	                "519",
	                "617",
	                "582"
	            ]
	        },
					... yadda yadda
	    ],
	    "places": [
	        {
	            "id": "462",
	            "ll": [
	                37.0382205,
	                27.423765
	            ],
	            "title": "Halicarnassus/Halikarnassos",
	            "uri": "http://pleiades.stoa.org/places/599636"
	        },
	        {
	            "id": "336",
	            "ll": [
	                37.631561,
	                22.719464
	            ],
	            "title": "Argos",
	            "uri": "http://pleiades.stoa.org/places/570106"
	        },
					... yadda yadda
	    ],
	    "printed": "2013-12-04 17:37:51",
	    "sections": [
	        {
	            "firstPage": "1",
	            "section": "1"
	        },
	        {
	            "firstPage": "217",
	            "section": "2"
	        },
	    ],
	    "texts": [
	        {
	            "documentID": "1",
	            "label": "English",
	            "lang": "en",
	            "language": "English"
	        },
	        {
	            "documentID": "2",
	            "label": "Ancient Greek",
	            "lang": "grc",
	            "language": "\u03b5\u03bb\u03bb\u03b7\u03bd\u03b9\u03ba\u03ac"
	        }
	    ],
	    "title": "Herodotus Histories - Hestia data",
	    "uri": "http://www.perseus.tufts.edu/hopper/text?doc=Perseus:text:1999.01.0126"
	}

pages in our case are characters, because... Smith's Dictionary.

	        {
	            "id": "1",
	            "places": [
	                "462",
	                "336",
	                "665",
	                "336",
	                "604"
	            ]
	        },

If the id value is the page that gets passed along to the perseus hopper to retrieve text a change like this...

	        {
	            "id": "alcathoe-1",
	            "places": [
	                "462",
	                "336",
	                "665",
	                "336",
	                "604"
	            ]
	        },

or this even... 

	{
      "id": "1",
			"perseus_id": "alcathoe-1",
      "places": [
          "462",
          "336",
          "665",
          "336",
          "604"
      ]
		},

It shouldn't require too much code wrangling to successfully pull in the text from Smith's...
if our only use for the id / perseus_id is to use it as a key for filtering, and for retrieving the correct entry from the Perseus hopper.