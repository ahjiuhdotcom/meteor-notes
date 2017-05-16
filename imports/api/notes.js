import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import SimpleSchema from 'simpl-schema';

export const Notes = new Mongo.Collection('notes');

if (Meteor.isServer) {
  Meteor.publish('notes', function() {
    return Notes.find({userId: this.userId});
  });
}

Meteor.methods({
  'notes.insert'() {
    if(!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    return Notes.insert({
      title: '',
      body: '',
      userId: this.userId,
      updatedAt: moment().valueOf()
    });
  },
  'notes.remove'(_id) {
    if(!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    try {
      new SimpleSchema({
        _id: {
          type: String,
          min: 1
        }
      }).validate({_id});

    } catch (e) {
      throw new Meteor.Error(400, e.message);
    }

    return Notes.remove({ _id, userId: this.userId });
  },
  // 'updates' is an object
  'notes.update'(_id, updates) {
    if(!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    try {
      // Not only validate '_id', 'title', 'body',
      // but also validate if there is any extra malicious argument pass in
      // that's why using spread operator '...updates' in validation
      // '...updates': title, body, xxx, yyy etc malicious argument
      new SimpleSchema({
        _id: {
          type: String,
          min: 1
        },
        title: {
          type: String,
          optional: true
        },
        body: {
          type: String,
          optional: true
        }
      }).validate({
        _id,
        ...updates
      });

    } catch (e) {
      throw new Meteor.Error(400, e.message);
    }

    Notes.update({
      _id,
      userId: this.userId
    }, {
      $set: {
          updatedAt: moment().valueOf(),
          ...updates
      }
    });

  }
});
