// development settings
API_ROOT = 'tests/api';
REPORT_URL = 'tests/api/flags/';
// API_DATA_TYPE = 'json';
// DEBUG = true;
// disableChangeLink = true;
// //if present and not null, makes a direct link isntead of a form. Looks for {token-id}
// REPORT_BAD_TOKEN_URL = null;
// //if present and not null, makes a direct link isntead of a form. Looks for {place-id}
//REPORT_PROBLEM_PLACE_URL = 'http://gap2.alexandriaarchive.org/report/place-issues/{place-id}';
API_ROOT = 'http://www.perseids.org/apps-stage';
CTS_API  = 'http://services2.perseids.org/exist/rest/db/repository/CTS.xq'
// API_ROOT = 'http://localhost/gapvis';
// REPORT_URL = 'http://gap2.alexandriaarchive.org/flags/';
API_DATA_TYPE = 'xml';
DEBUG = false;
DEEP_DEBUG = false;
// if present and not null, makes a direct link isntead of a form. Looks for {token-id}
//REPORT_BAD_TOKEN_URL = "http://gap2.alexandriaarchive.org/report/token-issues/{token-id}";
VIEW_ON = "View on Perseus"

VIEW_ON_LINK = function( uri, page ){
	// uri is the link to the book page on the origin repository
	// page is the page number (eg, 1, 3, -13) or reference (eg. 1.1, 4.5)
	// Implement here how to build a more detailed link
	
	// XXX This is the default (do nothing)
	//return uri;
	
	// XXX This is an example for Perseus repository
	// uri is something like http://www.perseus.tufts.edu/hopper/text?doc=Perseus%3Atext%3A1999.01.0126
        if (uri == null)  {
            if (page && page.match(/urn:cts:/)) {
              return "http://data.perseus.org/citations/" + page;
            } else {
              // no page, just go to Perseus Smith's
              return "http://www.perseus.tufts.edu/hopper/text?doc=Perseus:text:1999.04.0104";
            }
        } else {
	  if ( page.indexOf('.') != -1 ){
		page = page.split('.');
		return uri + ':entry=' + page[0];		
	  }
	  else {
		return uri;
	  }
        }
};

PLACE_THEME = "frequency"; // Supported values are 'frequency' and 'feature'. If the value is set to 'feature' then places should have a 'type' property set to one of the following values: "REGION", "SETTLEMENT", "NATURAL_FEATURE"

// We set up some endpoints to be sure we don't write them multiple times 
CTS_ENDPOINT = function() { return new CTS.endpoint.XQ(CTS_API, "annotsrc"); } // Doing that so the loading of CTS is made...
CTS_JOTH_ENDPOINT = function() { return new CTS.endpoint.XQ(API_ROOT + "/joth/books/reffs", "annotsrc"); } // Doing that so the loading of CTS is made...
/**
 * The previous system depends only one kind of retriever, 
 * 	using simple ajax calls without dealing with multiple endpoints
 * 	Instead of that, the new configuration file should handle multiple functions for retrievers
 */

SETTINGS_MODELS = {
    endpoints : {
        bookslist : API_ROOT + '/joth/books',
        book  : CTS_ENDPOINT,
        pages : CTS_JOTH_ENDPOINT,
        page  : CTS_ENDPOINT,
        places: function() { return API_ROOT + "/joth/places?urn="+this.book.id; },
        place: function() { return API_ROOT + "/joth/place?urn="+this.book.id; },
        persons: function(arg) { 
            if(typeof arg !== "undefined") {
                return API_ROOT + "joth/persons?persons=" + arg;
            } else {
                return API_ROOT + "/joth/persons?urn="+this.book.id; 
            }
        },
        citations: function(arg) { 

            var endpoints = [
                API_ROOT + "/joth/occurrences?urn="+this.book.id,
                CTS_ENDPOINT()
            ];
            return (typeof arg !== "undefined") ? endpoints[arg] : endpoints[0];
        }
    },
    retrievers : {
        bookslist: "sync",
        book: "cts.book",
        pages : "cts.reff",
        page : "cts.page",
        places: "joth.places",
        place: "joth.place",
        persons: "joth.persons",
        citations: "joth.citations"
    },
    options : {
        bookslist : {},
        book : {},
        pages : { level : 2 },
        page : {},
        places: {},
        place: {},
        persons: {},
        citations: {}
    },
    injections : {
        book : ["pages", "places", "persons", "citations"]
    },
    extensions : {
        book : [
            "extensions/Book/Pages",
            "extensions/Book/Places",
            {
                name : "extensions/Book/Network",
                parameters : {
                    collection : "persons"
                }
            }
        ],
        page : [{
            name : "extensions/Page/OpenAnnotation",
            parameters : {
                attributeNames : [
                    "placesAnnotations",
                    "personsAnnotations"
                ],
                prefixes : [
                    function(id) { 
                        return '<span class="place" data-place-id="' + id + '">' 
                    },
                    function(id) { 
                        return '<a class="people" style:="color:red;" data-person-id="' + id + '">' 
                    }
                ],
                suffixes : ["</span>", "</a>"]
            }
        }]
    }
}
