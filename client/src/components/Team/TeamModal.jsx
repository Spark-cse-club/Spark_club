import { useEffect } from "react";
import {
  FiExternalLink,
  FiFileText,
  FiLinkedin,
  FiUsers,
  FiX,
} from "react-icons/fi";
import { SiGithub, SiLeetcode } from "react-icons/si";

import "./TeamModal.css";

export default function TeamModal({
  member,
  memberType,
  roleLabel,
  onClose,
}) {
  const isFaculty = memberType === "faculty";

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="team-modal-overlay"
      onClick={handleBackdropClick}
    >
      <div className="team-modal">
        {/* CLOSE */}

        <button
          type="button"
          className="team-modal-close"
          onClick={onClose}
          aria-label="Close profile"
        >
          <FiX />
        </button>

        {/*  IMAGE */}

        <div className="team-modal-image-section">
          {member?.image?.url ? (
            <img
              src={member.image.url}
              alt={member.name || "Team member"}
              className="team-modal-image"
            />
          ) : (
            <div className="team-modal-image-fallback">
              <FiUsers size={52} />
            </div>
          )}
        </div>

        {/*   CONTENT */}

        <div className="team-modal-content">
          <span className="team-modal-kicker">
            {isFaculty
              ? "Faculty Advisor"
              : "Core Team"}
          </span>

          <h2 className="team-modal-name">
            {member.name}
          </h2>

          <p className="team-modal-role">
            {roleLabel || "Team Member"}
          </p>

          <p className="team-modal-club">
            Spark CSE Club
          </p>

          {/*  CORE / FACULTY INFO */}

          <div className="team-modal-info">
            {member.department && (
              <div className="team-modal-info-item">
                <span className="team-modal-info-label">
                  Department
                </span>

                <span className="team-modal-info-value">
                  {member.department}
                </span>
              </div>
            )}

            {!isFaculty && member.year && (
              <div className="team-modal-info-item">
                <span className="team-modal-info-label">
                  Year
                </span>

                <span className="team-modal-info-value">
                  {member.year}
                </span>
              </div>
            )}

            {!isFaculty &&
              member.registrationNumber && (
                <div className="team-modal-info-item">
                  <span className="team-modal-info-label">
                    Registration Number
                  </span>

                  <span className="team-modal-info-value">
                    {member.registrationNumber}
                  </span>
                </div>
              )}
          </div>

          {/*   BIO */}

          {member.bio && (
            <section className="team-modal-section">
              <h3 className="team-modal-section-title">
                About
              </h3>

              <p className="team-modal-bio">
                {member.bio}
              </p>
            </section>
          )}

          {/*   SKILLS — CORE ONLY */}

          {!isFaculty &&
            member.skills?.length > 0 && (
              <section className="team-modal-section">
                <h3 className="team-modal-section-title">
                  Skills
                </h3>

                <div className="team-modal-skills">
                  {member.skills.map((skill) => (
                    <span
                      key={skill}
                      className="team-modal-skill"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}

          {/*   SOCIAL LINKS */}

          <section className="team-modal-section">
            <h3 className="team-modal-section-title">
              Connect
            </h3>

            <div className="team-modal-socials">
              {!isFaculty && member.github && (
                <a
                  href={member.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="team-modal-social"
                  aria-label={`${member.name} GitHub`}
                  title="GitHub"
                >
                  <SiGithub />
                </a>
              )}

              {member.linkedin && (
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="team-modal-social"
                  aria-label={`${member.name} LinkedIn`}
                  title="LinkedIn"
                >
                  <FiLinkedin />
                </a>
              )}

              {!isFaculty && member.leetcode && (
                <a
                  href={member.leetcode}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="team-modal-social"
                  aria-label={`${member.name} LeetCode`}
                  title="LeetCode"
                >
                  <SiLeetcode />
                </a>
              )}

              {!isFaculty && member.portfolio && (
                <a
                  href={member.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="team-modal-social"
                  aria-label={`${member.name} Portfolio`}
                  title="Portfolio"
                >
                  <FiExternalLink />
                </a>
              )}

              {!isFaculty && member.resume && (
                <a
                  href={member.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="team-modal-social"
                  aria-label={`${member.name} Resume`}
                  title="Resume"
                >
                  <FiFileText />
                </a>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

