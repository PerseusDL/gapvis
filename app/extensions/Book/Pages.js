/**
 * This functions provide the Pages related function to a model if required.
 * @param  {[type]} ) {               return function() {    }} [description]
 * @return {[type]}   [description]
 */
define(function() {
    return function() {
        return {
            // array of page labels for timemap      
            labels: function() {
                // if(this.supportsSections()){
                //   var book = this;
                //   return this.pages.map(function(p) { return book.pageIdToRef(p.id).label });
                // }
              return this.pages.map(function(p) { return (p.label) ? p.label : p.id });
            },
            
            // next/prev ids
            nextPrevId: function(pageId, prev) {
              var pages = this.pages,
                currPage = pages.get(pageId),
                idx = currPage ? pages.indexOf(currPage) + (prev ? -1 : 1) : -1,
                page = pages.at(idx)
              return page && page.id;
            },
            
            // next page id
            nextId: function(pageId) {
              return this.nextPrevId(pageId);
            },
            
            // previous page id
            prevId: function(pageId) {
              return this.nextPrevId(pageId, true);
            },
            
            // first page id
            firstId: function() {
              var first = this.pages.first()
              return first && first.id;
            },

            supportsSections: function(){
              return (typeof this.attributes.sections !== 'undefined');
            },
            
            pageIdToRef: function(pageId){
              var book = this;
              // setup ref attribute
              if(book.supportsSections()){
                var sections = book.attributes.sections;
                var section = "";
                var fp = 0;
                var pageInSection = 0;
                for(var i in sections){
                  i = parseInt(i);
                  if(
                    (parseInt(sections[i].firstPage) == parseInt(pageId) ) ||
                      (
                      (parseInt(sections[i].firstPage) < parseInt(pageId) && ( (typeof sections[i+1] === 'undefined') || parseInt(sections[i+1].firstPage) > parseInt(pageId) )
                      )
                    )
                  ){
                    section = sections[i].section;
                    fp = parseInt(sections[i].firstPage);
                    pageInSection = (parseInt(section)>1)?(parseInt(pageId) - (parseInt(fp) - 1)):parseInt(pageId);
                    break;
                  }
                }
                return {
                  section: section,
                  page: pageInSection,
                  pageId: pageId,
                  label: section + "." + pageInSection
                }
              }
            },
            refToPageId: function(ref){
              var book = this;
              
              // setup ref attribute
              if(typeof book.attributes.sections !== 'undefined'){
                
                var ref = ref.split(".");
                var section = parseInt(ref[0]);
                var pageInSection = parseInt(ref[1]);
                // We don't accept a page = 0
                if(pageInSection == 0){
                  return;
                }
                if(section === 1) return new String(pageInSection);
                
                var sections = book.attributes.sections;
                for(var i in sections){
                  i = parseInt(i);
                  if(
                    (parseInt(section) == parseInt(sections[i].section) ) ){
                      return new String(parseInt(sections[i].firstPage) + pageInSection -1);
                    break;
                  }
                }
              }
            }
        }
    }
})