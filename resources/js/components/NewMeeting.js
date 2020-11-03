import React, {Component} from 'react';
import Form from 'react-bootstrap/Form'
import Moment from 'moment';
import momentLocalizer from "react-widgets-moment";
import DateTimePicker from 'react-widgets/lib/DateTimePicker'
import DropdownList from 'react-widgets/lib/DropdownList'
import {Button, Col, Modal, Alert} from "react-bootstrap";
// Add the css styles...
import "react-widgets/dist/css/react-widgets.css";

Moment.locale("en");
momentLocalizer();

const today = Moment();

class NewMeeting extends Component {
    constructor() {
        super();
        this.state = {
            topic: '',
            dateTime: new Date().toISOString(),
            duration: 0,
            requester: '',
            showSubmit: false,
            showWarning: false,
        }
    }

    render() {
        const handleClose = () => {
            this.setState({
                showSubmit: false
            })
        }

        const handleOpen = () => {
            this.setState({
                showSubmit: true
            })
        }

        const handleWarning = () => {
            this.setState({
                showWarning: true
            })
        }

        const handleSubmit = () => {
            fetch('/api/create', {
                method: 'POST',
                credentials: 'same-origin',
                body:JSON.stringify(
                    this.state
                ),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            })
            .then(function(response) {
                response.json().then(function(resp){
                    console.log(resp)
                    window.location.reload()
                })
            })
                .catch()
        }

        return(
            <Form className="initial-content">
                {this.state.showWarning ? (
                    <Alert variant="danger" onClose={() => {this.setState({showWarning: false})}} dismissible>
                        **ALERT**  You need to fill the empty fields in order to continue submission.
                    </Alert>
                ) : ''}

                {/*Meeting Name*/}
                <Form.Group as={Form.Row} controlId="formTopic">
                    <Form.Label column sm={2}>Topic</Form.Label>
                    <Col sm={10}>
                        <Form.Control onChange={(input) =>
                        {
                            this.setState({
                                topic: input.target.value
                            })
                        }
                        } placeholder="Ex. Boston Meeting"/>
                    </Col>
                </Form.Group>

                {/*Date and Time*/}
                <Form.Group as={Form.Row} controlId="formDateandTime">
                    <Form.Label column sm={2}>Date/Time</Form.Label>
                    <Col sm={10}>
                        <DateTimePicker defaultValue={new Date()} onChange={(date) => {
                            this.setState({
                                dateTime: date.toISOString()
                            })
                        }} min={new Date()}/>
                    </Col>
                </Form.Group>

                {/*Duration*/}
                <Form.Group as={Form.Row} controlId="formDuration">
                    <Form.Label column sm={2}>Duration (Hrs)</Form.Label>
                    <Col sm={2}>
                        <DropdownList data={[1,2,3,4,5]} onChange={(number) => {
                            this.setState({
                                duration: number,
                            })
                        }}/>
                    </Col>
                </Form.Group>

                <Form.Group as={Form.Row} controlId="formName">
                    <Form.Label column sm={2}>Full Name</Form.Label>
                    <Col sm={10}>
                        <Form.Control onChange={(input) =>
                        {
                            this.setState({
                                requester: input.target.value
                            })
                        }
                        } placeholder="Ex. John Doe"/>
                    </Col>
                </Form.Group>

                <Button variant="outline-primary" onClick={((this.state.topic.trim() == "") || (this.state.requester.trim() == "") || (this.state.duration <= 0)) ? handleWarning : handleOpen} style={{width: '25%', marginTop: '5%'}}>Schedule</Button>
                <Modal show={this.state.showSubmit} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm Create</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>You're about create a Zoom meeting. Are you sure?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleSubmit}>
                            Create
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Form>
        );
    }
}

export default NewMeeting;
