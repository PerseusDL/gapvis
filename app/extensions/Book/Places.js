/**
 * This functions provide the Places related function to a model if required.
 * @param  {[type]} ) {               return function() {    }} [description]
 * @return {[type]}   [description]
 */
define(function() {
    return function() {
        return {
            initplaces : function(callback) {
              if(this._initiated["places"]) return true;
              var pages = this.pages,
                  places = this.places;
              if(DEBUG) console.log("(Book.Places) Init.Places ...")
              // calculate frequencies of place in all pages
              // 
              pages.each(function(page) {
                  page.get('places').forEach(function(placeId) {
                      var place = places.get(placeId),
                          freq = place.get('frequency');
                      place.set({ frequency: freq+1 })
                  });
              });
              places.sort();
              this._initiated["places"] = true;
              if(callback) callback();
            },
            // array of items for timemap
            timemapItems: function(startId, endId) {
              var book = this,
                items = [],
                pages = book.pages,
                startIndex = startId ? pages.indexOf(pages.get(startId)) : 0,
                endIndex = endId ? pages.indexOf(pages.get(endId)) : pages.length;
              // Slice is non inclusive for the end-element !
              pages.models.slice(startIndex, endIndex)
                .forEach(function(page) {
                  console.log(page)
                  var places = _.uniq(page.get('places'));
                  places.forEach(function(placeId) {
                    var place = book.places.get(placeId),
                      ll = place.get('ll');
                    items.push({
                      title: place.get('title'),
                      point: {
                        lat: ll[0],
                        lon: ll[1]
                      },
                      options: {
                        place: place,
                        page: page
                      }
                    });
                  });
                });
              return items;
            },
            
            // bounding box for places, returned as {s,w,n,e}
            bounds: function() {
              // get mins/maxes for bounding box
              var lat = function(ll) { return ll[0] },
                lon = function(ll) { return ll[1] },
                points = _(this.places.pluck('ll'));        
              // if( DEBUG ) console.log("Points", points);
              var bnds = {
                s: lat(points.min(lat)),
                w: lon(points.min(lon)),
                n: lat(points.max(lat)),
                e: lon(points.max(lon))
              }
              // if( DEBUG ) console.log("Computed Bounding for box places", bnds);
              // We do not allow values not in 
              // s: -90, w: -180, n: 90, e: 180
              if(bnds.s <= -90 || bnds.s >= 90 || bnds.s >= bnds.n ) bnds.s = -90;
              if(bnds.w <= -180 ) bnds.w = -180.0;
              if(bnds.n >= 90 || bnds.n <= -90 ) bnds.n = 90.0;
              if(bnds.e >= 180 ) bnds.e = 180.0;
              // if( DEBUG ) console.log("Bounding for box places", bnds);
              return bnds;
            },
            
            // return a google maps API bounding box
            gmapBounds: function() {
              if (DEBUG && !window.google) return;
              var gmaps = google.maps,
                placeBounds = this.bounds();
              return new gmaps.LatLngBounds(
                new gmaps.LatLng(placeBounds.s, placeBounds.w),
                new gmaps.LatLng(placeBounds.n, placeBounds.e)
              );
            },
            // next/prev place references
            nextPrevPlaceRef: function(pageId, placeId, prev) {
              var pages = this.pages,
                currPage = pages.get(pageId);
              if (currPage) {
                var idx = pages.indexOf(currPage),
                  test = function(page) {
                    var places = page.get('places');
                    return places.indexOf(placeId) >= 0;
                  },
                  increment = function() { idx += (prev ? -1 : 1); return idx };
                while (currPage = pages.at(increment(idx))) {
                  if (test(currPage)) {
                    return currPage.id;
                  }
                }
              }
            },
            
            // next page id
            nextPlaceRef: function(pageId, placeId) {
              return this.nextPrevPlaceRef(pageId, placeId);
            },
            
            // previous page id
            prevPlaceRef: function(pageId, placeId) {
              return this.nextPrevPlaceRef(pageId, placeId, true);
            }
        }
    }
})