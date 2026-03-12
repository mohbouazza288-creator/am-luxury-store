<script>
    const API_SHEETY = "https://api.sheety.co/52fd183a674270cd4b36a72f4307bb93/feuilleDeCalculSansTitre/feuille1";
    const BOT_TOKEN = "8753134519:AAEaqgsaa8kZat3v1pYyNqlfMnZ1JUU0tDM";
    const CHAT_ID = "8332065634";
    let cart = [];

    // نظام الإشعارات الأنيق
    function showNotification(msg) {
        const div = document.createElement("div");
        div.style.cssText = "position:fixed; top:20px; left:50%; transform:translateX(-50%); background:#D4B483; color:#0A2626; padding:15px; border-radius:10px; z-index:9999; font-weight:bold; box-shadow:0 0 10px rgba(0,0,0,0.5);";
        div.innerText = msg;
        document.body.appendChild(div);
        setTimeout(() => div.remove(), 3000);
    }

    // دالة تغيير الصور
    function changeImg(btn, dir) {
        const container = btn.parentElement;
        const img = container.querySelector('img');
        const list = JSON.parse(img.dataset.imgs);
        let cur = parseInt(img.dataset.curr);
        cur = (cur + dir + list.length) % list.length;
        img.src = list[cur];
        img.dataset.curr = cur;
    }

    // دالة السلة مع حساب المجموع
    function addToCart(name, price, sId) {
        const size = document.getElementById(sId).value;
        cart.push({name, price, size});
        renderCart();
        showNotification("تمت الإضافة للسلة!");
    }

    function renderCart() {
        const cartDiv = document.getElementById("cart-items");
        const total = cart.reduce((sum, item) => sum + parseInt(item.price), 0);
        cartDiv.innerHTML = cart.map((i, index) => `<p>${i.name} (${i.size}) - ${i.price} دج</p>`).join('');
        if(cart.length > 0) cartDiv.innerHTML += `<hr><strong>المجموع الكلي: ${total} دج</strong>`;
    }

    // دالة الإرسال المنظمة
    function sendOrder() {
        const n = document.getElementById("cust-name").value;
        const p = document.getElementById("cust-phone").value;
        const w = document.getElementById("cust-wilaya").value;
        const d = document.getElementById("cust-delivery").value;
        const addr = document.getElementById("address-box").value;
        
        if(!n || !p || cart.length == 0) return showNotification("يرجى إكمال البيانات واختيار منتجات!");

        const total = cart.reduce((s, i) => s + parseInt(i.price), 0);
        const productsText = cart.map(i => `%0A- ${i.name} (${i.size}) : ${i.price} دج`).join('');
        
        const msg = `🛍 *طلب جديد من AM Luxury*%0A%0A👤 *الاسم:* ${n}%0A📱 *الهاتف:* ${p}%0A📍 *الولاية:* ${w}%0A🚚 *التوصيل:* ${d}%0A` + 
                    (addr ? `🏡 *العنوان:* ${addr}%0A` : ``) + 
                    `%0A📦 *المنتجات:* ${productsText}%0A%0A💰 *المجموع:* ${total} دج`;

        fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${msg}&parse_mode=Markdown`)
        .then(() => {
            showNotification("شكراً لثقتكم، سنتواصل معكم في أقرب وقت!");
            cart = [];
            renderCart();
            document.getElementById("cust-name").value = "";
            document.getElementById("cust-phone").value = "";
            document.getElementById("address-box").value = "";
        });
    }
</script>

