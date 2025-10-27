import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import ImpressumPage from './pages/ImpressumPage.jsx';
import DatenschutzPage from './pages/DatenschutzPage.jsx';
import ThankYouPage from './pages/ThankYouPage.jsx';
import './index.css';

let path = window.location.pathname.replace(/\/+$/, '');
// Support deployment under sub-path like /schnitter
if (path.startsWith('/schnitter')) {
  path = path.slice('/schnitter'.length) || '/';
  console.log("Path: ", path);
}
const isImpressum = path === '/impressum';
const isDatenschutz = path === '/datenschutz';
const isDanke = path === '/danke';
const Root = isImpressum ? ImpressumPage : isDatenschutz ? DatenschutzPage : isDanke ? ThankYouPage : App;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
);

// Smooth in-page scrolling with sticky-header offset
window.addEventListener('click', (e) => {
  if (!(e.target instanceof Element)) return;
  const anchor = e.target.closest('a[href^="#"], a[href^="/#"]');
  if (!anchor) return;

  const href = anchor.getAttribute('href');
  if (!href || href.length <= 1) return;

  const id = href.startsWith('/#') ? href.slice(2) : href.slice(1);
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
