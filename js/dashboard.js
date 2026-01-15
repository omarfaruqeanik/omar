import {
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const auth = window.firebaseAuth;
const db = window.firebaseDb;

// Check authentication
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "/login.html";
  } else {
    document.getElementById("adminEmail").textContent = user.email;
    initDashboard();
  }
});

// Logout
document.getElementById("logoutBtn").addEventListener("click", async () => {
  try {
    await signOut(auth);
    window.location.href = "/login.html";
  } catch (error) {
    console.error("Logout error:", error);
  }
});

// Navigation
const navItems = document.querySelectorAll(".nav-item");
const contentSections = document.querySelectorAll(".content-section");

navItems.forEach((item) => {
  item.addEventListener("click", () => {
    const section = item.dataset.section;

    navItems.forEach((nav) => nav.classList.remove("active"));
    item.classList.add("active");

    contentSections.forEach((content) => content.classList.remove("active"));
    document.getElementById(`${section}Section`).classList.add("active");
  });
});

// Modal functions
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const modalBody = document.getElementById("modalBody");
const modalClose = document.getElementById("modalClose");

function openModal(title, content) {
  modalTitle.textContent = title;
  modalBody.innerHTML = content;
  modal.classList.add("active");
}

function closeModal() {
  modal.classList.remove("active");
  modalBody.innerHTML = "";
}

modalClose.addEventListener("click", closeModal);
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

// Initialize Dashboard
function initDashboard() {
  loadAbout();
  loadSkills();
  loadExperience();
  loadProjects();
  loadBlogs();
}

// ==================== ABOUT SECTION ====================
async function loadAbout() {
  try {
    const aboutDoc = await getDoc(doc(db, "about", "main"));
    const aboutPreview = document.getElementById("aboutPreview");

    if (aboutDoc.exists()) {
      const data = aboutDoc.data();
      aboutPreview.innerHTML = `
        <h3>About Information</h3>
        <p>${data.description || "No description"}</p>
        <div class=\\"info-grid\\">
          <div class=\\"info-item\\">
            <strong>Email</strong>
            <span>${data.email || "Not set"}</span>
          </div>
          <div class=\\"info-item\\">
            <strong>Location</strong>
            <span>${data.location || "Not set"}</span>
          </div>
          <div class=\\"info-item\\">
            <strong>Status</strong>
            <span>${data.status || "Not set"}</span>
          </div>
        </div>
      `;
    } else {
      aboutPreview.innerHTML =
        '<div class=\\"loading-cell\\">No about information yet. Click \\"Edit About\\" to add.</div>';
    }
  } catch (error) {
    console.error("Error loading about:", error);
  }
}

document.getElementById("editAboutBtn").addEventListener("click", async () => {
  const aboutDoc = await getDoc(doc(db, "about", "main"));
  const data = aboutDoc.exists() ? aboutDoc.data() : {};

  openModal(
    "Edit About",
    `
    <form class=\\"modal-form\\" id=\\"aboutForm\\">
      <div class=\\"form-group\\">
        <label for=\\"description\\">Description</label>
        <textarea id=\\"description\\" name=\\"description\\" rows=\\"6\\" required>${
          data.description || ""
        }</textarea>
      </div>
      <div class=\\"form-group\\">
        <label for=\\"email\\">Email</label>
        <input type=\\"email\\" id=\\"email\\" name=\\"email\\" value=\\"${
          data.email || ""
        }\\" required>
      </div>
      <div class=\\"form-group\\">
        <label for=\\"location\\">Location</label>
        <input type=\\"text\\" id=\\"location\\" name=\\"location\\" value=\\"${
          data.location || ""
        }\\" required>
      </div>
      <div class=\\"form-group\\">
        <label for=\\"status\\">Status</label>
        <input type=\\"text\\" id=\\"status\\" name=\\"status\\" value=\\"${
          data.status || ""
        }\\" required>
      </div>
      <button type=\\"submit\\" class=\\"btn btn-primary\\">Save</button>
    </form>
  `
  );

  document.getElementById("aboutForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    try {
      await setDoc(doc(db, "about", "main"), data);
      closeModal();
      loadAbout();
      showSuccess("About updated successfully!");
    } catch (error) {
      console.error("Error saving about:", error);
      showError("Failed to save about information");
    }
  });
});

