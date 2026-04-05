import { useState } from 'react';

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <style>{`
        .site-nav {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          width: 100%;
        }

        .site-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #1a1a1a;
          border: 1px solid #333;
          border-radius: 8px;
          padding: 12px 16px;
          height: 56px;
        }

        .site-logo {
          color: #ff5500;
          font-weight: bold;
          font-size: 18px;
          letter-spacing: 2px;
        }

        .site-menu-btn {
          background: none;
          border: none;
          color: #888;
          font-size: 12px;
          letter-spacing: 2px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          text-transform: uppercase;
        }

        .site-menu-btn:hover {
          color: #fff;
        }

        .site-dropdown {
          background: #1a1a1a;
          border: 1px solid #333;
          border-radius: 8px;
          margin-top: 8px;
          padding: 40px;
          display: none;
        }

        .site-dropdown.open {
          display: block;
        }

        .site-dropdown-content {
          display: flex;
          flex-direction: column;
          gap: 40px;
        }

        .site-nav-links {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .site-nav-link {
          color: #666;
          text-decoration: none;
          font-size: 42px;
          font-weight: 500;
          transition: color 0.2s;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .site-nav-link:hover {
          color: #ff5500;
        }

        .site-contact-section {
          color: #888;
          font-size: 12px;
        }

        .site-contact-label {
          color: #555;
          text-transform: uppercase;
          letter-spacing: 2px;
          font-size: 10px;
          margin-bottom: 8px;
        }

        .site-contact-item {
          margin-bottom: 16px;
        }

        .site-contact-link {
          color: #888;
          text-decoration: none;
        }

        .site-contact-link:hover {
          color: #ff5500;
        }

        .site-book-btn {
          display: block;
          width: 100%;
          background: #ff5500;
          border: none;
          border-radius: 6px;
          color: white;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          padding: 18px;
          margin-top: 40px;
          cursor: pointer;
          text-align: center;
          text-decoration: none;
        }

        .site-book-btn:hover {
          background: #e64d00;
        }
      `}</style>

      <div className="site-nav">
        <div className="site-header">
          <div className="site-logo">Site Name</div>
          <button className="site-menu-btn" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? 'CLOSE' : 'MENU'} {isOpen ? '✕' : ''}
          </button>
        </div>

        <div className={`site-dropdown ${isOpen ? 'open' : ''}`}>
          <div className="site-dropdown-content">
            <nav className="site-nav-links">
              <a href="#" className="site-nav-link">Home</a>
              <a href="#" className="site-nav-link">Work</a>
              <a href="#" className="site-nav-link">Pricing</a>
              <a href="#" className="site-nav-link">About</a>
              <a href="#" className="site-nav-link">Contact</a>
            </nav>

            <div className="site-contact-section">
              <div className="site-contact-label">Contact</div>
              <div className="site-contact-item">
                <a href="mailto:contact@good-fella.com" className="site-contact-link">
                  contact@good-fella.com
                </a>
              </div>
            </div>
            </div>


          <a href="#" className="site-book-btn">Book Now</a>
        </div>
      </div>
    </>
  );
}