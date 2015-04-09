/*
 * Page model
 */
define(['models/Model', 'models/Collection'], function(Model, Collection) {
    var Page;
       
    // Model: Page
    Page = Model.extend({
        type: 'page',
        
        defaults: {
            places: []
        }, 
        
        initialize: function() {
            this.set({
                title:'Page ' + this.id
            });
        },
        
        isFullyLoaded: function() {
            return !!this.get('text'); // FIXME this may not exists if multilang book
        }
    });
    
    // Collection: PageList
    return Collection.extend({
        type: "pages",
        model: Page
    });
    
});