// ==================== SKILLS SECTION ====================
async function loadSkills() {
  try {
    const skillsSnapshot = await getDocs(collection(db, "skills"));
    const tbody = document.getElementById("skillsTableBody");

    if (skillsSnapshot.empty) {
      tbody.innerHTML =
        '<tr><td colspan=\\"4\\" class=\\"loading-cell\\">No skills added yet.</td></tr>';
      return;
    }

    let html = "";
    skillsSnapshot.forEach((docSnap) => {
      const skill = docSnap.data();
      html += `
        <tr>
          <td>${skill.category}</td>
          <td>${skill.name}</td>
          <td><span class=\\"level-badge level-${skill.level.toLowerCase()}\\">${
        skill.level
      }</span></td>
          <td>
            <div class=\\"action-buttons\\">
              <button class=\\"btn btn-secondary\\" onclick=\\"editSkill('${
                docSnap.id
              }')\\">Edit</button>
              <button class=\\"btn btn-danger\\" onclick=\\"deleteSkill('${
                docSnap.id
              }')\\">Delete</button>
            </div>
          </td>
        </tr>
      `;
    });

    tbody.innerHTML = html;
  } catch (error) {
    console.error("Error loading skills:", error);
  }
}

document.getElementById("addSkillBtn").addEventListener("click", () => {
  openModal(
    "Add Skill",
    `
    <form class=\\"modal-form\\" id=\\"skillForm\\">
      <div class=\\"form-group\\">
        <label for=\\"category\\">Category</label>
        <input type=\\"text\\" id=\\"category\\" name=\\"category\\" required>
      </div>
      <div class=\\"form-group\\">
        <label for=\\"name\\">Skill Name</label>
        <input type=\\"text\\" id=\\"name\\" name=\\"name\\" required>
      </div>
      <div class=\\"form-group\\">
        <label for=\\"level\\">Level</label>
        <select id=\\"level\\" name=\\"level\\" required>
          <option value=\\"Expert\\">Expert</option>
          <option value=\\"Advanced\\">Advanced</option>
          <option value=\\"Intermediate\\">Intermediate</option>
        </select>
      </div>
      <button type=\\"submit\\" class=\\"btn btn-primary\\">Add Skill</button>
    </form>
  `
  );

  document.getElementById("skillForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    try {
      await addDoc(collection(db, "skills"), data);
      closeModal();
      loadSkills();
      showSuccess("Skill added successfully!");
    } catch (error) {
      console.error("Error adding skill:", error);
      showError("Failed to add skill");
    }
  });
});

window.editSkill = async (id) => {
  const docSnap = await getDoc(doc(db, "skills", id));
  const skill = docSnap.data();

  openModal(
    "Edit Skill",
    `
    <form class=\\"modal-form\\" id=\\"skillForm\\">
      <div class=\\"form-group\\">
        <label for=\\"category\\">Category</label>
        <input type=\\"text\\" id=\\"category\\" name=\\"category\\" value=\\"${
          skill.category
        }\\" required>
      </div>
      <div class=\\"form-group\\">
        <label for=\\"name\\">Skill Name</label>
        <input type=\\"text\\" id=\\"name\\" name=\\"name\\" value=\\"${
          skill.name
        }\\" required>
      </div>
      <div class=\\"form-group\\">
        <label for=\\"level\\">Level</label>
        <select id=\\"level\\" name=\\"level\\" required>
          <option value=\\"Expert\\" ${
            skill.level === "Expert" ? "selected" : ""
          }>Expert</option>
          <option value=\\"Advanced\\" ${
            skill.level === "Advanced" ? "selected" : ""
          }>Advanced</option>
          <option value=\\"Intermediate\\" ${
            skill.level === "Intermediate" ? "selected" : ""
          }>Intermediate</option>
        </select>
      </div>
      <button type=\\"submit\\" class=\\"btn btn-primary\\">Update Skill</button>
    </form>
  `
  );

  document.getElementById("skillForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    try {
      await updateDoc(doc(db, "skills", id), data);
      closeModal();
      loadSkills();
      showSuccess("Skill updated successfully!");
    } catch (error) {
      console.error("Error updating skill:", error);
      showError("Failed to update skill");
    }
  });
};

