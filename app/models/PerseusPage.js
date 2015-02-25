/*
 * PerseusPage model
 */
define([
'gv', 
'models/Model' ], 
function( gv, Model ) {
    var settings = gv.settings,
        PerseusPage;
		
		var self = this;
       
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
							self.xml = psg.getXml();
							self.trigger( 'perseus_page:load' );
						},
						error: function( err ){
							console.log( err );
						}
					});
					
        }
    });
});

/*
Test: require(['models/PerseusPage'], function( p ){ new p() });
*/