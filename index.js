var browserSync    = require('browser-sync'),
	BroccoliFilter = require('broccoli-filter');

// yes, ghetto.  need to talk to robert jackson
// to see if there is a better way of doing this
var cssPathsChanged = [];

function RegistryPlugin(inputTree) {
	if (!(this instanceof RegistryPlugin)) {
		return new RegistryPlugin(inputTree);
	}

	this.inputTree = inputTree;
}

RegistryPlugin.prototype = Object.create(BroccoliFilter.prototype);
RegistryPlugin.prototype.constructor = RegistryPlugin;
RegistryPlugin.prototype.extensions = ['css'];
RegistryPlugin.prototype.targetExtension = 'css';
RegistryPlugin.prototype.processString = function(str, relativePath) {
	cssPathsChanged.push(relativePath);
	return str;
};


module.exports = {
	name: 'ember-cli-browser-sync',

	// compileStyles: function () {
	// 	return this._super.compileStyles.apply(this, arguments);
	// },

	included: function(app) {
		if(app.env !== 'development') {
			return false;
		}

		this._super.included.apply(this, arguments);

		app.registry.add('css', {
			name: 'browser-sync',
			ext: 'css',
			toTree: function(tree) {
				return RegistryPlugin(tree);
			}
		});
	},

	serverMiddleware: function(config) {
		var options = config.options,
			evt = browserSync.emitter;

		options.liveReload = false;

		evt.on('init', function () {
			console.log('BrowserSync is running!');
		});

		browserSync({
			reloadDelay: 10,
			notify: false,
			injectChanges: true,
			proxy: config.options.host + ':' + config.options.port || 4200
		});
	},

	postBuild: function(config) {
		// todo: find a hook to place notifications that a build
		// has started or has failed
		// browserSync.notify("This message will only last a second", 1000);

		if (!cssPathsChanged.length) {
			return false;
		}

		cssPathsChanged.forEach(function (path) { browserSync.reload(path); });
		cssPathsChanged = [];
	}
};
