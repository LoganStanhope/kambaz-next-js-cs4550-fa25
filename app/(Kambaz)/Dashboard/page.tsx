'use client';
import Link from "next/link";
import Image from "next/image";
import {Card, Row, Col, Button} from "react-bootstrap";

export default function Dashboard() {
    return (
        <div id="wd-dashboard">
            <h1 id="wd-dashboard-title">Dashboard</h1>
            <hr/>
            <h2 id="wd-dashboard-published">Published Courses (12)</h2>
            <hr/>
            <div id="wd-dashboard-courses">
                <Row xs={1} md={5} className="g-4">
                    <Col className="wd-dashboard-course" style={{width: "300px"}}>
                        <Card>
                            <Link href="/Courses/1234/Home"
                                  className="wd-dashboard-course-link text-decoration-none text-dark">
                                <Card.Img variant="top" src="/images/reactjs.svg" width="100%" height={160}/>
                                <Card.Body>
                                    <Card.Title className="wd-dashboard-course-title text-nowrap overflow-hidden">CS1234
                                        React JS</Card.Title>
                                    <Card.Text className="wd-dashboard-course-description overflow-hidden"
                                               style={{height: "100px"}}>
                                        Full Stack software developer</Card.Text>
                                    <Button variant="primary">Go</Button>
                                </Card.Body>
                            </Link>
                        </Card>
                    </Col>
                    <Col className="wd-dashboard-course" style={{width: "300px"}}>
                        <Card>
                            <Link href="/Courses/1111/Home"
                                  className="wd-dashboard-course-link text-decoration-none text-dark">
                                <Card.Img variant="top" src="/images/nature.jpg" width="100%" height={160}/>
                                <Card.Body>
                                    <Card.Title className="wd-dashboard-course-title text-nowrap overflow-hidden">ENVR1111
                                        Earth Science</Card.Title>
                                    <Card.Text className="wd-dashboard-course-description overflow-hidden"
                                               style={{height: "100px"}}>
                                        Life Scientists</Card.Text>
                                    <Button variant="primary">Go</Button>
                                </Card.Body>
                            </Link>
                        </Card>
                    </Col>
                    <Col className="wd-dashboard-course" style={{width: "300px"}}>
                        <Card>
                            <Link href="/Courses/2233/Home"
                                  className="wd-dashboard-course-link text-decoration-none text-dark">
                                <Card.Img variant="top" src="/images/foodjpg.webp" width="100%" height={160}/>
                                <Card.Body>
                                    <Card.Title className="wd-dashboard-course-title text-nowrap overflow-hidden">DS2233
                                        Data Mining</Card.Title>
                                    <Card.Text className="wd-dashboard-course-description overflow-hidden"
                                               style={{height: "100px"}}>
                                        Data Miner</Card.Text>
                                    <Button variant="primary">Go</Button>
                                </Card.Body>
                            </Link>
                        </Card>
                    </Col>
                    <Col className="wd-dashboard-course" style={{width: "300px"}}>
                        <Card>
                            <Link href="/Courses/3341/Home"
                                  className="wd-dashboard-course-link text-decoration-none text-dark">
                                <Card.Img variant="top" src="/images/cat.jpg" width="100%" height={160}/>
                                <Card.Body>
                                    <Card.Title className="wd-dashboard-course-title text-nowrap overflow-hidden">CS3341
                                        Java</Card.Title>
                                    <Card.Text className="wd-dashboard-course-description overflow-hidden"
                                               style={{height: "100px"}}>
                                        Back end software developer</Card.Text>
                                    <Button variant="primary">Go</Button>
                                </Card.Body>
                            </Link>
                        </Card>
                    </Col>
                    <Col className="wd-dashboard-course" style={{width: "300px"}}>
                        <Card>
                            <Link href="/Courses/4223/Home"
                                  className="wd-dashboard-course-link text-decoration-none text-dark">
                                <Card.Img variant="top" src="/images/pslseason.webp" width="100%" height={160}/>
                                <Card.Body>
                                    <Card.Title className="wd-dashboard-course-title text-nowrap overflow-hidden">PHIL4223
                                        Life Theory</Card.Title>
                                    <Card.Text className="wd-dashboard-course-description overflow-hidden"
                                               style={{height: "100px"}}>
                                        Life Philosopher</Card.Text>
                                    <Button variant="primary">Go</Button>
                                </Card.Body>
                            </Link>
                        </Card>
                    </Col>
                    <Col className="wd-dashboard-course" style={{width: "300px"}}>
                        <Card>
                            <Link href="/Courses/1122/Home"
                                  className="wd-dashboard-course-link text-decoration-none text-dark">
                                <Card.Img variant="top" src="/images/dessert.jpg" width="100%" height={160}/>
                                <Card.Body>
                                    <Card.Title className="wd-dashboard-course-title text-nowrap overflow-hidden">CS1122
                                        Fundies 1</Card.Title>
                                    <Card.Text className="wd-dashboard-course-description overflow-hidden"
                                               style={{height: "100px"}}>
                                        Intro developer</Card.Text>
                                    <Button variant="primary">Go</Button>
                                </Card.Body>
                            </Link>
                        </Card>
                    </Col>
                    <Col className="wd-dashboard-course" style={{width: "300px"}}>
                        <Card>
                            <Link href="/Courses/3141/Home"
                                  className="wd-dashboard-course-link text-decoration-none text-dark">
                                <Card.Img variant="top" src="/images/stockPeople.jpg" width="100%" height={160}/>
                                <Card.Body>
                                    <Card.Title className="wd-dashboard-course-title text-nowrap overflow-hidden">DS3141
                                        DataBases </Card.Title>
                                    <Card.Text className="wd-dashboard-course-description overflow-hidden"
                                               style={{height: "100px"}}>
                                        Database developer</Card.Text>
                                    <Button variant="primary">Go</Button>
                                </Card.Body>
                            </Link>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
}
