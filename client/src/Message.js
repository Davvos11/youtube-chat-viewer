import {Component} from "react";
import PropTypes from 'prop-types';

export class MessageComponent extends Component {
    static propTypes = {
        authorName: PropTypes.string.isRequired,
        authorIcon: PropTypes.instanceOf(URL).isRequired,
        message: PropTypes.string.isRequired
    }

    render() {
        return <div>
            {this.props.authorName}: {this.props.message}
        </div>
    }
}
