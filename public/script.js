document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".tab");
  const contents = document.querySelectorAll(".tab-content");
  const addBookBtn = document.getElementById("addBookBtn");
  const bookList = document.querySelector(".book-list");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      contents.forEach(c => c.classList.remove("active"));
      tab.classList.add("active");
      document.getElementById(tab.dataset.tab).classList.add("active");
    });
  });

  addBookBtn.addEventListener("click", () => {
    const bookName = prompt("Nhập tên sách mới:");
    if (bookName) {
      const div = document.createElement("div");
      div.className = "book-item";
      div.textContent = "📘 " + bookName;
      bookList.appendChild(div);
    }
  });

  document.getElementById("viewDataBtn").addEventListener("click", () => {
    alert("Chức năng xem dữ liệu đang được phát triển!");
  });
});
