document.addEventListener("DOMContentLoaded", () => {
  const uploadForm = document.getElementById("uploadForm");
  const uploadResult = document.getElementById("uploadResult");
  const token = localStorage.getItem("token");

  uploadForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fileInput = document.getElementById("imageUpload");
    const descriptionInput = document.getElementById("description");

    if (!fileInput.files[0]) {
      uploadResult.textContent = "Por favor, selecciona una imagen antes de subir.";
      uploadResult.style.color = "red";
      return;
    }

    const formData = new FormData();
    formData.append("image", fileInput.files[0]);
    formData.append("description", descriptionInput.value);

    try {
      const response = await fetch("/api/uploadImage", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });

      const result = await response.json();
      console.log("Resultado de la API:", result);

      if (result.success) {
        uploadResult.textContent = "Imagen subida correctamente.";
        uploadResult.style.color = "green";
      } else {
        uploadResult.textContent = `"Error: ${result.errorMessage || "No se pudo subir la imagen"}`;
        uploadResult.style.color = "red";
      }
    } catch (err) {
      console.error(err);
      uploadResult.textContent = "Error al conectar con el servidor.";
      uploadResult.style.color = "red";
    }
  });
});
