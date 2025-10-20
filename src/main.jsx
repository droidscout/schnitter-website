import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// Smooth in-page scrolling with sticky-header offset
window.addEventListener('click', (e) => {
  const anchor = e.target.closest && e.target.closest('a[href^="#"]');
  if (!anchor) return;

  const href = anchor.getAttribute('href');
  if (!href || href.length <= 1) return;

  const id = href.slice(1);
  const target = document.getElementById(id);
  if (!target) return;

  e.preventDefault();
  const header = document.querySelector('.header');
  const headerHeight = header ? header.getBoundingClientRect().height : 0;
  const offset = Math.ceil(headerHeight + 10);
  const top = target.getBoundingClientRect().top + window.scrollY - offset;

  window.scrollTo({ top, behavior: 'smooth' });
  // Update the hash without jumping
  history.pushState(null, '', `#${id}`);
});