window.deleteSkill = async (id) => {
  if (confirm("Are you sure you want to delete this skill?")) {
    try {
      await deleteDoc(doc(db, "skills", id));
      loadSkills();
      showSuccess("Skill deleted successfully!");
    } catch (error) {
      console.error("Error deleting skill:", error);
      showError("Failed to delete skill");
    }
  }
};

// ==================== EXPERIENCE SECTION ====================
async function loadExperience() {
  try {
    const experienceSnapshot = await getDocs(collection(db, "experience"));
    const tbody = document.getElementById("experienceTableBody");

    if (experienceSnapshot.empty) {
      tbody.innerHTML =
        '<tr><td colspan=\\"4\\" class=\\"loading-cell\\">No experience added yet.</td></tr>';
      return;
    }

    let html = "";
    experienceSnapshot.forEach((docSnap) => {
      const exp = docSnap.data();
      html += `
        <tr>
          <td>${exp.position}</td>
          <td>${exp.company}</td>
          <td>${exp.startDate} - ${exp.endDate || "Present"}</td>
          <td>
            <div class=\\"action-buttons\\">
              <button class=\\"btn btn-secondary\\" onclick=\\"editExperience('${
                docSnap.id
              }')\\">Edit</button>
              <button class=\\"btn btn-danger\\" onclick=\\"deleteExperience('${
                docSnap.id
              }')\\">Delete</button>
            </div>
          </td>
        </tr>
      `;
    });

    tbody.innerHTML = html;
  } catch (error) {
    console.error("Error loading experience:", error);
  }
}

document.getElementById("addExperienceBtn").addEventListener("click", () => {
  openModal(
    "Add Experience",
    `
    <form class=\\"modal-form\\" id=\\"experienceForm\\">
      <div class=\\"form-group\\">
        <label for=\\"position\\">Position</label>
        <input type=\\"text\\" id=\\"position\\" name=\\"position\\" required>
      </div>
      <div class=\\"form-group\\">
        <label for=\\"company\\">Company</label>
        <input type=\\"text\\" id=\\"company\\" name=\\"company\\" required>
      </div>
      <div class=\\"form-row\\">
        <div class=\\"form-group\\">
          <label for=\\"startDate\\">Start Date</label>
          <input type=\\"text\\" id=\\"startDate\\" name=\\"startDate\\" placeholder=\\"e.g. Jan 2022\\" required>
        </div>
        <div class=\\"form-group\\">
          <label for=\\"endDate\\">End Date</label>
          <input type=\\"text\\" id=\\"endDate\\" name=\\"endDate\\" placeholder=\\"e.g. Dec 2023 or leave empty for Present\\">
        </div>
      </div>
      <div class=\\"form-group\\">
        <label for=\\"description\\">Description</label>
        <textarea id=\\"description\\" name=\\"description\\" rows=\\"4\\" required></textarea>
      </div>
      <div class=\\"form-group\\">
        <label for=\\"technologies\\">Technologies (comma-separated)</label>
        <input type=\\"text\\" id=\\"technologies\\" name=\\"technologies\\" placeholder=\\"e.g. React, Node.js, MongoDB\\">
      </div>
      <button type=\\"submit\\" class=\\"btn btn-primary\\">Add Experience</button>
    </form>
  `
  );

  document
    .getElementById("experienceForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData);

      // Convert technologies string to array
      if (data.technologies) {
        data.technologies = data.technologies
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t);
      } else {
        data.technologies = [];
      }

      try {
        await addDoc(collection(db, "experience"), data);
        closeModal();
        loadExperience();
        showSuccess("Experience added successfully!");
      } catch (error) {
        console.error("Error adding experience:", error);
        showError("Failed to add experience");
      }
    });
});

