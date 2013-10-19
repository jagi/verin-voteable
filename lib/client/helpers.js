if (Handlebars) {
  Handlebars.registerHelper('voted', function (votersIds) {
    var userId;
  
    userId = Meteor.userId();
    
    return votersIds && votersIds.indexOf(userId) >= 0 ? 'voted' : '';
  });
}