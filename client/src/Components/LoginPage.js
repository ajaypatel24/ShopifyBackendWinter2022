import React from 'react'
import { Form, Button, Alert } from 'react-bootstrap'
import { Redirect } from 'react-router-dom'
import './LoginPage.css'
import axios from 'axios'
export default class LoginPage extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            email: "",
            password: "",
            LoginOrRegister: true,
            error: ""
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleRegistration = this.handleRegistration.bind(this);

    }


    validateForm() {
        return this.state.email.length > 0 && this.state.password.length > 0;
    }

    async handleSubmit(e) {
        e.preventDefault();

        const data = {}
        data["email"] = this.state.email
        data["password"] = this.state.password
        await axios.post("/login/", data)
            .then(res => this.setState({ status: res.data }))
            .then(err => console.log(err));

        
        sessionStorage.setItem("Auth", this.state.status)
        if (this.state.status) {

            window.location.href = '#/home'
            return <Redirect to="/" push={true} />
        }
        else {
            this.setState({ error: "Incorrect crendentials" })
        }
    }

    handleRegistration(e) {
        e.preventDefault();
        var data = {}
        data["email"] = this.state.email
        data["password"] = this.state.password

        axios.post("/register/", data)
            .then(res => this.setState({ status: res.data }))
            .then(err => console.log(err));

        if (this.state.status === true) {
            window.location.reload()
        }
        else {
            this.setState({ error: "Username already taken" })
        }


    }



    render() {
        return (


            <div className="Login">
                <h1>Welcome to Image Repository</h1>
                <Form onSubmit={this.handleSubmit}>
                    <Form.Group size="lg" controlId="email">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                            autoFocus
                            type="text"
                            value={this.state.email}
                            onChange={(e) => this.setState({ email: e.target.value })}
                        />
                    </Form.Group>
                    <Form.Group size="lg" controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            value={this.state.password}
                            onChange={(e) => this.setState({ password: e.target.value })}
                        />
                    </Form.Group>
                    <Button block size="lg" type="submit" disabled={!this.validateForm()}>
                        Login
                        </Button>
                    <br />
                    <Button tyoe="reset" block size="lg" onClick={this.handleRegistration}>
                        Register
                        </Button>
                    <br />
                    {
                        this.state.status === true ?
                            <Alert variant="success" style={{ textAlign: "center" }}>Registered</Alert>
                            :
                            this.state.status === false ?
                                <Alert variant="danger" style={{ textAlign: "center" }}>{this.state.error}</Alert>
                                :
                                <p></p>
                    }


                </Form>
            </div>






        )
    }
}
