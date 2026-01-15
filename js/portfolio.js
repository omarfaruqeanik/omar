import {
  collection,
  getDocs,
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const db = window.firebaseDb;

// Load About section
async function loadAbout() {
  try {
    const aboutDoc = await getDoc(doc(db, "about", "main"));
    if (aboutDoc.exists()) {
      const data = aboutDoc.data();

      // Update about text
      const aboutText = document.getElementById("aboutText");
      if (aboutText && data.description) {
        aboutText.textContent = data.description;
      }

      // Update contact info
      if (data.email) {
        const emailElem = document.getElementById("contactEmail");
        if (emailElem) emailElem.textContent = data.email;
      }

      if (data.location) {
        const locationElem = document.getElementById("contactLocation");
        if (locationElem) locationElem.textContent = data.location;
      }

      if (data.status) {
        const statusElem = document.getElementById("contactStatus");
        if (statusElem) statusElem.textContent = data.status;
      }
    } else {
      const aboutText = document.getElementById("aboutText");
      if (aboutText) {
        aboutText.textContent = "No about information available yet.";
      }
    }
  } catch (error) {
    console.error("Error loading about:", error);
  }
}

// Load Skills section
async function loadSkills() {
  try {
    const skillsSnapshot = await getDocs(collection(db, "skills"));
    const skillsGrid = document.getElementById("skillsGrid");

    if (!skillsGrid) return;

    if (skillsSnapshot.empty) {
      skillsGrid.innerHTML =
        '<div class="empty-state">No skills added yet.</div>';
      return;
    }

    // Group skills by category
    const skillsByCategory = {};
    skillsSnapshot.forEach((doc) => {
      const skill = doc.data();
      if (!skillsByCategory[skill.category]) {
        skillsByCategory[skill.category] = [];
      }
      skillsByCategory[skill.category].push(skill);
    });

    // Generate HTML
    let html = "";
    for (const [category, skills] of Object.entries(skillsByCategory)) {
      html += `
        <div class=\"skill-category\">
          <h3>${category}</h3>
          ${skills
            .map(
              (skill) => `
            <div class=\"skill-item\">
              <span>${skill.name}</span>
              <span class=\"skill-level ${skill.level.toLowerCase()}\">${
                skill.level
              }</span>
            </div>
          `
            )
            .join("")}
        </div>
      `;
    }

    skillsGrid.innerHTML = html;
  } catch (error) {
    console.error("Error loading skills:", error);
    const skillsGrid = document.getElementById("skillsGrid");
    if (skillsGrid) {
      skillsGrid.innerHTML =
        '<div class="empty-state">Error loading skills.</div>';
    }
  }
}

// Load Experience section
async function loadExperience() {
  try {
    const experienceSnapshot = await getDocs(collection(db, "experience"));
    const experienceTimeline = document.getElementById("experienceTimeline");

    if (!experienceTimeline) return;

    if (experienceSnapshot.empty) {
      experienceTimeline.innerHTML =
        '<div class="empty-state">No experience added yet.</div>';
      return;
    }

    // Sort by date (newest first)
    const experiences = [];
    experienceSnapshot.forEach((doc) => {
      experiences.push({ id: doc.id, ...doc.data() });
    });

    // Sort by end date
    experiences.sort((a, b) => {
      const dateA = a.endDate || "9999-99";
      const dateB = b.endDate || "9999-99";
      return dateB.localeCompare(dateA);
    });

    // Generate HTML
    let html = "";
    experiences.forEach((exp) => {
      html += `
        <div class=\"timeline-item\">
          <div class=\"timeline-content\">
            <h3>${exp.position}</h3>
            <h4>${exp.company}</h4>
            <p class=\"timeline-date\">${exp.startDate} - ${
        exp.endDate || "Present"
      }</p>
            <p class=\"timeline-description\">${exp.description}</p>
            ${
              exp.technologies && exp.technologies.length > 0
                ? `
              <div class=\"tech-tags\">
                ${exp.technologies
                  .map((tech) => `<span class=\"tech-tag\">${tech}</span>`)
                  .join("")}
              </div>
            `
                : ""
            }
          </div>
        </div>
      `;
    });

    experienceTimeline.innerHTML = html;
  } catch (error) {
    console.error("Error loading experience:", error);
    const experienceTimeline = document.getElementById("experienceTimeline");
    if (experienceTimeline) {
      experienceTimeline.innerHTML =
        '<div class="empty-state">Error loading experience.</div>';
    }
  }
}

