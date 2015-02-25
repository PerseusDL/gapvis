/*
 * Perseus Page View
 */
define([
'gv', 
'views/BookView',
'models/PerseusPage' ], 
function( gv, BookView, PerseusPage ) {
	var state = gv.state;
	
	// View: Perseus Page View
	
	return BookView.extend({
		className: 'perseus-page-view',
		template: '#perseus-page-template',
		initialize: function(){
			var view = this;
			view.page = new PerseusPage( "urn:cts:greekLit:tlg0003.tlg001.perseus-eng6:4" );
			view.page.on( 'perseus_page:load', view.render )
		},
		render: function(){
			var view = this;
			
			console.log( view );
			
			// render content and append to parent
			
			view.renderTemplate();
			return view;
		}
	});
    
});