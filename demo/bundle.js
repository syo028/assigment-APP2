"use strict";
(() => {
  // app.ts
  var baseUrl = "https://dae-mobile-assignment.hkit.cc/api";
  refreshButton?.addEventListener("click", loadItems);
  var skeletonItem = courseList.querySelector(".skeleton-item");
  skeletonItem.remove();
  loadMoreButton.addEventListener("click", loadMoreItems);
  var page = 1;
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
    loadMoreButton.hidden = json.pagination.page >= maxPage;
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
        <ion-card-header>
            <ion-card-title>${item.title}</ion-card-title>
        </ion-card-header>
        <ion-card-content>
        `;
      courseList.appendChild(card);
    }
  }
  loadItems();
  function loadMoreItems() {
    page++;
    loadItems();
  }
})();
