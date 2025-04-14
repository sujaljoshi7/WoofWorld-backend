import React from "react";
// import { Link } from "wouter";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import our_story from "../../assets/images/about/our_story.jpg";
import walking from "../../assets/images/about/walking.jpg";
import care_taker from "../../assets/images/about/care_taker.jpg";
import bath from "../../assets/images/about/bath.jpg";
import vaccination from "../../assets/images/about/vaccination.jpg";
import "../../styles/Home.css";
const AboutUs = () => {
  return (
    <div>
      <Navbar />
      <div className="container my-5">
        {/* Hero Section */}
        <div className="row mb-5">
          <div className="col-lg-8 mx-auto text-center">
            <h1 className="display-4 fw-bold mb-4">About WoofWorld</h1>
            <p className="lead mb-4">
              We're on a mission to create a better world for dogs and their
              human companions through quality products, services, and community
              initiatives.
            </p>
            <div className="d-flex justify-content-center gap-3">
              <Link
                to="/adoption"
                className="btn yellow-bg btn-lg px-4"
                onClick={() => window.scrollTo(0, 0)}
              >
                Adopt a Dog
              </Link>
              <Link
                to="/contact"
                className="btn btn-outline-secondary btn-lg px-4"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>

        {/* Our Story Section */}
        <div className="row mb-5">
          <div className="col-lg-6">
            <img
              src={our_story}
              alt="Our Story"
              className="img-fluid rounded w-100 h-100 object-fit-cover"
              style={{ minHeight: "350px" }}
            />
          </div>
          <div className="col-lg-6 d-flex flex-column justify-content-center">
            <h2 className="display-6 fw-bold mb-3">Our Story</h2>
            <p className="fs-5">
              PawsForever was founded in 2015 by a group of passionate dog
              lovers who recognized the need for a comprehensive platform
              dedicated to enhancing the lives of dogs and their owners. What
              started as a small pet store in Seattle has grown into a
              nationwide community supporting dog adoption, quality products,
              and educational resources.
            </p>
            <p className="fs-5">
              Today, we're proud to have helped over 10,000 dogs find their
              forever homes and to have built a community of over 500,000 dog
              lovers who share our passion for canine well-being.
            </p>
          </div>
        </div>

        {/* Our Mission Section */}
        <div className="row mb-5 bg-light py-5 rounded-3">
          <div className="col-lg-8 mx-auto text-center">
            <h2 className="display-6 fw-bold mb-3">Our Mission</h2>
            <p className="fs-5 mb-4">
              To create meaningful connections between dogs and humans through
              ethical adoption practices, quality products, comprehensive
              services, and educational resources.
            </p>
            <div className="row g-4 mt-3">
              <div className="col-md-4">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body text-center">
                    <div
                      className="rounded-circle bg-warning bg-opacity-10 p-3 mx-auto mb-3"
                      style={{ width: "80px", height: "80px" }}
                    >
                      <i className="fa-solid fa-paw fs-2 text-warning"></i>
                    </div>
                    <h5 className="card-title fw-bold">Ethical Adoption</h5>
                    <p className="card-text">
                      Connecting dogs with loving forever homes through thorough
                      vetting and matching.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body text-center">
                    <div
                      className="rounded-circle bg-warning bg-opacity-10 p-3 mx-auto mb-3"
                      style={{ width: "80px", height: "80px" }}
                    >
                      <i className="fa-solid fa-heart fs-2 text-warning"></i>
                    </div>
                    <h5 className="card-title fw-bold">Quality Care</h5>
                    <p className="card-text">
                      Providing premium products and services that enhance
                      canine health and happiness.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body text-center">
                    <div
                      className="rounded-circle bg-warning bg-opacity-10 p-3 mx-auto mb-3"
                      style={{ width: "80px", height: "80px" }}
                    >
                      <i className="fa-solid fa-book fs-2 text-warning"></i>
                    </div>
                    <h5 className="card-title fw-bold">Education</h5>
                    <p className="card-text">
                      Empowering dog owners with knowledge to provide the best
                      care for their pets.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Our Services Section */}
        <div className="row mb-5">
          <div className="col-12 text-center mb-4">
            <h2 className="display-6 fw-bold">What We Offer</h2>
            <p className="fs-5 mx-auto" style={{ maxWidth: "700px" }}>
              Our comprehensive suite of dog-focused services and products
              ensures your furry friend receives the best care possible.
            </p>
          </div>

          <div className="col-md-6 col-lg-3 mb-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body">
                <div className="text-warning mb-3">
                  <i className="fa-solid fa-house-chimney fa-2x"></i>
                </div>
                <h5 className="card-title fw-bold">Dog Adoption</h5>
                <p className="card-text">
                  Find your perfect canine companion through our ethical,
                  thorough adoption process.
                </p>
                <Link
                  to="/adoption"
                  className="btn btn-sm btn-outline-warning mt-2"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-3 mb-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body">
                <div className="text-warning mb-3">
                  <i className="fa-solid fa-bowl-food fa-2x"></i>
                </div>
                <h5 className="card-title fw-bold">Premium Dog Food</h5>
                <p className="card-text">
                  Nutritionally balanced, high-quality food options for dogs of
                  all ages and needs.
                </p>
                <Link
                  to="/shop"
                  className="btn btn-sm btn-outline-warning mt-2"
                >
                  Shop Now
                </Link>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-3 mb-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body">
                <div className="text-warning mb-3">
                  <i className="fa-solid fa-scissors fa-2x"></i>
                </div>
                <h5 className="card-title fw-bold">Grooming Services</h5>
                <p className="card-text">
                  Professional grooming to keep your dog clean, healthy, and
                  looking their best.
                </p>
                <Link
                  to="/services"
                  className="btn btn-sm btn-outline-warning mt-2"
                >
                  Book Now
                </Link>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-3 mb-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body">
                <div className="text-warning mb-3">
                  <i className="fa-solid fa-calendar-check fa-2x"></i>
                </div>
                <h5 className="card-title fw-bold">Dog Events</h5>
                <p className="card-text">
                  Community events, training workshops, and socialization
                  opportunities for dogs and owners.
                </p>
                <Link
                  to="/events"
                  className="btn btn-sm btn-outline-warning mt-2"
                >
                  See Events
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="row mb-5">
          <div className="col-12 text-center mb-4">
            <h2 className="display-6 fw-bold">Our Leadership Team</h2>
            <p className="fs-5 mx-auto" style={{ maxWidth: "700px" }}>
              Meet the dedicated professionals who are passionate about
              improving the lives of dogs everywhere.
            </p>
          </div>

          <div className="col-md-6 col-lg-3 mb-4">
            <div className="card border-0 shadow-sm">
              <img
                src={walking}
                alt="Aarav Mehta"
                className="card-img-top"
                style={{ height: "250px", objectFit: "cover" }}
              />
              <div className="card-body text-center">
                <h5 className="card-title fw-bold">Aarav Mehta</h5>
                <p className="card-text text-muted">Dog Walker</p>
                <p className="card-text small text-justify">
                  Aarav ensures dogs get daily exercise, fresh air, and
                  socialization through safe, engaging walks while monitoring
                  their health and behavior carefully.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-3 mb-4">
            <div className="card border-0 shadow-sm">
              <img
                src={care_taker}
                alt="Priya Sharma"
                className="card-img-top"
                style={{ height: "250px", objectFit: "cover" }}
              />
              <div className="card-body text-center">
                <h5 className="card-title fw-bold">Priya Sharma</h5>
                <p className="card-text text-muted">Dog Caretaker</p>
                <p className="card-text small text-justify">
                  Provides affectionate care, feeding, and companionship,
                  ensuring a comfortable and stress-free environment for every
                  dog.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-3 mb-4">
            <div className="card border-0 shadow-sm">
              <img
                src={bath}
                alt="Neha Patel"
                className="card-img-top"
                style={{ height: "250px", objectFit: "cover" }}
              />
              <div className="card-body text-center">
                <h5 className="card-title fw-bold">Neha Patel</h5>
                <p className="card-text text-muted">Dog Groomer</p>
                <p className="card-text small text-justify">
                  Specializes in gentle dog baths, coat cleaning, and hygiene
                  maintenance, ensuring dogs look fresh and feel comfortable.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-3 mb-4">
            <div className="card border-0 shadow-sm">
              <img
                src={vaccination}
                alt="Milana"
                className="card-img-top"
                style={{ height: "250px", objectFit: "cover" }}
              />
              <div className="card-body text-center">
                <h5 className="card-title fw-bold">Milana Oberoi</h5>
                <p className="card-text text-muted">Veterinary Assistant</p>
                <p className="card-text small">
                  Administers vaccinations, monitors health, and educates pet
                  parents on preventive care to keep dogs healthy and
                  disease-free.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="row mb-5 py-5 bg-light rounded-3">
          <div className="col-12 text-center mb-4">
            <h2 className="display-6 fw-bold">What Our Community Says</h2>
            <p className="fs-5 mx-auto" style={{ maxWidth: "700px" }}>
              We're proud to have helped thousands of dogs and their owners live
              happier, healthier lives together.
            </p>
          </div>

          <div className="col-md-4 mb-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body">
                <div className="mb-3 text-warning">
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                </div>
                <p className="card-text fst-italic">
                  "I adopted my dog Max through PawsForever two years ago, and
                  it was the best decision of my life. Their thorough matching
                  process ensured we were perfect for each other, and their
                  follow-up support has been amazing."
                </p>
                <div className="d-flex align-items-center">
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      overflow: "hidden",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundImage:
                        "url(https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80)",
                    }}
                    className="me-3"
                  ></div>
                  <div>
                    <h6 className="mb-0 fw-bold">Jennifer Walker</h6>
                    <small className="text-muted">Dog Mom to Max</small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body">
                <div className="mb-3 text-warning">
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                </div>
                <p className="card-text fst-italic">
                  "The quality of PawsForever's dog food is exceptional. My
                  senior dog has so much more energy since switching, and their
                  subscription service means I never run out. Their team is
                  always available to answer any questions."
                </p>
                <div className="d-flex align-items-center">
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      overflow: "hidden",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundImage:
                        "url(https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80)",
                    }}
                    className="me-3"
                  ></div>
                  <div>
                    <h6 className="mb-0 fw-bold">Robert Martinez</h6>
                    <small className="text-muted">Dog Dad to Bella</small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body">
                <div className="mb-3 text-warning">
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                </div>
                <p className="card-text fst-italic">
                  "I've been attending PawsForever's training workshops for
                  months, and the difference in my dog's behavior is remarkable.
                  Their trainers are knowledgeable, patient, and truly care
                  about creating a strong bond between dogs and their owners."
                </p>
                <div className="d-flex align-items-center">
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      overflow: "hidden",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundImage:
                        "url(https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80)",
                    }}
                    className="me-3"
                  ></div>
                  <div>
                    <h6 className="mb-0 fw-bold">Lisa Thompson</h6>
                    <small className="text-muted">Dog Mom to Charlie</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="row mb-5">
          <div className="col-12 text-center mb-4">
            <h2 className="display-6 fw-bold">Our Impact</h2>
            <p className="fs-5 mx-auto" style={{ maxWidth: "700px" }}>
              Every day, we strive to make a difference in the lives of dogs and
              their human companions.
            </p>
          </div>

          <div className="col-6 col-md-3 text-center mb-4">
            <div className="display-4 fw-bold text-warning mb-1">1K+</div>
            <p className="fs-5">Dogs Adopted</p>
          </div>

          <div className="col-6 col-md-3 text-center mb-4">
            <div className="display-4 fw-bold text-warning mb-1">4K+</div>
            <p className="fs-5">Community Members</p>
          </div>

          <div className="col-6 col-md-3 text-center mb-4">
            <div className="display-4 fw-bold text-warning mb-1">10+</div>
            <p className="fs-5">Partner Shelters</p>
          </div>

          <div className="col-6 col-md-3 text-center mb-4">
            <div className="display-4 fw-bold text-warning mb-1">₹500K+</div>
            <p className="fs-5">Donated to Causes</p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="row">
          <div className="col-12">
            <div className="yellow-bg text-dark p-5 rounded-3 text-center">
              <h2 className="display-6 fw-bold mb-3">Join Our Mission</h2>
              <p className="fs-5 mb-4">
                Whether you're looking to adopt, shop, or simply learn more
                about caring for your dog, we're here to help. Join our
                community of dog lovers today.
              </p>
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <Link to="/adoption" className="btn btn-dark btn-lg px-4">
                  Adopt a Dog
                </Link>
                <Link to="/shop" className="btn btn-outline-dark btn-lg px-4">
                  Shop Products
                </Link>
                <Link
                  to="/blogs"
                  onClick={() => window.scrollTo(0, 0)}
                  className="btn btn-outline-dark btn-lg px-4"
                >
                  Read Our Blog
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
