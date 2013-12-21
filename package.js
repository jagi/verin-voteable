Package.describe({
  summary: 'Voteable behavior for Meteor\'s Verin Model package'
});

Package.on_use(function (api) {
  api.use('handlebars', 'client');
  api.use([
    'accounts-base',
    'verin-model'
  ], ['client', 'server']);
  
  api.add_files('lib/client/helpers.js', 'client');
  api.add_files('lib/voteable.js', ['client', 'server']);
});