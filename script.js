
/* PRODUCT DATABASE */

const products = [
    {
        name: "Matcha",
        price: 80,
        category: "coffee",
        image: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=600",
        description: "Rich, smooth, and freshly prepared matcha."
    },
    {
        name: "Espresso",
        price: 80,
        category: "coffee",
        image: "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=600",
        description: "Strong, bold, and freshly brewed espresso."
    },
    {
        name: "Americano",
        price: 80.25,
        category: "coffee",
        image: "https://images.unsplash.com/photo-1551030173-122aabc4489c?w=600",
        description: "Espresso topped with hot water."
    },
    {
        name: "Latte",
        price: 80.50,
        category: "coffee",
        image: "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=600",
        description: "Espresso with smooth steamed milk."
    },
    {
        name: "Caramel Cappuccino",
        price: 80.75,
        category: "coffee",
        image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600",
        description: "Espresso, foamy milk, and caramel."
    },
    {
        name: "Butter Croissant",
        price: 80.25,
        category: "treats",
        image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600",
        description: "Flaky, golden, and baked fresh."
    },
    {
        name: "Chocolate Brownie",
        price: 80.75,
        category: "treats",
        image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600",
        description: "Fudgy chocolate with a crackly top."
    },
    {
        name: "Blueberry Muffin",
        price: 75.50,
        category: "treats",
        image: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=600",
        description: "Soft, sweet, and filled with blueberries."
    }
];


/* SHOPPING CART AND ORDER HISTORY */

let cart = {};
let orderHistory = [];
let orderNumber = 1;


/* DISPLAY PRODUCTS */

function displayProducts() {

    products.forEach((product, index) => {

        const card = `
            <article class="item">
                <img src="${product.image}"
                alt="${product.name}" loading="lazy">

                <div class="item-content">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>

                    <div class="item-bottom">
                        <span class="price">
                            ₱${product.price.toFixed(2)}
                        </span>

                        <button onclick="addToCart(${index})">
                            Add to Cart
                        </button>
                    </div>
                </div>
            </article>
        `;

        document.getElementById(
            product.category + "-menu"
        ).insertAdjacentHTML("beforeend", card);

    });

}


/* ADD TO CART */

function addToCart(index) {

    if (!cart[index]) {
        cart[index] = 0;
    }

    cart[index]++;

    updateCart();
}


/* CHANGE QUANTITY */

function changeQuantity(index, amount) {

    cart[index] += amount;

    if (cart[index] <= 0) {
        delete cart[index];
    }

    updateCart();
}


/* REMOVE ITEM */

function removeItem(index) {

    delete cart[index];

    updateCart();
}


/* UPDATE CART */

function updateCart() {

    const container = document.getElementById("order-items");

    let total = 0;
    let count = 0;

    container.innerHTML = "";

    Object.keys(cart).forEach(key => {

        const index = Number(key);
        const product = products[index];
        const quantity = cart[index];
        const subtotal = product.price * quantity;

        total += subtotal;
        count += quantity;

        container.innerHTML += `
            <div class="order-row">
                <div>
                    <strong>${product.name}</strong><br>
                    ₱${product.price.toFixed(2)}
                    × ${quantity}
                    = ₱${subtotal.toFixed(2)}
                </div>

                <div class="quantity">
                    <button onclick="changeQuantity(${index}, -1)">−</button>

                    ${quantity}

                    <button onclick="changeQuantity(${index}, 1)">+</button>

                    <button class="remove"
                    onclick="removeItem(${index})">
                        Remove
                    </button>
                </div>
            </div>
        `;
    });

    if (count === 0) {
        container.innerHTML = "<p>Nothing added yet.</p>";
    }

    document.getElementById("total").textContent =
        total.toFixed(2);
}


/* CHECKOUT */

function showCheckout() {

    if (Object.keys(cart).length === 0) {
        alert("Please add an item to your order first!");
        return;
    }

    document.getElementById("checkout-form").style.display = "block";

    document.getElementById("checkout-form").scrollIntoView({
        behavior: "smooth"
    });
}


/* PLACE CUSTOMER ORDER */

document.getElementById("customer-form")
.addEventListener("submit", function(event) {

    event.preventDefault();

    if (Object.keys(cart).length === 0) {
        alert("Your cart is empty.");
        return;
    }

    const name = document.getElementById("customer-name").value.trim();
    const phone = document.getElementById("customer-phone").value.trim();
    const type = document.getElementById("order-type").value;
    const notes = document.getElementById("notes").value.trim();

    if (!name || !phone) return;

    let items = [];
    let total = 0;

    Object.keys(cart).forEach(key => {

        const product = products[Number(key)];
        const quantity = cart[key];
        const subtotal = product.price * quantity;

        total += subtotal;

        items.push({
            name: product.name,
            price: product.price,
            quantity: quantity,
            subtotal: subtotal
        });
    });

    const order = {
        orderNumber: orderNumber,
        customer: name,
        phone: phone,
        type: type,
        notes: notes || "None",
        items: items,
        total: total,
        date: new Date().toLocaleString()
    };

    orderHistory.push(order);
    orderNumber++;

    displayReceipt(order);
    displayHistory();

    cart = {};
    updateCart();

    this.reset();

    document.getElementById("checkout-form").style.display = "none";
    document.getElementById("receipt").style.display = "block";

    document.getElementById("receipt").scrollIntoView({
        behavior: "smooth"
    });

    alert("Customer order successfully placed!");
});


