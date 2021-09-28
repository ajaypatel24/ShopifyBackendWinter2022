import React from 'react'
import {Card, Button} from 'react-bootstrap'

export default class Profile extends React.Component {
    constructor(props) {
        super(props)

        
        this.state = {
           
        }

    }

    

    render() {
        
        return (

            <div>
                <Card className="text-center">
                <Card.Header className="DNE">Image Repository</Card.Header>
                <Card.Body>
                    <Card.Title className="NotFound404">404 Error</Card.Title>


                    <Card.Text className="DNE">
                        The page you requested does not exist
                    </Card.Text>
                    <Button variant="primary" href="#/home">Return Home</Button>
                </Card.Body>
                <Card.Footer className="text-muted"></Card.Footer>
            </Card>

            </div>


        )
    }
}






