import {Component} from "react";
import PropTypes from 'prop-types';
import {Col, Image, Row} from "react-bootstrap";
import style from "./message.module.css"

export class MessageComponent extends Component {
    static propTypes = {
        authorName: PropTypes.string.isRequired,
        authorIcon: PropTypes.instanceOf(URL).isRequired,
        message: PropTypes.string.isRequired
    }

    constructor(props) {
        super(props);

        this.state = {
            showClass: style.messageShown
        }
    }

    render() {
        return <Row className={`${style.message} ${this.state.showClass}`}>
            <Col xs="auto">
                <Image roundedCircle style={{height: "50px"}} src={this.props.authorIcon}/>
            </Col>
            <Col>
                <span><b>{this.props.authorName}:</b> {this.props.message}</span>
            </Col>
        </Row>
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({showClass: style.messageHidden})
        }, 10000)
    }
}
