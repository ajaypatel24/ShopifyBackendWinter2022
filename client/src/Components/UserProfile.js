import React from 'react'
import { Row, Col, CardGroup, Card, Button, Jumbotron,  Modal, Badge, ListGroup } from 'react-bootstrap'
import axios from 'axios'

export default class Profile extends React.Component {
    constructor(props) {
        super(props)

        this.modalShow = this.modalShow.bind(this)
        this.modalHide = this.modalHide.bind(this)
        this.state = {
            showModal: false,
            modaldata: "",
            chosenImage: "",
            s: [],
            user: ""
        }

    }

    expandModal(imgdata) {
        this.setState({
            chosenImage: '/images/' + imgdata[0],
            caption: imgdata[1],
            showModal: true
        })
    }


    handleClose() {
        this.setState({ showModal: false })
    }

    likeImage(image) {
        axios.post("/like/" + image + '/' + this.state.user.username)
            .then(err => console.log(err))

        window.location.reload()
    }

    async componentDidMount() {
        var data = {}
        data["token"] = sessionStorage.getItem("Auth")
        await axios.post("/authenticate/", data)
            .then(res => this.setState({ user: res.data }))

        if (this.state.user === false) {
            window.location.href = "#/"
            return
        }

        await axios.get("/userprofile/" + this.props.match.params.user)
            .then(res => this.setState({ s: res.data }))

    }

    async modalShow(image) {
        this.setState({ modalshow: true })
        this.setState({ modaldata: image })
        await this.setState({ chosenImage: '/images/' + image[0] })
    }

    modalHide() {
        this.setState({ showModal: false })
    }


    render() {
        const mystyle = {
            wordBreak: 'break-word'
        };
        return (

            <div>

                <h1>
                    {this.props.match.params.user}'s profile
                </h1>


                <CardGroup>
                    {
                        this.state.s.map((image, index) => (


                            <Col lg="3">


                                <Card style={{ height: '100%' }} className="newscard">
                                    <Card.Img variant="top" src={'/images/' + image.imagePath} />

                                    <Card.Body>
                                        <Card.Text>
                                            <ListGroup>
                                                <ListGroup.Item>
                                                    {
                                                        image.caption !== "" ?
                                                            image.caption
                                                            :
                                                            <small>no caption</small>
                                                    }
                                                </ListGroup.Item>
                                            </ListGroup>
                                        </Card.Text>
                                    </Card.Body>
                                    <Card.Footer>
                                        <Row>


                                            <Col lg="8">
                                                <p className="text-muted">Uploaded by: {this.props.match.params.user} </p>
                                            </Col>
                                            <Col lg="4">
                                                <Button onClick={this.likeImage.bind(this, image.imageID)} variant="primary">
                                                    Like <Badge variant="light">{image.likes}</Badge>

                                                </Button>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col lg="6">
                                                <Button block variant="primary" onClick={this.expandModal.bind(this, [image.imagePath, image.caption])}>Full image</Button>
                                            </Col>
                                        </Row>
                                    </Card.Footer>
                                </Card>









                                <Modal centered size="lg" show={this.state.showModal} onHide={this.modalHide}>
                                    <Modal.Header closeButton>

                                        <Modal.Title>Image Settings</Modal.Title>




                                    </Modal.Header>
                                    <Modal.Body>
                                        <img src={this.state.chosenImage} width="100%" height="100%" alt="None"/>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Row>

                                            <Col>
                                                <Jumbotron style={mystyle}>
                                                    {
                                                        this.state.caption !== "" ?
                                                            <h2 style={{ textAlign: 'center' }}>
                                                                {this.state.caption}
                                                            </h2>

                                                            :

                                                            <small>no caption</small>
                                                    }

                                                </Jumbotron>

                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>




                                                <Button variant="secondary" onClick={this.modalHide}>
                                                    Close
                                                </Button>

                                            </Col>
                                        </Row>

                                    </Modal.Footer>
                                </Modal>

                            </Col>

                        ))


                    }
                </CardGroup>


            </div>


        )
    }
}






