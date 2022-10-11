import React from "react";
import { Logo } from "./../components";
import main from "../assets/images/main.svg";
import Wrapper from "./../assets/wrappers/LandingPage";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <Wrapper>
      <nav>
        <Logo />
      </nav>
      <div className="container page">
        <div className="info">
          <h1>
            job <span>tracking</span> app
          </h1>
          <p>
            I{`&apos`}m baby paleo pok pok tilde blue bottle. Vaporware hexagon
            jianbing succulents echo park. Af mlkshk YOLO tonx raw denim freegan
            disrupt taxidermy bespoke letterpress subway tile tbh live-edge.
          </p>
          <Link to="/register" className="btn btn-hero">
            Login/Register
          </Link>
        </div>
        <img src={main} alt="job hunt" className="img main-img" />
      </div>
    </Wrapper>
  );
};

export default Landing;
