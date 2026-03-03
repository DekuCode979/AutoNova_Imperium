document.addEventListener("DOMContentLoaded", () => {
    /* ========================= 
        DATOS DE VEHÍCULOS
    ========================== */
const vehicles = [
    { codigo: 1, categoria: "SUV", marca: "BMW", modelo: "X7", precio: 85000, img: "img/bmw_x7.jpg" },
    { codigo: 2, categoria: "SUV", marca: "Audi", modelo: "Q8", precio: 95000, img: "img/audi_q8.jpg" },
    { codigo: 3, categoria: "SUV", marca: "Mercedes", modelo: "GLE", precio: 88000, img: "img/mercedes_gle.jpg" },
    { codigo: 4, categoria: "SUV", marca: "Porsche", modelo: "Cayenne", precio: 110000, img: "img/porsche_cayenne.jpg" },
    { codigo: 5, categoria: "SUV", marca: "Range Rover", modelo: "Sport", precio: 120000, img: "img/range_rover_sport.jpg" },
    { codigo: 6, categoria: "Sedan", marca: "Mercedes", modelo: "S-Class", precio: 120000, img: "img/mercedes_sclass.jpg" },
    { codigo: 7, categoria: "Sedan", marca: "BMW", modelo: "Serie 7", precio: 105000, img: "img/bmw_serie7.jpg" },
    { codigo: 8, categoria: "Sedan", marca: "Audi", modelo: "A8", precio: 98000, img: "img/audi_a8.jpg" },
    { codigo: 9, categoria: "Sedan", marca: "Lexus", modelo: "LS", precio: 92000, img: "img/lexus_ls.jpg" },
    { codigo: 10, categoria: "Sedan", marca: "Maserati", modelo: "Ghibli", precio: 100000, img: "img/maserati_ghibli.jpg" },
    { codigo: 11, categoria: "Deportivo", marca: "Porsche", modelo: "911", precio: 150000, img: "img/porsche_911.jpg" },
    { codigo: 12, categoria: "Deportivo", marca: "Audi", modelo: "R8", precio: 170000, img: "img/audi_r8.jpg" },
    { codigo: 13, categoria: "Deportivo", marca: "BMW", modelo: "M8", precio: 165000, img: "img/bmw_m8.jpg" },
    { codigo: 14, categoria: "Deportivo", marca: "Mercedes", modelo: "AMG GT", precio: 180000, img: "img/mercedes_amggt.jpg" },
    { codigo: 15, categoria: "Deportivo", marca: "Aston Martin", modelo: "Vantage", precio: 200000, img: "img/aston_martin_vantage.jpg" }
];

// Ejemplo de cómo podrías usarlo:
console.log(`Tenemos ${vehicles.length} vehículos disponibles.`);

    /* =========================
        ELEMENTOS DEL DOM
    ========================== */
    const container = document.getElementById("productsContainer");
    const cartItems = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");
    const cartCount = document.getElementById("cartCount");
    const welcome = document.getElementById("welcomeUser");
    const hero = document.querySelector(".hero-section");
    const searchInput = document.getElementById("searchInput");
    const categoryFilter = document.getElementById("categoryFilter");
    const currencySelect = document.getElementById("currencySelect");
    const currencySymbol = document.getElementById("currencySymbol");
    const financeSelect = document.getElementById("financeMonths");
    const financeResult = document.getElementById("financeResult");

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let user = localStorage.getItem("user") || null;

    /* =========================
        LÓGICA DEL HERO
    ========================== */
    let heroIndex = 0;
    function changeHeroImage() {
        if (!hero) return;
        hero.style.backgroundImage = `url('${vehicles[heroIndex].img}')`;
        heroIndex = (heroIndex + 1) % vehicles.length;
    }
    changeHeroImage();
    setInterval(changeHeroImage, 4000);

    /* =========================
        GESTIÓN DE USUARIO
    ========================== */
    function initUser() {
        if (!user) {
            user = prompt("Ingrese su nombre:") || "Invitado";
            localStorage.setItem("user", user);
        }
        welcome.textContent = `Bienvenido, ${user}`;
    }

    document.getElementById("userBtn").addEventListener("click", () => {
        const name = prompt("Ingrese su nuevo nombre:");
        if (name?.trim()) {
            user = name.trim();
            localStorage.setItem("user", user);
            welcome.textContent = `Bienvenido, ${user}`;
        }
    });

    document.getElementById("logoutBtn").addEventListener("click", () => {
        localStorage.removeItem("user");
        location.reload();
    });

    /* =========================
        RENDERIZADO Y FILTROS
    ========================== */
    function renderProducts(filter = "all", search = "") {
        container.innerHTML = "";
        const filtered = vehicles.filter(v => 
            (filter === "all" || v.categoria === filter) &&
            (`${v.marca} ${v.modelo}`.toLowerCase().includes(search.toLowerCase()))
        );

        filtered.forEach((v, index) => {
            const col = document.createElement("div");
            col.className = "col-md-4 mb-4 product-card";
            col.style.cssText = `opacity: 0; transform: translateY(20px); transition: 0.5s ${index * 0.05}s;`;
            
            // HTML Ajustado con 'card-img-container' para el Zoom CSS
            col.innerHTML = `
                <div class="card shadow">
                    <div class="card-img-container">
                        <img src="${v.img}" alt="${v.marca}">
                        <div class="card-overlay">
                            <span>${v.marca} ${v.modelo}</span>
                            <span>${currencySymbol.textContent}${v.precio.toLocaleString()}</span>
                        </div>
                    </div>
                    <div class="card-body">
                        <p class="mb-2"><small class="text-secondary">${v.categoria}</small></p>
                        <button class="btn btn-primary addBtn" data-id="${v.codigo}">Agregar al Carrito</button>
                    </div>
                </div>
            `;
            container.appendChild(col);
        });

        setTimeout(() => {
            document.querySelectorAll(".product-card").forEach(c => {
                c.style.opacity = 1;
                c.style.transform = "translateY(0)";
            });
        }, 50);
    }

    searchInput.addEventListener("input", () => renderProducts(categoryFilter.value, searchInput.value));
    categoryFilter.addEventListener("change", () => renderProducts(categoryFilter.value, searchInput.value));

    /* =========================
        CARRITO Y FINANZAS
    ========================== */
    function updateCart() {
        cartItems.innerHTML = "";
        let total = 0;

        cart.forEach((item, i) => {
            total += item.precio;
            cartItems.innerHTML += `
                <div class="cart-item">
                    <span>${item.marca} ${item.modelo}</span>
                    <button class="btn btn-sm btn-outline-danger removeBtn" data-index="${i}">×</button>
                </div>
            `;
        });

        cartTotal.textContent = total.toLocaleString();
        cartCount.textContent = cart.length;
        localStorage.setItem("cart", JSON.stringify(cart));
        calculateFinance();
    }

    function calculateFinance() {
        const months = parseInt(financeSelect.value);
        const total = cart.reduce((sum, v) => sum + v.precio, 0);
        
        if (months > 0 && total > 0) {
            const monthlyRate = 0.07 / 12;
            const cuota = total * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
            financeResult.innerHTML = `Cuota estimada: ${currencySymbol.textContent}${cuota.toFixed(2)} / mes`;
        } else {
            financeResult.innerHTML = "";
        }
    }

    /* =========================
        EVENTOS DE ACCIÓN
    ========================== */
    document.addEventListener("click", e => {
        if (e.target.classList.contains("addBtn")) {
            const id = parseInt(e.target.dataset.id);
            const vehicle = vehicles.find(v => v.codigo === id);
            if (vehicle) {
                cart.push(vehicle);
                updateCart();
                const originalText = e.target.innerText;
                e.target.innerText = "✔ Agregado";
                e.target.classList.replace("btn-primary", "btn-success");
                setTimeout(() => {
                    e.target.innerText = originalText;
                    e.target.classList.replace("btn-success", "btn-primary");
                }, 1000);
            }
        }
        if (e.target.classList.contains("removeBtn")) {
            cart.splice(parseInt(e.target.dataset.index), 1);
            updateCart();
        }
    });

    currencySelect.addEventListener("change", () => {
        const symbols = { "USD": "$", "EUR": "€", "GBP": "£", "JPY": "¥" };
        currencySymbol.textContent = symbols[currencySelect.value] || "$";
        renderProducts(categoryFilter.value, searchInput.value);
        updateCart();
    });

    financeSelect.addEventListener("change", calculateFinance);

    document.getElementById("downloadPDF").addEventListener("click", () => {
        if (cart.length === 0) return alert("El carrito está vacío");
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.text("COTIZACIÓN - AUTONOVA IMPERIUM", 10, 20);
        doc.setFontSize(12);
        doc.text(`Cliente: ${user}`, 10, 30);
        
        cart.forEach((item, i) => {
            doc.text(`${i + 1}. ${item.marca} ${item.modelo} - ${currencySymbol.textContent}${item.precio.toLocaleString()}`, 10, 45 + (i * 10));
        });
        
        doc.text(`TOTAL: ${currencySymbol.textContent}${cartTotal.textContent}`, 10, 45 + (cart.length * 10) + 10);
        doc.save(`cotizacion-${user}.pdf`);
    });

    document.getElementById("simulatePayment").addEventListener("click", () => {
        if (cart.length === 0) return alert("El carrito está vacío");
        alert("¡Procesando pago! Gracias por elegir AutoNova Imperium.");
        cart = [];
        updateCart();
    });

    // Inicialización
    initUser();
    renderProducts();
    updateCart();
});