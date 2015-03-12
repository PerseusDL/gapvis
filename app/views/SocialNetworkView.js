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
      	    view.bindState( 'change:pageid', view.render, view );
						this.on( 'render', this.viz );
      	},
				
				
				// render page
				
				render: function(){
          var view = this;
					
          // render content and append to parent
					
          view.renderTemplate();
					this.trigger( 'render' );
					return view;
				},
				
				
				// start the visualization
				
				viz: function(){
					var graph = 'data/gapvis/network.json';

					var w = 960,
							h = 700,
							r = 10;

					var vis = d3.select(".graph")
						.append("svg:svg")
						.attr("width", w)
						.attr("height", h)
						.attr("pointer-events", "all")
						.append('svg:g')
						.call(d3.behavior.zoom().on("zoom", redraw))
						.append('svg:g');

					vis.append('svg:rect')
					    .attr('width', w)
					    .attr('height', h)
					    .attr('fill', 'rgba(1,1,1,0)')

					function redraw() {
						vis.attr( "transform","translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")"); }	
	
						var force = d3.layout.force()
							.gravity( .05 )
							.charge( -200 )
							.linkDistance( 60 )
							.size([w, h]);
	
						var svg = d3.select(".text").append("svg")
							.attr("width", w)
							.attr("height", h);
		
						d3.json( graph, function( json ){
							var link = vis.selectAll("line")
								.data(json.links)
								.enter()
								.append("line")
	
								.attr("stroke-opacity", 
								function(d){ 
									if (d.label == 'is a') { 
										return '0.8'
									} 
									else { 
										return '0.2'
									}; 
								})
								
								.attr("stroke-color", "#222")
				
								.attr("stroke-width","6")
				
								.style("stroke", 
								function(d){ 
									if ( d.color !== null ){ 
										return d.color
									}
								})
			
								.on("mouseover", 
								function(){
									d3.select(this)
										.style("stroke", "#999999")
										.attr("stroke-opacity", "1.0");
								})
			
								.on("mouseout", 
								function(){
									d3.select(this)
									.style("stroke", 
									function(d){ 
										if (d.color !== null){ 
											return d.color
										}
									})
									
									.attr("stroke-opacity", 
									function(d){ 
										if(d.label == 'is a'){ 
											return '0.8'
										} 
										else { 
											return '0.2'
										}
									})
								});

								link.append("title").text(
								function(d){ 
									return d.label 
								});			

								var node = vis.selectAll("g.node")
								.data(json.nodes)
								.enter().append("svg:g")
								.attr("class","node")
								.call(force.drag);
			
								node
								.append("svg:circle")
								
								.attr("r", 
								function(d) {
									if ( d.size > 0 ) { 
										return 10 + ( d.size*2 )
									} 
									else { 
										return 10
									}
								})
								
								.style("fill", 
								function(d){ 
									if ( d.style == 'filled' ){ 
										return d.color
									}
								})
								
								.style("stroke", 
								function(d){ 
									if(d.style !== 'filled'){ 
										return d.color
									}
								})
								
								.style("stroke-width", "4")
								
								.on("mouseover", 
								function(){ 
									d3.select(this).style("fill", "#999")
								})
								
								.on("mouseout", 
								function(d) {
									if (d.style == 'filled') { 
										d3.select(this).style("fill",d.color); 
									}
									else {
										d3.select(this).style("stroke",d.color);
										d3.select(this).style("fill","black");
									} 
								});
				
								node.append("svg:text")
									.attr("text-anchor", "middle") 
									.attr("fill","white")
									.style("pointer-events", "none")
								
									.attr("font-size", 
									function( d ){ 
										if ( d.color == '#b94431' ){ 
											return 10+(d.size*2) + 'px'
										} 
										else { 
											return "9px"
										} 
									})
									
									.attr("font-weight", 
									function( d ) { 
										if ( d.color == '#b94431' ){ 
											return "bold"
										} 
										else { 
											return "100" 
										} 
									})
									
									.text( 
									function( d ){ 
										if ( d.color == '#b94431' ){ 
											return d.id + ' (' + d.size + ')'
										} 
										else {
											return d.id
										} 
									});
				
									node.append("title").text(
									function( d ){ 
										return d.URI 
									});

							force
								.nodes(json.nodes)
								.links(json.links)
								.on("tick", tick)
								.start();
			
					  function tick() {
					    node.attr("cx", function(d) { return d.x; })
					        .attr("cy", function(d) { return d.y; })
							.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")";});

					    link.attr("x1", function(d) { return d.source.x; })
					        .attr("y1", function(d) { return d.source.y; })
					        .attr("x2", function(d) { return d.target.x; })
					        .attr("y2", function(d) { return d.target.y; });
					  }
					});
				}
    });
    
});