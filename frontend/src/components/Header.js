import React from 'react'
import { Link } from 'react-router-dom'
import { Navbar, Container, Nav } from 'react-bootstrap'

const Header = () => {
    return (
        <header>
            <Navbar bg="dark" variant='dark' expand="lg" collapseOnSelect>
                <Container>

                {
                /*  use the "as" attribute to let Link instead of the original href attribute in Bootstrap components
                    this will prevent page refresh
                    and will NOT change the default Bootstrap styles
                    if use <Link> to wrap Bootstrap components, it may change the default styles
                */}
                    <Navbar.Brand as={Link} to="/">Meegle</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">
                            <Nav.Link as={Link} to="/cart"><i className='fas fa-shopping-cart'></i> Cart</Nav.Link>
                            <Nav.Link as={Link} to="/login"><i className='fas fa-user'></i> Sign in</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    )
}

export default Header