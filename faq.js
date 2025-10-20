function getFaqContainer() {
  return document.getElementById('faq-container');
}

export function renderState(message) {
  const faqContainer = getFaqContainer();
  console.log(`[STATE] ${message}`);
  faqContainer.innerHTML = `<div class="faq__state">${message}</div>`;
}

export function renderFAQs(faqs) {
  const faqContainer = getFaqContainer();
  console.log(`[RENDER] Rendering ${faqs.length} FAQ(s)`);

  faqContainer.innerHTML = faqs.map((faq) => `
    <div class="faq__item">
      <div class="faq__question">
        <span>${faq.question}</span>
        <span class="faq__icon">▼</span>
      </div>
      <div class="faq__answer">${faq.answer}</div>
    </div>
  `).join('');

  const faqItems = faqContainer.querySelectorAll('.faq__item');
  faqItems.forEach((item, i) => {
    item.addEventListener('click', () => {
      faqItems.forEach(other => {
        if (other !== item) other.classList.remove('open');
      });
      item.classList.toggle('open');
    });
  });
}

export async function fetchFAQs() {
  console.log('[FETCH] Start fetching FAQs...');
  renderState('Loading...');

  try {
    const res = await fetch('faqs.json');
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    const data = await res.json();
    if (data.length === 0) renderState('No FAQs available.');
    else renderFAQs(data);
  } catch (err) {
    console.error('[FETCH ERROR]', err);
    renderState('Error loading FAQs. Please try again later.');
  }
}

// Khởi chạy khi trang load
document.addEventListener('DOMContentLoaded', () => {
    console.log('[INIT] Document loaded. Fetching FAQs...');
    fetchFAQs();
});