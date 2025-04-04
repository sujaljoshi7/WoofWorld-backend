import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../../api";
import logo from "../../assets/images/logo/logo1.png";
import phone from "../../assets/images/icons/phone.png";
import email from "../../assets/images/icons/email.png";
import whatsapp from "../../assets/images/icons/whatsapp.png";
import linkedin from "../../assets/images/icons/linkedin.png";
import location_pin from "../../assets/images/icons/location.png";
import facebook from "../../assets/images/icons/facebook.png";
import instagram from "../../assets/images/icons/instagram.png";
import twitter from "../../assets/images/icons/twitter.png";
import amex from "../../assets/images/icons/amex.png";
import master from "../../assets/images/icons/master.png";
import visa from "../../assets/images/icons/visa.png";
import upi from "../../assets/images/icons/upi.webp";
import animated_dog from "../../assets/images/icons/animated-dog.gif";
import "../../styles/Footer.css";

const Footer = () => {
  const [navbarItems, setNavbarItems] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const fetchNavbarItems = async () => {
      try {
        const { data } = await api.get("/api/navbar/");
        if (Array.isArray(data)) {
          const structuredNavbar = processNavbarData(
            data.filter((item) => item.status === 1)
          );
          setNavbarItems(structuredNavbar);
        }
      } catch (error) {
        console.error("Failed to fetch navbar items:", error);
      }
    };
    fetchNavbarItems();
  }, []);

  const processNavbarData = (items) => {
    const itemMap = {};
    items.forEach((item) => (itemMap[item.id] = { ...item, subItems: [] }));
    return items.reduce((menu, item) => {
      if (item.dropdown_parent && itemMap[item.dropdown_parent]) {
        itemMap[item.dropdown_parent].subItems.push(itemMap[item.id]);
      } else {
        menu.push(itemMap[item.id]);
      }
      return menu;
    }, []);
  };

  return (
    <footer className="text-dark py-3" style={{ backgroundColor: "#ffec00" }}>
      <div className="container">
        <div className="row">
          {/* Left Section (30%) - Branding */}
          <div className="col-md-4 d-flex flex-column align-items-start">
            <img src={logo} alt="WoofWorld Logo" className="mb-3" width={200} />
            <p className="p-0 m-0">Your Trusted Partner for Dog Care</p>
            <hr
              stylef={{
                height: "2px",
                color: "bloack",
                backgroundColor: "black",
                width: "70%",
              }}
            />
            <h5>Contact Us</h5>
            <ul className="list-unstyled mt-2">
              <li className="d-flex align-items-center">
                <img src={phone} alt="Phone" height={18} />
                <span className="ms-2">+91 9974137635</span>
              </li>
              <li className="d-flex align-items-center mt-2">
                <img src={email} alt="Email" height={18} />
                <span className="ms-2">contact@woofworld.com</span>
              </li>
              <li className="d-flex align-items-center mt-2">
                <img src={location_pin} alt="Location" height={18} />
                <span className="ms-2">Ahmedabad, Gujarat, India</span>
              </li>
              <li className="mt-3">
                <strong>Working Hours:</strong>
                <p className="mb-0">Mon - Fri: 9:00 AM - 6:00 PM</p>
                <p>Sat - Sun: 10:00 AM - 4:00 PM</p>
              </li>
            </ul>
            <img src={animated_dog} border="0" alt="animated-dog-image-0718" />
          </div>

          {/* Right Section (70%) - Contact & Quick Links */}
          <div className="col-md-8">
            <div className="d-flex justify-content-end mb-3">
              <a
                href="https://www.facebook.com/"
                target="_blank"
                className="me-3 social-icons"
              >
                <img src={facebook} alt="Facebook" height={24} />
              </a>
              <a
                href="https://www.x.com/"
                target="_blank"
                className="me-3 social-icons"
              >
                <img src={twitter} alt="Twitter" height={24} />
              </a>
              <a
                href="https://www.instagram.com/"
                target="_blank"
                className="me-3 social-icons"
              >
                <img src={instagram} alt="Instagram" height={24} />
              </a>
              <a
                href="https://www.linkedin.com/"
                target="_blank"
                className="social-icons"
              >
                <img src={linkedin} alt="LinkedIn" height={24} />
              </a>
            </div>
            <div className="row">
              {/* Contact Us Section */}
              <div className="col-md-12">
                {/* Newsletter Section */}
                <div className="text-center mt-4">
                  <h5>Subscribe to Our Newsletter</h5>
                  <p className="text-muted">
                    Get the latest updates on dog care, adoption, and events.
                  </p>
                  <div className="d-flex justify-content-center">
                    <input
                      type="email"
                      className="form-control w-100 p-2"
                      placeholder="Enter your email"
                    />
                    <button className="btn btn-dark ms-2">Subscribe</button>
                  </div>
                </div>
              </div>

              {/* Quick Links Section */}
              <div className="col-md-12">
                <h3 className="mt-5 text-center">Quick Links</h3>
                <hr
                  style={{
                    height: "2px",
                    color: "bloack",
                    backgroundColor: "black",
                    width: "100%",
                  }}
                />
                <div className="row">
                  <div className="col-md-4">
                    <h5>Services</h5>
                    <ul className="list-unstyled mt-2">
                      <li>
                        <a
                          href="/services"
                          className="text-black text-decoration-none"
                        >
                          Grooming
                        </a>
                      </li>
                      <li>
                        <a
                          href="/services"
                          className="text-black text-decoration-none"
                        >
                          Training
                        </a>
                      </li>
                      <li>
                        <a
                          href="/services"
                          className="text-black text-decoration-none"
                        >
                          Boarding
                        </a>
                      </li>
                      <li>
                        <a
                          href="/services"
                          className="text-black text-decoration-none"
                        >
                          Daycare
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className="col-md-4">
                    <h5>Products</h5>
                    <ul className="list-unstyled mt-2">
                      <li>
                        <a
                          href="/products"
                          className="text-black text-decoration-none"
                        >
                          Food & Treats
                        </a>
                      </li>
                      <li>
                        <a
                          href="/products"
                          className="text-black text-decoration-none"
                        >
                          Accessories
                        </a>
                      </li>
                      <li>
                        <a
                          href="/products"
                          className="text-black text-decoration-none"
                        >
                          Toys
                        </a>
                      </li>
                      <li>
                        <a
                          href="/products"
                          className="text-black text-decoration-none"
                        >
                          Apparel
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className="col-md-4">
                    <h5>Company</h5>
                    <ul className="list-unstyled mt-2">
                      <li>
                        <a
                          href="/about"
                          className="text-black text-decoration-none"
                        >
                          About Us
                        </a>
                      </li>
                      <li>
                        <a
                          href="/contact"
                          className="text-black text-decoration-none"
                        >
                          Contact Us
                        </a>
                      </li>
                      <li>
                        <a
                          href="/faq"
                          className="text-black text-decoration-none"
                        >
                          FAQs
                        </a>
                      </li>
                      <li>
                        <a
                          href="/privacy"
                          className="text-black text-decoration-none"
                        >
                          Privacy Policy
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="d-flex justify-content-between align-items-center mt-4 border-top border-dark pt-3">
          <p className="mb-0">© 2025 WoofWorld. All rights reserved.</p>
          <div>
            <img src={master} alt="MasterCard" height={60} className="me-2" />
            <img src={visa} alt="Visa" height={40} className="me-2" />
            <img src={upi} alt="Visa" height={20} className="ms-2" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
