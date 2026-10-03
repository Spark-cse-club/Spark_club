import { useEffect, useState } from "react";
import { FiCalendar, FiFilter, FiMapPin } from "react-icons/fi";
import { getEvents } from "../api/api.js";

import EventCard from "../components/Events/EventCard.jsx";
import EventModal from "../components/Events/EventModal.jsx";

import "./Events.css";

const categories = [
  { value: "all", label: "All Events" },
  { value: "dsa", label: "DSA" },
  { value: "aptitude", label: "Aptitude" },
  { value: "other", label: "Other" },
];

const getEventStatus = (event) => {
  const now = new Date();
  const start = new Date(event.startDate);
  const end = new Date(event.endDate);

  if (now < start) return "upcoming";
  if (now <= end) return "ongoing";
  return "completed";
};

const Events = () => {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await getEvents();
        setEvents(response?.data || []);
      } catch (error) {
        console.error("Failed to fetch events:", error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents =
    filter === "all"
      ? events
      : events.filter((event) => event.category === filter);

  if (loading) {
    return (
      <main className="events-page">
        <section className="events-loading">
          <div className="events-loader"></div>
          <p>Loading events...</p>
        </section>
      </main>
    );
  }

  return (
    <main className="events-page">
      {/* Hero */}
      <section className="events-hero">
        <div className="events-hero-content">
          <span className="section-label">
            <FiCalendar />
            Spark Club Events
          </span>

          <h1>
            Explore Our <span>Events</span>
          </h1>

          <p>
            Discover upcoming workshops, competitions, DSA sessions,
            aptitude activities, and other events organized by Spark Club.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="events-section">
        <div className="events-header">
          <div>
            <span className="section-label">
              <FiFilter />
              Browse Events
            </span>

            <h2>All Events</h2>
          </div>

          <div className="events-filters">
            {categories.map((category) => (
              <button
                key={category.value}
                type="button"
                className={`event-filter ${
                  filter === category.value ? "active" : ""
                }`}
                onClick={() => setFilter(category.value)}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Events */}
        {filteredEvents.length === 0 ? (
          <div className="events-empty">
            <FiCalendar />
            <h3>No events found</h3>
            <p>
              There are currently no events available in this category.
            </p>
          </div>
        ) : (
          <div className="events-grid">
            {filteredEvents.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                status={getEventStatus(event)}
                onViewDetails={() => setSelectedEvent(event)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Event Details Modal */}
      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          status={getEventStatus(selectedEvent)}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </main>
  );
};

export default Events;
