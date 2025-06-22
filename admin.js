// รอให้ DOM โหลดเสร็จก่อน
window.addEventListener('DOMContentLoaded', function () {
  // ฟังก์ชันเพิ่มสินค้า
  document.getElementById('addProductForm').addEventListener('submit', function (e) {
    e.preventDefault();  // ป้องกันการรีเฟรชหน้า

    // รับค่าจากฟอร์ม
    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const price = document.getElementById('price').value;
    const category = document.getElementById('category').value;
    const image = document.getElementById('image').value;

    // ส่งข้อมูลไปที่ backend (API)
    fetch('http://localhost:3000/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description, price, category, image })
    })
      .then(response => response.json())
      .then(data => {
        alert('สินค้าเพิ่มสำเร็จ!');
        document.getElementById('addProductForm').reset();  // รีเซ็ตฟอร์ม
        loadProducts();  // โหลดสินค้าทั้งหมดใหม่
      })
      .catch(err => console.error('Error:', err));
  });

  // โหลดสินค้าทันทีเมื่อหน้าเพจโหลด
  loadProducts();
});

// ฟังก์ชันโหลดสินค้า
function loadProducts() {
  fetch('http://localhost:3000/api/products')
    .then(res => res.json())
    .then(products => {
      const container = document.getElementById('productList');
      container.innerHTML = ''; // เคลียร์ข้อมูลเก่า

      if (products.length === 0) {
        container.innerHTML = `<p>ไม่พบสินค้าตามที่ค้นหา</p>`;
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
