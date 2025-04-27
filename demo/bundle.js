"use strict";
(() => {
  // app.ts
  var baseUrl = "https://dae-mobile-assignment.hkit.cc/api";
  refreshButton?.addEventListener("click", loadItems);
  var token = localStorage.getItem("token");
  var userId = null;
  errorToast.duration = 3e3;
  errorToast.color = "danger";
  errorToast.position = "bottom";
  var skeletonItem = courseList.querySelector(".skeleton-item");
  skeletonItem.remove();
  var page = 1;
  prevPageButton.addEventListener("click", () => {
    page--;
    loadItems();
  });
  nextPageButton.addEventListener("click", () => {
    page++;
    loadItems();
  });
  var itemCardTemplate = courseList.querySelector(".item-card");
  itemCardTemplate.remove();
  logoutButton.addEventListener("click", () => {
    token = "";
    userId = null;
    localStorage.removeItem("token");
    errorToast.message = "\u5DF2\u767B\u51FA";
    errorToast.present();
  });
  async function loadItems() {
    courseList.textContent = "";
    courseList.appendChild(skeletonItem.cloneNode(true));
    courseList.appendChild(skeletonItem.cloneNode(true));
    courseList.appendChild(skeletonItem.cloneNode(true));
    let params = new URLSearchParams();
    params.set("page", page.toString());
    let res = await fetch(`${baseUrl}/courses?${params}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    let json = await res.json();
    if (json.error) {
      errorToast.message = json.error;
      errorToast.duration = 3e3;
      errorToast.color = "danger";
      errorToast.present();
      courseList.textContent = "";
      return;
    }
    errorToast.dismiss();
    let maxPage = Math.ceil(json.pagination.total / json.pagination.limit);
    prevPageButton.hidden = json.pagination.page <= 1;
    nextPageButton.hidden = json.pagination.page >= maxPage;
    let items = json.items;
    console.log("items:", items);
    courseList.textContent = "";
    for (let item of items) {
      let card = itemCardTemplate.cloneNode(true);
      card.querySelector(".item-title").textContent = item.title;
      let favoriteButton = card.querySelector(".favorite-button");
      let favoriteIcon = favoriteButton.querySelector("ion-icon");
      let hasBookmarked = false;
      favoriteIcon.name = hasBookmarked ? "heart" : "heart-outline";
      favoriteButton.addEventListener("click", () => {
        if (!token) {
          loginModal.present();
          return;
        }
        hasBookmarked = !hasBookmarked;
        favoriteIcon.name = hasBookmarked ? "heart" : "heart-outline";
      });
      let img = card.querySelector(".course-image");
      img.src = item.image_url;
      img.alt = item.title;
      let courseMeta = card.querySelector(".course-meta");
      courseMeta.innerHTML = `
            <span class="language">\u7A0B\u5F0F\u8A9E\u8A00: Python 3.x</span>
            <span class="level">\u7A0B\u5EA6: ${item.level}</span>
        `;
      card.querySelector(".course-description").textContent = item.description;
      let tagContainer = card.querySelector(".tag-container");
      let chipTemplate = tagContainer.querySelector("ion-chip");
      chipTemplate.remove();
      for (let tag of item.tags) {
        let chip = chipTemplate.cloneNode(true);
        chip.textContent = tag;
        chip.dataset.type = tag;
        chip.addEventListener("click", () => {
        });
        tagContainer.appendChild(chip);
      }
      courseList.appendChild(card);
    }
  }
  loadItems();
  loginButton.addEventListener("click", async () => {
    await handleAuth("login");
  });
  registerButton.addEventListener("click", async () => {
    await handleAuth("signup");
  });
  async function handleAuth(mode) {
    let username = usernameInput.value;
    let password = passwordInput.value;
    let res = await fetch(`${baseUrl}/auth/${mode}`, {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: {
        "Content-Type": "application/json"
      }
    });
    let json = await res.json();
    if (json.error) {
      errorToast.message = json.error;
      errorToast.present();
      return;
    }
    errorToast.dismiss();
    token = json.token;
    localStorage.setItem("token", json.token);
    loginModal.dismiss();
  }
})();
