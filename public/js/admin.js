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

  // ฟังก์ชันแก้ไขสินค้า
  document.getElementById('editProductForm').addEventListener('submit', function (e) {
    e.preventDefault();  // ป้องกันการรีเฟรชหน้า

    // รับค่าจากฟอร์มแก้ไข
    const id = document.getElementById('editId').value;
    const name = document.getElementById('editName').value;
    const description = document.getElementById('editDescription').value;
    const price = document.getElementById('editPrice').value;
    const category = document.getElementById('editCategory').value;
    const image = document.getElementById('editImage').value;

    // ส่งข้อมูลไปที่ backend (API) เพื่อแก้ไขสินค้า
    fetch(`http://localhost:3000/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description, price, category, image })
    })
      .then(response => response.json())
      .then(data => {
        alert('สินค้าแก้ไขสำเร็จ!');
        loadProducts();  // โหลดสินค้าทั้งหมดใหม่
      })
      .catch(err => console.error('Error:', err));
  });

  // ฟังก์ชันลบสินค้า
  document.getElementById('deleteProductForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const id = document.getElementById('deleteId').value;

    // ส่งคำขอลบสินค้าไปที่ API
    fetch(`http://localhost:3000/api/products/${id}`, {
      method: 'DELETE',
    })
      .then(response => response.json())
      .then(data => {
        alert('สินค้าถูกลบแล้ว!');
        loadProducts();  // โหลดสินค้าทั้งหมดใหม่
      })
      .catch(err => console.error('Error:', err));
  });

  // โหลดสินค้าทันทีเมื่อหน้าเพจโหลด
  loadProducts();
  loadCategories(); // โหลดหมวดหมู่ที่มีในระบบ
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
                <button onclick="populateEditForm(${p.id})">แก้ไข</button>
                <button onclick="populateDeleteForm(${p.id})">ลบ</button>
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

// ฟังก์ชันเติมข้อมูลในฟอร์มแก้ไข
function populateEditForm(id) {
  fetch(`http://localhost:3000/api/products/${id}`)
    .then(res => res.json())
    .then(data => {
      document.getElementById('editId').value = data.id;
      document.getElementById('editName').value = data.name;
      document.getElementById('editDescription').value = data.description;
      document.getElementById('editPrice').value = data.price;
      document.getElementById('editCategory').value = data.category;
      document.getElementById('editImage').value = data.image;
    })
    .catch(err => console.error('Error:', err));
}

// ฟังก์ชันเติมข้อมูลในฟอร์มลบ
function populateDeleteForm(id) {
  document.getElementById('deleteId').value = id;
}

// ฟังก์ชันโหลดหมวดหมู่จาก backend
function loadCategories() {
  fetch('http://localhost:3000/api/categories')
    .then(res => res.json())
    .then(categories => {
      const editCategorySelect = document.getElementById('editCategory');
      const addCategorySelect = document.getElementById('category');
      
      // ล้าง dropdown เก่า
      editCategorySelect.innerHTML = '<option value="">เลือกหมวดหมู่</option>';
      addCategorySelect.innerHTML = '<option value="">เลือกหมวดหมู่</option>';
      
      // เพิ่มหมวดหมู่ที่มีอยู่แล้ว
      categories.forEach(category => {
        editCategorySelect.innerHTML += `<option value="${category.name}">${category.name}</option>`;
        addCategorySelect.innerHTML += `<option value="${category.name}">${category.name}</option>`;
      });
    })
    .catch(err => {
      console.error('Error loading categories:', err);
    });
}
