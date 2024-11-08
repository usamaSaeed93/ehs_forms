import React, { FunctionComponent } from "react";
import {
  isMobile as libIsMobile,
  isTablet as libIsTablet,
} from "react-device-detect";
let isMobile: Boolean;
if (process.env.NODE_ENV === "localhost") {
  isMobile = window.innerWidth < 1024;
} else {
  isMobile = libIsMobile || libIsTablet || window.innerWidth < 1024;
}
interface NavbarProps {
  window?: () => Window;
}
import logo from "./../assets/img-logo.png";

const Navbar: FunctionComponent<NavbarProps> = (props) => {
  return (
    <>
      <header
        id="header"
        className="header-sticky sticky-active"
        data-fullwidth="true"
        style={{
          marginBottom: "60px",
        }}
      >
        <div
          className="header-inner"
          style={{
            height: "120px",
          }}
        >
          <div className="container">
            <div id="logo">
              <a
                href="/"
                className="logo vcenter"
                data-src-dark="/img/img-logo.png"
                style={{ fontFamily: "Cassannet", fontSize: "16px" }}
              >
                <img
                  src={logo}
                  alt="Form Builder"
                  style={
                    isMobile
                      ? {
                          marginTop: "7px",
                          display: "inline-block",
                          width: "200px",
                        }
                      : {
                          display: "inline-block",
                          width: "200px",
                          height: "auto",
                        }
                  }
                  className={isMobile ? "p-l-20 p-r-15" : "p-r-20 "}
                />
                DFWCZ Form Builder
              </a>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
