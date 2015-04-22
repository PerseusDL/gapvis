define(function() {

    return function(page, annotations) {
        if(!page.get("annotators")) {
            page.set({"annotators" : []})
        }
        var mergeAnnotators = _.map(annotations, function(anno) {
            return anno.annotators;
        })
        mergeAnnotators.push(page.get("annotators", []))
        mergeAnnotators = _.compact(_.uniq(_.flatten(mergeAnnotators)))

        page.set({"annotators" : mergeAnnotators})
    }
})