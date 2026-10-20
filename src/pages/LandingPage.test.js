import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import LandingPage from './LandingPage';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

function renderPage() {
  const container = document.createElement('div');
  document.body.appendChild(container);
  act(() => {
    createRoot(container).render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <LandingPage />
      </MemoryRouter>
    );
  });
  return container;
}

describe('LandingPage', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('lists all eight sample businesses', () => {
    const container = renderPage();
    expect(container.textContent).toContain("Rahim's Rice Mill");
    expect(container.textContent).toContain("Hassan's Auto Repair");
    expect(container.textContent).toContain('8 listings');
  });

  test('filters to one agriculture listing', () => {
    const container = renderPage();
    const category = container.querySelector('select');
    act(() => {
      category.value = 'Agriculture';
      category.dispatchEvent(new Event('change', { bubbles: true }));
    });
    expect(container.textContent).toContain('1 listing');
    expect(container.textContent).toContain("Rahim's Rice Mill");
    expect(container.textContent).not.toContain("Md's Garment Shop");
  });
});
