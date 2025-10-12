document.addEventListener("DOMContentLoaded", () => {
  const navItems = document.querySelectorAll(".nav-item");

  navItems.forEach(item => {
    item.addEventListener("click", () => {
      const target = item.getAttribute("data-target");

      switch (target) {
        case "dashboard":
          window.location.href = "dashboard.html";
          break;
        case "cnnephe":
          window.location.href = "cnnephe.html";
          break;
        case "imagenes":
          window.location.href = "imagenes.html";
          break;
        case "configuracion":
          window.location.href = "configuracion.html";
          break;
        case "logout":
          localStorage.removeItem("token");
          window.location.href = "index.html";
          break;
        default:
          console.warn("Ruta no definida:", target);
      }
    });
  });
});
