import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../../api";
import logo from "../../assets/images/logo/logo1.png";
import phone from "../../assets/images/icons/phone.png";
import email from "../../assets/images/icons/email.png";
import skype from "../../assets/images/icons/skype.png";
import location_pin from "../../assets/images/icons/location.png";
import facebook from "../../assets/images/icons/facebook.png";
import instagram from "../../assets/images/icons/instagram.png";
import twitter from "../../assets/images/icons/twitter.png";
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
    <footer className="bg-warning text-black py-5">
      <div className="container">
        <div className="row">
          {/* Left Section (30%) - Branding */}
          <div className="col-md-4 d-flex flex-column align-items-start">
            <img src={logo} alt="WoofWorld Logo" className="mb-3" width={200} />
            <p>Your Trusted Partner for Dog Care</p>
            <div className="d-flex gap-3 mt-2">
              <img
                src={facebook}
                alt="Facebook"
                height={24}
                className="cursor-pointer"
              />
              <img
                src={twitter}
                alt="Twitter"
                height={24}
                className="cursor-pointer"
              />
              <img
                src={instagram}
                alt="Instagram"
                height={24}
                className="cursor-pointer"
              />
            </div>
          </div>

          {/* Right Section (70%) - Contact & Quick Links */}
          <div className="col-md-8">
            <div className="row">
              {/* Contact Us Section */}
              <div className="col-md-6">
                <h5>Contact Us</h5>
                <ul className="list-unstyled mt-2">
                  <li className="d-flex align-items-center">
                    <img src={phone} alt="Phone" height={18} />
                    <span className="ms-2">+91 994137635</span>
                  </li>
                  <li className="d-flex align-items-center mt-2">
                    <img src={email} alt="Email" height={18} />
                    <span className="ms-2">ballu@badmash.com</span>
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
              </div>

              {/* Quick Links Section */}
              <div className="col-md-6">
                <h5>Quick Links</h5>
                <ul className="list-unstyled mt-2">
                  <li>
                    <a href="#" className="text-black text-decoration-none">
                      About Us
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-black text-decoration-none">
                      Services
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-black text-decoration-none">
                      Adoption
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-black text-decoration-none">
                      Events
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-black text-decoration-none">
                      FAQs
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="text-center mt-4">
          <h5>Subscribe to Our Newsletter</h5>
          <p className="text-muted">
            Get the latest updates on dog care, adoption, and events.
          </p>
          <div className="d-flex justify-content-center">
            <input
              type="email"
              className="form-control w-50 p-2"
              placeholder="Enter your email"
            />
            <button className="btn btn-dark ms-2">Subscribe</button>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="text-center mt-4 border-top pt-3">
          <p className="mb-0">© 2025 WoofWorld. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
