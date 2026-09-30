import { useState } from "react";
import { motion } from "framer-motion";
import {
  FiMail,
  FiSend,
  FiMapPin,
  FiPhone,
} from "react-icons/fi";
import { sendContact } from "../api/api.js";
import { toast } from "react-toastify";
import "./ContactUs.css";

const contactPageFadeUp = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const contactPageInfo = [
  {
    icon: <FiMail />,
    label: "Email",
    value: "spark@college.edu",
  },
  {
    icon: <FiPhone />,
    label: "Phone",
    value: "+91 XXXXXXXXXX",
  },
  {
    icon: <FiMapPin />,
    label: "Location",
    value: "CSE Department, College Campus",
  },
];

export default function ContactUs() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
      await sendContact(form);

      toast.success("Message sent successfully!");

      setForm({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="contact-page">
      {/* Hero */}
      <section className="contact-page-hero">
        <div className="contact-page-hero-orb" />

        <div className="contact-page-hero-inner">
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              show: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
          >
            <motion.div variants={contactPageFadeUp}>
              <span className="contact-page-kicker">
                <FiMail size={13} />
                Contact Us
              </span>
            </motion.div>

            <motion.h1
              variants={contactPageFadeUp}
              className="contact-page-heading"
            >
              Get In{" "}
              <span className="contact-page-heading-accent">
                Touch
              </span>
            </motion.h1>

            <motion.p
              variants={contactPageFadeUp}
              className="contact-page-lede"
            >
              Have a question or want to collaborate? We'd love to hear
              from you.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Contact Body */}
      <section className="contact-page-body">
        <div className="contact-page-layout">
          {/* Contact Information */}
          <motion.div
            className="contact-page-connect"
            initial={{
              opacity: 0,
              x: -20,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
            }}
          >
            <h2 className="contact-page-connect-heading">
              Let's{" "}
              <span className="contact-page-heading-accent">
                Connect
              </span>
            </h2>

            <div className="contact-page-info-list">
              {contactPageInfo.map((item) => (
                <div
                  key={item.label}
                  className="contact-page-info-row"
                >
                  <div className="contact-page-info-icon">
                    {item.icon}
                  </div>

                  <div className="contact-page-info-content">
                    <p className="contact-page-info-label">
                      {item.label}
                    </p>

                    <p className="contact-page-info-value">
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            className="contact-page-form-panel"
            initial={{
              opacity: 0,
              x: 20,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
            }}
          >
            <form
              className="contact-page-form"
              onSubmit={handleSubmit}
            >
              <div className="contact-page-form-row">
                <div className="contact-page-field">
                  <label
                    htmlFor="contact-name"
                    className="contact-page-label"
                  >
                    Name *
                  </label>

                  <input
                    id="contact-name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="contact-page-input"
                    placeholder="Your name"
                    required
                  />
                </div>

                <div className="contact-page-field">
                  <label
                    htmlFor="contact-email"
                    className="contact-page-label"
                  >
                    Email *
                  </label>

                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    className="contact-page-input"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <div className="contact-page-field">
                <label
                  htmlFor="contact-subject"
                  className="contact-page-label"
                >
                  Subject
                </label>

                <input
                  id="contact-subject"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  className="contact-page-input"
                  placeholder="What's this about?"
                />
              </div>

              <div className="contact-page-field">
                <label
                  htmlFor="contact-message"
                  className="contact-page-label"
                >
                  Message *
                </label>

                <textarea
                  id="contact-message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  className="contact-page-textarea"
                  placeholder="Tell us more..."
                  rows={5}
                  required
                />
              </div>

              <button
                type="submit"
                className="contact-page-submit"
                disabled={loading}
              >
                {loading ? (
                  "Sending..."
                ) : (
                  <>
                    <FiSend size={15} />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </main>
  );
}