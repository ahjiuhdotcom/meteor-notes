import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session';
import PropTypes from 'prop-types';
import {Meteor} from 'meteor/meteor';
import { browserHistory } from 'react-router';
import { Notes } from '../api/notes';

export class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      body: ''
    };
  };

  handleTitleChange(e) {
    const title = e.target.value;
    this.setState({title});
    this.props.call('notes.update', this.props.note._id, {
      title
      // title: e.target.value
    });
  };

  handleBodyChange(e) {
    const body = e.target.value;
    this.setState({body});
    this.props.call('notes.update', this.props.note._id, {
      body
      // body: e.target.value
    });
  };

  handleRemoval() {
    this.props.call('notes.remove', this.props.note._id);
    this.props.browserHistory.push('/dashboard');
  }

  componentDidUpdate(prevProps, prevState) {
    const currentNodeId = this.props.note ? this.props.note._id : undefined;
    const prevNoteId = prevProps.note? prevProps.note._id : undefined;

    // This checking to ensure that only set the props if there is 'note' in current state (not empty note)
    // and user has switch between different note (if there is no switching note happen,
    // we expect handleXxxChange(e) to handle render the value to the input field)
    if (currentNodeId && currentNodeId !== prevNoteId) {
      this.setState({
        title: this.props.note.title,
        body: this.props.note.body
      });
    }

  }

  render() {
    if (this.props.note) {
      return (
          <div className="editor">
            <input className="editor__title" value={this.state.title} placeholder="Your title here" onChange={this.handleTitleChange.bind(this)} />
            <textarea className="editor__body" value={this.state.body} placeholder="Your note here" onChange={this.handleBodyChange.bind(this)}></textarea>
            <div>
              <button className="button button--secondary" onClick={this.handleRemoval.bind(this)}>Delete Note</button>
            </div>
          </div>
      );
    } else {
      return (
        <div className="editor">
          <p className="editor__message">
            {this.props.selectedNoteId ? 'Note not found.' : 'Pick or create a note to get started.'}
          </p>
        </div>
      );
    };
  };
};

Editor.propTypes = {
  note: PropTypes.object,
  selectedNoteId: PropTypes.string,
  call: PropTypes.func.isRequired,
  browserHistory: PropTypes.object.isRequired
};

export default createContainer (() => {
    const selectedNoteId = Session.get('selectedNoteId');

    return {
      selectedNoteId,
      note: Notes.findOne(selectedNoteId),
      call: Meteor.call,
      browserHistory
    }
}, Editor);

/*
Originally, input filed use props to update its value: <input value={this.props.title} />
whenever there is change in value, we need to update
the props then re-render the value to the screen. This process take time (xx ms)
and create a bug where if we type in the middle of the sentence, whenver every stroke we key in,
the curser will automatic move to the end. This is because the slight lagging time took
to update the props, and the input tag treat it it as rendering a new data
To solve this, we need to use <input value={this.state.title} /> which update the input
value instantly and maintain the cursor position
Detatils refer to video "Removing Notes"
*/
