/**
 * @jest-environment jsdom
 */

import { jest } from '@jest/globals';
import { renderFAQs, renderState, fetchFAQs } from './faq.js'; // file bạn đã viết logic
// ⚠️ Nhớ export các hàm trong file gốc để test được

beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  console.log.mockRestore();
  console.error.mockRestore();
});

// Tạo DOM giả cho faq-container
beforeEach(() => {
  document.body.innerHTML = `<div id="faq-container"></div>`;
  global.fetch = jest.fn(); // mock fetch API
});

afterEach(() => {
  jest.resetAllMocks();
});

test('renders FAQ items correctly', () => {
  const sampleData = [
    { question: 'Q1?', answer: 'A1' },
    { question: 'Q2?', answer: 'A2' },
  ];

  renderFAQs(sampleData);

  const faqItems = document.querySelectorAll('.faq__item');
  expect(faqItems.length).toBe(2);
  expect(faqItems[0].querySelector('.faq__question').textContent).toContain('Q1');
  expect(faqItems[1].querySelector('.faq__answer').textContent).toContain('A2');
});

test('shows Empty state when no data', async () => {
  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => [],
  });

  await fetchFAQs();

  const stateElement = document.querySelector('.faq__state');
  expect(stateElement.textContent).toBe('No FAQs available.');
});

test('shows Error state when fetch fails', async () => {
  global.fetch.mockRejectedValueOnce(new Error('Network error'));

  await fetchFAQs();

  const stateElement = document.querySelector('.faq__state');
  expect(stateElement.textContent).toBe('Error loading FAQs. Please try again later.');
});
