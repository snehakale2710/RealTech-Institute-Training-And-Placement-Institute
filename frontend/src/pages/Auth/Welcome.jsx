
import { Link } from "react-router-dom";
import {
  ArrowRight,
  UserRound,
  Monitor,
  BookOpen,
  BriefcaseBusiness,
  Code2,
  ChartNoAxesCombined,
  BrainCircuit,
  GraduationCap,
  Phone,
  MapPin,
  Mail,
} from "lucide-react";

import heroImage from "../../assets/realtech-hero.png";
import logoImage from "../../assets/realtech-logo.png";

import "./Welcome.css";

const benefits = [
  {
    icon: UserRound,
    title: "Expert Trainers",
    description: "Learn from experienced industry professionals.",
  },
  {
    icon: Monitor,
    title: "Online Class Access",
    description: "Learn anytime, anywhere with online classes.",
  },
  {
    icon: BookOpen,
    title: "Study Materials",
    description: "Get access to notes and learning resources.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Placement Support",
    description: "Get guidance to prepare for your career.",
  },
];

const courses = [
  {
    icon: Code2,
    title: "Python Programming",
    description:
      "Learn Python programming from fundamentals to advanced concepts.",
    className: "python-card",
  },
  {
    icon: Monitor,
    title: "Web Development",
    description:
      "Create modern and responsive websites and web applications.",
    className: "web-card",
  },
  {
    icon: ChartNoAxesCombined,
    title: "Data Analytics",
    description:
      "Understand data and develop practical analytical skills.",
    className: "analytics-card",
  },
  {
    icon: BrainCircuit,
    title: "AI & Machine Learning",
    description:
      "Explore artificial intelligence and machine learning technologies.",
    className: "ai-card",
  },
];

function Welcome() {
  return (
    <div className="welcome-page">

      {/* HERO SECTION */}
      <section className="welcome-hero">

        <div className="hero-left">
          <Link to="/" className="welcome-logo">
            <img src={logoImage} alt="Real Tech Institute" />
          </Link>

          <div className="hero-text">
            <h1>
              Your Future in Tech
              <span>Starts Here</span>
            </h1>

            <p>
              At Real Tech, we provide industry-relevant training
              and placement support to help you build the skills,
              confidence and career you deserve.
            </p>

            <Link to="/login" className="welcome-button">
              Get Started
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>

        <div className="hero-right">
          <img
            src={heroImage}
            alt="Real Tech learning illustration"
            className="hero-image"
          />
        </div>

      </section>

      {/* BENEFITS SECTION */}
      <section className="benefits-section">

        <div className="benefits-heading">
          <span className="section-label">WHY REAL-TECH?</span>
          <h2>More Than Just Training</h2>
        </div>

        <div className="benefits-list">
          {benefits.map((item, index) => {
            const Icon = item.icon;

            return (
              <div className="benefit-item" key={index}>
                <div className="benefit-icon">
                  <Icon size={22} />
                </div>

                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>

      </section>

      {/* COURSES SECTION */}
      <section className="courses-section">

        <div className="courses-heading">
          <div>
            <span className="section-label">OUR COURSES</span>
            <h2>Build In-Demand Skills</h2>
          </div>

          <Link to="/courses" className="view-courses">
            View All Courses
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="courses-grid">
          {courses.map((course, index) => {
            const Icon = course.icon;

            return (
              <article
                className={`course-card ${course.className}`}
                key={index}
              >
                <div className="course-icon">
                  <Icon size={23} />
                </div>

                <h3>{course.title}</h3>

                <p>{course.description}</p>

                <Link
                  to="/courses"
                  className="course-arrow"
                  aria-label={`Explore ${course.title}`}
                >
                  <ArrowRight size={17} />
                </Link>
              </article>
            );
          })}
        </div>

      </section>

      {/* CAREER BANNER */}
      <section className="career-banner">

        <div className="career-icon">
          <GraduationCap size={38} />
        </div>

        <div className="career-content">
          <h2>Ready to Build Your Career?</h2>
          <p>
            Join Real Tech and take the first step towards your future.
          </p>
        </div>

        <Link to="/login" className="welcome-button">
          Get Started
          <ArrowRight size={17} />
        </Link>

      </section>

      {/* FOOTER */}
      <footer className="welcome-footer">

        <div className="footer-logo">
          <img src={logoImage} alt="Real Tech" />
        </div>

        <div className="footer-contact">
          <p>
            <Phone size={15} />
            <span>Contact Us</span>
          </p>

          <p>
            <Mail size={15} />
            <span>info@realtechinstitute.com</span>
          </p>
        </div>

        <div className="footer-address">
          <MapPin size={17} />
          <p>
            Real Tech Training and
            <br />
            Placement Institute
          </p>
        </div>

        <div className="footer-links">
          <h4>Quick Links</h4>
          <Link to="/">Home</Link>
          <Link to="/courses">Courses</Link>
          <Link to="/login">Login</Link>
        </div>

        <div className="footer-copyright">
          © 2026 Real Tech Training and Placement Institute. All rights reserved.
        </div>

      </footer>

    </div>
  );
}

export default Welcome;
