import {
  FiExternalLink,
  FiFileText,
  FiLinkedin,
  FiUsers,
} from "react-icons/fi";
import { SiGithub, SiLeetcode } from "react-icons/si";

import "./TeamCard.css";

export default function TeamCard({
  member,
  memberType,
  roleLabel,
  onViewMore,
}) {
  const isFaculty = memberType === "faculty";

  return (
    <article className="spark-team-card-content">
      {/* PROFILE IMAGE */}

      <div className="team-card-image-wrap">
        {member.image?.url ? (
          <img
            src={member.image.url}
            alt={member.name || "Team member"}
            className="team-card-image"
            loading="lazy"
          />
        ) : (
          <div className="team-card-image-fallback">
            <FiUsers size={40} />
          </div>
        )}

        <span className="team-card-club-badge">
          Spark CSE Club
        </span>
      </div>

      {/* ========================================
          CONTENT
      ======================================== */}

      <div className="team-card-content">
        <div className="team-card-heading">
          <h3 className="team-card-name">
            {member.name}
          </h3>

          <span className="team-card-role">
            {roleLabel || "Team Member"}
          </span>
        </div>

        {member.department && (
          <p className="team-card-department">
            {member.department}
            {!isFaculty && member.year
              ? ` • ${member.year}`
              : ""}
          </p>
        )}

        {/* ========================================
            SOCIAL LINKS
        ======================================== */}

        <div className="team-card-footer">
          <div className="team-card-socials">
            {!isFaculty && member.github && (
              <a
                href={member.github}
                target="_blank"
                rel="noopener noreferrer"
                className="team-card-social"
                aria-label={`${member.name} GitHub`}
              >
                <SiGithub />
              </a>
            )}

            {member.linkedin && (
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="team-card-social"
                aria-label={`${member.name} LinkedIn`}
              >
                <FiLinkedin />
              </a>
            )}

            {!isFaculty && member.leetcode && (
              <a
                href={member.leetcode}
                target="_blank"
                rel="noopener noreferrer"
                className="team-card-social"
                aria-label={`${member.name} LeetCode`}
              >
                <SiLeetcode />
              </a>
            )}

            {!isFaculty && member.portfolio && (
              <a
                href={member.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="team-card-social"
                aria-label={`${member.name} Portfolio`}
              >
                <FiExternalLink />
              </a>
            )}

            {!isFaculty && member.resume && (
              <a
                href={member.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="team-card-social"
                aria-label={`${member.name} Resume`}
              >
                <FiFileText />
              </a>
            )}
          </div>

          <button
            type="button"
            className="team-card-view-more"
            onClick={onViewMore}
          >
            View More
            <FiExternalLink />
          </button>
        </div>
      </div>
    </article>
  );
}