// Load Projects section
async function loadProjects() {
  try {
    const projectsSnapshot = await getDocs(collection(db, "projects"));
    const projectsGrid = document.getElementById("projectsGrid");

    if (!projectsGrid) return;

    if (projectsSnapshot.empty) {
      projectsGrid.innerHTML =
        '<div class="empty-state">No projects added yet.</div>';
      return;
    }

    // Generate HTML
    let html = "";
    projectsSnapshot.forEach((doc) => {
      const project = doc.data();
      html += `
        <div class=\"project-card\">
          <div class=\"project-image\">
            ${
              project.image
                ? `<img src=\"${project.image}\" alt=\"${project.title}\" />`
                : '<div style="width:100%;height:100%;background:#2a2a2b;"></div>'
            }
          </div>
          <div class=\"project-content\">
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            ${
              project.technologies && project.technologies.length > 0
                ? `
              <div class=\"tech-tags\">
                ${project.technologies
                  .map((tech) => `<span class=\"tech-tag\">${tech}</span>`)
                  .join("")}
              </div>
            `
                : ""
            }
            <div class=\"project-links\">
              ${
                project.githubLink
                  ? `<a href=\"${project.githubLink}\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"project-link\">Code</a>`
                  : ""
              }
              ${
                project.liveLink
                  ? `<a href=\"${project.liveLink}\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"project-link\">Live</a>`
                  : ""
              }
            </div>
          </div>
        </div>
      `;
    });

    projectsGrid.innerHTML = html;
  } catch (error) {
    console.error("Error loading projects:", error);
    const projectsGrid = document.getElementById("projectsGrid");
    if (projectsGrid) {
      projectsGrid.innerHTML =
        '<div class="empty-state">Error loading projects.</div>';
    }
  }
}

// Load Blog section
async function loadBlogs() {
  try {
    const blogsSnapshot = await getDocs(collection(db, "blogs"));
    const blogGrid = document.getElementById("blogGrid");

    if (!blogGrid) return;

    if (blogsSnapshot.empty) {
      blogGrid.innerHTML =
        '<div class="empty-state">No blog posts added yet.</div>';
      return;
    }

    // Sort by date (newest first)
    const blogs = [];
    blogsSnapshot.forEach((doc) => {
      blogs.push({ id: doc.id, ...doc.data() });
    });

    blogs.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB - dateA;
    });

    // Generate HTML
    let html = "";
    blogs.forEach((blog) => {
      const date = new Date(blog.date);
      const formattedDate = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

      html += `
        <article class=\"blog-card\">
          <div class=\"blog-image\">
            ${
              blog.image
                ? `<img src=\"${blog.image}\" alt=\"${blog.title}\" />`
                : '<div style="width:100%;height:100%;background:#2a2a2b;"></div>'
            }
            <div class=\"blog-date\">${formattedDate}</div>
          </div>
          <div class=\"blog-content\">
            <div class=\"blog-category\">${blog.category}</div>
            <h3>${blog.title}</h3>
            <p>${blog.excerpt}</p>
            ${
              blog.link
                ? `
              <a href=\"${blog.link}\" class=\"blog-read-more\" target=\"_blank\" rel=\"noopener noreferrer\">
                Read More
                <svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\">
                  <line x1=\"5\" y1=\"12\" x2=\"19\" y2=\"12\"></line>
                  <polyline points=\"12 5 19 12 12 19\"></polyline>
                </svg>
              </a>
            `
                : ""
            }
          </div>
        </article>
      `;
    });

    blogGrid.innerHTML = html;
  } catch (error) {
    console.error("Error loading blogs:", error);
    const blogGrid = document.getElementById("blogGrid");
    if (blogGrid) {
      blogGrid.innerHTML =
        '<div class="empty-state">Error loading blog posts.</div>';
    }
  }
}

// Load all data when page loads
document.addEventListener("DOMContentLoaded", () => {
  loadAbout();
  loadSkills();
  loadExperience();
  loadProjects();
  loadBlogs();
});
