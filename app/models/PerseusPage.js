/*
 * PerseusPage model
 */
define([
'gv', 
'models/Model' ], 
function( gv, Model ) {
    var settings = gv.settings,
        PerseusPage;
       
    // Model: PerseusPage
				
		var config = {
		  "endpoint": "http://sosol.perseids.org/exist/rest/db/xq/CTS.xq?",
			"inventory": "annotsrc"
		};
		
		// Retrieve CTS passage
		
		function passage( opt ){
			return new CTS.text.Passage( opt[0], opt[1], opt[2] )
		}
				
		return Model.extend({
        type: 'page',
        initialize: function( urn ) {
					var self = this;
					
					var psg = passage([ 
						urn,
						config.endpoint, 
						config.inventory
					]);
					
					psg.retrieve({
						success: function(){
							
							// Get the response template ready
							
							self.response = psg.getXml();
							var body = self.response.getElementsByTagName("body")[0];
							var xml = body.childNodes[0].nextSibling;
							self.out = $(xml).text();
							
							// Let the app know data has been successfully retrieved
							
							self.trigger( 'PerseusPage:success' );
						},
						error: function( err ){ throw err }
					});
					
        }
    });
});

/*
Test: require(['models/PerseusPage'], function( p ){ new p() });
*/