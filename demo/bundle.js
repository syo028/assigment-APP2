"use strict";
(() => {
  // app.ts
  var baseUrl = "https://dae-mobile-assignment.hkit.cc/api";
  refreshButton?.addEventListener("click", loadItems);
  async function loadItems() {
    let token = "";
    let res = await fetch(`${baseUrl}/courses`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    let json = await res.json();
    if (json.error) {
      toast.message = json.error;
      toast.duration = 3e3;
      toast.color = "danger";
      toast.present();
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
