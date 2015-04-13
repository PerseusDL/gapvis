define(function() {
  var reg = new RegExp(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g)
  return function (str) {
    return str.replace(reg, "\\$&");
  }
})