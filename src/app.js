document.addEventListener("alpine:init", () => {
  // ================= MENU ROTI =================
  Alpine.data("menuRoti", () => ({
    items: [
      { id: 1, name: "Original Coffee", img: "1.jpg", price: 6500 },
      { id: 2, name: "Original Vanilla", img: "2.jpg", price: 6500 },
      { id: 3, name: "Original Pandan", img: "3.jpg", price: 6500 },
      { id: 4, name: "Coklat Coffee", img: "4.jpg", price: 6500 },
      { id: 5, name: "Coklat Pandan", img: "5.jpg", price: 6500 },
      { id: 6, name: "Keju", img: "6.jpg", price: 7000 },
      { id: 7, name: "Banana Vanilla", img: "7.jpg", price: 6500 },
      { id: 8, name: "Banana Pandan", img: "8.jpg", price: 6500 },
    ],
    init() {
      this.$nextTick(() => feather.replace());
    },
  }));

  // ================= MENU ESKRIM =================
  Alpine.data("menuEskrim", () => ({
    items: [
      { id: 101, name: "Vanilla Ice Cream", img: "9.jpg", price: 8000 },
      { id: 102, name: "Chocolate Ice Cream", img: "10.jpg", price: 8000 },
      { id: 103, name: "Matcha Ice Cream", img: "11.jpg", price: 8000 },
      { id: 104, name: "Mix Ice Cream", img: "12.jpg", price: 8000 },
    ],
    init() {
      this.$nextTick(() => feather.replace());
    },
  }));

  // ================= MENU LAINNYA =================
  Alpine.data("menuLainnya", () => ({
    items: [
      { id: 201, name: "Kopi Aren", img: "13.jpg", price: 10000 },
      { id: 202, name: "Kopi Aren + Roti", img: "17.jpg", price: 15000 },
      { id: 203, name: "6 Roti", img: "18.jpg", price: 36000 },
      { id: 204, name: "Paket 6 Roti", img: "14.jpg", price: 42000 },
      { id: 205, name: "12 Roti", img: "19.jpg", price: 72000 },
      { id: 206, name: "Paket 12 Roti", img: "15.jpg", price: 80000 },
    ],
    init() {
      this.$nextTick(() => feather.replace());
    },
  }));

  // ================= STORE CART =================
  Alpine.store("cart", {
    items: [],
    total: 0,
    quantity: 0,

    rupiah(number) {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(number);
    },

    add(newItem) {
      const cartItem = this.items.find((item) => item.id === newItem.id);

      if (!cartItem) {
        this.items.push({ ...newItem, quantity: 1, total: newItem.price });
        this.quantity++;
        this.total += newItem.price;
      } else {
        this.items = this.items.map((item) => {
          if (item.id !== newItem.id) return item;
          item.quantity++;
          item.total = item.price * item.quantity;
          this.quantity++;
          this.total += item.price;
          return item;
        });
      }
    },

    remove(id) {
      const cartItem = this.items.find((item) => item.id === id);

      if (cartItem.quantity > 1) {
        this.items = this.items.map((item) => {
          if (item.id !== id) return item;
          item.quantity--;
          item.total = item.price * item.quantity;
          this.quantity--;
          this.total -= item.price;
          return item;
        });
      } else {
        this.items = this.items.filter((item) => item.id !== id);
        this.quantity--;
        this.total -= cartItem.price;
      }
    },
  });
});

// ================= CHECKOUT =================
document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("#checkoutForm");
  const checkoutButton = document.querySelector("#checkout-button");

  checkoutButton.disabled = true;

  form.addEventListener("input", function () {
    const name = document.querySelector("#name").value.trim();
    const email = document.querySelector("#email").value.trim();
    const phone = document.querySelector("#phone").value.trim();

    if (name !== "" && email !== "" && phone !== "") {
      checkoutButton.classList.remove("disabled");
      checkoutButton.disabled = false;
    } else {
      checkoutButton.classList.add("disabled");
      checkoutButton.disabled = true;
    }
  });

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = new FormData(form);
    const data = new URLSearchParams(formData);

    try {
      const response = await fetch("php/placeOrder.php", {
        method: "POST",
        body: data,
      });

      const token = await response.text();

      if (token) {
        snap.pay(token);
      } else {
        alert("Token tidak ditemukan");
      }
    } catch (err) {
      console.log(err);
      alert("Terjadi kesalahan server");
    }
  });
});

//format pesan whatsapp
const formatMessage = (obj) => {
  return `Data Customer
  Nama: ${obj.nama}
  Email: ${obj.email}
  No HP: ${obj.phone}
Data Pesanan
${JSON.parse(obj.items).map(
  (item) => `${item.name} (${item.quantity} x ${rupiah(item.total)}) \n`
)}
TOTAL: ${rupiah(obj.total)}
Terima Kasih.`;
};
