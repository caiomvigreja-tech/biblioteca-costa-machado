const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const id = link.getAttribute('href');
    if (!id || id === '#') return;
    const target = document.querySelector(id);
    if (target) {
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

const countdownElements = document.querySelectorAll('[data-countdown]');
const deadlineLabels = document.querySelectorAll('[data-deadline-label]');
const deadlineMessages = document.querySelectorAll('[data-deadline-message]');
const offerDuration = 24 * 60 * 60 * 1000;
const storageKey = 'biblioteca-processo-vip-expira-em';
let expirationTime;

try {
  expirationTime = Number(localStorage.getItem(storageKey));
  if (!expirationTime) {
    expirationTime = Date.now() + offerDuration;
    localStorage.setItem(storageKey, String(expirationTime));
  }
} catch {
  expirationTime = Date.now() + offerDuration;
}

const formatCountdown = (remaining) => {
  const totalSeconds = Math.max(0, Math.floor(remaining / 1000));
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
};

const expireOffer = () => {
  countdownElements.forEach((element) => { element.textContent = '00:00:00'; });
  deadlineLabels.forEach((element) => { element.textContent = 'ÚLTIMAS VAGAS'; });
  deadlineMessages.forEach((element) => { element.textContent = '— inscrições ainda disponíveis'; });
};

const updateCountdown = () => {
  const remaining = expirationTime - Date.now();
  if (remaining <= 0) {
    expireOffer();
    return false;
  }
  const formatted = formatCountdown(remaining);
  countdownElements.forEach((element) => { element.textContent = formatted; });
  return true;
};

updateCountdown();
const countdownInterval = setInterval(() => {
  if (!updateCountdown()) clearInterval(countdownInterval);
}, 1000);