/* DISPLAY RECEIPT */

function displayReceipt(order) {

    let receipt = `
        <div class="receipt-info">
            <p><strong>Order Number:</strong> #${order.orderNumber}</p>
            <p><strong>Date:</strong> ${escapeHTML(order.date)}</p>
            <p><strong>Customer:</strong> ${escapeHTML(order.customer)}</p>
            <p><strong>Contact:</strong> ${escapeHTML(order.phone)}</p>
            <p><strong>Order Type:</strong> ${escapeHTML(order.type)}</p>
        </div>

        <hr>
        <h3>ORDER DETAILS</h3>
    `;

    order.items.forEach(item => {

        receipt += `
            <p style="margin:12px 0;">
                ${escapeHTML(item.name)}
                × ${item.quantity}
                — ₱${item.subtotal.toFixed(2)}
            </p>
        `;
    });

    receipt += `
        <hr>

        <h3 style="margin-top:20px;">
            TOTAL: ₱${order.total.toFixed(2)}
        </h3>

        <p style="margin-top:15px;">
            <strong>Notes:</strong> ${escapeHTML(order.notes)}
        </p>

        <p style="text-align:center; margin-top:25px;">
            Thank you for ordering at CATAN COFFEE! ❤️
        </p>
    `;

    document.getElementById("receipt-content").innerHTML = receipt;
}


/* ORDER HISTORY */

function displayHistory() {

    const container = document.getElementById("history-list");

    document.getElementById("history-count").textContent =
        "Total Completed Orders: " + orderHistory.length;

    container.innerHTML = "";

    if (orderHistory.length === 0) {

        container.innerHTML = `
            <div class="empty-history">
                No customer orders yet.
            </div>
        `;

        return;
    }

    [...orderHistory].reverse().forEach(order => {

        let itemList = "";

        order.items.forEach(item => {

            itemList += `
                <p>
                    ${escapeHTML(item.name)}
                    × ${item.quantity}
                    — ₱${item.subtotal.toFixed(2)}
                </p>
            `;
        });

        const card = `
            <div class="history-card">

                <h3>🧾 Order #${order.orderNumber}</h3>

                <p><strong>Customer:</strong> ${escapeHTML(order.customer)}</p>
                <p><strong>Contact:</strong> ${escapeHTML(order.phone)}</p>
                <p><strong>Order Type:</strong> ${escapeHTML(order.type)}</p>
                <p><strong>Date:</strong> ${escapeHTML(order.date)}</p>

                <div class="history-items">
                    <strong>Ordered Items:</strong>
                    ${itemList}
                </div>

                <p><strong>Notes:</strong> ${escapeHTML(order.notes)}</p>

                <p class="history-total">
                    Total: ₱${order.total.toFixed(2)}
                </p>

                <div class="history-actions">
                    <button onclick="viewOrder(${order.orderNumber})">
                        View Receipt
                    </button>
                </div>

            </div>
        `;

        container.insertAdjacentHTML("beforeend", card);
    });
}


/* VIEW PREVIOUS RECEIPT */

function viewOrder(number) {

    const order = orderHistory.find(
        item => item.orderNumber === number
    );

    if (!order) return;

    displayReceipt(order);

    document.getElementById("receipt").style.display = "block";

    document.getElementById("receipt").scrollIntoView({
        behavior: "smooth"
    });
}


/* NEW CUSTOMER */

function startNewCustomer() {

    cart = {};

    updateCart();

    document.getElementById("customer-form").reset();

    document.getElementById("checkout-form").style.display = "none";
    document.getElementById("receipt").style.display = "none";

    document.getElementById("coffee").scrollIntoView({
        behavior: "smooth"
    });
}


/* CLEAR HISTORY */

function clearHistory() {

    if (orderHistory.length === 0) {
        alert("There are no orders to clear.");
        return;
    }

    const confirmClear = confirm(
        "Are you sure you want to delete all customer order history?"
    );

    if (confirmClear) {
        orderHistory = [];
        displayHistory();
        alert("Order history cleared!");
    }
}


/* SECURITY */

function escapeHTML(value) {

    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}


/* INITIALIZE WEBSITE */

displayProducts();
updateCart();
displayHistory();
