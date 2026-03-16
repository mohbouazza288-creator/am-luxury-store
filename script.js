const API_SHEETY = "https://api.sheety.co/52fd183a674270cd4b36a72f4307bb93/feuilleDeCalculSansTitre/feuille1";
const BOT_TOKEN = "8753134519:AAEaqgsaa8kZat3v1pYyNqlfMnZ1JUU0tDM";
const CHAT_ID = "8332065634";
let cart = [];

// قائمة الولايات والأسعار
const shippingRates = {
    "01 أدرار": { home: 1500, desk: 1000 }, "02 الشلف": { home: 750, desk: 450 }, "03 الأغواط": { home: 1000, desk: 600 },
    "04 أم البواقي": { home: 900, desk: 600 }, "05 باتنة": { home: 900, desk: 600 }, "06 بجاية": { home: 800, desk: 500 },
    "07 بسكرة": { home: 1100, desk: 700 }, "08 بشار": { home: 1200, desk: 800 }, "09 البليدة": { home: 750, desk: 450 },
    "10 البويرة": { home: 800, desk: 500 }, "11 تمنراست": { home: 2000, desk: 1500 }, "12 تبسة": { home: 900, desk: 600 },
    "13 تلمسان": { home: 800, desk: 500 }, "14 تيارت": { home: 800, desk: 500 }, "15 تيزي وزو": { home: 800, desk: 500 },
    "16 الجزائر": { home: 700, desk: 450 }, "17 الجلفة": { home: 1000, desk: 600 }, "18 جيجل": { home: 900, desk: 600 },
    "19 سطيف": { home: 900, desk: 600 }, "20 سعيدة": { home: 500, desk: 300 }, "21 سكيكدة": { home: 900, desk: 600 },
    "22 سيدي بلعباس": { home: 650, desk: 400 }, "23 عنابة": { home: 900, desk: 600 }, "24 قالمة": { home: 900, desk: 600 },
    "25 قسنطينة": { home: 900, desk: 600 }, "26 المدية": { home: 900, desk: 600 }, "27 مستغانم": { home: 800, desk: 500 },
    "28 المسيلة": { home: 900, desk: 600 }, "29 معسكر": { home: 600, desk: 400 }, "30 ورقلة": { home: 1000, desk: 600 },
    "31 وهران": { home: 700, desk: 450 }, "32 البيض": { home: 1200, desk: 800 }, "33 إليزي": { home: 1900, desk: 1500 },
    "34 برج بوعريريج": { home: 900, desk: 600 }, "35 بومرداس": { home: 750, desk: 450 }, "36 الطارف": { home: 900, desk: 600 },
    "37 تندوف": { home: 1700, desk: 1000 }, "38 تيسمسيلت": { home: 900, desk: 600 }, "39 الوادي": { home: 1000, desk: 600 },
    "40 خنشلة": { home: 900, desk: 600 }, "41 سوق أهراس": { home: 900, desk: 600 }, "42 تيبازة": { home: 750, desk: 450 },
    "43 ميلة": { home: 900, desk: 600 }, "44 عين الدفلى": { home: 800, desk: 500 }, "45 النعامة": { home: 1200, desk: 800 },
    "46 عين تموشنت": { home: 800, desk: 500 }, "47 غرداية": { home: 1000, desk: 600 }, "48 غليزان": { home: 700, desk: 450 },
    "49 أولاد جلال": { home: 1100, desk: 700 }, "50 بني عباس": { home: 1200, desk: 800 }, "51 إن صالح": { home: 1800, desk: 1200 },
    "52 إن قزام": { home: 2200, desk: 1800 }, "53 تقرت": { home: 1000, desk: 600 }, "54 جانت": { home: 2200, desk: 1800 },
    "55 المغير": { home: 1000, desk: 600 }, "56 المنيعة": { home: 1000, desk: 600 }, "58 برج باجي مختار": { home: 2000, desk: 1500 }
};

function showNotification(msg) {
    const div = document.createElement("div");
    div.style.cssText = "position:fixed; top:20px; left:50%; transform:translateX(-50%); background:#D4B483; color:#0A2626; padding:15px; border-radius:10px; z-index:9999; font-weight:bold; box-shadow:0 0 10px rgba(0,0,0,0.5);";
    div.innerText = msg;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 3000);
}

