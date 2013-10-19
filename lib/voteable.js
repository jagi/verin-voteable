var voteUp = function () {
  // Check if user is logged in.
  var currUserId = Meteor.userId();
  if (!currUserId) {
    throw new Error('You have to be logged in to vote');
  }
  // Set default options' values.
  var options = this._definition._behaviours.voteable._options;
  options.voteOnOwnDoc = options.voteOnOwnDoc || false;
  options.docOwnerIdFieldName = options.docOwnerIdFieldName || 'ownerId';
  // Check if you don't vote on you own document.
  if (!options.voteOnOwnDoc && this[options.docOwnerIdFieldName] === currUserId) {
    throw new Error("You can't vote on you own document");
  }
  var inc = 0,
      index = -1;
  if ((index = this.upVotersIds.indexOf(currUserId)) >= 0) {
    inc--;
    this.upVotersIds.splice(index, 1);
  } else {
    inc++;
    this.upVotersIds.push(currUserId);

    if ((index = this.downVotersIds.indexOf(currUserId)) >= 0) {
      inc++;
      this.downVotersIds.splice(index, 1);
    }
  }
  this.votes += inc;
  return inc;
};

var voteDown = function () {
  // Check if user is logged in.
  var currUserId = Meteor.userId();
  if (!currUserId) {
    throw new Error('You have to be logged in to vote');
  }
  // Set default options' values.
  var options = this._definition._behaviours.voteable._options;
  options.voteOnOwnDoc = options.voteOnOwnDoc || false;
  options.docOwnerIdFieldName = options.docOwnerIdFieldName || 'ownerId';
  // Check if you don't vote on your own document.
  if (!options.voteOnOwnDoc && this[options.docOwnerIdFieldName] === currUserId) {
    throw new Error("You can't vote on you own document");
  }
  var inc = 0,
      index = -1;
  if ((index = this.downVotersIds.indexOf(currUserId)) >= 0) {
    inc++;
    this.downVotersIds.splice(index, 1);
  } else {
    inc--;
    this.downVotersIds.push(currUserId);

    if (this.upVotersIds.indexOf(currUserId) >= 0) {
      inc--;
      this.upVotersIds.splice(index, 1);
    }
  }
  this.votes += inc;
  return inc;
};

var upVoted = function () {
  // Check if user is logged in.
  var currUserId = Meteor.userId();
  if (!currUserId) {
    return false;
  }
  var options = this._definition._behaviours.voteable._options;
  return this.upVotersIds.indexOf(currUserId) >= 0;
};

var downVoted = function () {
  // Check if user is logged in.
  var currUserId = Meteor.userId();
  if (!currUserId) {
    return false;
  }
  var options = this._definition._behaviours.voteable._options;
  return this.downVotersIds.indexOf(currUserId) >= 0;
};

Voteable = Behaviour('voteable', function () {
  this.fields({
    votes: 0,
    upVotersIds: [],
    downVotersIds: []
  });

  this.required({
    votes: 'The `votes` attribute is required',
    upVotersIds: 'The `upVotersIds` attribute is required',
    downVotersIds: 'The `downVotersIds` attribute is required'
  });

  this.methods({
    voteUp: voteUp,
    voteDown: voteDown,
    upVoted: upVoted,
    downVoted: downVoted
  });
});