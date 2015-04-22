/*
 * Citations View
 */
define([
'gv', 
'views/BookView', 
'util/slide'], 
function( gv, BookView, slide ) {
    var state = gv.state;
    // View: SocialNetworkView 
    
    return BookView.extend({
        className: 'citations-view',
        template: '#citations-template',
      
      
        // initialize
      
        initialize: function(){
            var view = this;
            view.bindState( 'change:pageid', view.render, view );

            view.ready(function() {
                view.render();
            });
        },
        
        
        // render page
        render: function(){
            var view = this;
            // render content and append to parent
            view.renderTemplate();
            view.trigger( 'render' );
            return view;
        },
        renderTemplate: function( context ){
          var view = this,
              book = view.model,
              template = _.template( view.template ),
              context = context || view.model.toJSON(),
              page = book.pages.get(state.get("pageid")),
              citations = []

              context.citations.forEach(function(citation) {
                if((page.get("citations") || []).indexOf(citation.id) >= 0) {
                  citations.push(book.citations.get(citation.id).toJSON())
                }
                //return citation;
              });

              if(citations.length === 0) {
                view.$el.hide();
                return;
              } else {
                view.$el.show();
              }

              citations.map(function(citation) { 
                citation.text = citation.text.replace(citation.sourceSelector.current, "<b>" + citation.sourceSelector.current + "</b>")
                return citation;
              });

          $( view.el ).html( template({ citations : citations}) );
        },
    });
});