// تحميل المنتجات
fetch(API_SHEETY).then(r => r.json()).then(data => {
    const container = document.getElementById("product-container");
    data.feuille1.forEach((p, i) => {
        const imgs = [p.image1, p.image2, p.image3, p.image4, p.image5].filter(img => img);
        container.innerHTML += `<div class="product-card"><h3>${p.name}</h3><div class="slider-container"><a href="${imgs[0]}" target="_blank"><img id="img-${i}" src="${imgs[0]}" data-imgs='${JSON.stringify(imgs)}' data-curr="0" class="product-img"></a><br><button class="nav-btn" onclick="changeImg(${i}, -1)">❮</button> <button class="nav-btn" onclick="changeImg(${i}, 1)">❯</button></div><p>السعر: ${p.price} دج</p><select id="size-${i}"><option>S</option><option>M</option><option>L</option><option>XL</option><option>XXL</option></select><button class="add-btn" onclick="addToCart('${p.name}', ${p.price}, 'size-${i}')">إضافة للسلة</button></div>`;
    });
});

function changeImg(i, dir) {
    const img = document.getElementById(`img-${i}`);
    const list = JSON.parse(img.dataset.imgs);
    let cur = (parseInt(img.dataset.curr) + dir + list.length) % list.length;
    img.src = list[cur]; img.dataset.curr = cur;
    img.parentElement.href = list[cur];
}

function addToCart(name, price, sId) {
    cart.push({name, price, size: document.getElementById(sId).value});
    renderCart();
    showNotification("تمت الإضافة للسلة!");
}

function renderCart() {
    const cartDiv = document.getElementById("cart-items");
    const wilaya = document.getElementById("cust-wilaya").value;
    const deliveryType = document.getElementById("cust-delivery").value;
    
    let subtotal = cart.reduce((sum, item) => sum + parseInt(item.price), 0);
    let shipping = 0;
    
    if (wilaya && shippingRates[wilaya]) {
        shipping = (deliveryType === 'توصيل للمنزل') ? shippingRates[wilaya].home : shippingRates[wilaya].desk;
    }
    
    let total = subtotal + shipping;
    
    cartDiv.innerHTML = cart.map(i => `<p>${i.name} (${i.size}) - ${i.price} دج</p>`).join('');
    if(cart.length > 0) cartDiv.innerHTML += `<hr><strong>المجموع الفرعي: ${subtotal} دج</strong><br><strong>سعر التوصيل: ${shipping} دج</strong><br><strong style="font-size:1.2em; color:#D4B483;">المجموع الكلي: ${total} دج</strong>`;
}

// إعادة الحساب عند تغيير الولاية أو نوع التوصيل
document.getElementById("cust-wilaya").onchange = renderCart;
document.getElementById("cust-delivery").onchange = renderCart;

function sendOrder() {
    const n = document.getElementById("cust-name").value;
    const p = document.getElementById("cust-phone").value;
    const w = document.getElementById("cust-wilaya").value;
    const d = document.getElementById("cust-delivery").value;
    const addr = document.getElementById("address-box").value;
    if(!n || !p || !w || cart.length == 0) return showNotification("يرجى إكمال جميع البيانات!");

    const subtotal = cart.reduce((s, i) => s + parseInt(i.price), 0);
    const shipping = (w && shippingRates[w]) ? (d === 'توصيل للمنزل' ? shippingRates[w].home : shippingRates[w].desk) : 0;
    const total = subtotal + shipping;
    
    const productsList = cart.map(i => `\n- ${i.name} (${i.size}) : ${i.price} دج`).join('');
    const msg = `🛍 *طلب جديد من AM Luxury*%0A%0A👤 *الاسم:* ${n}%0A📱 *الهاتف:* ${p}%0A📍 *الولاية:* ${w}%0A🚚 *التوصيل:* ${d}%0A` + (addr ? `🏡 *العنوان:* ${addr}%0A` : ``) + `%0A📦 *المنتجات:* ${productsList}%0A%0A💰 *المجموع الفرعي:* ${subtotal} دج%0A🚚 *التوصيل:* ${shipping} دج%0A-------------------%0A💰 *المجموع الكلي:* ${total} دج`;
    
    fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${msg}&parse_mode=Markdown`)
    .then(() => {
        showNotification("شكراً لثقتكم، سنتواصل معكم في أقرب وقت!");
        cart = []; renderCart();
        document.getElementById("cust-name").value = ""; document.getElementById("cust-phone").value = ""; document.getElementById("address-box").value = "";
    });
}