window.editExperience = async (id) => {
  const docSnap = await getDoc(doc(db, "experience", id));
  const exp = docSnap.data();

  openModal(
    "Edit Experience",
    `
    <form class=\\"modal-form\\" id=\\"experienceForm\\">
      <div class=\\"form-group\\">
        <label for=\\"position\\">Position</label>
        <input type=\\"text\\" id=\\"position\\" name=\\"position\\" value=\\"${
          exp.position
        }\\" required>
      </div>
      <div class=\\"form-group\\">
        <label for=\\"company\\">Company</label>
        <input type=\\"text\\" id=\\"company\\" name=\\"company\\" value=\\"${
          exp.company
        }\\" required>
      </div>
      <div class=\\"form-row\\">
        <div class=\\"form-group\\">
          <label for=\\"startDate\\">Start Date</label>
          <input type=\\"text\\" id=\\"startDate\\" name=\\"startDate\\" value=\\"${
            exp.startDate
          }\\" required>
        </div>
        <div class=\\"form-group\\">
          <label for=\\"endDate\\">End Date</label>
          <input type=\\"text\\" id=\\"endDate\\" name=\\"endDate\\" value=\\"${
            exp.endDate || ""
          }\\">
        </div>
      </div>
      <div class=\\"form-group\\">
        <label for=\\"description\\">Description</label>
        <textarea id=\\"description\\" name=\\"description\\" rows=\\"4\\" required>${
          exp.description
        }</textarea>
      </div>
      <div class=\\"form-group\\">
        <label for=\\"technologies\\">Technologies (comma-separated)</label>
        <input type=\\"text\\" id=\\"technologies\\" name=\\"technologies\\" value=\\"${
          exp.technologies ? exp.technologies.join(", ") : ""
        }\\">
      </div>
      <button type=\\"submit\\" class=\\"btn btn-primary\\">Update Experience</button>
    </form>
  `
  );

  document
    .getElementById("experienceForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData);

      // Convert technologies string to array
      if (data.technologies) {
        data.technologies = data.technologies
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t);
      } else {
        data.technologies = [];
      }

      try {
        await updateDoc(doc(db, "experience", id), data);
        closeModal();
        loadExperience();
        showSuccess("Experience updated successfully!");
      } catch (error) {
        console.error("Error updating experience:", error);
        showError("Failed to update experience");
      }
    });
};

window.deleteExperience = async (id) => {
  if (confirm("Are you sure you want to delete this experience?")) {
    try {
      await deleteDoc(doc(db, "experience", id));
      loadExperience();
      showSuccess("Experience deleted successfully!");
    } catch (error) {
      console.error("Error deleting experience:", error);
      showError("Failed to delete experience");
    }
  }
};

// ==================== PROJECTS SECTION ====================
async function loadProjects() {
  try {
    const projectsSnapshot = await getDocs(collection(db, "projects"));
    const projectsGrid = document.getElementById("projectsGrid");

    if (projectsSnapshot.empty) {
      projectsGrid.innerHTML =
        '<div class=\\"loading-cell\\">No projects added yet.</div>';
      return;
    }

    let html = "";
    projectsSnapshot.forEach((docSnap) => {
      const project = docSnap.data();
      html += `
        <div class=\\"project-card\\">
          <div class=\\"card-image\\">
            ${
              project.image
                ? `<img src=\\"${project.image}\\" alt=\\"${project.title}\\">`
                : "No Image"
            }
          </div>
          <div class=\\"card-content\\">
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            <div class=\\"card-meta\\">
              <div class=\\"action-buttons\\">
                <button class=\\"btn btn-secondary\\" onclick=\\"editProject('${
                  docSnap.id
                }')\\">Edit</button>
                <button class=\\"btn btn-danger\\" onclick=\\"deleteProject('${
                  docSnap.id
                }')\\">Delete</button>
              </div>
            </div>
          </div>
        </div>
      `;
    });

    projectsGrid.innerHTML = html;
  } catch (error) {
    console.error("Error loading projects:", error);
  }
}

