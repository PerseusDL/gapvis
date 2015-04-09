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
    "inventory": "annotsrc",
    "prefix": "urn:cts:pdlrefwk:viaf88890045.003.perseus-eng1:"
  };
  
  // Retrieve CTS passage
  
  function passage( opt ){
    return new CTS.text.Passage( opt[0], opt[1], opt[2] )
  }
      
  return Model.extend({
    type: 'page',
    event: {
      success: 'PerseusPage:Success'
    },
    initialize: function( id ) {
      var self = this;
      
      // Modify person id so CTS.js works
      
      id = id.replace( 'bio-', '' ).replace( '-', '_' );
      var psg = passage([ 
        config.prefix + id,
        config.endpoint, 
        config.inventory
      ]);
      
      psg.retrieve({
        success: function(){
          
          // Get the response template ready
          
          var xml = psg.getXml();
          var $xml = $( xml.getElementsByTagName('body')[0].innerHTML );
          self.out = $xml.text();
          
          // Let the app know data has been successfully retrieved
          
          self.trigger( self.event.success );
        },
        error: function( err ){ throw err }
      });
      
    }
  });
});