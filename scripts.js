document.addEventListener('DOMContentLoaded', function () {
    const cartItems = [];
    const cartContainer = document.querySelector('.cart-items');
    const totalPriceElement = document.getElementById('total-price');
    const totalItemsElement = document.getElementById('total-items');
    const checkoutBtn = document.getElementById('checkout-btn');

    // Fungsi untuk memperbarui keranjang
    function updateCart() {
        cartContainer.innerHTML = ''; // Kosongkan keranjang
        let totalItems = 0;
        let totalPrice = 0;

        cartItems.forEach(function (item) {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <h4>${item.name}</h4>
                <div>
                    <button class="decrease">-</button>
                    <span>${item.quantity}</span>
                    <button class="increase">+</button>
                    <span>Rp. ${(item.price * item.quantity).toLocaleString()}</span>
                </div>`;
            cartContainer.appendChild(cartItem);

            // Event listener untuk menambah dan mengurangi produk
            cartItem.querySelector('.increase').addEventListener('click', function () {
                item.quantity++;
                updateCart();
            });

            cartItem.querySelector('.decrease').addEventListener('click', function () {
                if (item.quantity > 1) {
                    item.quantity--;
                } else {
                    const index = cartItems.indexOf(item);
                    cartItems.splice(index, 1); // Hapus item dari keranjang
                }
                updateCart();
            });

            totalItems += item.quantity;
            totalPrice += item.price * item.quantity;
        });

        totalItemsElement.textContent = totalItems;
        totalPriceElement.textContent = totalPrice.toLocaleString();
    }

    // Event listener untuk tombol "Tambah ke Keranjang"
    const addToCartButtons = document.querySelectorAll('.add-to-cart');

    addToCartButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            const productCard = button.closest('.product-card');
            const name = productCard.querySelector('h3').textContent;
            const price = parseInt(productCard.getAttribute('data-price'));

            const existingItem = cartItems.find(function (item) {
                return item.name === name;
            });

            if (existingItem) {
                existingItem.quantity++;
            } else {
                cartItems.push({
                    name: name,
                    price: price,
                    quantity: 1
                });
            }

            updateCart();
        });
    });

    // Fungsi untuk mengirim data ke WhatsApp saat checkout
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function () {
            if (cartItems.length === 0) {
                alert("Keranjang Anda kosong. Tambahkan produk terlebih dahulu.");
                return;
            }

            let message = 'Pesanan Saya:\n\n';
            cartItems.forEach(function (item) {
                message += `${item.name} - ${item.quantity} pcs - Rp. ${(item.price * item.quantity).toLocaleString()}\n`;
            });

            message += `\nTotal Produk: ${totalItemsElement.textContent}`;
            message += `\nTotal Harga: Rp. ${totalPriceElement.textContent}`;

            const phoneNumber = '6285839842757'; // Ganti dengan nomor WhatsApp Anda
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

            window.open(whatsappUrl, '_blank'); // Redirect ke WhatsApp
        });
    }
});