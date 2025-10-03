"use client";
import {
    Button,
    Col,
    Form,
    FormCheck,
    FormControl,
    FormGroup,
    FormLabel,
    FormSelect,
    InputGroup,
    Row
} from "react-bootstrap";
import FormRange from "react-bootstrap/FormRange";

export default function BootstrapForms() {
    return (
        <div>
            <div id="wd-css-styling-forms">
                <h2>Forms</h2>
                <FormGroup className="mb-3" controlId="wd-email">
                    <FormLabel>Email address</FormLabel>
                    <FormControl type="email" placeholder="name@example.com"/>
                </FormGroup>
                <FormGroup className="mb-3" controlId="wd-textarea">
                    <FormLabel>Example textarea</FormLabel>
                    <FormControl as="textarea" rows={3}/>
                </FormGroup>
            </div>

            <div id="wd-css-styling-dropdowns">
                <h3>Dropdowns</h3>
                <FormSelect>
                    <option selected>Open this select menu</option>
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                </FormSelect>
            </div>

            <div id="wd-css-styling-switches">
                <h3>Switches</h3>
                <FormCheck type="switch" checked={false} id="wd-switch-1"
                           label="Unchecked switch checkbox input"/>
                <FormCheck type="switch" checked={true} id="wd-switch-2"
                           label="Checked switch checkbox input"/>
                <FormCheck type="switch" checked={false} disabled
                           id="custom-switch"
                           label="Unchecked disabled switch checkbox input"/>
                <FormCheck type="switch" checked={true} disabled
                           id="custom-switch"
                           label="Checked disabled switch checkbox input"/>
            </div>

            <div id="wd-css-styling-range-and-sliders">
                <h3>Range</h3>
                <FormGroup controlId="wd-range1">
                    <FormLabel>Example range</FormLabel>
                    <FormRange min="0" max="5" step="0.5"/>
                </FormGroup>
            </div>

            <div id="wd-css-styling-addons">
                <h3>Addons</h3>
                <InputGroup className="mb-3">
                    <InputGroup.Text>$</InputGroup.Text>
                    <InputGroup.Text>0.00</InputGroup.Text>
                    <FormControl/>
                </InputGroup>
                <InputGroup>
                    <FormControl/>
                    <InputGroup.Text>$</InputGroup.Text>
                    <InputGroup.Text>0.00</InputGroup.Text>
                </InputGroup>
            </div>

            <div id="wd-css-responsive-forms-1">
                <h3>Responsive forms</h3>
                <FormGroup as={Row} className="mb-3" controlId="email1">
                    <FormLabel column sm={2}>
                        Email
                    </FormLabel>
                    <Col sm={10}>
                        <FormControl type="email" value="email@example.com"/>
                    </Col>
                </FormGroup>
                <FormGroup as={Row} className="mb-3" controlId="password1">
                    <FormLabel column sm={2}>
                        Password
                    </FormLabel>
                    <Col sm={10}>
                        <FormControl type="password"/>
                    </Col>
                </FormGroup>
                <FormGroup as={Row} className="mb-3" controlId="textarea2">
                    <FormLabel column sm={2}>
                        Bio
                    </FormLabel>
                    <Col sm={10}>
                        <FormControl as="textarea" style={{height: "100px"}}/>
                    </Col>
                </FormGroup>
            </div>

            <div id="wd-css-responsive-forms-2">
                <h3>Responsive forms</h3>
                <Form>
                    <FormGroup as={Row} className="mb-3">
                        <FormLabel column sm={2}> Email </FormLabel>
                        <Col sm={10}>
                            <FormControl type="email" placeholder="Email"/>
                        </Col>
                    </FormGroup>
                    <FormGroup as={Row} className="mb-3">
                        <FormLabel column sm={2}> Password </FormLabel>
                        <Col sm={10}>
                            <FormControl type="password" placeholder="Password"/>
                        </Col>
                    </FormGroup>
                    <fieldset>
                        <FormGroup as={Row} className="mb-3">
                            <FormLabel as="legend" column sm={2}>
                                Radios </FormLabel>
                            <Col sm={10}>
                                <FormCheck type="radio" label="first radio"
                                           checked name="formHorizontalRadios"/>
                                <FormCheck type="radio" label="second radio"
                                           name="formHorizontalRadios"/>
                                <FormCheck type="radio" label="third radio"
                                           name="formHorizontalRadios"/>
                            </Col>
                        </FormGroup>
                    </fieldset>
                    <FormGroup as={Row} className="mb-3">
                        <Col sm={{span: 10, offset: 2}}>
                            <FormCheck label="Remember me"/>
                        </Col>
                    </FormGroup>
                    <FormGroup as={Row} className="mb-3">
                        <Col>
                            <Button type="submit">Sign in</Button>
                        </Col>
                    </FormGroup>
                </Form>
            </div>
        </div>
    )
}