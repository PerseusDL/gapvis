/*
 * Annotators View
 */
define([
  'gv', 
  'views/BookView', 
  'util/slide'
], 
function( gv, BookView, slide ) {
    var state = gv.state;
    
    return BookView.extend({
        className: 'annotators-view',
        template: '#annotators-template',
      
      
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
              annotators = page.get("annotators", []);

              if(annotators.length === 0) {
                view.$el.hide();
                return;
              } else {
                view.$el.show();
              }

          $( view.el ).html( template({ annotators : annotators}) );
        },
    });
});