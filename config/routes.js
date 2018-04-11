// Draw routes.  Locomotive's router provides expressive syntax for drawing
// routes, including support for resourceful routes, namespaces, and nesting.
// MVC routes can be mapped to controllers using convenient
// `controller#action` shorthand.  Standard middleware in the form of
// `function(req, res, next)` is also fully supported.  Consult the Locomotive
// Guide on [routing](http://locomotivejs.org/guide/routing.html) for additional
// information.
module.exports = function routes() {
  this.root('stores#index');
  this.match('/stores', 'stores#index');
  this.match('/stores/search', 'stores#search', { via: "post" });
  this.match('/stores/store', 'stores#store', { via: "post" });
  this.match('/stores/update', 'stores#update', { via: "post" });
  this.match('/stores/delete/:id', 'stores#delete');
}
