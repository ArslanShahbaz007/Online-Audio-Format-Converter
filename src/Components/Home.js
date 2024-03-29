import React from "react";
import Navbar from "./Navbar";
import Dropzone from "./Dropzone";
import Footer from "./Footer";
import "./Home.css";
function Home() {
  return (
    <>
      <div className="content-container">
        <div>
          <Navbar />
        </div>
        <div className="contain">
          <h1 style={{color: "black", fontSize: "2.2rem", fontWeight: "bold", marginBottom:'1em'}}>
          Audio Format Converter: Convert Your Audio Files Online
          </h1>
          <p>
          Elevate your auditory journey effortlessly with Audio Format Converter, the leading web-based solution for converting audio formats with precision and ease. Whether you're an avid audiophile, a dynamic content creator, or simply aiming to enrich your digital sound collection, SonicShift presents an intuitive platform equipped with robust conversion tools, catering to all your audio format requirements.
          </p>
        </div>

        <div>
          <Dropzone />
        </div>
      </div>

      <div style={{marginTop:'8rem'}}>
        <Footer />
      </div>
    </>
  );
}

export default Home;
