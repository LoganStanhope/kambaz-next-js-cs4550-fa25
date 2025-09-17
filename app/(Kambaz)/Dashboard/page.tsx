import Link from "next/link";
import Image from "next/image";
export default function Dashboard() {
    return (
        <div id="wd-dashboard">
            <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
            <h2 id="wd-dashboard-published">Published Courses (12)</h2> <hr />
            <div id="wd-dashboard-courses">
                <div className="wd-dashboard-course">
                    <Link href="/Courses/1234" className="wd-dashboard-course-link">
                        <Image src="/images/reactjs.svg" width={200} height={150} alt={"altName"}/>
                        <div>
                            <h5> CS1234 React JS </h5>
                            <p className="wd-dashboard-course-title">
                                Full Stack software developer</p>
                            <button> Go </button>
                        </div>
                    </Link>
                    <Link href="/Courses/1111" className="wd-dashboard-course-link">
                        <Image src="/images/nature.jpg" width={200} height={150} alt={"altName"}/>
                        <div>
                            <h5> ENVR1111 Environmental Science </h5>
                            <p className="wd-dashboard-course-title">
                                Life Scientists</p>
                            <button> Go </button>
                        </div>
                    </Link>
                    <Link href="/Courses/2233" className="wd-dashboard-course-link">
                        <Image src="/images/foodjpg.webp" width={200} height={150} alt={"altName"}/>
                        <div>
                            <h5> DS2233 Data Mining </h5>
                            <p className="wd-dashboard-course-title">
                                Data Miner</p>
                            <button> Go </button>
                        </div>
                    </Link>
                    <Link href="/Courses/3341" className="wd-dashboard-course-link">
                        <Image src="/images/bookedposter.png" width={200} height={150} alt={"altName"}/>
                        <div>
                            <h5> CS3341 Java </h5>
                            <p className="wd-dashboard-course-title">
                                Back end software developer</p>
                            <button> Go </button>
                        </div>
                    </Link>
                    <Link href="/Courses/4223" className="wd-dashboard-course-link">
                        <Image src="/images/pslseason.webp" width={200} height={150} alt={"altName"}/>
                        <div>
                            <h5> PHIL4223 Life Theory </h5>
                            <p className="wd-dashboard-course-title">
                                Life Philosopher</p>
                            <button> Go </button>
                        </div>
                    </Link>
                    <Link href="/Courses/1122" className="wd-dashboard-course-link">
                        <Image src="/images/dessert.jpg" width={200} height={150} alt={"altName"}/>
                        <div>
                            <h5> CS1122 Fundies 1 </h5>
                            <p className="wd-dashboard-course-title">
                                Intro developer</p>
                            <button> Go </button>
                        </div>
                    </Link>
                    <Link href="/Courses/3141" className="wd-dashboard-course-link">
                        <Image src="/images/stockPeople.jpg" width={200} height={150} alt={"altName"}/>
                        <div>
                            <h5> DS3141 DataBases </h5>
                            <p className="wd-dashboard-course-title">
                                Database developer</p>
                            <button> Go </button>
                        </div>
                    </Link>
                </div>
                <div className="wd-dashboard-course"> ... </div>
                <div className="wd-dashboard-course"> ... </div>
            </div>
        </div>
    );}
