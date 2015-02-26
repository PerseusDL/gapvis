/*
 * Perseus Page View
 */

define([
'gv', 
'models/PerseusPage',
'views/BookView' ], 
function( gv, PerseusPage, BookView ) {
  var state = gv.state;
  
  // View: Perseus Page View
  
  return BookView.extend({
    className: 'perseus-page-view',
    template: '#perseus-page-template',
    
    render: function(){
      var self = this;
      if ( 'page' in self ){
        console.log( 'view--render!' )
        self.renderTemplate( { out: self.page.out } );
      }
    },
    
    initialize: function(){
      var self = this;
      console.log( 'view--init!' );
      self.page = new PerseusPage( "alcathoe-bio-1" );
      console.log( self );
      self.bindState( self.page.event.success, self.render, self )
    }
  });
});