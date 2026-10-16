const topo = document.querySelector('.topo');
const burger = document.querySelector('.burger');
const menu = document.querySelector('.menu-extra');

/* ===== MENU HAMBÚRGUER ===== */
function fecharMenu() {
  menu.classList.remove('aberto');
  burger.classList.remove('aberto');
  burger.innerHTML = '&#9776;';
  burger.setAttribute('aria-expanded', 'false');
}

function alternarMenu() {
  const abrir = !menu.classList.contains('aberto');
  menu.classList.toggle('aberto', abrir);
  burger.classList.toggle('aberto', abrir);
  burger.innerHTML = abrir ? '&#10005;' : '&#9776;';
  burger.setAttribute('aria-expanded', abrir);
}

burger.addEventListener('click', (e) => {
  e.stopPropagation();
  alternarMenu();
});

menu.addEventListener('click', (e) => {
  if (e.target.closest('a')) fecharMenu();
});

document.addEventListener('click', (e) => {
  if (!topo.contains(e.target)) fecharMenu();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') fecharMenu();
});

/* ===== TOPO COM EFEITO AO ROLAR ===== */
window.addEventListener('scroll', () => {
  topo.classList.toggle('rolou', window.scrollY > 20);
}, { passive: true });

/* ===== APARECER AO ROLAR ===== */
const alvos = document.querySelectorAll(
  '.sec h2, .sub, .card, .palestra, .bio p, .texto p, .cta p, .post, .livro, form, .centro'
);

const observador = new IntersectionObserver((entradas) => {
  entradas.forEach((entrada) => {
    if (!entrada.isIntersecting) return;
    const el = entrada.target;
    el.classList.add('visivel');
    observador.unobserve(el);
    setTimeout(() => el.classList.remove('reveal', 'visivel'), 1000);
  });
}, { threshold: 0.1 });

alvos.forEach((el) => {
  const posicao = [...el.parentElement.children].indexOf(el);
  el.style.setProperty('--d', (posicao % 4) * 0.08 + 's');
  el.classList.add('reveal');
  observador.observe(el);
});

/* ===== VALIDAÇÃO E MÁSCARA APENAS NÚMEROS NO CAMPO CELULAR ===== */
document.querySelectorAll('input[name="celular"]').forEach((input) => {
  input.addEventListener('input', (e) => {
    let v = e.target.value.replace(/\D/g, '');
    if (v.length > 11) v = v.slice(0, 11);

    if (v.length > 6) {
      v = `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`;
    } else if (v.length > 2) {
      v = `(${v.slice(0, 2)}) ${v.slice(2)}`;
    } else if (v.length > 0) {
      v = `(${v}`;
    }

    e.target.value = v;
  });
});

/* ===== VALIDAÇÃO E MÁSCARA APENAS NÚMEROS NO CAMPO DATA (DD/MM/AAAA) ===== */
document.querySelectorAll('input[name="data"]').forEach((input) => {
  input.addEventListener('input', (e) => {
    let v = e.target.value.replace(/\D/g, '');
    if (v.length > 8) v = v.slice(0, 8);

    if (v.length > 4) {
      v = `${v.slice(0, 2)}/${v.slice(2, 4)}/${v.slice(4)}`;
    } else if (v.length > 2) {
      v = `${v.slice(0, 2)}/${v.slice(2)}`;
    }

    e.target.value = v;
  });
});

/* ===== CARROSSEL INFINITO CIRCULAR COM ARRASTE E SETAS ULTRA SUAVES ===== */
const carrosselContainer = document.querySelector('.carrossel-container');
const btnPrev = document.querySelector('.carrossel-btn.prev');
const btnNext = document.querySelector('.carrossel-btn.next');

