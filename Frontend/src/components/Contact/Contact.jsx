import React from "react";
import "./Contact.css";
import { MdEmail, MdPhone } from "react-icons/md";

const Contact = () => {
  return (
    <div id="contact-us" className="c-wrapper">
      <div className="paddings innerWidth flexCenter c-container">
        {/* Left Side */}
        <div className="flexColStart c-left">
          <span className="orangeText">Contact Us</span>
          <span className="primaryText">Get in Touch</span>
          <span className="secondaryText">
            We are here to assist you. Reach out to us anytime!
          </span>

          {/* Contact Details */}
          <div className="flexColStart contactModes">
            <div className="flexStart row">
              {/* Email */}
              <div className="flexColCenter mode">
                <div className="flexStart">
                  <div className="flexCenter icon">
                    <MdEmail size={25} />
                  </div>
                  <div className="flexColStart detail">
                    <span className="primaryText">Email</span>
                    <span className="secondaryText">support@infraestate.com</span>
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="flexColCenter mode">
                <div className="flexStart">
                  <div className="flexCenter icon">
                    <MdPhone size={25} />
                  </div>
                  <div className="flexColStart detail">
                    <span className="primaryText">Phone</span>
                    <span className="secondaryText">+92 308 9511144</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="flexEnd c-right">
          <div className="image-container">
            <img src="./contact.jpg" alt="Contact Us" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
