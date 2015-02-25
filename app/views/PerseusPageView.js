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
		
		initialize: function(){
			var self = this;
			self.page = new PerseusPage( "urn:cts:greekLit:tlg0003.tlg001.perseus-eng6:4" );
			self.bindState( 'PerseusPage:success', self.render, self )
		},
		
		render: function(){
			var self = this;
			
			// render content and append to parent
			
			self.renderTemplate( { out: self.page.out } );
		}
	});
});