if (carrosselContainer && btnPrev && btnNext) {
  const getItemWidth = () => carrosselContainer.querySelector('.carrossel-item').offsetWidth + 24;

  btnNext.addEventListener('click', () => {
    const itemWidth = getItemWidth();
    const maxScrollLeft = carrosselContainer.scrollWidth - carrosselContainer.clientWidth;
    
    if (carrosselContainer.scrollLeft >= maxScrollLeft - 10) {
      carrosselContainer.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      carrosselContainer.scrollBy({ left: itemWidth, behavior: 'smooth' });
    }
  });

  btnPrev.addEventListener('click', () => {
    const itemWidth = getItemWidth();
    
    if (carrosselContainer.scrollLeft <= 10) {
      carrosselContainer.scrollTo({ left: carrosselContainer.scrollWidth, behavior: 'smooth' });
    } else {
      carrosselContainer.scrollBy({ left: -itemWidth, behavior: 'smooth' });
    }
  });

  let isDown = false;
  let startX;
  let scrollLeft;

  carrosselContainer.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.pageX - carrosselContainer.offsetLeft;
    scrollLeft = carrosselContainer.scrollLeft;
    carrosselContainer.style.scrollSnapType = 'none';
  });

  carrosselContainer.addEventListener('mouseleave', () => {
    if (!isDown) return;
    isDown = false;
    carrosselContainer.style.scrollSnapType = 'x mandatory';
  });

  carrosselContainer.addEventListener('mouseup', () => {
    if (!isDown) return;
    isDown = false;
    carrosselContainer.style.scrollSnapType = 'x mandatory';
    
    const maxScrollLeft = carrosselContainer.scrollWidth - carrosselContainer.clientWidth;
    if (carrosselContainer.scrollLeft >= maxScrollLeft - 5) {
      carrosselContainer.scrollTo({ left: 0, behavior: 'smooth' });
    } else if (carrosselContainer.scrollLeft <= 5) {
      carrosselContainer.scrollTo({ left: maxScrollLeft, behavior: 'smooth' });
    }
  });

  carrosselContainer.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - carrosselContainer.offsetLeft;
    const walk = (x - startX) * 1.5;
    carrosselContainer.scrollLeft = scrollLeft - walk;
  });
}

/* ===== SISTEMA DE TRADUÇÃO PT / EN ===== */
const langBtn = document.getElementById('lang-btn');
let currentLang = localStorage.getItem('site_lang') || 'pt';

function updateLanguage(lang) {
  document.querySelectorAll('[data-pt]').forEach((el) => {
    if (lang === 'en' && el.dataset.en) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = el.dataset.en;
      } else {
        el.innerHTML = el.dataset.en;
      }
    } else if (el.dataset.pt) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = el.dataset.pt;
      } else {
        el.innerHTML = el.dataset.pt;
      }
    }
  });

  if (langBtn) {
    langBtn.textContent = lang === 'pt' ? 'EN' : 'PT';
  }
  localStorage.setItem('site_lang', lang);
}

if (langBtn) {
  updateLanguage(currentLang);

  langBtn.addEventListener('click', () => {
    currentLang = currentLang === 'pt' ? 'en' : 'pt';
    updateLanguage(currentLang);
  });
}

/* ===== ENVIO DOS FORMULÁRIOS ===== */
document.querySelectorAll('form').forEach((form) => {
  const aviso = document.createElement('p');
  aviso.className = 'full form-aviso';
  aviso.setAttribute('role', 'status');
  form.appendChild(aviso);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const botao = form.querySelector('button[type="submit"]');
    const textoOriginal = botao.textContent;
    botao.disabled = true;
    botao.textContent = currentLang === 'en' ? 'Sending...' : 'Enviando...';
    aviso.textContent = '';

    try {
      const resposta = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });
      if (!resposta.ok) throw new Error();
      form.reset();
      aviso.className = 'full form-aviso ok';
      aviso.textContent = currentLang === 'en' ? 'Message sent successfully! Our team will contact you soon.' : 'Mensagem enviada com sucesso! Em breve nossa equipe entrará em contato.';
    } catch (erro) {
      aviso.className = 'full form-aviso erro';
      aviso.textContent = currentLang === 'en' ? 'Could not send. Try again or write to acfreitas@acfreitas.com.br.' : 'Não foi possível enviar. Tente novamente ou escreva para acfreitas@acfreitas.com.br.';
    }

    botao.disabled = false;
    botao.textContent = textoOriginal;
  });
});