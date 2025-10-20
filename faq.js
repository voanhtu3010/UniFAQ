const faqContainer = document.getElementById('faq-container');

// Hàm render trạng thái (Loading, Empty, Error)
function renderState(message) {
  console.log(`[STATE] ${message}`);
  faqContainer.innerHTML = `<div class="faq__state">${message}</div>`;
}

// Hàm render danh sách FAQ với accordion
function renderFAQs(faqs) {
  console.log(`[RENDER] Rendering ${faqs.length} FAQ(s)`);
  faqContainer.innerHTML = faqs.map((faq, index) => `
    <div class="faq__item">
      <div class="faq__question">
        <span>${faq.question}</span>
        <span class="faq__icon">▼</span>
      </div>
      <div class="faq__answer">${faq.answer}</div>
    </div>
  `).join('');

  // Thêm sự kiện click cho accordion
  const faqItems = faqContainer.querySelectorAll('.faq__item');
  faqItems.forEach((item, i) => {
    item.addEventListener('click', () => {
      console.log(`[CLICK] FAQ item ${i + 1} clicked`);
      // Đóng các item khác
      faqItems.forEach((other, j) => {
        if (other !== item) {
          other.classList.remove('open');
          console.log(`→ Closed item ${j + 1}`);
        }
      });
      // Toggle item hiện tại
      item.classList.toggle('open');
      console.log(`→ Toggled item ${i + 1} (${item.classList.contains('open') ? 'OPEN' : 'CLOSED'})`);
    });
  });
}

// Fetch dữ liệu từ faqs.json
async function fetchFAQs() {
  console.log('[FETCH] Start fetching FAQs...');
  renderState('Loading...'); // Trạng thái loading

  try {
    const res = await fetch('faqs.json');
    console.log(`[FETCH] Response status: ${res.status}`);

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    const data = await res.json();
    console.log('[FETCH] Data received:', data);

    if (data.length === 0) {
      console.log('[FETCH] Data is empty');
      renderState('No FAQs available.');
    } else {
      renderFAQs(data);
    }
  } catch (err) {
    console.error('[FETCH ERROR]', err);
    renderState('Error loading FAQs. Please try again later.');
  }
}

// Gọi khi trang load
document.addEventListener('DOMContentLoaded', () => {
  console.log('[INIT] Document loaded. Fetching FAQs...');
  fetchFAQs();
});