document.getElementById("addProjectBtn").addEventListener("click", () => {
  openModal(
    "Add Project",
    `
    <form class=\\"modal-form\\" id=\\"projectForm\\">
      <div class=\\"form-group\\">
        <label for=\\"title\\">Project Title</label>
        <input type=\\"text\\" id=\\"title\\" name=\\"title\\" required>
      </div>
      <div class=\\"form-group\\">
        <label for=\\"description\\">Description</label>
        <textarea id=\\"description\\" name=\\"description\\" rows=\\"4\\" required></textarea>
      </div>
      <div class=\\"form-group\\">
        <label for=\\"image\\">Image URL</label>
        <input type=\\"url\\" id=\\"image\\" name=\\"image\\" placeholder=\\"https://example.com/image.jpg\\">
      </div>
      <div class=\\"form-group\\">
        <label for=\\"technologies\\">Technologies (comma-separated)</label>
        <input type=\\"text\\" id=\\"technologies\\" name=\\"technologies\\" placeholder=\\"e.g. React, Node.js, MongoDB\\">
      </div>
      <div class=\\"form-row\\">
        <div class=\\"form-group\\">
          <label for=\\"githubLink\\">GitHub Link</label>
          <input type=\\"url\\" id=\\"githubLink\\" name=\\"githubLink\\" placeholder=\\"https://github.com/...\\">
        </div>
        <div class=\\"form-group\\">
          <label for=\\"liveLink\\">Live Link</label>
          <input type=\\"url\\" id=\\"liveLink\\" name=\\"liveLink\\" placeholder=\\"https://...\\">
        </div>
      </div>
      <button type=\\"submit\\" class=\\"btn btn-primary\\">Add Project</button>
    </form>
  `
  );

  document
    .getElementById("projectForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData);

      // Convert technologies string to array
      if (data.technologies) {
        data.technologies = data.technologies
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t);
      } else {
        data.technologies = [];
      }

      try {
        await addDoc(collection(db, "projects"), data);
        closeModal();
        loadProjects();
        showSuccess("Project added successfully!");
      } catch (error) {
        console.error("Error adding project:", error);
        showError("Failed to add project");
      }
    });
});

window.editProject = async (id) => {
  const docSnap = await getDoc(doc(db, "projects", id));
  const project = docSnap.data();

  openModal(
    "Edit Project",
    `
    <form class=\\"modal-form\\" id=\\"projectForm\\">
      <div class=\\"form-group\\">
        <label for=\\"title\\">Project Title</label>
        <input type=\\"text\\" id=\\"title\\" name=\\"title\\" value=\\"${
          project.title
        }\\" required>
      </div>
      <div class=\\"form-group\\">
        <label for=\\"description\\">Description</label>
        <textarea id=\\"description\\" name=\\"description\\" rows=\\"4\\" required>${
          project.description
        }</textarea>
      </div>
      <div class=\\"form-group\\">
        <label for=\\"image\\">Image URL</label>
        <input type=\\"url\\" id=\\"image\\" name=\\"image\\" value=\\"${
          project.image || ""
        }\\">
      </div>
      <div class=\\"form-group\\">
        <label for=\\"technologies\\">Technologies (comma-separated)</label>
        <input type=\\"text\\" id=\\"technologies\\" name=\\"technologies\\" value=\\"${
          project.technologies ? project.technologies.join(", ") : ""
        }\\">
      </div>
      <div class=\\"form-row\\">
        <div class=\\"form-group\\">
          <label for=\\"githubLink\\">GitHub Link</label>
          <input type=\\"url\\" id=\\"githubLink\\" name=\\"githubLink\\" value=\\"${
            project.githubLink || ""
          }\\">
        </div>
        <div class=\\"form-group\\">
          <label for=\\"liveLink\\">Live Link</label>
          <input type=\\"url\\" id=\\"liveLink\\" name=\\"liveLink\\" value=\\"${
            project.liveLink || ""
          }\\">
        </div>
      </div>
      <button type=\\"submit\\" class=\\"btn btn-primary\\">Update Project</button>
    </form>
  `
  );

  document
    .getElementById("projectForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData);

      // Convert technologies string to array
      if (data.technologies) {
        data.technologies = data.technologies
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t);
      } else {
        data.technologies = [];
      }

      try {
        await updateDoc(doc(db, "projects", id), data);
        closeModal();
        loadProjects();
        showSuccess("Project updated successfully!");
      } catch (error) {
        console.error("Error updating project:", error);
        showError("Failed to update project");
      }
    });
};

