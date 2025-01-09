import { ArrowUpOutlined, CustomerServiceOutlined } from "@ant-design/icons";
import "./SideBar.less";

const handleGoTop = () => {
    $("html,body").animate({scrollTop:0},500);
}

const handleGoService = () => {
    $("html,body").animate({scrollTop:0},500);
}

export const SideBar = () => {
    return (
        <div className="mod-back-top-side-bar">
            <div className="mod-back-top-item" onClick={handleGoTop}><ArrowUpOutlined /></div>
            {/* <div className="mod-back-top-item" onClick={handleGoService}><CustomerServiceOutlined /></div> */}
        </div>
    )
}