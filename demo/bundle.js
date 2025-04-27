"use strict";
(() => {
  // app.ts
  var baseUrl = "https://dae-mobile-assignment.hkit.cc/api";
  refreshButton?.addEventListener("click", loadItems);
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
  async function loadItems() {
    courseList.textContent = "";
    courseList.appendChild(skeletonItem.cloneNode(true));
    courseList.appendChild(skeletonItem.cloneNode(true));
    courseList.appendChild(skeletonItem.cloneNode(true));
    let token = "";
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
    let ServerItems = json.items;
    let uiItems = ServerItems.map((item) => {
      return {
        id: item.id,
        title: item.title,
        level: item.level,
        domain: item.category,
        description: item.description,
        tags: item.tags,
        imageUrl: item.image_url,
        videoUrl: item.video_url
      };
    });
    console.log("items:", uiItems);
    courseList.textContent = "";
    for (let item of uiItems) {
      let card = document.createElement("ion-card");
      card.innerHTML = `
        <ion-card style="width: 100%;">
          <div class="video-thumbnail">
            <img src="${item.imageUrl}" alt="${item.title}" class="course-image">
            <div class="play-button">
              <ion-icon name="play" color="light" size="large"></ion-icon>
            </div>
            <div class="favorite-button">
              <ion-icon name="heart-outline"></ion-icon>
            </div>
          </div>
          <ion-card-content>
            <div class="course-details">
              <div class="course-title">${item.title}</div>
              <div class="course-meta">
                <span>\u7A0B\u5F0F\u8A9E\u8A00: Python 3.x</span>
                <span>\u7A0B\u5EA6: ${item.level}</span>
              </div>
              <div class="course-description">
                ${item.description}
              </div>
              <div class="tag-container">
                ${item.tags.map(
        (tag) => `<ion-chip color="medium" outline="true">${tag}</ion-chip>`
      ).join("")}
              </div>
            </div>
          </ion-card-content>
        </ion-card>
        `;
      courseList.appendChild(card);
    }
  }
  loadItems();
})();
