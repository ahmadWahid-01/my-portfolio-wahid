

const products = [
    { id: 1, name: "Produk 1", category: "azure", price: 100000, image: "1.jpeg" },
    { id: 2, name: "Produk 2", category: "", price: 200000, image: "2.jpeg" },
    { id: 3, name: "Produk 3", category: "canna", price: 300000, image: "produk3.jpeg" },
    { id: 4, name: "Produk 4", category: "valmezo", price: 100000, image: "4.jpeg" },
];

// Pencarian dan Filter
function filterCategory(category) {
    const filteredProducts = products.filter((product) => product.category === category);
    displayProducts(filteredProducts);
}

// Menampilkan produk ke halaman katalog
function displayProducts(products) {
    const grid = document.getElementById("productGrid");
    grid.innerHTML = products.map(product => `
        <div class="product">
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>Rp ${product.price.toLocaleString()}</p>
            <button onclick="addToCart(${product.id})">Beli</button>
        </div>
    `).join("");
}

// Menambahkan produk ke keranjang
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProduct = cart.find(item => item.id === productId);

    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${product.name} telah ditambahkan ke keranjang.`);
}

// Menampilkan gambar produk di halaman checkout
function displayCheckoutProducts() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const checkoutContainer = document.getElementById('checkoutProducts');

    if (cart.length === 0) {
        checkoutContainer.innerHTML = '<p>Keranjang Anda kosong.</p>';
        return;
    }

    checkoutContainer.innerHTML = cart.map(product => `
        <div class="checkout-product">
            <img src="${product.image}" alt="${product.name}" class="checkout-image">
            <div class="checkout-details">
                <h3>${product.name}</h3>
                <p>Rp ${product.price.toLocaleString()}</p>
                <p>Jumlah: ${product.quantity}</p>
                <p>Total: Rp ${(product.price * product.quantity).toLocaleString()}</p>
            </div>
        </div>
    `).join("");
}

// Checkout dan Simpan Data Pembeli
function confirmCheckout() {
    const name = document.getElementById('name').value;
    const address = document.getElementById('address').value;
    const paymentMethod = document.getElementById('payment').value;

    if (!name || !address || !paymentMethod) {
        alert("Harap lengkapi semua informasi!");
        return;
    }

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        alert("Keranjang Anda kosong!");
        return;
    }

    // Simpan data pembeli ke LocalStorage
    const purchasers = JSON.parse(localStorage.getItem('purchasers')) || [];
    purchasers.push({
        name,
        address,
        paymentMethod,
        items: cart,
        date: new Date().toLocaleString(),
    });
    localStorage.setItem('purchasers', JSON.stringify(purchasers));

    alert("Pesanan Anda telah diterima!\nMetode Pembayaran: " + paymentMethod);

    // Hapus keranjang setelah checkout
    localStorage.removeItem('cart');
    window.location.href = 'success.html';
}

// Tampilkan data pembeli di laporan.html
function displayPurchasers() {
    const purchasers = JSON.parse(localStorage.getItem('purchasers')) || [];
    const purchaserList = document.getElementById('purchaserList');

    if (purchasers.length === 0) {
        purchaserList.innerHTML = '<p>Belum ada pembelian.</p>';
        return;
    }

    purchaserList.innerHTML = purchasers.map(purchaser => `
        <div class="purchaser">
            <h3>${purchaser.name}</h3>
            <p>Alamat: ${purchaser.address}</p>
            <p>Metode Pembayaran: ${purchaser.paymentMethod}</p>
            <p>Tanggal: ${purchaser.date}</p>
            <h4>Item yang Dibeli:</h4>
            <ul>
                ${purchaser.items.map(item => `
                    <li>${item.name} - Rp${item.price.toLocaleString()} x ${item.quantity}</li>
                `).join("")}
            </ul>
        </div>
        <hr>
    `).join("");
}

// QRIS Handler
document.getElementById("payment")?.addEventListener("change", function () {
    const qrisContainer = document.getElementById("qrisContainer");
    qrisContainer.style.display = this.value === "qris" ? "block" : "none";
});

// Menampilkan produk di halaman katalog saat pertama kali dimuat
window.onload = function() {
    displayProducts(products);  // Tampilkan semua produk jika belum difilter
    displayCheckoutProducts();  // Tampilkan produk di halaman checkout jika ada produk di keranjang
};
