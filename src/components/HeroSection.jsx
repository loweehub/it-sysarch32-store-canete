import React from "react";

function HeroSection() {
    const heroStyle = {
        backgroundImage: `url('https://firebasestorage.googleapis.com/v0/b/it-sysarch32-store-canete.appspot.com/o/shoesBG.jpg?alt=media&token=b0f99a6c-3c29-49f2-9f10-440a2ff13633')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "500px", 
        position: "relative",
        marginBottom: "50px",
        marginTop: "15px",
        borderRadius: "10px", 
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        color: "#fff",
      };
      

  const overlayStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)", 
    borderRadius: "10px", 
  };

  const textStyle = {
    zIndex: 1, 
  };

  return (
    <div style={heroStyle}>
      <div style={overlayStyle}></div>
      <div style={textStyle}>
        <h1>New shoes everyday</h1>
        {}
      </div>
    </div>
  );
}

export default HeroSection;