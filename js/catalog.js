// ฟังก์ชันเพิ่มสินค้า
document.getElementById('addProductForm').addEventListener('submit', function (e) {
  e.preventDefault();  // ป้องกันการรีเฟรชหน้า

  // รับค่าจากฟอร์ม
  const name = document.getElementById('name').value;
  const description = document.getElementById('description').value;
  const price = document.getElementById('price').value;
  const category = document.getElementById('category').value;
  const image = document.getElementById('image').value;

  // ส่งข้อมูลไปที่ backend (API) เพื่อเพิ่มสินค้า
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

// ฟังก์ชันโหลดหมวดหมู่จาก backend
function loadCategories() {
  fetch('http://localhost:3000/api/categories')
    .then(res => res.json())
    .then(categories => {
      const categorySelect = document.getElementById('category');
      const categorySelectForSearch = document.getElementById('categorySelect');
      categorySelect.innerHTML = '<option value="">เลือกหมวดหมู่</option>'; // ล้างตัวเลือกเก่า
      categorySelectForSearch.innerHTML = '<option value="">ทั้งหมด</option>'; // ล้างตัวเลือกเก่า

      // เพิ่มหมวดหมู่ที่มีอยู่แล้ว
      categories.forEach(category => {
        categorySelect.innerHTML += `<option value="${category.name}">${category.name}</option>`;
        categorySelectForSearch.innerHTML += `<option value="${category.name}">${category.name}</option>`;
      });
    })
    .catch(err => {
      console.error('Error loading categories:', err);
    });
}

// ฟังก์ชันเพิ่มหมวดหมู่ใหม่
document.getElementById('addCategoryBtn').addEventListener('click', function () {
  const newCategory = prompt('กรอกชื่อหมวดหมู่ใหม่:');
  if (newCategory) {
    // ส่งหมวดหมู่ใหม่ไปที่ backend
    fetch('http://localhost:3000/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category: newCategory })
    })
      .then(response => response.json())
      .then(data => {
        alert('หมวดหมู่ใหม่ถูกเพิ่มแล้ว');
        loadCategories(); // รีเฟรชหมวดหมู่หลังจากเพิ่มใหม่
      })
      .catch(err => {
        console.error('Error adding category:', err);
      });
  }
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

      // แสดงสินค้าทั้งหมด
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

// ฟังก์ชันค้นหาสินค้าตามคำค้น
document.getElementById('searchBtn').addEventListener('click', function () {
  const searchQuery = document.getElementById('searchInput').value;
  fetch(`http://localhost:3000/api/products/search?search=${searchQuery}`)
    .then(res => res.json())
    .then(products => {
      const container = document.getElementById('productList');
      container.innerHTML = ''; // เคลียร์ข้อมูลเก่า

      if (products.length === 0) {
        container.innerHTML = `<p>ไม่พบสินค้าตามที่ค้นหา</p>`;
        return;
      }

      // แสดงสินค้าที่ค้นหา
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
      console.error('เกิดข้อผิดพลาดในการค้นหาสินค้า:', err);
    });
});

// เรียกใช้ฟังก์ชันโหลดหมวดหมู่และสินค้าเมื่อหน้าเพจโหลด
document.addEventListener('DOMContentLoaded', function () {
  loadCategories(); // โหลดหมวดหมู่
  loadProducts();   // โหลดสินค้าทั้งหมด
});
