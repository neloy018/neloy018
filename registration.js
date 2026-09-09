/* =================================================
   BANGLADESH STANDARD TIME CLOCK
   ================================================= */

const hourHand = document.getElementById('hourHand');
const minuteHand = document.getElementById('minuteHand');
const secondHand = document.getElementById('secondHand');

function updateBangladeshClock(){
  const now = new Date();
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Dhaka',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23'
  }).formatToParts(now);

  let hour = 0;
  let minute = 0;
  let second = 0;

  parts.forEach(part => {
    if(part.type === 'hour'){ hour = Number(part.value); }
    if(part.type === 'minute'){ minute = Number(part.value); }
    if(part.type === 'second'){ second = Number(part.value); }
  });

  const hourAngle = ((hour % 12) * 30) + (minute * 0.5);
  const minuteAngle = (minute * 6) + (second * 0.1);
  const secondAngle = second * 6;

  hourHand.style.transform = `translateX(-50%) rotate(${hourAngle}deg)`;
  minuteHand.style.transform = `translateX(-50%) rotate(${minuteAngle}deg)`;
  secondHand.style.transform = `translateX(-50%) rotate(${secondAngle}deg)`;
}

updateBangladeshClock();
setInterval(updateBangladeshClock, 1000);

document.addEventListener('visibilitychange', () => {
  if(document.visibilityState === 'visible'){
    updateBangladeshClock();
  }
});

/* =================================================
   FOCUS EFFECT
   ================================================= */

const fieldWraps = document.querySelectorAll('.field-wrap');
const fields = document.querySelectorAll('.field');

fields.forEach(field => {
  field.addEventListener('focus', () => {
    fieldWraps.forEach(w => { w.classList.remove('active'); });
    field.parentElement.classList.add('active');
  });

  field.addEventListener('click', () => {
    fieldWraps.forEach(w => { w.classList.remove('active'); });
    field.parentElement.classList.add('active');
  });
});

/* =================================================
   SHOW / HIDE PASSWORD
   ================================================= */

document.querySelectorAll('.toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const input = document.getElementById(btn.dataset.target);

    if(input.type === 'password'){
      input.type = 'text';
      btn.textContent = 'HIDE';
    } else {
      input.type = 'password';
      btn.textContent = 'SHOW';
    }

    input.focus();
  });
});

/* =================================================
   PASSWORD ELEMENTS & STRENGTH
   ================================================= */

const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPassword');
const strengthFill = document.getElementById('strengthFill');

const reqs = {
  upper: document.getElementById('rUpper'),
  lower: document.getElementById('rLower'),
  number: document.getElementById('rNumber'),
  special: document.getElementById('rSpecial'),
  length: document.getElementById('rLength')
};

function checkPassword(){
  const value = password.value;

  const checks = {
    upper: /[A-Z]/.test(value),
    lower: /[a-z]/.test(value),
    number: /[0-9]/.test(value),
    special: /[^A-Za-z0-9]/.test(value),
    length: value.length >= 8
  };

  Object.keys(checks).forEach(key => {
    reqs[key].classList.toggle('ok', checks[key]);
  });

  const passed = Object.values(checks).filter(Boolean).length;
  let stage = passed;

  if(passed === 5){
    if(value.length >= 16){ stage = 8; }
    else if(value.length >= 13){ stage = 7; }
    else if(value.length >= 10){ stage = 6; }
    else { stage = 5; }
  }

  strengthFill.className = 'strength-fill' + (stage ? ' s' + stage : '');
  strengthFill.style.width = stage ? (stage / 8 * 100) + '%' : '0%';

  return checks;
}

/* =================================================
   LIVE PASSWORD UPDATE
   ================================================= */

password.addEventListener('input', checkPassword);
confirmPassword.addEventListener('input', checkPassword);
checkPassword();

/* =================================================
   SIGN UP VALIDATION
   ================================================= */

document.getElementById('registerForm').addEventListener('submit', e => {
  const form = e.currentTarget;

  if(form.dataset.registrationHandled === "true"){
    return;
  }

  const checks = checkPassword();
  const allStrong = Object.values(checks).every(Boolean);
  const same = password.value === confirmPassword.value && confirmPassword.value !== '';

  if(!allStrong){
    e.preventDefault();
    alert('Please complete all password requirements.');
    password.focus();
    return;
  }

  if(!same){
    e.preventDefault();
    alert('Password and Confirm Password do not match.');
    confirmPassword.focus();
    return;
  }
});

/* =================================================
   SIGN IN
   ================================================= */

document.getElementById('signInBtn').addEventListener('click', () => {
  window.location.href = 'login.html';
});
