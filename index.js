var browserSync = require("browser-sync");
module.exports = {
  name: 'ember-cli-browser-sync',
  serverMiddleware: function(config) {
    var app = config.app,
      options = config.options;
      // browserSync;

    // if (options.browserSync !== true) { return; }

    // var browserSync = require("browser-sync");

    options.liveReload = false;
    browserSync({
        // server: {
        reloadDelay: 10,
        notify: false,
        proxy: "gamebreeze-lm.yahoo-inc.com:4200"
        // }
    });

    // app.use(browserSync({
    //   // port: options.liveReloadPort
    // }));

    console.log('sups');

  },
  postBuild: function(config) {

    console.log(config);
    browserSync.reload("app.css");
  }
  // ,

  // shouldUseMiddleware: function() {
  //   var version = this.project.emberCLIVersion();
  //   var portions = version.split('.');
  //   portions = portions.map(function(portion) {
  //     return Number(portion.split('-')[0]);
  //   });
  //
  //   if (portions[0] > 0) {
  //     return false;
  //   } else if (portions[1] > 0) {
  //     return false;
  //   } else if (portions[2] > 46) {
  //     return false;
  //   } else {
  //     return true;
  //   }
  // }
};
