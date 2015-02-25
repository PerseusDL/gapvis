/*
 * Social Network View
 */
define([
'gv', 
'views/BookView', 
'util/slide'], 
function( gv, BookView, slide ) {
    var state = gv.state;
    
    // View: SocialNetworkView 
		
    return BookView.extend({
        className: 'social-network-view',
				template: '#social-network-template',
      	initialize: function(){
      	    var view = this;
      	    view.bindState( 'change:pageid', view.render, view );
      	},
				render: function(){
          var view = this;
					
          // render content and append to parent
					
          view.renderTemplate();
					return view;
				}
    });
    
});