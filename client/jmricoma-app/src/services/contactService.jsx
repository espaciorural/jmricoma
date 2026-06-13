import axios from 'axios';

const RECAPTCHA_ACTION = 'contact_submit';
const RECAPTCHA_SCRIPT_ID = 'google-recaptcha-v3';

const loadRecaptchaScript = (siteKey) => new Promise((resolve, reject) => {
  if (!siteKey) {
    resolve();
    return;
  }

  if (window.grecaptcha) {
    resolve();
    return;
  }

  const existingScript = document.getElementById(RECAPTCHA_SCRIPT_ID);

  if (existingScript) {
    existingScript.addEventListener('load', resolve, { once: true });
    existingScript.addEventListener('error', reject, { once: true });
    return;
  }

  const script = document.createElement('script');
  script.id = RECAPTCHA_SCRIPT_ID;
  script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
  script.async = true;
  script.defer = true;
  script.onload = resolve;
  script.onerror = reject;
  document.head.appendChild(script);
});

const getRecaptchaToken = async () => {
  const siteKey = process.env.REACT_APP_RECAPTCHA_SITE_KEY;

  if (!siteKey) {
    return '';
  }

  await loadRecaptchaScript(siteKey);

  return new Promise((resolve, reject) => {
    window.grecaptcha.ready(() => {
      window.grecaptcha
        .execute(siteKey, { action: RECAPTCHA_ACTION })
        .then(resolve)
        .catch(reject);
    });
  });
};

const sendContactMessage = async ({ name, email, message }) => {
  const captchaToken = await getRecaptchaToken();
  const response = await axios.post('/api/contact', {
    name,
    email,
    message,
    captchaToken,
  });

  return response.data;
};

export { sendContactMessage };
