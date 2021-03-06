// @flow
import { Meteor } from 'meteor/meteor';
import { Sessions } from '/imports/api/sessions';

function sessionJoin(slug: string) {
  const user = Meteor.users.findOne(this.userId);
  if (user.joinedSessions && user.joinedSessions.includes(slug)) {
    return { result: 'success' };
  }
  const session = Sessions.findOne({ slug }, { sort: { startedAt: -1 } });
  if (!session) {
    return { result: 'error', message: 'No such session' };
  }
  if (session.tooLate) {
    return { result: 'error', message: 'Too late' };
  }

  Meteor.users.update(this.userId, { $push: { joinedSessions: slug } });
  Meteor.call('ensure.reactive', session._id, this.userId);
  return { result: 'success' };
}

Meteor.methods({ 'session.join': sessionJoin });
