import React, { useEffect, useRef, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser"; // 1. Importamos la librería

const sideImageUrl = "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070&auto=format&fit=crop";
const journeyImageUrl = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";

export const Home = () => {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();
  
  // 2. Referencia para el formulario y estado de carga
  const form = useRef();
  const [isSending, setIsSending] = useState(false);

  const loadMessage = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined");
      const response = await fetch(backendUrl + "/api/hello");
      const data = await response.json();
      if (response.ok) dispatch({ type: "set_hello", payload: data.message });
    } catch (error) {
      console.error(error);
    }
  };

  const loadMenusAndRestaurants = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const respMenus = await fetch(backendUrl + "/api/menus");
      if (respMenus.ok) {
        const dataMenus = await respMenus.json();
        dispatch({ type: "set_menus", payload: dataMenus });
      }
      const respRestos = await fetch(backendUrl + "/api/restaurants");
      if (respRestos.ok) {
        const dataRestos = await respRestos.json();
        dispatch({ type: "set_restaurants", payload: dataRestos });
      }
    } catch (error) {
      console.error("Error fetching data for home:", error);
    }
  };

  useEffect(() => {
    loadMessage();
    loadMenusAndRestaurants();
  }, []);

  
  const sendEmail = (e) => {
    e.preventDefault();
    setIsSending(true);

    
    const SERVICE_ID = "service_82zai09"; 
    const TEMPLATE_ID = "template_cgve0ys";      
    const PUBLIC_KEY = "cHFTu0TxS2OEjV4qo";
    

    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form.current, PUBLIC_KEY)
      .then((result) => {
        alert("¡Mensaje enviado con éxito! Nos vemos pronto en TableNow.");
        form.current.reset();
      }, (error) => {
        console.error(error.text);
        alert("Ocurrió un error. Por favor intenta de nuevo.");
      })
      .finally(() => {
        setIsSending(false);
      });
  };

  return (
    <div className="home-wrapper">
      {/* SECCIÓN HERO */}
      <div className="home-container">
        <div className="text-side">
          <span className="brand-badge">Reservations Open</span>
          <h1 className="main-title">
            Savor the Moment, <br /> 
            <span style={{ color: "#c5a47e" }}>One Click</span> at a Time
          </h1>
          <p className="sub-text">
            Discover a journey of flavors at our exquisite restaurants. 
            Immerse yourself in a delightful dining experience crafted 
            with passion and precision.
          </p>
          <div className="d-flex flex-wrap">
            <button className="btn btn-luxury btn-fill" onClick={() => navigate("/clients")}>
              Book a Table
            </button>
            <button className="btn btn-luxury btn-outline" onClick={() => navigate("/gerentes")}>
              Explore System
            </button>
          </div>
          <div className="mt-5 pt-4 admin-access-section">
             <p className="admin-label">Admin Access</p>
             <button className="btn p-0 text-white admin-btn" onClick={() => navigate("/owners")}>
                Dashboard Owners →
             </button>
          </div>
        </div>
        <div className="image-side"></div>
      </div>

      {/* SECCIÓN: ABOUT TABLE NOW */}
      <div className="journey-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-5 mb-lg-0">
              <span className="brand-badge">Elevating Experiences</span>
              <h2 className="section-title">About TableNow</h2>
              <p className="journey-text">
                TableNow was born from the idea that booking a table should be as exquisite as the meal itself. 
                We bridge the gap between world-class gastronomy and seamless technology, allowing you to 
                secure your spot at the finest culinary destinations in just seconds.
              </p>
              <p className="journey-text">
                Whether it's a romantic dinner, a business meeting, or a family celebration, our platform 
                ensures that your table is ready and waiting, so you can focus on what truly matters: 
                the flavors and the company.
              </p>
              <div className="chef-quote">
                <div className="quote-icon">"</div>
                <p>
                  "In every reservation, there is a promise of a new memory. TableNow isn't just a booking tool; 
                  it's the first step toward a perfect evening."
                  <br /><strong>— The TableNow Team</strong>
                </p>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="journey-image-wrapper">
                <img src={journeyImageUrl} alt="Elegant Restaurant" className="img-fluid journey-img" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN: CARACTERÍSTICAS Y STATS */}
      <div className="features-section">
        <div className="container">
          <div className="row text-center">
            <div className="col-md-3 col-6 feature-card">
              <div className="feature-icon">🏆</div>
              <h4>Premium Selection</h4>
              <p>Only the highest-rated restaurants in the city.</p>
            </div>
            <div className="col-md-3 col-6 feature-card">
              <div className="feature-icon">⚡</div>
              <h4>Instant Booking</h4>
              <p>Real-time availability with immediate confirmation.</p>
            </div>
            <div className="col-md-3 col-6 feature-card">
              <div className="feature-icon">👥</div>
              <h4>Smart Management</h4>
              <p>Exclusive tools for restaurant owners and managers.</p>
            </div>
            <div className="col-md-3 col-6 feature-card">
              <div className="feature-icon">✨</div>
              <h4>Seamless UI</h4>
              <p>A luxury experience designed for effortless use.</p>
            </div>
          </div>

          <div className="row stats-row text-center mt-5">
            <div className="col-md-3 stats-item">
              <h3 className="stat-number">50+</h3>
              <p>Partner Restaurants</p>
            </div>
            <div className="col-md-3 stats-item">
              <h3 className="stat-number">24/7</h3>
              <p>System Uptime</p>
            </div>
            <div className="col-md-3 stats-item">
              <h3 className="stat-number">0</h3>
              <p>Booking Fees</p>
            </div>
            <div className="col-md-3 stats-item">
              <h3 className="stat-number">2k+</h3>
              <p>Monthly Guests</p>
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN: SIGNATURE MENUS */}
      <div className="signature-menus-section">
        <div className="container">
          <div className="text-center mb-5">
            <span className="brand-badge text-center w-100 d-block">Culinary Masterpieces</span>
            <h2 className="section-title">Our Signature Menus</h2>
            <p className="sub-text mx-auto" style={{ maxWidth: "600px", color: "#aaa" }}>
              Explore a curated selection of our most exquisite dishes, prepared by top chefs across our partner restaurants.
            </p>
          </div>

          <div className="row g-4">
            {store.menus && store.menus.length > 0 ? (
              store.menus.slice(0, 6).map((item) => {
                const restaurantName = store.restaurants?.find(r => r.id === parseInt(item.restaurante_id))?.nombre 
                                       || store.restaurants?.find(r => r.id === parseInt(item.restaurante_id))?.name 
                                       || "Exclusive Location";

                return (
                  <div key={item.id} className="col-lg-4 col-md-6">
                    <div className="menu-card">
                      <div className="menu-img-wrapper">
                        <img 
                          src={item.foto || "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=400&auto=format&fit=crop"} 
                          alt={item.nombre} 
                          className="menu-img" 
                        />
                        <div className="menu-price-tag">${item.precio}</div>
                      </div>
                      <div className="menu-info">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h4 className="menu-title">{item.nombre}</h4>
                          <span className="menu-category">{item.categoria}</span>
                        </div>
                        <div className="menu-restaurant mb-4">
                          <i className="fas fa-map-marker-alt me-2" style={{ color: "#c5a47e" }}></i>
                          {restaurantName}
                        </div>
                        <button className="btn btn-luxury btn-outline w-100 py-2" onClick={() => navigate("/clients")}>
                          Book to Taste
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-12 text-center py-5">
                <i className="fas fa-utensils fa-3x mb-3" style={{ color: "rgba(197, 164, 126, 0.3)" }}></i>
                <p style={{ color: "#aaa", fontStyle: "italic" }}>Curating our exquisite menu... Please check back soon.</p>
              </div>
            )}
          </div>
          
          {store.menus && store.menus.length > 6 && (
            <div className="text-center mt-5">
              <button className="btn btn-luxury btn-fill" onClick={() => navigate("/clients")}>
                View All Experiences
              </button>
            </div>
          )}
        </div>
      </div>

      {/* SECCIÓN: GALLERY & SOCIAL VIBE */}
      <div className="gallery-vibe-section py-5">
        <div className="container">
          <div className="text-center mb-5 galeria-header">
            <span className="brand-badge text-center w-100 d-block">Experience the Atmosphere</span>
            <h2 className="section-title text-white">Moments at TableNow</h2>
            <p className="sub-text mx-auto text-white-50" style={{ maxWidth: "600px" }}>
              Join the elite circle of diners enjoying unforgettable evenings. 
              Our restaurants are more than just food; they are about connections.
            </p>
          </div>

          <div className="row g-3 galeria-grid">
            {/* Imagen Grande Izquierda */}
            <div className="col-lg-6 col-md-12">
              <div className="gallery-item large-item rounded-4 overflow-hidden shadow-lg position-relative">
                <img 
                  src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop" 
                  alt="People enjoying dinner" 
                  className="w-100 h-100 object-fit-cover transition-all galeria-img"
                />
                <div className="img-overlay position-absolute bottom-0 start-0 w-100 p-4 text-white">
                  <h5 className="mb-1 fw-bold">Unforgettable Evenings</h5>
                  <p className="small mb-0 text-white-50">Laughter, wine, and exquisite taste.</p>
                </div>
              </div>
            </div>

            {/* Grid */}
            <div className="col-lg-6 col-md-12">
              <div className="row g-3">
                {/* Top Left */}
                <div className="col-6">
                  <div className="gallery-item small-item rounded-4 overflow-hidden shadow position-relative">
                    <img 
                      src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600&auto=format&fit=crop" 
                      alt="Elegant interior" 
                      className="w-100 h-100 object-fit-cover transition-all galeria-img"
                    />
                  </div>
                </div>
                {/* Top Right */}
                <div className="col-6">
                  <div className="gallery-item small-item rounded-4 overflow-hidden shadow position-relative">
                    <img 
                      src="https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=600&auto=format&fit=crop" 
                      alt="Friends toasting" 
                      className="w-100 h-100 object-fit-cover transition-all galeria-img"
                    />
                  </div>
                </div>
                {/* Bottom Left */}
                <div className="col-6">
                  <div className="gallery-item small-item rounded-4 overflow-hidden shadow position-relative">
                    <img 
                      src="https://images.unsplash.com/photo-1560624052-449f5ddf0c31?q=80&w=600&auto=format&fit=crop" 
                      alt="Couple dining" 
                      className="w-100 h-100 object-fit-cover transition-all galeria-img"
                    />
                  </div>
                </div>
                {/* Bottom Right */}
                <div className="col-6">
                  <div className="gallery-item small-item rounded-4 overflow-hidden shadow position-relative">
                    <img 
                      src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=600&auto=format&fit=crop" 
                      alt="Gourmet dish presentation" 
                      className="w-100 h-100 object-fit-cover transition-all galeria-img"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-5 galeria-footer">
            <button className="btn btn-luxury btn-outline" onClick={() => navigate("/clients")}>
              Book Your Moment →
            </button>
          </div>
        </div>
      </div>

      {/* SECCIÓN: TESTIMONIALS */}
      <div className="testimonials-section">
        <div className="container">
          <div className="text-center mb-5">
            <span className="brand-badge text-center w-100 d-block">Guest Experiences</span>
            <h2 className="section-title">What They Say</h2>
          </div>

          <div className="row g-4">
            <div className="col-lg-4">
              <div className="testimonial-card">
                <div className="stars">★★★★★</div>
                <p className="testimonial-text">
                  "The most seamless booking experience I've ever had. TableNow curated a 
                  perfect anniversary dinner for us. The interface is as elegant as the 
                  restaurants they feature."
                </p>
                <div className="guest-info">
                  <img src="https://i.pravatar.cc/150?u=sarah" alt="Guest" className="guest-avatar" />
                  <div>
                    <h6 className="guest-name">Sarah Jenkins</h6>
                    <p className="guest-title">Food Enthusiast</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="testimonial-card featured-testimonial">
                <div className="stars">★★★★★</div>
                <p className="testimonial-text">
                  "As a restaurant owner, TableNow has transformed how we manage our 
                  reservations. The admin dashboard is intuitive and the support team 
                  is world-class. Truly a game changer."
                </p>
                <div className="guest-info">
                  <img src="https://i.pravatar.cc/150?u=marcus" alt="Guest" className="guest-avatar" />
                  <div>
                    <h6 className="guest-name">Marcus Thorne</h6>
                    <p className="guest-title">Bistro Owner</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="testimonial-card">
                <div className="stars">★★★★★</div>
                <p className="testimonial-text">
                  "Exquisite attention to detail. I love how I can see the signature dishes 
                  before even arriving. It makes choosing where to dine an absolute 
                  pleasure every single time."
                </p>
                <div className="guest-info">
                  <img src="https://i.pravatar.cc/150?u=elena" alt="Guest" className="guest-avatar" />
                  <div>
                    <h6 className="guest-name">Elena Rodriguez</h6>
                    <p className="guest-title">Lifestyle Blogger</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN CONTACT US */}
      <div className="contact-section">
        <div className="container">
          <div className="contact-box">
            <div className="row g-0">
              <div className="col-lg-5 contact-info-side">
                <span className="brand-badge">Get in Touch</span>
                <h2 className="section-title mb-4" style={{ fontSize: "2.5rem" }}>Contact TableNow</h2>
                <p className="journey-text mb-5">
                  Have questions about our partner restaurants or need help with a reservation? 
                  Our team is here to ensure your experience is flawless.
                </p>
                
                <div className="contact-item">
                  <div className="contact-icon-mini"><i className="fas fa-envelope"></i></div>
                  <div>
                    <h6>Email Us</h6>
                    <p>concierge@tablenow.com</p>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon-mini"><i className="fas fa-phone-alt"></i></div>
                  <div>
                    <h6>Call Us</h6>
                    <p>+1 (555) 123-4567</p>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon-mini"><i className="fas fa-map-marker-alt"></i></div>
                  <div>
                    <h6>Headquarters</h6>
                    <p>Luxury Row 123, Gastronomy District</p>
                  </div>
                </div>
              </div>

              <div className="col-lg-7 contact-form-side">
                <form ref={form} onSubmit={sendEmail} className="luxury-form">
                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <label className="form-label">Full Name</label>
                      <input 
                        type="text" 
                        name="from_name" 
                        className="form-control luxury-input" 
                        placeholder="John Doe" 
                        required 
                      />
                    </div>
                    <div className="col-md-6 mb-4">
                      <label className="form-label">Email Address</label>
                      <input 
                        type="email" 
                        name="from_email" 
                        className="form-control luxury-input" 
                        placeholder="john@example.com" 
                        required 
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="form-label">Subject</label>
                    <input 
                      type="text" 
                      name="subject" 
                      className="form-control luxury-input" 
                      placeholder="How can we help?" 
                      required 
                    />
                  </div>
                  <div className="mb-4">
                    <label className="form-label">Message</label>
                    <textarea 
                      name="message" 
                      className="form-control luxury-input" 
                      rows="4" 
                      placeholder="Write your message here..." 
                      required
                    ></textarea>
                  </div>
                  <button 
                    type="submit" 
                    className="btn btn-luxury btn-fill w-100 mt-2" 
                    disabled={isSending}
                  >
                    {isSending ? "Sending..." : "Send Message"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    
      {/* FOOTER DE REDES SOCIALES Y LINKS */}
<footer className="footer-section pt-5 pb-3" style={{ backgroundColor: "#000", borderTop: "1px solid #222", color: "#fff" }}>
  <div className="container">
    <div className="row mb-5">
      <div className="col-lg-4 mb-4">
        <h3 style={{ fontFamily: "'Playfair Display', serif", color: "#fff" }}>TableNow</h3>
        <p style={{ color: "#777", fontSize: "0.9rem" }}>
          Conectando paladares exigentes con las mejores mesas del país. La excelencia gastronómica a un click de distancia.
        </p>
        <div className="social-links d-flex gap-3">
          <a href="#" style={{ color: "#fff", fontSize: "1.2rem", border: "1px solid #333", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%" }}><i className="fab fa-x-twitter"></i></a>
          <a href="#" style={{ color: "#fff", fontSize: "1.2rem", border: "1px solid #333", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%" }}><i className="fab fa-facebook-f"></i></a>
          <a href="#" style={{ color: "#fff", fontSize: "1.2rem", border: "1px solid #333", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%" }}><i className="fab fa-instagram"></i></a>
          <a href="#" style={{ color: "#fff", fontSize: "1.2rem", border: "1px solid #333", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%" }}><i className="fab fa-linkedin-in"></i></a>
        </div>
      </div>
      
      <div className="col-lg-2 col-md-4 mb-4">
        <h6 className="text-uppercase mb-4" style={{ color: "#c9a050", fontSize: "0.8rem", letterSpacing: "2px" }}>Useful Links</h6>
        <ul className="list-unstyled" style={{ color: "#777", fontSize: "0.9rem" }}>
          <li className="mb-2"><a href="#" className="text-decoration-none text-reset">Home</a></li>
          <li className="mb-2"><a href="#" className="text-decoration-none text-reset">About Us</a></li>
          <li className="mb-2"><a href="#" className="text-decoration-none text-reset">Services</a></li>
          <li className="mb-2"><a href="#" className="text-decoration-none text-reset">Privacy Policy</a></li>
        </ul>
      </div>

      <div className="col-lg-3 col-md-4 mb-4">
        <h6 className="text-uppercase mb-4" style={{ color: "#c9a050", fontSize: "0.8rem", letterSpacing: "2px" }}>Our Services</h6>
        <ul className="list-unstyled" style={{ color: "#777", fontSize: "0.9rem" }}>
          <li className="mb-2">Table Reservations</li>
          <li className="mb-2">Event Planning</li>
          <li className="mb-2">VIP Concierge</li>
          <li className="mb-2">Corporate Dining</li>
        </ul>
      </div>

      <div className="col-lg-3 col-md-4 mb-4">
        <h6 className="text-uppercase mb-4" style={{ color: "#c9a050", fontSize: "0.8rem", letterSpacing: "2px" }}>Contact Us</h6>
        <p className="mb-1" style={{ color: "#777", fontSize: "0.9rem" }}>A108 Adam Street</p>
        <p className="mb-3" style={{ color: "#777", fontSize: "0.9rem" }}>New York, NY 535022</p>
        <p className="mb-1" style={{ color: "#777", fontSize: "0.9rem" }}><strong>Phone:</strong> +1 5589 55488 55</p>
        <p style={{ color: "#777", fontSize: "0.9rem" }}><strong>Email:</strong> info@tablenow.com</p>
      </div>
    </div>
    
    <div className="footer-bottom text-center pt-4" style={{ borderTop: "1px solid #222", color: "#555", fontSize: "0.8rem" }}>
      <p>© Copyright <strong>TableNow</strong> All Rights Reserved</p>
    </div>
  </div>
</footer>

      {/* Indicador de Conexión */}
      <div className="status-pill">
        <span className="dot" style={{ backgroundColor: store.message ? "#4CAF50" : "#F44336" }}></span>
        <span>{store.message ? `System Online: ${store.message}` : "Connecting to API..."}</span>
      </div>

      {/* ESTILOS */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Montserrat:wght@300;400;600&display=swap');

        .home-wrapper {
          background-color: #111;
          color: #fff;
          min-height: 100vh;
          padding-top:60px
        }

        /* --- HERO SECTION STYLES --- */
        .home-container { display: flex; height: 120vh; width: 100%; align-items: center;}
        .text-side { flex: 1; padding: 0 8%; display: flex; flex-direction: column; justify-content: center; }
        .image-side { 
          flex: 1; height: 90vh; background-image: url('${sideImageUrl}'); 
          background-size: cover; background-position: center; margin-right: 40px; 
          border-radius: 12px; box-shadow: -20px 20px 60px rgba(0,0,0,0.7); 
        }

        .brand-badge {
          font-family: 'Montserrat', sans-serif; color: #c5a47e;
          text-transform: uppercase; letter-spacing: 4px; font-size: 0.8rem;
          margin-bottom: 20px; display: block;
        }

        .main-title, .section-title { font-family: 'Playfair Display', serif; line-height: 1.1; }
        .main-title { font-size: clamp(2.5rem, 5vw, 4.5rem); margin-bottom: 30px; }
        .section-title { font-size: 3rem; margin-bottom: 25px; }

        .sub-text, .journey-text { 
          font-family: 'Montserrat', sans-serif; font-weight: 300; 
          line-height: 1.8; color: #aaa; 
        }
        .sub-text { max-width: 500px; margin-bottom: 40px; }
        .journey-text { margin-bottom: 20px; font-size: 1.05rem; }

        .btn-luxury {
          padding: 15px 35px; border-radius: 0; font-family: 'Montserrat', sans-serif;
          text-transform: uppercase; letter-spacing: 2px; font-size: 0.8rem; transition: all 0.4s ease;
        }
        .btn-fill { background-color: #c5a47e; color: white; border: none; margin-right: 15px; }
        .btn-fill:hover { background-color: #e2c29d; transform: translateY(-3px); }
        .btn-outline { background: transparent; border: 1px solid rgba(255,255,255,0.3); color: white; }
        .btn-outline:hover { background: #c5a47e; border-color: #c5a47e; color: #fff; }

        .admin-access-section { border-top: 1px solid #333; max-width: 400px; }
        .admin-label { font-size: 0.7rem; color: #666; text-transform: uppercase; letter-spacing: 2px; }
        .admin-btn { font-size: 0.8rem; opacity: 0.5; background: none; border: none; }

        /* --- JOURNEY SECTION --- */
        .journey-section { padding: 120px 0; background-color: #0c0c0c; }
        .chef-quote { 
          display: flex; gap: 15px; align-items: flex-start; 
          border-left: 2px solid #c5a47e; padding: 10px 0 10px 25px; 
          font-style: italic; margin-top: 30px;
          transition: all 0.3s ease;
        }
        .quote-icon { font-family: 'Playfair Display', serif; font-size: 3rem; color: #c5a47e; line-height: 1; }
        .journey-image-wrapper { overflow: hidden; border-radius: 15px; box-shadow: 0 30px 60px rgba(0,0,0,0.5); }
        .journey-img { transition: transform 0.8s ease; filter: grayscale(30%); }
        .journey-image-wrapper:hover .journey-img { transform: scale(1.08); filter: grayscale(0%); }

        /* --- SIGNATURE MENUS SECTION --- */
        .signature-menus-section {
          padding: 100px 0;
          background-color: #111;
          background-image: radial-gradient(circle at 50% 50%, rgba(197, 164, 126, 0.03) 0%, transparent 60%);
        }
        .menu-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(197, 164, 126, 0.15);
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.4s ease;
          height: 100%; display: flex; flex-direction: column;
        }
        .menu-card:hover { transform: translateY(-8px); border-color: rgba(197, 164, 126, 0.5); }
        .menu-img-wrapper { position: relative; height: 220px; overflow: hidden; }
        .menu-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
        .menu-price-tag {
          position: absolute; bottom: 15px; left: 15px; background-color: #c5a47e;
          color: #000; font-family: 'Playfair Display', serif; font-weight: bold;
          padding: 5px 15px; border-radius: 4px;
        }
        .menu-info { padding: 25px; flex-grow: 1; display: flex; flex-direction: column; }
        .menu-title { font-family: 'Playfair Display', serif; color: #c5a47e; font-size: 1.3rem; margin: 0; }
        .menu-category {
          font-family: 'Montserrat', sans-serif; font-size: 0.7rem; text-transform: uppercase;
          color: rgba(255,255,255,0.5); background: rgba(255,255,255,0.05); padding: 3px 8px; border-radius: 4px;
        }
        .menu-restaurant { font-family: 'Montserrat', sans-serif; font-size: 0.85rem; color: #aaa; margin-top: auto; }

        /* --- CONTACT SECTION --- */
        .contact-section { padding: 100px 0; background-color: #0c0c0c; }
        .contact-box { 
          background: rgba(255,255,255,0.02); 
          border-radius: 20px; 
          overflow: hidden; 
          border: 1px solid rgba(255,255,255,0.05);
          box-shadow: 0 40px 100px rgba(0,0,0,0.4);
        }
        .contact-info-side { padding: 60px; background: rgba(197, 164, 126, 0.03); }
        .contact-form-side { padding: 60px; background: transparent; }
        .contact-item { display: flex; align-items: center; gap: 20px; margin-bottom: 30px; }
        .contact-icon-mini { 
          width: 50px; height: 50px; background: rgba(197, 164, 126, 0.1); 
          border-radius: 50%; display: flex; align-items: center; justify-content: center;
          color: #c5a47e; font-size: 1.2rem; border: 1px solid rgba(197, 164, 126, 0.2);
        }
        .contact-item h6 { margin: 0; font-family: 'Playfair Display', serif; color: #c5a47e; }
        .contact-item p { margin: 0; font-size: 0.9rem; color: #888; }

        .luxury-form .form-label { 
          font-family: 'Montserrat', sans-serif; font-size: 0.75rem; 
          text-transform: uppercase; letter-spacing: 1px; color: #c5a47e; margin-bottom: 10px;
        }
        .luxury-input {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 0;
          color: white;
          padding: 12px 15px;
          transition: all 0.3s ease;
        }
        .luxury-input:focus {
          background: rgba(255,255,255,0.08);
          border-color: #c5a47e;
          box-shadow: none;
          color: white;
        }
        .luxury-input::placeholder { color: #444; }

        /* --- FEATURES & STATS --- */
        .features-section { padding: 100px 0; background-color: #0c0c0c; border-top: 1px solid #222; }
        .feature-card { padding: 30px 15px; transition: all 0.4s ease; border: 1px solid transparent; }
        .feature-card:hover { background: #151515; border-color: #333; transform: translateY(-10px); }
        .feature-icon { font-size: 2.5rem; margin-bottom: 20px; color: #c5a47e; transition: transform 0.3s ease; }
        .stat-number { font-family: 'Playfair Display', serif; font-size: 2.8rem; color: #c5a47e; margin-bottom: 5px; }

        /* --- COMMON --- */
        .status-pill {
          position: fixed; bottom: 30px; left: 8%; font-family: 'Montserrat', sans-serif;
          font-size: 0.7rem; display: flex; align-items: center; gap: 10px;
          padding: 8px 15px; background: rgba(255,255,255,0.05); border-radius: 50px; backdrop-filter: blur(5px);
          z-index: 100;
        }
        .dot { height: 8px; width: 8px; border-radius: 50%; }

        @media (max-width: 992px) {
          .home-container { height: auto; flex-direction: column; }
          .image-side { display: none; }
          .text-side { text-align: center; padding: 100px 5% 40px; align-items: center; }
          .contact-info-side, .contact-form-side { padding: 40px 25px; }
          .section-title { font-size: 2.2rem; }
        }

        .testimonials-section {
          padding: 100px 0;
          background-color: #0c0c0c;
        }
        .testimonial-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          padding: 40px;
          border-radius: 15px;
          height: 100%;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
        }
        .testimonial-card:hover {
          background: rgba(197, 164, 126, 0.05);
          border-color: rgba(197, 164, 126, 0.2);
          transform: translateY(-5px);
        }
        .featured-testimonial {
          border-color: rgba(197, 164, 126, 0.3);
          background: rgba(197, 164, 126, 0.02);
        }
        .stars {
          color: #c5a47e;
          margin-bottom: 20px;
          letter-spacing: 2px;
        }
        .testimonial-text {
          font-family: 'Montserrat', sans-serif;
          font-style: italic;
          color: #ccc;
          line-height: 1.7;
          margin-bottom: 30px;
          flex-grow: 1;
        }
        .guest-info {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        .guest-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #c5a47e;
        }
        .guest-name {
          font-family: 'Playfair Display', serif;
          margin: 0;
          color: #fff;
        }
        .guest-title {
          font-family: 'Montserrat', sans-serif;
          font-size: 0.75rem;
          color: #c5a47e;
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        /* --- GALLERY & SOCIAL VIBE SECTION --- */
        .gallery-vibe-section {
          background-color: #0c0c0c;
          position: relative;
          z-index: 1;
        }

        .gallery-item {
          position: relative;
          border: 1px solid rgba(255,255,255,0.05);
          transition: transform 0.3s ease, border-color 0.3s ease;
        }
        .gallery-item:hover {
          transform: translateY(-5px);
          border-color: rgba(197, 164, 126, 0.3);
          z-index: 2;
        }

        .large-item { height: 510px; }
        .small-item { height: 250px; }

        .galeria-img {
          filter: grayscale(20%);
          transition: filter 0.5s ease, transform 0.5s ease;
        }
        .gallery-item:hover .galeria-img {
          filter: grayscale(0%);
          transform: scale(1.05);
        }

        .img-overlay {
          background: linear-gradient(0deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%);
          opacity: 0;
          transition: opacity 0.4s ease;
        }
        .gallery-item:hover .img-overlay {
          opacity: 1;
        }

        .galeria-header h2 {
          font-family: 'Playfair Display', serif;
          font-size: 3rem;
          margin-bottom: 20px;
        }
        .galeria-header .sub-text {
          font-family: 'Montserrat', sans-serif;
          font-weight: 300;
        }

        @media (max-width: 991px) {
          .large-item, .small-item { height: 300px; }
          .galeria-grid { margin-top: 30px; }
        }
      `}</style>
    </div>
  );
};