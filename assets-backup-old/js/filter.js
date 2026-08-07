let allListings = [];

function showLoader() {
  const container = document.getElementById('listings-container');
  
  const skeletonCard = `
    <div class="listing-card skeleton-card">
        <div class="listing-img skeleton-pulse" style="height: 250px; background: #eaeaea; border-radius: 12px 12px 0 0;"></div>
        <div class="listing-details" style="padding: 20px;">
          <span class="listing-tag skeleton-pulse" style="width: 80px; height: 24px; display: inline-block; margin-bottom: 15px; background: #eaeaea; border-radius: 20px;"></span>
          <h3 class="skeleton-pulse" style="width: 70%; height: 28px; background: #eaeaea; margin-bottom: 15px; border-radius: 4px;"></h3>
          <p class="skeleton-pulse" style="width: 100%; height: 50px; background: #eaeaea; margin-bottom: 20px; border-radius: 4px;"></p>
          <div class="skeleton-pulse" style="width: 130px; height: 45px; background: #eaeaea; border-radius: 30px;"></div>
        </div>
    </div>
  `;

  container.innerHTML = `
    <style>
      .skeleton-pulse {
        animation: pulse 1.5s infinite ease-in-out;
      }
      @keyframes pulse {
        0% { opacity: 0.7; background-color: #eaeaea; }
        50% { opacity: 1; background-color: #f5f5f5; }
        100% { opacity: 0.7; background-color: #eaeaea; }
      }
      .skeleton-card {
        pointer-events: none;
        border: 1px solid #f0f0f0;
        box-shadow: 0 4px 15px rgba(0,0,0,0.03);
      }
    </style>
    ${skeletonCard.repeat(3)}
  `;
}

$(document).ready(function () {
  $('.filter-type, .filter-price').on('change', function () {
    showLoader();
    $.ajax({
      url: window.LISTINGS_DATA_URL,
      type: 'GET',
      dataType: 'json',
      beforeSend: function () {
        showLoader();
      },
      success: function(data) {
        allListings = data;
        applyFilters();
      },
      error: function(xhr, status, error) {
        console.error("AJAX Error:", error);
        document.getElementById('listings-container').innerHTML = '<p>Error loading listings.</p>';
      }
    });
  });
});

function applyFilters() {
  const selectedTypes = [...document.querySelectorAll('.filter-type:checked')].map(el => el.value);
  const selectedPrices = [...document.querySelectorAll('.filter-price:checked')].map(el => el.value);

  let filtered = allListings;

  if (selectedTypes.length && !selectedTypes.includes('all')) {
    filtered = filtered.filter(item =>
      item.types && item.types.some(t => selectedTypes.includes(t))
    );
  }

  if (selectedPrices.length) {
    filtered = filtered.filter(item =>
      item.priceRanges && item.priceRanges.some(p => selectedPrices.includes(p))
    );
  }

  renderListings(filtered);
}

function renderListings(items) {
  const container = document.getElementById('listings-container');

  if (!items.length) {
    container.innerHTML = `<p>No listings found.</p>`;
    return;
  }

  container.innerHTML = items.map((item, i) => `
    <div class="listing-card">
        <div class="listing-img">
        ${item.image ? 
          `<img src="${item.image}" alt="${item.title}">` 
        : 
          `<div class="promo-img-placeholder" style="height: 100%; min-height: 200px; display: flex; align-items: center; justify-content: center; background: #e0e0e0;">
            <span>No Image</span>
          </div>`
        }
    </div>
    <div class="listing-details">
      <span class="listing-tag">Listing #${i + 1}</span>
      <h3>${item.title}</h3>
      <p>${item.description}</p>
      <a href="${item.buttonUrl || '#'}" class="cstm-btn">${item.buttonText || 'View Details'}</a>
    </div>
  </div>
  `).join('');
}
