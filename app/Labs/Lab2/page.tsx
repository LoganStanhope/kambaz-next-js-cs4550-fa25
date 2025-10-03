import Dimensions from "@/app/Labs/Lab2/Dimensions";
import ForegroundColors from "@/app/Labs/Lab2/ForegroundColors";
import Positions from "@/app/Labs/Lab2/Positions";
import BackgroundColors from "@/app/Labs/Lab2/BackgroundColors";
import Borders from "@/app/Labs/Lab2/Borders";
import Padding from "@/app/Labs/Lab2/Padding";
import Margins from "@/app/Labs/Lab2/Margins";
import Corners from "@/app/Labs/Lab2/Corners";
import Zindex from "@/app/Labs/Lab2/Zindex";
import Float from "@/app/Labs/Lab2/Float";
import GridLayout from "@/app/Labs/Lab2/GridLayout";
import Flex from "@/app/Labs/Lab2/Flex";
import ReactIconsSampler from "@/app/Labs/Lab2/ReactIconSampler";
import {Container} from "react-bootstrap";
import BootstrapGrids from "@/app/Labs/Lab2/BootstrapGrids";
import ScreenSizeLabel from "@/app/Labs/Lab2/ScreenSizeLabel";
import BootstrapTables from "@/app/Labs/Lab2/BootstrapTables";
import BootstrapLists from "@/app/Labs/Lab2/BootstrapLists";
import BootstrapForms from "@/app/Labs/Lab2/BootstrapForms";
import BootstrapNavigation from "@/app/Labs/Lab2/BootstrapNavigation";


export default function Lab2() {
    return (
        <Container>
            <h2>Lab 2 - Cascading Style Sheets</h2>
            <p> Logan Stanhope CS4550.11597.202610 </p>
            <h3>Styling with the STYLE attribute</h3>
            <p>
                Style attribute allows configuring look and feel
                right on the element. Although it&apos; very convenient
                it is considered bad practice and you should avoid
                using the style attribute
            </p>
            <div id="wd-css-id-selectors">
                <h3>ID selectors</h3>
                <p id="wd-id-selector-1">
                    Instead of changing the look and feel of all the
                    elements of the same name, e.g., P, we can refer to a specific element by its ID
                </p>
                <p id="wd-id-selector-2">
                    Here&apos;s another paragraph using a different ID and a different look and
                    feel
                </p>
            </div>
            <div id="wd-css-class-selectors">
                <h3>Class selectors</h3>

                <p className="wd-class-selector">
                    Instead of using IDs to refer to elements, you can use an element&apos;s CLASS attribute
                </p>

                <h4 className="wd-class-selector">
                    This heading has same style as paragraph above
                </h4>
            </div>
            <div id="wd-css-document-structure">
                <div className="wd-selector-1">
                    <h3>Document structure selectors</h3>
                    <div className="wd-selector-2">
                        Selectors can be combined to refer elements in particular
                        places in the document
                        <p className="wd-selector-3">
                            This paragraph&apos;s red background is referenced as
                            <br />
                            .selector-2 .selector3<br />
                            meaning the descendant of some ancestor.<br />
                            <span className="wd-selector-4">
          Whereas this span is a direct child of its parent
        </span><br />
                            You can combine these relationships to create specific
                            styles depending on the document structure
                        </p>
                    </div>
                </div>
            </div>
            <ForegroundColors/>
            <BackgroundColors/>
            <Borders/>
            <Padding/>
            <Margins/>
            <Corners/>
            <Dimensions/>
            <Positions/>
            <Zindex/>
            <Float/>
            <GridLayout/>
            <Flex/>
            <ReactIconsSampler/>
            <BootstrapGrids/>
            <ScreenSizeLabel/>
            <BootstrapTables/>
            <BootstrapLists/>
            <BootstrapForms/>
            <BootstrapNavigation/>
        </Container>
    );
}
