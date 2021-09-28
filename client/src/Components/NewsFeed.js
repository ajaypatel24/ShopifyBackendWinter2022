import axios from 'axios'
import React from 'react'
import { Row, Col, CardGroup, Card, Navbar, Nav, Button, Modal, Dropdown, Jumbotron, Badge, ListGroup } from 'react-bootstrap'

export default class NewsFeed extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            url: "",
            publicimages: [],
            showModal: false,
            chosenImage: "",
            user: ""
        }

        this.expandModal = this.expandModal.bind(this)
        this.handleClose = this.handleClose.bind(this)


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

        await axios.get("/publicimages")
            .then(res => this.setState({ publicimages: res.data }))
            .then(err => console.log(err))



    }

    expandModal(imgpath, caption) {
        var arr = []
        arr.push('/images/' + imgpath)
        arr.push(caption)
        this.setState({ chosenImage: arr })
        this.setState({ showModal: true })
    }


    logout() {
        sessionStorage.removeItem("Auth");
    }

    handleClose() {
        this.setState({ showModal: false })
    }

    likeImage(image) {
        axios.post("/like/" + image + '/' + this.state.user.username)
            .then(res => (res.data))
            .then(err => console.log(err))

        window.location.reload()
    }


    render() {
        const mystyle = {
            wordBreak: 'break-word'
        };
        return (

            <div >
                <Navbar bg="light" expand="lg">
                    <Navbar.Brand href="#home">Image Repository</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Link href="#">News Feed</Nav.Link>
                        </Nav>
                        <Navbar.Text>
                            <Dropdown>
                                <Button href="#/profile">{this.state.user.username}</Button>

                                <Dropdown.Toggle split />
                                <Dropdown.Menu>
                                    <Dropdown.Item href="#/profile">Profile</Dropdown.Item>
                                    <Dropdown.Item href="#/" onClick={this.logout}>Logout</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Navbar.Text>


                    </Navbar.Collapse>
                </Navbar>



                <CardGroup>

                    {
                        this.state.publicimages.map((image, index) => (

                            <Col lg="3">
                                <Card id={index} style={{ height: '100%' }} className="newscard">
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
                                                <p className="text-muted">Uploaded by: <a href={"#/userprofile/" + image.imagePoster}>{image.imagePoster}</a> </p>
                                            </Col>
                                            <Col lg="4">
                                                <Button onClick={this.likeImage.bind(this, image.imageID)} variant="primary">
                                                    Like <Badge variant="light">{image.likes}</Badge>
                                                    <span className="sr-only">unread messages</span>
                                                </Button>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col lg="6">
                                                <Button block variant="primary" onClick={this.expandModal.bind(this, image.imagePath, image.caption)}>Full image</Button>
                                            </Col>
                                        </Row>
                                    </Card.Footer>
                                </Card>


                                <Modal centered size="lg" show={this.state.showModal} onHide={this.handleClose}>

                                    <Modal.Body>

                                        <img src={this.state.chosenImage[0]} width="100%" height="100%" alt="None" />

                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Row>

                                            <Col>
                                                <Jumbotron style={mystyle}>
                                                    {
                                                        this.state.chosenImage[1] !== "" ?
                                                            <h2 style={{ textAlign: 'center' }}>
                                                                {this.state.chosenImage[1]}
                                                            </h2>

                                                            :

                                                            <small>no caption</small>
                                                    }

                                                </Jumbotron>

                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <Button variant="secondary" onClick={this.handleClose}>
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
