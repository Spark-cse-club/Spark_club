import {
  FiArrowRight,
  FiCalendar,
  FiCode,
  FiGithub,
} from "react-icons/fi";

import "./ProjectCard.css";

const ProjectCard = ({ project, onViewDetails }) => {
  const formatCategory = (category) => {
    if (!category) return "Project";

    return (
      category.charAt(0).toUpperCase() +
      category.slice(1)
    );
  };

  const formatDate = (date) => {
    if (!date) return "Date not available";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <article className="project-card">
      {/* IMAGE */}
      <div className="project-card-image">
        {project.image?.url ? (
          <img
            src={project.image.url}
            alt={project.projectName || "Project"}
            loading="lazy"
          />
        ) : (
          <div className="project-card-image-placeholder">
            <FiCode />
          </div>
        )}

        <span
          className={`project-card-category ${
            project.category === "software"
              ? "project-card-category-software"
              : "project-card-category-hardware"
          }`}
        >
          {formatCategory(project.category)}
        </span>
      </div>

      {/* CONTENT */}
      <div className="project-card-content">
        <h3 className="project-card-title">
          {project.projectName}
        </h3>

        {project.description && (
          <p className="project-card-description">
            {project.description}
          </p>
        )}

        <div className="project-card-meta">
          <div className="project-card-meta-item">
            <FiCalendar />
            <span>
              {formatDate(project.startDate)}
            </span>
          </div>

          {project.githubLink && (
            <div className="project-card-github-indicator">
              <FiGithub />
              <span>GitHub</span>
            </div>
          )}
        </div>

        <button
          type="button"
          className="project-view-button"
          onClick={onViewDetails}
        >
          <span>View Details</span>
          <FiArrowRight />
        </button>
      </div>
    </article>
  );
};

export default ProjectCard;

