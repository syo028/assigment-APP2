"use strict";
(() => {
  // app.ts
  var baseUrl = "https://dae-mobile-assignment.hkit.cc/api";
  refreshButton?.addEventListener("click", loadItems);
  var skeletonItem = courseList.querySelector(".skeleton-item");
  skeletonItem.remove();
  async function loadItems() {
    courseList.textContent = "";
    courseList.appendChild(skeletonItem.cloneNode(true));
    courseList.appendChild(skeletonItem.cloneNode(true));
    courseList.appendChild(skeletonItem.cloneNode(true));
    let token = "";
    let res = await fetch(`${baseUrl}/courses`, {
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
      courseList.querySelectorAll("ion-skeleton-text").forEach((skeleton) => {
      });
      return;
    }
    let items = json.items.map((item) => {
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
    console.log("items:", items);
  }
  loadItems();
})();
