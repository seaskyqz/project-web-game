// ฟังก์ชันเพิ่มสินค้า
document.getElementById('addProductForm').addEventListener('submit', function (e) {
  e.preventDefault();

  // รับค่าจากฟอร์ม
  const name = document.getElementById('name').value;
  const description = document.getElementById('description').value;
  const price = document.getElementById('price').value;
  const category = document.getElementById('category').value;
  const image = document.getElementById('image').value;

  // ส่งข้อมูลไปที่ backend
  fetch('http://localhost:3000/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, description, price, category, image })
  })
    .then(response => response.json())
    .then(data => {
      alert('สินค้าเพิ่มสำเร็จ!');
      
      // รีเซ็ตฟอร์มหลังจากเพิ่มสินค้า
      document.getElementById('addProductForm').reset();

      // โหลดสินค้าทั้งหมดใหม่หลังจากเพิ่ม
      loadProducts();
    })
    .catch(err => console.error('Error:', err));
});

// ฟังก์ชันโหลดสินค้า
function loadProducts(category = '', searchTerm = '') {
  let url = 'http://localhost:3000/api/products';

  // กรองสินค้าตามหมวดหมู่
  if (category) {
    url += `/category/${encodeURIComponent(category)}`;
  }

  // ค้นหาตามคำค้น
  if (searchTerm) {
    url = `http://localhost:3000/api/products/search?search=${encodeURIComponent(searchTerm)}`;
  }

  fetch(url)
    .then(res => res.json())
    .then(products => {
      const container = document.getElementById('productList');
      container.innerHTML = '';

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
