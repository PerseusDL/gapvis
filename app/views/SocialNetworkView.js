/*
 * Social Network View
 */
define(['gv', 'views/BookView'], 
function( gv, BookView ) {
    var state = gv.state;
		console.log( 'inside!' );
    
    // View: SocialNetworkView 
		//
		
    return BookView.extend({
        className: 'social-network-view',
				template: '#social-network-template',
				render: function(){
          var view = this;
					
          // render content and append to parent
					
          view.renderTemplate();
					return view;
				}
    });
    
});