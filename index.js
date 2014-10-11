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

	serverMiddleware: function(/*config*/) {
		browserSync({
			reloadDelay: 10,
			notify: false,
			open: false,
			injectChanges: true,
			proxy: config.options.host + ':' + config.options.port || 4200
		});
	},

	postBuild: function (/*results*/) {
		this.project.liveReloadFilterPatterns = [/(\.+(js|html|json|hbs)$)/g]

		if (!cssPathsChanged.length) {
			return false;
		}

		console.log(cssPathsChanged);

		browserSync.reload(cssPathsChanged);

		cssPathsChanged = [];
	}
};
