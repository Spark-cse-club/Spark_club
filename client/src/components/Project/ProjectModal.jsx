import { useEffect } from "react";
import {
  FiCalendar,
  FiCode,
  FiExternalLink,
  FiGithub,
  FiX,
} from "react-icons/fi";

import "./ProjectModal.css";

const ProjectModal = ({ project, onClose }) => {
  const formatCategory = (category) => {
    if (!category) return "Project";

    return (
      category.charAt(0).toUpperCase() +
      category.slice(1)
    );
  };

  const formatDate = (date) => {
    if (!date) return "Not available";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    // Prevent background scrolling while modal is open
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="project-modal-overlay"
      onClick={handleBackdropClick}
    >
      <div className="project-modal">
        {/* CLOSE BUTTON */}
        <button
          type="button"
          className="project-modal-close"
          onClick={onClose}
          aria-label="Close project details"
        >
          <FiX />
        </button>

        {/* IMAGE */}
        <div className="project-modal-image-section">
          {project?.image?.url ? (
            <img
              src={project.image.url}
              alt={project.projectName || "Project"}
              className="project-modal-image"
            />
          ) : (
            <div className="project-modal-image-placeholder">
              <FiCode />
            </div>
          )}
        </div>

        {/* CONTENT */}
        <div className="project-modal-content">
          {/* BADGE */}
          <div className="project-modal-badges">
            <span className="project-modal-category">
              {formatCategory(project.category)}
            </span>
          </div>

          {/* TITLE */}
          <h2>{project.projectName}</h2>

          {/* PROJECT INFO */}
          <div className="project-modal-info">
            {project.startDate && (
              <div className="project-modal-info-item">
                <FiCalendar />

                <div>
                  <span>Start Date</span>
                  <strong>
                    {formatDate(project.startDate)}
                  </strong>
                </div>
              </div>
            )}

            {project.endDate && (
              <div className="project-modal-info-item">
                <FiCalendar />

                <div>
                  <span>End Date</span>
                  <strong>
                    {formatDate(project.endDate)}
                  </strong>
                </div>
              </div>
            )}
          </div>

          {/* DESCRIPTION */}
          {project.description && (
            <div className="project-modal-description">
              <h3>About This Project</h3>

              <p>{project.description}</p>
            </div>
          )}

          {/* ACTION */}
          {project.githubLink && (
            <div className="project-modal-actions">
              <a
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="project-modal-github"
              >
                <FiGithub />
                <span>View on GitHub</span>
                <FiExternalLink />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;