window.deleteProject = async (id) => {
  if (confirm("Are you sure you want to delete this project?")) {
    try {
      await deleteDoc(doc(db, "projects", id));
      loadProjects();
      showSuccess("Project deleted successfully!");
    } catch (error) {
      console.error("Error deleting project:", error);
      showError("Failed to delete project");
    }
  }
};

// ==================== BLOGS SECTION ====================
async function loadBlogs() {
  try {
    const blogsSnapshot = await getDocs(collection(db, "blogs"));
    const blogsGrid = document.getElementById("blogsGrid");

    if (blogsSnapshot.empty) {
      blogsGrid.innerHTML =
        '<div class=\\"loading-cell\\">No blog posts added yet.</div>';
      return;
    }

    let html = "";
    blogsSnapshot.forEach((docSnap) => {
      const blog = docSnap.data();
      const date = new Date(blog.date);
      const formattedDate = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

      html += `
        <div class=\\"blog-card\\">
          <div class=\\"card-image\\">
            ${
              blog.image
                ? `<img src=\\"${blog.image}\\" alt=\\"${blog.title}\\">`
                : "No Image"
            }
          </div>
          <div class=\\"card-content\\">
            <div class=\\"card-category\\">${blog.category}</div>
            <h3>${blog.title}</h3>
            <p>${blog.excerpt}</p>
            <small style=\\"color: #888;\\">${formattedDate}</small>
            <div class=\\"card-meta\\" style=\\"margin-top: 1rem;\\">
              <div class=\\"action-buttons\\">
                <button class=\\"btn btn-secondary\\" onclick=\\"editBlog('${
                  docSnap.id
                }')\\">Edit</button>
                <button class=\\"btn btn-danger\\" onclick=\\"deleteBlog('${
                  docSnap.id
                }')\\">Delete</button>
              </div>
            </div>
          </div>
        </div>
      `;
    });

    blogsGrid.innerHTML = html;
  } catch (error) {
    console.error("Error loading blogs:", error);
  }
}

document.getElementById("addBlogBtn").addEventListener("click", () => {
  openModal(
    "Add Blog Post",
    `
    <form class=\\"modal-form\\" id=\\"blogForm\\">
      <div class=\\"form-group\\">
        <label for=\\"title\\">Blog Title</label>
        <input type=\\"text\\" id=\\"title\\" name=\\"title\\" required>
      </div>
      <div class=\\"form-group\\">
        <label for=\\"category\\">Category</label>
        <input type=\\"text\\" id=\\"category\\" name=\\"category\\" placeholder=\\"e.g. Development, React, TypeScript\\" required>
      </div>
      <div class=\\"form-group\\">
        <label for=\\"excerpt\\">Excerpt</label>
        <textarea id=\\"excerpt\\" name=\\"excerpt\\" rows=\\"3\\" placeholder=\\"Brief summary of the blog post\\" required></textarea>
      </div>
      <div class=\\"form-group\\">
        <label for=\\"image\\">Image URL</label>
        <input type=\\"url\\" id=\\"image\\" name=\\"image\\" placeholder=\\"https://example.com/image.jpg\\">
      </div>
      <div class=\\"form-group\\">
        <label for=\\"date\\">Date</label>
        <input type=\\"date\\" id=\\"date\\" name=\\"date\\" required>
      </div>
      <div class=\\"form-group\\">
        <label for=\\"link\\">Blog Link (optional)</label>
        <input type=\\"url\\" id=\\"link\\" name=\\"link\\" placeholder=\\"https://...\\">
      </div>
      <button type=\\"submit\\" class=\\"btn btn-primary\\">Add Blog Post</button>
    </form>
  `
  );

  document.getElementById("blogForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    try {
      await addDoc(collection(db, "blogs"), data);
      closeModal();
      loadBlogs();
      showSuccess("Blog post added successfully!");
    } catch (error) {
      console.error("Error adding blog:", error);
      showError("Failed to add blog post");
    }
  });
});

