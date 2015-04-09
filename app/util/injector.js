define(["models/Pages"], function(Pages) {
    var dic = {
        "pages" : Pages
    }
    return function(dep) {
        return dic[dep];
    }
});