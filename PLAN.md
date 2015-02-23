# GapVis-JOTH development plan
## Getting started developing.

Built on-top of backbone.js

* Uses backbone-spf submodule
	* After cloning run
	
			git submodule update --init

Uses ant to build app

You have to install ant to build the app.
Running OSX?

	brew install ant

Otherwise install ant and modify path to ant-contrib in `build.xml`

    <!-- define ant-contrib tasks -->
    <taskdef resource="net/sf/antcontrib/antlib.xml">
        <classpath>
            <pathelement location="/usr/local/Cellar/ant-contrib/1.0b3/libexec/ant-contrib-1.0b3.jar"/>
        </classpath>
    </taskdef>

If node and grunt is installed you can run...

	grunt watch

So ant build task is run whenever app .js and .css files are changed.


## hypothes.is data accessibility

Bridget

JSON Index of all JOTH annotation links.  Like this one.

	http://sosol.perseids.org/sosol/publications/7922/oa_cite_identifiers/10122/convert?resource=https%3A%2F%2Fhypothes.is%2Fa%2FNlP4CyExRfS1gUR_hgTqXg&format=json

Index and annotation JSON must be accessible without login credentials for conversion scripts to build data that drives GapVis display.


## Data Conversion

Adam

node.js conversion scripts.
Run from terminal window as shell scripts currently,
but could potentially be used in browser.

	/scripts

Retrieve hypothes.is annotation JSON from Perseids.
Retrieve lat-lon for pleiades places.
Massage data into structure that drives GapVis.


## Social Network View

Thibault

Social Network View
Visualize character relationships.

Selecting character node will return that character id and ids of immediately adjacent nodes...
used for filtering rest of display.

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

shouldn't require too much code wrangling to successfully pull in the text from Smith's.

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

Just replace entry of this URL...

	http://www.perseus.tufts.edu/hopper/text?doc=Perseus:text:1999.04.0104:entry=penelope-bio-1

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

Used to filter the pages objects.