window.editBlog = async (id) => {
  const docSnap = await getDoc(doc(db, "blogs", id));
  const blog = docSnap.data();

  openModal(
    "Edit Blog Post",
    `
    <form class=\\"modal-form\\" id=\\"blogForm\\">
      <div class=\\"form-group\\">
        <label for=\\"title\\">Blog Title</label>
        <input type=\\"text\\" id=\\"title\\" name=\\"title\\" value=\\"${
          blog.title
        }\\" required>
      </div>
      <div class=\\"form-group\\">
        <label for=\\"category\\">Category</label>
        <input type=\\"text\\" id=\\"category\\" name=\\"category\\" value=\\"${
          blog.category
        }\\" required>
      </div>
      <div class=\\"form-group\\">
        <label for=\\"excerpt\\">Excerpt</label>
        <textarea id=\\"excerpt\\" name=\\"excerpt\\" rows=\\"3\\" required>${
          blog.excerpt
        }</textarea>
      </div>
      <div class=\\"form-group\\">
        <label for=\\"image\\">Image URL</label>
        <input type=\\"url\\" id=\\"image\\" name=\\"image\\" value=\\"${
          blog.image || ""
        }\\">
      </div>
      <div class=\\"form-group\\">
        <label for=\\"date\\">Date</label>
        <input type=\\"date\\" id=\\"date\\" name=\\"date\\" value=\\"${
          blog.date
        }\\" required>
      </div>
      <div class=\\"form-group\\">
        <label for=\\"link\\">Blog Link (optional)</label>
        <input type=\\"url\\" id=\\"link\\" name=\\"link\\" value=\\"${
          blog.link || ""
        }\\">
      </div>
      <button type=\\"submit\\" class=\\"btn btn-primary\\">Update Blog Post</button>
    </form>
  `
  );

  document.getElementById("blogForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    try {
      await updateDoc(doc(db, "blogs", id), data);
      closeModal();
      loadBlogs();
      showSuccess("Blog post updated successfully!");
    } catch (error) {
      console.error("Error updating blog:", error);
      showError("Failed to update blog post");
    }
  });
};

window.deleteBlog = async (id) => {
  if (confirm("Are you sure you want to delete this blog post?")) {
    try {
      await deleteDoc(doc(db, "blogs", id));
      loadBlogs();
      showSuccess("Blog post deleted successfully!");
    } catch (error) {
      console.error("Error deleting blog:", error);
      showError("Failed to delete blog post");
    }
  }
};

// ==================== UTILITY FUNCTIONS ====================
function showSuccess(message) {
  const alertDiv = document.createElement("div");
  alertDiv.className = "success-message";
  alertDiv.style.position = "fixed";
  alertDiv.style.top = "20px";
  alertDiv.style.right = "20px";
  alertDiv.style.zIndex = "9999";
  alertDiv.textContent = message;
  document.body.appendChild(alertDiv);

  setTimeout(() => {
    alertDiv.remove();
  }, 3000);
}

function showError(message) {
  const alertDiv = document.createElement("div");
  alertDiv.className = "error-message";
  alertDiv.style.position = "fixed";
  alertDiv.style.top = "20px";
  alertDiv.style.right = "20px";
  alertDiv.style.zIndex = "9999";
  alertDiv.textContent = message;
  document.body.appendChild(alertDiv);

  setTimeout(() => {
    alertDiv.remove();
  }, 3000);
}
