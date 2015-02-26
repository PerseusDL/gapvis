/*
 * Perseus Page View
 */

define([
'gv', 
'models/PerseusPage',
'views/BookView' ], 
function( gv, PerseusPage, BookView ) {
  var state = gv.state;
	_.extend( Backbone.Events );
  
  // View: Perseus Page View
  
  return BookView.extend({
    className: 'perseus-page-view',
    template: '#perseus-page-template',
    
    render: function(){
      var self = this;
      if ( 'page' in self ){
        self.renderTemplate( { out: self.page.out } );
      }
    },
    
    initialize: function(){
      var self = this;
      self.page = new PerseusPage( "alcathoe-bio-1" );
      self.page.on( self.page.event.success, self.render, self )
    }
  });
});