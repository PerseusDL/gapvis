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
      
      
        // initialize
      
        initialize: function(){
            var view = this;
            view.bindState( 'change:pageid', function() {
              view.render.call(view)
            });
            view.on( 'render', 
              function() {
                if(gv.state.get('view') === "book-summary") {
                  view.viz();
                } else {
                  console.log(state.get( 'pageid' ), view.model)
                  view.viz(state.get( 'pageid' )) 
                }
             }
            );
        },
        
        
        // render page
        render: function(){
            var view = this;
            // render content and append to parent
            view.renderTemplate();
            view.trigger( 'render' );
            return view;
        },
        
        viz: function(page){
          $("body").on("click", "a[data-person-id]", function(e) {
              e.preventDefault();
              var person = $(this).attr("data-person-id"),
                  labels = $("text.label"),
                  target = $("text.label[data-person-id='"+ person + "']");

              $("text.label").css("font-size", "");
              target.css("font-size", "larger");
              $('html, body').animate({
                  scrollTop: target.offset().top
              }, 2000);

          });
          var w = $(".right-column").width() - 20,
              h = 300,
              r = 10;
          //We get the graph from the model function
          var view = this,
              graph = view.model.networkpersons(page);
          //
          var color = d3.scale.category20();
          var force = d3.layout.force()
            .gravity( .05 )
            .charge( -200 )
            .linkDistance( 60 )
            .size([w, h]);
          //
          var svg = d3.select(".graph").append("svg:svg")
            .attr("width", w)
            .attr("height", h);

          //Now we start the graph !
          force
            .nodes(graph.nodes)
            .links(graph.links)
            .start();

          var link = svg
              .selectAll(".link")
              .data(graph.links)
              .enter()
              .append("svg:line")
              .attr("class", "link")
              .style("stroke-width", function(d) { return Math.sqrt(d.value); });

          var node = svg
              .selectAll(".node")
              .data(graph.nodes)
              .enter()
              .append("svg:circle")
              .attr("class", "node")
              .attr("r", 5)
              .style("fill", function(d) { return color(d.group); })
              .call(force.drag);

            var texts = svg.selectAll("text.label")
                .data(graph.nodes)
                .enter()
                .append("svg:text")
                .attr("class", "label")
                .attr("fill", "black")
                .text(function(d) {  return d.name;  })
                .attr("data-person-id", function(d) {  return d["@id"];  });
   
          force.on("tick", function() {
            link.attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });

            node.attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; });

            texts.attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")";
            });
          });

        }
    });
});