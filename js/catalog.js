$(document).ready(() => {
  // Load all categories
  $.get('/api/categories', (categories) => {
    categories.forEach(cat => {
      $('#category-select').append(`<option value="${cat.id}">${cat.name}</option>`);
    });

    const firstCategoryId = categories[0]?.id;
    if (firstCategoryId) {
      loadProducts(firstCategoryId);
    }
  });

  // Change category
  $('#category-select').change(function () {
    const categoryId = $(this).val();
    loadProducts(categoryId);
  });

  // Search
  $('#search-btn').click(() => {
    const keyword = $('#search-input').val();
    $.get(`/api/search?keyword=${encodeURIComponent(keyword)}`, (products) => {
      $('#product-list').html('');
      products.forEach(prod => {
        $('#product-list').append(`
          <div class="product-card">
            <img src="/images/${prod.image}" alt="${prod.name}" width="120">
            <h3>${prod.name}</h3>
            <p>${prod.description}</p>
            <p><strong>฿${prod.price}</strong></p>
          </div>
        `);
      });
    });
  });

  function loadProducts(categoryId) {
    $.get(`/api/products/${categoryId}`, (products) => {
      $('#product-list').html('');
      products.forEach(prod => {
        $('#product-list').append(`
          <div class="product-card">
            <img src="/images/${prod.image}" alt="${prod.name}" width="120">
            <h3>${prod.name}</h3>
            <p>${prod.description}</p>
            <p><strong>฿${prod.price}</strong></p>
          </div>
        `);
      });
    });
  }
});