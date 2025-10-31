import {FaPlus} from "react-icons/fa6";
import GreenCheckmark from "./GreenCheckmark";
import {Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle} from "react-bootstrap";
import {CgUnavailable} from "react-icons/cg";
import ModuleEditor from "./ModuleEditor";
import {useState} from "react";

export default function ModulesControls(
    { moduleName, setModuleName, addModule }:
        { moduleName: string; setModuleName: (title: string) => void; addModule: () => void; }) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return (

        <div id="wd-modules-controls" className="d-flex flex-row-reverse text-nowrap">
            <Button variant="danger" onClick={handleShow}
            size="lg" className="me-1 float-end" id="wd-add-module-btn">
                <FaPlus className="position-relative me-2" style={{bottom: "1px"}}/>
                Module
            </Button>
            <ModuleEditor show={show} handleClose={handleClose} dialogTitle="Add Module"
                          moduleName={moduleName} setModuleName={setModuleName} addModule={addModule} />
            <Dropdown className="float-end me-2">
                <DropdownToggle style={{color: "black", background: "lightgray", outline: "none"}}
                                variant="secondary" size="lg" id="wd-publish-all-btn">
                    <GreenCheckmark/> Publish All
                </DropdownToggle>
                <DropdownMenu>
                    <DropdownItem id="wd-publish-all">
                        <GreenCheckmark/> Publish All
                    </DropdownItem>
                    <DropdownItem id="wd-publish-all-modules-and-items">
                        <GreenCheckmark/> Publish all modules and items
                    </DropdownItem>
                    <DropdownItem id="wd-publish-modules-only">
                        <GreenCheckmark/> Publish modules only
                    </DropdownItem>
                    <DropdownItem id="wd-unpublish-modules-only">
                        <CgUnavailable/> Unpublish modules only
                    </DropdownItem>
                    <DropdownItem id="wd-unpublish-all-modules-and-items">
                        <CgUnavailable/> Unpublish all modules and items
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
            <Button style={{color: "black", background: "lightgray", outline: "none"}} variant="secondary" size="lg"
                    className="me-1 float-end" id="wd-view-progress">
                View Progress
            </Button>
            <Button style={{color: "black", background: "lightgray", outline: "none"}} variant="secondary" size="lg"
                    className="me-1 float-end" id="wd-collapse-all">
                Collapse All
            </Button>
        </div>
    );
}