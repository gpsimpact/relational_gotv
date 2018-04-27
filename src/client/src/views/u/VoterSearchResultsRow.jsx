import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { parse, differenceInYears } from 'date-fns';
import AssociateVoterButton from './AssociateVoterButton';

class VoterSearchResultsRow extends PureComponent {
  render() {
    const { content } = this.props;
    return (
      <div>
        <nav className="level">
          <div className="level-left">
            <div className="level-item">
              <div className="content">
                <strong>
                  {content.first_name} {content.last_name}
                </strong>
                <br />
                <small>
                  {content.home_address} - {content.city}, {content.state} {content.zip} -{' '}
                  {differenceInYears(new Date(), parse(content.dob))} years old
                </small>
              </div>
            </div>
          </div>
          <div className="level-right">
            <div className="level-item">
              <AssociateVoterButton
                pv_id={this.props.pv_id}
                voter_id={content.state_file_id}
                close_modal={this.props.close_modal}
              />
            </div>
          </div>
        </nav>
        <hr />
      </div>
    );
  }
}

VoterSearchResultsRow.propTypes = {
  content: PropTypes.object.isRequired,
  pv_id: PropTypes.string.isRequired,
  close_modal: PropTypes.func.isRequired,
};

export default VoterSearchResultsRow;
