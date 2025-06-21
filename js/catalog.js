// โหลดสินค้า (ทั้งหมดหรือเฉพาะตามหมวดหมู่)
function loadProducts(category = '') {
  let url = 'http://localhost:3000/api/products';
  if (category) {
    url += `/category/${encodeURIComponent(category)}`;
  }

  fetch(url)
    .then(res => res.json())
    .then(products => {
      const container = document.getElementById('productList');
      container.innerHTML = '';

      if (products.length === 0) {
        container.innerHTML = `<p>ไม่พบสินค้าในหมวดนี้</p>`;
        return;
      }

      products.forEach(p => {
        container.innerHTML += `
          <div class="col-lg-4 col-md-6 mb-4">
            <div class="card h-100">
              <img src="${p.image}" class="card-img-top" alt="${p.name}">
              <div class="card-body">
                <h5 class="card-title">${p.name}</h5>
                <p class="card-text">${p.description}</p>
                <p class="card-text text-danger"><strong>${p.price} บาท</strong></p>
              </div>
            </div>
          </div>
        `;
      });
    })
    .catch(err => {
      console.error('เกิดข้อผิดพลาดในการโหลดสินค้า:', err);
    });
}

// เมื่อเลือกหมวดหมู่
document.getElementById('categorySelect')?.addEventListener('change', function () {
  loadProducts(this.value);
});

// โหลดสินค้าทั้งหมดเมื่อหน้าโหลด
document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
});
