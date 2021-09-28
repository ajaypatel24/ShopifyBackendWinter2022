import React from 'react'
import { Row, Col, CardGroup, Card, Form, Button, Jumbotron, Tabs, Tab, Modal, Container, Figure, Alert, ListGroup, Navbar, Nav, Dropdown } from 'react-bootstrap'
import axios from 'axios'

export default class Profile extends React.Component {
    constructor(props) {
        super(props)

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleTextChange = this.handleTextChange.bind(this)
        this.modalHide = this.modalHide.bind(this)
        this.modalShow = this.modalShow.bind(this)
        this.handleCheck = this.handleCheck.bind(this)
        this.bulkDeleteConfirm = this.bulkDeleteConfirm.bind(this)
        this.state = {
            imageName: "",
            status: "",
            s: [],
            ImageCaption: "",
            user: "",
            modalshow: false,
            deleteflow: false,
            preview: "",
            modaldata: [],
            chosenImage: "",
            checked: [],
            bulkDeleteConfirm: false
        }

    }

    async handleChange(e) {
        const file = e.target.files[0]
        await this.setState({
            imageName: file,
            preview: URL.createObjectURL(file),
            status: ""
        })
    }

    handleTextChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });

    };

    async handleSubmit(e) {
        const data = new FormData();
        data.append("user", this.state.user.username)
        data.append("file", this.state.imageName)
        data.append("caption", this.state.ImageCaption)

        await axios.post("/upload", data)
            .then(res => this.setState({ status: res.data }))
            .then(err => console.log(err));


        await this.setState({
            ImageCaption: "",
            imageName: "",
            preview: ""
        })

        if (this.state.status) {

        }

    }


    importAll(r) {
        return r.keys().map(r);
    }

    async bulkDeleteConfirm() {

        if (this.state.checked.length === 0) {
            await this.setState({ bulkDeleteConfirm: "0" })
            return
        }
        else {
            await this.setState({ bulkDeleteConfirm: true })
        }
    }

    async expandModal(imgpath) {
        this.setState({ chosenImage: '/images/' + imgpath })

        await this.setState({ modalShow: true })
    }

    async componentDidMount() {

        var data = {}
        data["token"] = sessionStorage.getItem("Auth")
        await axios.post("/authenticate/", data)
            .then(res => this.setState({ user: res.data }))

        
        if (this.state.user === false) {
                window.location.href ="#/"
                return
        }
        if (this.state.user === "Cannot read property 'body' of undefined") {
            window.location.href = "#/"
        }


        await axios.get("/imageNames/" + this.state.user.username)
            .then(res => this.setState({ s: res.data }))


    }

    async privatePhoto(image, privacy) {

        if (privacy === 'public') {
            privacy = 'private'
        }
        else {
            privacy = 'public'
        }
        axios.post("/private/" + image + '/' + privacy)
            .then(res => this.setState({ status: "success" }))
            .then(err => console.log(err))


        await this.modalHide()
        window.location.reload();

    }

    async delete(image) {

        await axios.post("/delete/" + image)
            .then(res => (res.data))
            .then(err => console.log(err))

        this.modalHide()
        window.location.reload()

    }

    async modalShow(image) {
        this.setState({ modalshow: true })
        this.setState({ modaldata: image })
        await this.setState({ chosenImage: '/images/' + image[0] })
    }

    modalHide() {
        this.setState({ modalshow: false })
        this.setState({ bulkDeleteConfirm: false })
    }

    async handleCheck(e, imagepath) {
        var join = ""
        if (e.target.checked) {
            if (this.state.checked !== null) {
                join = this.state.checked.concat(imagepath)
                await this.setState({ checked: join })
            }
            else {
                this.setState({ checked: [imagepath] })
            }
        }

        else {
            
            var index = this.state.checked.indexOf(imagepath)
            if (index > -1) {
                join = this.state.checked.splice(index, 1)
            }
            await this.setState({ checked: this.state.checked })

        }
    }

    async bulkDelete(data) {
        const imgdata = new FormData();
        await imgdata.append("file", data)
        for (const img of data) {
            await axios.post("/delete/" + img)
                .then(res => this.setState({ bulkDeleteConfirm: !res.data }))
                .then(err => console.log(err))
        }


        window.location.reload();

    }

    render() {
        const mystyle = {
            wordBreak: 'break-word'
        };
        return (

            <div>
                <Navbar bg="light" expand="lg">
                    <Navbar.Brand href="#home">Image Repository</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Link href="#/home">News Feed</Nav.Link>
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

                <h1>
                    {this.state.user.username}'s profile
                </h1>

                <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
                    <Tab eventKey="home" title="Upload">

                        <Row>
                            <Col>
                                <Container>
                                    <div className="Login">
                                        <h1>Upload an Image to your profile</h1>
                                        <Form onSubmit={this.handleSubmit}>
                                            <Form.Group size="lg" controlId="email">
                                                <Form.Label>Image Upload</Form.Label>
                                                <Form.File

                                                    placeholder="Upload Image"
                                                    onChange={this.handleChange}

                                                />


                                            </Form.Group>
                                            <Form.Group size="lg" controlId="password">
                                                <Form.Label>Caption (max 100 characters)</Form.Label>
                                                <Form.Control
                                                    as="textarea"
                                                    rows={3}
                                                    name="ImageCaption"
                                                    type="text"
                                                    maxLength="100"
                                                    placeholder="Optional Image Caption"
                                                    onChange={this.handleTextChange}
                                                />
                                            </Form.Group>
                                            <Button block size="lg" variant="success" onClick={this.handleSubmit} type="reset" >
                                                Confirm
                                            </Button>
                                        </Form>
                                    </div>
                                </Container>
                                <Container>
                                    <Col lg={{ span: 4, offset: 4 }}>
                                        {
                                            this.state.status === true ?

                                                <Alert variant="success">
                                                    Successfully uploaded image
                                                </Alert>

                                                :
                                                this.state.status === false ?

                                                    <Alert variant="danger">
                                                        Invalid or missing input
                                                </Alert>
                                                    :
                                                    <p></p>
                                        }
                                    </Col>
                                </Container>

                            </Col>
                            <Col>
                                <Figure>
                                    <Figure.Image
                                        width="60%"
                                        height="60%"
                                        src={this.state.preview}
                                    />
                                    <Figure.Caption>
                                        {
                                            this.state.preview !== null ?
                                                <span>Image preview</span>
                                                :
                                                <p></p>
                                        }

                                    </Figure.Caption>
                                </Figure>

                            </Col>
                        </Row>

                    </Tab>
                    <Tab eventKey="profile" title="Posts">


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
                                                        <Button block variant="primary" onClick={this.modalShow.bind(this, [image.imagePath, image.privacy, image.caption])}>Image Settings</Button>
                                                    </Col>
                                                    <Col>
                                                        <Form.Group controlId="formBasicCheckbox">
                                                            <Form.Check type="checkbox" label="Select" onChange={(e) => { this.handleCheck(e, image.imagePath) }} />
                                                        </Form.Group></Col>
                                                </Row>
                                                <Row>
                                                    <Col>
                                                        <small className="text-muted">{image.privacy} image</small>
                                                    </Col>
                                                </Row>

                                            </Card.Footer>
                                        </Card>


                                        <Modal centered size="lg" show={this.state.modalshow} onHide={this.modalHide}>
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
                                                                this.state.modaldata[2] !== "" ?
                                                                    <h2 style={{ textAlign: 'center' }}>
                                                                        {this.state.modaldata[2]}
                                                                    </h2>

                                                                    :

                                                                    <small>no caption</small>
                                                            }

                                                        </Jumbotron>

                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col>


                                                        <Button onClick={this.privatePhoto.bind(this, this.state.modaldata[0], this.state.modaldata[1])}>
                                                            {
                                                                this.state.modaldata[1] === 'public' ?
                                                                    <span>Confirm Private</span>
                                                                    :

                                                                    <span>Confirm Public</span>

                                                            }
                                                        </Button>

                                                        <Button variant="secondary" onClick={this.modalHide}>
                                                            Close
                                                </Button>

                                                    </Col>
                                                </Row>

                                            </Modal.Footer>
                                        </Modal>


                                        <Modal centered size="lg" show={this.state.bulkDeleteConfirm === true} onHide={this.modalHide}>
                                            <Modal.Header closeButton>


                                                <Modal.Title>Deletion Confirmation</Modal.Title>




                                            </Modal.Header>
                                            <Modal.Body>
                                                Are you sure you want to delete {this.state.checked.length} item(s)
                                            </Modal.Body>
                                            <Modal.Footer>
                                                <Button variant="secondary" onClick={this.modalHide}>
                                                    Close
                                                </Button>


                                                <Button onClick={this.bulkDelete.bind(this, this.state.checked)}>
                                                    Confirm Deletion
                                                        </Button>




                                            </Modal.Footer>
                                        </Modal>


                                        <Modal centered size="lg" show={this.state.bulkDeleteConfirm === '0'} onHide={this.modalHide}>
                                            <Modal.Header closeButton>


                                                <Modal.Title>Deletion Confirmation</Modal.Title>




                                            </Modal.Header>
                                            <Modal.Body>
                                                No items specified
                                            </Modal.Body>
                                            <Modal.Footer>
                                                <Button variant="secondary" onClick={this.modalHide}>
                                                    Close
                                                </Button>





                                            </Modal.Footer>
                                        </Modal>
                                    </Col>


                                ))


                            }


                        </CardGroup>

                        <br />
                        {
                            this.state.s.length === 0 ?
                                <h1 style={{ textAlign: 'center' }}>No Posts Yet!</h1>

                                :


                                <Button onClick={this.bulkDeleteConfirm}>Delete</Button>

                        }


                    </Tab>
                </Tabs>

            </div>


        )
    }
}






