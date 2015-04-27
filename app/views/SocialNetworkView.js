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
            view.bindState('change:pageid', function() {
              view.render.call(view)
            });
            view.bindState('change:view', function() {
              view.render.call(view)
            });
            view.on( 'render', 
              function() {
                if(gv.state.get('view') === "book-summary") {
                  view.viz();
                } else {
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
          $(".social-network-view .graph svg").remove()
          $("body").on("click", "a[data-person-id]", function(e) {
              e.preventDefault();
              var person = $(this).attr("data-person-id"),
                  labels = $("text.label"),
                  target = $("text.label[data-person-id='"+ person + "']");

              $("text.label").css("font-size", "");
              target.css("font-size", "larger");
              $('html, body').animate({
                  scrollTop: target.parent().offset().top
              }, 2000);

          });
          var w = $(".right-column").width() - 20,
              h = 400,
              r = 10;
          //We get the graph from the model function
          var view = this,
              graph = view.model.networkpersons(page);
          if(graph.nodes.length === 0) {
            view.$el.hide();
            return;
          } else {
            view.$el.show();
          }
          var color = d3.scale.category20();
          var force = d3.layout.force()
            .gravity( .05 )
            .charge( -200 )
            .linkDistance( 150 )
            .size([w, h]);
          //
          var svg = d3.select(".graph").append("svg:svg")
            .attr("width", w)
            .attr("height", h)
            .attr("pointer-events", "all")
          .append('svg:g')
            .call(d3.behavior.zoom().on("zoom", redraw))
          .append('svg:g');

          function redraw() {
            svg.attr("transform",
                "translate(" + d3.event.translate + ")"
                + " scale(" + d3.event.scale + ")");
          }

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
              .style("stroke-width", function(d) { return Math.sqrt(d.value); })
              .attr("marker-end", "url(#end)");


          svg.append("svg:defs").selectAll("marker")
            .data(["end"])
          .enter().append("svg:marker")
            .attr("id", String)
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 15)
            .attr("refY", -1.5)
            .attr("markerWidth", 6)
            .attr("markerHeight", 6)
            .attr("orient", "auto")
          .append("svg:path")
            .attr("d", "M0,-5L10,0L0,5");

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
                .attr("data-person-id", function(d) {  return d["@id"];  })
                .attr("data-page", function(d) {
                  if(d.link) {
                    return d.link;
                  } else {
                    return "#"
                  }
                })
                .on("click", function(d) {
                  if(d.link) {
                    state.set({
                      "pageid" : d.link,
                      'view': 'reading-view'
                    })
                  }
                });
   
            var linktext = svg
                .selectAll(".linkLabel")
                .data(graph.links)
                .enter()
                .append("svg:g")
                .attr("class", "linklabelholder")
               .append("svg:text")
               .attr("class", "linklabel")
               .attr("dx", 1)
               .attr("dy", ".35em")
               .attr("text-anchor", "middle")
               .text(function(d) { return d.type.split(":")[1]; });

          force.on("tick", function() {
            link.attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });

            linktext.attr("transform", function(d) {
              return "translate(" + (d.source.x + d.target.x) / 2 + "," + (d.source.y + d.target.y) / 2 + ")"; 
            });

            node.attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; });

            texts.attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")";
            });
          });

        }
    });
});