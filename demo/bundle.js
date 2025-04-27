"use strict";
(() => {
  // app.ts
  var baseUrl = "https://dae-mobile-assignment.hkit.cc/api";
  async function loadItems() {
    let token = "";
    let res = await fetch(`${baseUrl}/courses`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    let json = await res.json();
    console.log("json:", json);
  }
  loadItems();
})();
