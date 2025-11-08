let posts = JSON.parse(localStorage.getItem("posts")) || [];
let editingPostId = null;

const postForm = document.getElementById("postForm");
const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");
const imageInput = document.getElementById("imageUrl");
const titleError = document.getElementById("titleError");
const contentError = document.getElementById("contentError");
const postsContainer = document.getElementById("postsContainer");
const submitBtn = document.getElementById("submitBtn");

function getTimeAgo(editedTime) {
  const now = new Date();
  const edited = new Date(editedTime);
  const diffMs = now - edited;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);

  if (diffHours >= 1) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  } else {
    return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  }
}

function renderPosts() {
  postsContainer.innerHTML = "";
  posts.forEach(post => {
    const postDiv = document.createElement("div");
    postDiv.className = "post";

    postDiv.innerHTML = `
      <div class="meta">
        <span><strong>ID:</strong> ${post.id}</span>
        <span><strong>Date:</strong> ${new Date(post.timestamp).toLocaleDateString()}</span>
        <span><strong>Time:</strong> ${new Date(post.timestamp).toLocaleTimeString()}</span>
        ${post.lastEdited ? `<span><strong>Edited:</strong> ${getTimeAgo(post.lastEdited)}</span>` : ""}
      </div>
      <div class="content-block">
        ${post.image ? `<img src="${post.image}" class="image" alt="Blog image" />` : ""}
        <div>
          <div class="title">${post.title}</div>
          <div class="content">${post.content}</div>
        </div>
      </div>
      <button onclick="editPost('${post.id}')">Edit</button>
      <button onclick="deletePost('${post.id}')">Delete</button>
    `;

    postsContainer.appendChild(postDiv);
  });
}

function validateForm(title, content) {
  let isValid = true;
  titleError.textContent = "";
  contentError.textContent = "";

  if (!title.trim()) {
    titleError.textContent = "Title is required.";
    isValid = false;
  }

  if (!content.trim()) {
    contentError.textContent = "Content is required.";
    isValid = false;
  }

  return isValid;
}

function saveToLocalStorage() {
  localStorage.setItem("posts", JSON.stringify(posts));
}

postForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const title = titleInput.value;
  const content = contentInput.value;
  const imageUrl = imageInput.value.trim();

  if (!validateForm(title, content)) return;

  if (editingPostId) {
    const post = posts.find(p => p.id === editingPostId);
    post.title = title;
    post.content = content;
    post.image = imageUrl || null;
    post.lastEdited = new Date().toISOString();
    editingPostId = null;
    submitBtn.textContent = "Add Post";
  } else {
    const newPost = {
      id: Date.now().toString(),
      title,
      content,
      image: imageUrl || null,
      timestamp: new Date().toISOString()
    };
    posts.push(newPost);
  }

  saveToLocalStorage();
  renderPosts();
  postForm.reset();
  imageInput.value = "";
});

function deletePost(id) {
  posts = posts.filter(post => post.id !== id);
  saveToLocalStorage();
  renderPosts();
}

function editPost(id) {
  const post = posts.find(p => p.id === id);
  titleInput.value = post.title;
  contentInput.value = post.content;
  imageInput.value = post.image || "";
  editingPostId = id;
  submitBtn.textContent = "Update Post";
}

renderPosts();
