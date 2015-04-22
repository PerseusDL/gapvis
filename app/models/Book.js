/*
 * Book model
 */
define([
    'gv', 
    'models/Model', 
    //Should find another way to retrieve them dynamically :
    'models/Places',
    'models/Pages',
    'models/Persons',
    'models/Annotator',
    'models/Citations'
  ], 
  function(gv, Model, Places, Pages, Persons, Annotations) {
  
  var settings = gv.settings;
     
  // Model: Book
  return Model.extend({
    type: 'book',
    
    defaults: {
      title: "Untitled Book",
      author: "Unnamed Author",
      printed: "?"
    },

    /**
     * ready is a function to retrieve data from endpoints. 
     *   This is used by view to know when all data are available for a model.
     *   
     * @param  {function} loadCallback    Callback, no data passed to it
     * @param  {function} immediateCallback Callback (?), no data passed to it
     */
    ready: function(id, loadCallback, immediateCallback ){
      var model = this,
        immediateCallback = immediateCallback || loadCallback;

      if(typeof model.queue === "undefined") {
        model.queue = {}
        model.on('ready', function() {
            _.each(Object.keys(model.queue), function(id) {
                model.queue[id]();
            });
        });
      }
      if ( !model.isFullyLoaded() ){
          // Legacy was : Ready should be called when all data are available
          // Ready is actually now call back ready up to when everything is loaded !
          if(!model.queue[id]) {
              model.queue[id] = function() {
                model.ready(loadCallback, immediateCallback) 
              };
          }
          // fetch model, avoiding multiple simultaneous calls
          // We also check that we have loaded all dependencies
          if ( !model._fetching || model._fetched.length !== model.requiredData.length ){
            if(typeof model._fetching === "undefined") {
              model._fetching = {};
            }
            if(typeof model._fetched === "undefined") {
              model._fetched = {};
            }
            // If we didn't fetch the data of model.book, 
            // represented by self in the injections.
            if(!model._fetching["self"] && !model._fetched["self"]) {
              model._fetching["self"] = true;
              model.fetch({ 
                success: function() {
                  model._fetched["self"] = true;
                  model.trigger('ready');
                  model._fetching["self"] = false;
                },
                error: function() {
                  gv.state.set({ 
                    message: {
                      text: 'Error: Could not get data for the ' + model.type +
                        ' with ID ' + model.id,
                      type: 'error'
                    }
                  });
                }
              });
            }
            //Then we fetch all required data for injected dependecies
            _.each(model.injections, function(injected) {
                if(!model._fetching[injected] && !model._fetched[injected]) {
                  model._fetching[injected] = true;
                  model[injected].fetchNew({ 
                    success: function() {
                      model._fetched[injected] = true;
                      model.trigger('ready');
                      model.trigger("ready." + injected)
                      model._fetching[injected] = false;
                    },
                    error: function() {
                      gv.state.set({ 
                        message: {
                          text: 'Error: Could not get data for the ' + model.type +
                            ' with ID ' + model.id,
                          type: 'error'
                        }
                      });
                    }
                  });
                }
            }); 
        }
      } else {
        if(DEEP_DEBUG) console.log("(Model.Book) Book with dependencies loaded")
        model.onReady(immediateCallback);
      }
    },

    /**
     * Rewritten toJSON function to take into account dependencies
     * @return {Object.<string, Any>} A simple object without functions
     */
    toJSON : function() {
        var model  = this,
            json = {},

        json = _.clone(model.attributes);
        _.each(model.injections, function(key) {
            json[key] = model[key].toJSON();
        });
        return json;
    },
    
    /**
     * isFullyLoaded tells us for each information if data is available.
     * @return {Boolean} Indicator of loading
     */
    isFullyLoaded: function() {
      return !!(typeof this._fetched !== "undefined" && Object.keys(this._fetched).length === this.requiredData.length);
    },
    
  });
  
});