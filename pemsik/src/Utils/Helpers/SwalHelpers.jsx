import Swal from "sweetalert2";

export const confirmLogout = (onConfirm) => {
  Swal.fire({
    title: "Yakin ingin logout?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Ya, logout",
    cancelButtonText: "Batal",
  }).then((result) => {
    if (result.isConfirmed) {
      onConfirm();
      Swal.fire("Logout berhasil", "", "success");
    }
  });
};

export const confirmDelete = (title, text, onConfirm) => {
  Swal.fire({
    title: title || "Yakin ingin menghapus data ini?",
    text: text || "",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Ya, hapus",
    cancelButtonText: "Batal",
  }).then((result) => {
    if (result.isConfirmed) {
      if (typeof onConfirm === "function") {
        onConfirm();
      }
    }
  });
};

export const confirmUpdate = (title, text, onConfirm) => {
  Swal.fire({
    title: title || "Yakin ingin memperbarui data ini?",
    text: text || "",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Ya, perbarui",
    cancelButtonText: "Batal",
  }).then((result) => {
    if (result.isConfirmed) {
      if (typeof onConfirm === "function") {
        onConfirm();
      }
    }
  });
};
