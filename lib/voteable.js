var methods = {
  voteUp: function () {
    var self = this;

    // Check if user is logged in.
    var currUserId = Meteor.userId();
    if (!currUserId) {
      throw new Error('You have to be logged in to vote');
    }
    // Set default options' values.
    var behavior = self.constructor.schema.behaviors.voteable,
        options = behavior.options;
    // Check if you don't vote on you own document.
    if (!options.voteOnOwnDoc && self[options.docOwnerIdFieldName] === currUserId) {
      throw new Error("You can't vote on you own document");
    }
    var inc = 0,
        index = -1;
    if ((index = self.upVotersIds.indexOf(currUserId)) >= 0) {
      inc--;
      self.upVotersIds.splice(index, 1);
    } else {
      inc++;
      self.upVotersIds.push(currUserId);

      if ((index = self.downVotersIds.indexOf(currUserId)) >= 0) {
        inc++;
        self.downVotersIds.splice(index, 1);
      }
    }
    self.votes += inc;

    return inc;
  },

  voteDown: function () {
    var self = this;

    // Check if user is logged in.
    var currUserId = Meteor.userId();
    if (!currUserId) {
      throw new Error('You have to be logged in to vote');
    }
    // Set default options' values.
    var behavior = self.constructor.schema.behaviors.voteable,
        options = behavior.options;
    // Check if you don't vote on your own document.
    if (!options.voteOnOwnDoc && self[options.docOwnerIdFieldName] === currUserId) {
      throw new Error("You can't vote on you own document");
    }
    var inc = 0,
        index = -1;
    if ((index = self.downVotersIds.indexOf(currUserId)) >= 0) {
      inc++;
      self.downVotersIds.splice(index, 1);
    } else {
      inc--;
      self.downVotersIds.push(currUserId);

      if (self.upVotersIds.indexOf(currUserId) >= 0) {
        inc--;
        self.upVotersIds.splice(index, 1);
      }
    }
    self.votes += inc;

    return inc;
  },

  upVoted: function (userId) {
    var self = this;

    // Check if user is logged in.
    userId = userId || Meteor.userId();
    if (!userId) {
      return false;
    }
    return self.upVotersIds.indexOf(userId) >= 0;
  },

  downVoted: function (userId) {
    var self = this;

    // Check if user is logged in.
    userId = userId || Meteor.userId();
    if (!userId) {
      return false;
    }
    return self.downVotersIds.indexOf(userId) >= 0;
  }
};

Behavior('voteable', {
  options: {
    voteOnOwnDoc: false,
    docOwnerIdFieldName: 'ownerId'
  },

  fields: {
    votes: 0,
    upVotersIds: [],
    downVotersIds: []
  },

  required: {
    votes: 'The "votes" attribute is required',
    upVotersIds: 'The "upVotersIds" attribute is required',
    downVotersIds: 'The "downVotersIds" attribute is required'
  },

  methods: methods
});