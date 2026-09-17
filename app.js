/* ===== CHARACTER SYSTEM ===== */
var CHAR_TYPES = ['frog','cat','bunny','panda','fox','penguin','unicorn','dragon','bear','ghost'];
var CHAR_LABELS = { frog:'Frog', cat:'Cat', bunny:'Bunny', panda:'Panda', fox:'Fox', penguin:'Penguin', unicorn:'Unicorn', dragon:'Dragon', bear:'Bear', ghost:'Ghost' };
var MOOD_IDX = { struggling:0, surviving:1, good:2, thriving:3 };
/* ===== AI CONFIG ===== */
var GROQ_API_KEY = ['gsk_CN4mAU0eDbXhYsPxkv', 'mBWGdyb3FYOkDZdeqw', 'KMblt3uK1jduIQUR'].join('') || localStorage.getItem('hb_groq_key') || '';
var GROQ_MODEL   = 'openai/gpt-oss-120b';
var GROQ_URL     = 'https://api.groq.com/openai/v1/chat/completions';

/* ===== THEME ===== */
function getTheme() {
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}
function setTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
  try { localStorage.setItem('hb_theme', theme); } catch(e) {}
  updateThemeButton();
  updateMetaThemeColor(theme);
}
function toggleTheme() {
  var next = getTheme() === 'dark' ? 'light' : 'dark';
  setTheme(next);
  if (navigator.vibrate) navigator.vibrate(15);
  if (next === 'dark') {
    showToast('Lights off. ' + (charName || 'Your buddy') + ' is now nocturnal. 🌙');
  } else {
    showToast('Lights on. ' + (charName || 'Your buddy') + ' can see you now. ☀️');
  }
}
function updateThemeButton() {
  var btn = document.getElementById('themeBtn');
  if (!btn) return;
  btn.textContent = getTheme() === 'dark' ? '☀️' : '🌙';
}
function updateMetaThemeColor(theme) {
  var meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', theme === 'dark' ? '#121212' : '#4CD964');
}
var CHAR_COLORS = {
  frog:    { body:['#8FBF9A','#C8E0A0','#7FE890','#4CD964'], belly:['#C8D4C8','#E8F0C8','#C8F0D0','#A8F0C0'], cheek:'#FFA0B8' },
  cat:     { body:['#D4B896','#F0C890','#FFB672','#FF9A4D'], belly:['#F0D8B8','#FFE8C8','#FFD8B0','#FFC090'], cheek:'#FF8CB0' },
  bunny:   { body:['#D4C8C8','#F0D8E0','#FFB6D4','#FF80B0'], belly:['#FFF0F0','#FFE8F0','#FFD0E0','#FFB0D0'], cheek:'#FFA0C8' },
  panda:   { body:['#C8C8C8','#E0E0E0','#F0F0F0','#FFFFFF'], belly:['#F0F0F0','#F8F8F8','#FFFFFF','#FFFFFF'], cheek:'#FFC0C8' },
  fox:     { body:['#C89070','#E8A878','#FF9060','#FF6B3D'], belly:['#F0E0D0','#FFE0C8','#FFD0B0','#FFC090'], cheek:'#FFB0B0' },
  penguin: { body:['#8090A0','#A0B0C0','#5B7B9A','#3D5B8A'], belly:['#F0F0F0','#FFFFFF','#FFFFFF','#FFFFFF'], cheek:'#FFB0C0' },
  unicorn: { body:['#D4C8E0','#E8D8F0','#C8A8FF','#B088FF'], belly:['#FFF0FF','#FFE8FF','#FFD8FF','#FFC0FF'], cheek:'#FF90D0' },
  dragon:  { body:['#9C8AB0','#B8A8C8','#9B6BFF','#7B4DEF'], belly:['#E0D0F0','#E8D8F8','#D8C0FF','#C0A0FF'], cheek:'#FF90B0' },
  bear:    { body:['#A08878','#C0A088','#B08060','#906040'], belly:['#F0D8C0','#FFE8D0','#FFD8B8','#FFC098'], cheek:'#FFA0B0' },
  ghost:   { body:['#B8C0D8','#D0D8E8','#B8D8FF','#90C0FF'], belly:['#E8E8F0','#F0F0F8','#E8F0FF','#D8E8FF'], cheek:'#FFB0D0' }
};

function getBody(type, p) {
  var shadow = '<ellipse cx="100" cy="188" rx="55" ry="6" fill="rgba(0,0,0,0.08)"/>';
  if (type === 'cat') return shadow +
    '<path d="M64 90 L58 46 L92 76 Z" fill="' + p.body + '"/>' +
    '<path d="M136 90 L142 46 L108 76 Z" fill="' + p.body + '"/>' +
    '<path d="M72 82 L68 58 L86 76 Z" fill="' + p.cheek + '" opacity="0.55"/>' +
    '<path d="M128 82 L132 58 L114 76 Z" fill="' + p.cheek + '" opacity="0.55"/>' +
    '<ellipse cx="100" cy="132" rx="55" ry="50" fill="' + p.body + '"/>' +
    '<ellipse cx="100" cy="158" rx="30" ry="20" fill="' + p.belly + '"/>';
  if (type === 'bunny') return shadow +
    '<ellipse cx="80" cy="58" rx="11" ry="34" fill="' + p.body + '"/>' +
    '<ellipse cx="120" cy="58" rx="11" ry="34" fill="' + p.body + '"/>' +
    '<ellipse cx="80" cy="62" rx="5" ry="24" fill="' + p.cheek + '" opacity="0.5"/>' +
    '<ellipse cx="120" cy="62" rx="5" ry="24" fill="' + p.cheek + '" opacity="0.5"/>' +
    '<ellipse cx="100" cy="135" rx="54" ry="50" fill="' + p.body + '"/>' +
    '<ellipse cx="100" cy="158" rx="28" ry="18" fill="' + p.belly + '"/>';
  if (type === 'panda') return shadow +
    '<circle cx="64" cy="80" r="19" fill="#2D2D2D"/>' +
    '<circle cx="136" cy="80" r="19" fill="#2D2D2D"/>' +
    '<ellipse cx="100" cy="132" rx="56" ry="52" fill="' + p.body + '"/>' +
    '<ellipse cx="76" cy="98" rx="18" ry="20" fill="#2D2D2D"/>' +
    '<ellipse cx="124" cy="98" rx="18" ry="20" fill="#2D2D2D"/>' +
    '<ellipse cx="100" cy="158" rx="34" ry="24" fill="' + p.belly + '"/>';
  if (type === 'fox') return shadow +
    '<path d="M62 88 L50 42 L92 74 Z" fill="' + p.body + '"/>' +
    '<path d="M138 88 L150 42 L108 74 Z" fill="' + p.body + '"/>' +
    '<path d="M70 80 L64 56 L84 74 Z" fill="#2D2D2D" opacity="0.25"/>' +
    '<path d="M130 80 L136 56 L116 74 Z" fill="#2D2D2D" opacity="0.25"/>' +
    '<ellipse cx="100" cy="132" rx="55" ry="50" fill="' + p.body + '"/>' +
    '<ellipse cx="100" cy="160" rx="30" ry="22" fill="' + p.belly + '"/>';
  if (type === 'penguin') return shadow +
    '<ellipse cx="48" cy="132" rx="11" ry="26" fill="' + p.body + '"/>' +
    '<ellipse cx="152" cy="132" rx="11" ry="26" fill="' + p.body + '"/>' +
    '<ellipse cx="100" cy="130" rx="52" ry="56" fill="' + p.body + '"/>' +
    '<ellipse cx="100" cy="148" rx="34" ry="42" fill="' + p.belly + '"/>';
  if (type === 'unicorn') return shadow +
    '<path d="M96 62 L100 24 L104 62 Z" fill="#FFE28A" stroke="#E0B830" stroke-width="1"/>' +
    '<path d="M62 88 L58 60 L82 78 Z" fill="' + p.body + '"/>' +
    '<path d="M138 88 L142 60 L118 78 Z" fill="' + p.body + '"/>' +
    '<path d="M78 56 Q100 42 122 56 Q115 66 100 66 Q85 66 78 56 Z" fill="#FF9FBE" opacity="0.8"/>' +
    '<ellipse cx="100" cy="135" rx="56" ry="50" fill="' + p.body + '"/>' +
    '<ellipse cx="100" cy="158" rx="32" ry="22" fill="' + p.belly + '"/>';
  if (type === 'dragon') return shadow +
    '<path d="M45 118 Q10 88 22 132 Q14 145 45 148 Z" fill="' + p.body + '" opacity="0.85"/>' +
    '<path d="M155 118 Q190 88 178 132 Q186 145 155 148 Z" fill="' + p.body + '" opacity="0.85"/>' +
    '<path d="M70 88 L62 48 L86 78 Z" fill="#FFE28A"/>' +
    '<path d="M130 88 L138 48 L114 78 Z" fill="#FFE28A"/>' +
    '<ellipse cx="100" cy="135" rx="55" ry="48" fill="' + p.body + '"/>' +
    '<ellipse cx="100" cy="158" rx="32" ry="20" fill="' + p.belly + '"/>';
  if (type === 'bear') return shadow +
    '<circle cx="62" cy="76" r="19" fill="' + p.body + '"/>' +
    '<circle cx="138" cy="76" r="19" fill="' + p.body + '"/>' +
    '<circle cx="62" cy="76" r="10" fill="' + p.belly + '"/>' +
    '<circle cx="138" cy="76" r="10" fill="' + p.belly + '"/>' +
    '<ellipse cx="100" cy="135" rx="58" ry="52" fill="' + p.body + '"/>' +
    '<ellipse cx="100" cy="158" rx="32" ry="22" fill="' + p.belly + '"/>';
  if (type === 'ghost') return shadow +
    '<path d="M42 130 Q42 56 100 56 Q158 56 158 130 L158 176 Q146 168 138 176 Q130 168 118 176 Q108 168 100 176 Q92 168 82 176 Q72 168 62 176 Q52 168 42 176 Z" fill="' + p.body + '"/>';
  return shadow +
    '<circle cx="76" cy="88" r="21" fill="' + p.body + '"/>' +
    '<circle cx="124" cy="88" r="21" fill="' + p.body + '"/>' +
    '<circle cx="76" cy="88" r="13" fill="#FFFFFF"/>' +
    '<circle cx="124" cy="88" r="13" fill="#FFFFFF"/>' +
    '<ellipse cx="100" cy="132" rx="58" ry="52" fill="' + p.body + '"/>' +
    '<ellipse cx="100" cy="158" rx="34" ry="24" fill="' + p.belly + '"/>';
}

function getFace(mood) {
  if (mood === 'struggling') return '<path d="M66 98 Q76 90 86 98" stroke="#3D3D3D" stroke-width="3" fill="none" stroke-linecap="round"/>' +
    '<path d="M114 98 Q124 90 134 98" stroke="#3D3D3D" stroke-width="3" fill="none" stroke-linecap="round"/>' +
    '<path d="M88 148 Q100 142 112 148" stroke="#3D3D3D" stroke-width="3" fill="none" stroke-linecap="round"/>' +
    '<ellipse cx="56" cy="142" rx="9" ry="6" fill="#FFC8D0" opacity="0.7"/>' +
    '<ellipse cx="144" cy="142" rx="9" ry="6" fill="#FFC8D0" opacity="0.7"/>';
  if (mood === 'surviving') return '<line x1="66" y1="98" x2="86" y2="98" stroke="#3D3D3D" stroke-width="3.5" stroke-linecap="round"/>' +
    '<line x1="114" y1="98" x2="134" y2="98" stroke="#3D3D3D" stroke-width="3.5" stroke-linecap="round"/>' +
    '<line x1="88" y1="148" x2="112" y2="148" stroke="#3D3D3D" stroke-width="3" stroke-linecap="round"/>' +
    '<ellipse cx="56" cy="142" rx="9" ry="6" fill="#FFC8D0" opacity="0.7"/>' +
    '<ellipse cx="144" cy="142" rx="9" ry="6" fill="#FFC8D0" opacity="0.7"/>';
  if (mood === 'good') return '<circle cx="76" cy="96" r="12" fill="#FFF"/>' +
    '<circle cx="124" cy="96" r="12" fill="#FFF"/>' +
    '<circle cx="76" cy="98" r="6" fill="#3D3D3D"/>' +
    '<circle cx="124" cy="98" r="6" fill="#3D3D3D"/>' +
    '<circle cx="78" cy="96" r="2" fill="#FFF"/>' +
    '<circle cx="126" cy="96" r="2" fill="#FFF"/>' +
    '<path d="M86 144 Q100 158 114 144" stroke="#3D3D3D" stroke-width="3" fill="none" stroke-linecap="round"/>' +
    '<ellipse cx="56" cy="142" rx="9" ry="6" fill="#FFB3C6" opacity="0.7"/>' +
    '<ellipse cx="144" cy="142" rx="9" ry="6" fill="#FFB3C6" opacity="0.7"/>';
  return '<path d="M66 100 Q76 86 86 100" stroke="#3D3D3D" stroke-width="4" fill="none" stroke-linecap="round"/>' +
    '<path d="M114 100 Q124 86 134 100" stroke="#3D3D3D" stroke-width="4" fill="none" stroke-linecap="round"/>' +
    '<path d="M84 142 Q100 168 116 142 Q100 150 84 142 Z" fill="#3D3D3D"/>' +
    '<path d="M95 152 Q100 162 105 152 Q100 156 95 152 Z" fill="#FF9FBE"/>' +
    '<ellipse cx="56" cy="142" rx="10" ry="7" fill="#FFA0B8" opacity="0.85"/>' +
    '<ellipse cx="144" cy="142" rx="10" ry="7" fill="#FFA0B8" opacity="0.85"/>';
}

function getExtras(mood) {
  if (mood === 'struggling') return '<text x="150" y="80" font-size="18" fill="#999" class="zzz" font-weight="800">z</text>' +
    '<text x="163" y="65" font-size="22" fill="#999" class="zzz zzz2" font-weight="800">z</text>' +
    '<text x="176" y="48" font-size="26" fill="#999" class="zzz zzz3" font-weight="800">z</text>';
  if (mood === 'surviving') return '<path d="M158 92 Q161 100 158 104 Q155 108 151 104 Q148 100 151 92 Z" fill="#8AB4F8" opacity="0.85" class="sweat"/>';
  if (mood === 'thriving') return '<rect x="58" y="84" width="38" height="24" rx="6" fill="#1A1A1A"/>' +
    '<rect x="104" y="84" width="38" height="24" rx="6" fill="#1A1A1A"/>' +
    '<rect x="92" y="92" width="16" height="6" fill="#1A1A1A"/>' +
    '<path d="M62 88 L70 96" stroke="#8AB4F8" stroke-width="2" opacity="0.6"/>' +
    '<path d="M108 88 L116 96" stroke="#8AB4F8" stroke-width="2" opacity="0.6"/>' +
    '<path d="M28 60 L32 70 L42 74 L32 78 L28 88 L24 78 L14 74 L24 70 Z" fill="#FFE28A" class="sparkle"/>' +
    '<path d="M172 40 L175 48 L183 51 L175 54 L172 62 L169 54 L161 51 L169 48 Z" fill="#FFE28A" class="sparkle sparkle2"/>' +
    '<path d="M180 120 L182 126 L188 128 L182 130 L180 136 L178 130 L172 128 L178 126 Z" fill="#FFE28A" class="sparkle sparkle3"/>';
  return '';
}

function characterSVG(type, mood, size) {
  size = size || '100%';
  if (!CHAR_COLORS[type]) type = 'frog';
  var c = CHAR_COLORS[type];
  var i = MOOD_IDX[mood] != null ? MOOD_IDX[mood] : 2;
  var p = { body: c.body[i], belly: c.belly[i], cheek: c.cheek };
  return '<svg viewBox="0 0 200 200" width="' + size + '" height="' + size + '" xmlns="http://www.w3.org/2000/svg">' +
    getBody(type, p) + getFace(mood) + getExtras(mood) +
  '</svg>';
}

/* ===== ROAST CONTENT ===== */
var MOOD_MESSAGES = {
  struggling: [
    "needs help... or a new owner.",
    "has started writing your eulogy.",
    "is googling 'how to file for neglect'.",
    "is currently a raisin.",
    "saw you open TikTok. Not mad. Just disappointed.",
    "has one foot in the grave. The other one gave up.",
    "is drafting a strongly worded letter to your mom.",
    "is starting to think you don't love them."
  ],
  surviving: [
    "is surviving on caffeine and prayers.",
    "is doing... something. Barely.",
    "thinks you could do better. But ok.",
    "is being held together by duct tape and vibes.",
    "has filed a formal complaint. It's under review.",
    "is 60% sure you remember they exist."
  ],
  good: [
    "is actually functioning!",
    "is vibing. Don't ruin it.",
    "is proud of you (for now).",
    "did a little dance. It was cute.",
    "is telling all its friends about you.",
    "is cautiously optimistic. Emphasis on cautious."
  ],
  thriving: [
    "is PEAK PERFORMANCE. Look at them go!",
    "is wearing tiny sunglasses.",
    "is drafting an acceptance speech.",
    "might start a podcast about success.",
    "is flexing. Actually flexing. Rude, but ok.",
    "is telling strangers at the gym about you."
  ]
};

var CHALLENGES = [
  { text:'Drink a glass of water. Hydrate or Diedrate.', xp:15 },
  { text:'Walk for 5 minutes. Touch grass. It won\'t hurt you.', xp:20 },
  { text:'Stare at the wall and think about what you\'ve done. 30 seconds.', xp:20 },
  { text:'Do a little dance. Nobody is watching. (They are watching.)', xp:15 },
  { text:'Put your phone away for 10 minutes. Yes, YOU.', xp:25 },
  { text:'Text someone you appreciate. Yes, an actual human.', xp:15 },
  { text:'Do 10 jumping jacks. They are judging your form.', xp:20 },
  { text:'Take 5 deep breaths. In through the nose, out through the shame.', xp:15 }
];

var SKIP_TEXT = [
  'Skip',
  'Are you sure? They\'re sad.',
  'Wow. Okay. Just don\'t then.',
  'They\'re drafting a breakup text.',
  'This is why they don\'t trust you.',
  'Skip (they saw that)'
];

var STAT_COMMENTS = [
  "Your brain is doing great. Your sleep schedule is a crime scene. We need to talk.",
  "Impressive stats. Too bad your sleep is a myth. 💀",
  "Hydration called. It wants its 3 days back.",
  "You're basically a productivity influencer at this point.",
  "Somewhere, a doctor is crying about your posture.",
  "Doing great! Your bedtime, however, is a rumor.",
  "Your future self just sent a thank-you card. Mostly.",
  "You're crushing it. Also your eyesight. Please blink."
];

/* ===== SOUND ===== */
var audioCtx = null;
function initAudio() {
  if (!audioCtx) {
    try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch(e) {}
  }
}
function beep(freq, dur, type, vol) {
  initAudio();
  if (!audioCtx) return;
  try {
    var osc = audioCtx.createOscillator();
    var gain = audioCtx.createGain();
    osc.type = type || 'sine';
    osc.frequency.value = freq;
    osc.connect(gain); gain.connect(audioCtx.destination);
    gain.gain.setValueAtTime(vol || 0.08, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
    osc.start(); osc.stop(audioCtx.currentTime + dur);
  } catch(e) {}
}
function soundBoing() { beep(600, 0.15, 'sine', 0.1); setTimeout(function(){ beep(900, 0.12, 'sine', 0.08); }, 60); }
function soundTrombone() {
  beep(300, 0.25, 'sawtooth', 0.1);
  setTimeout(function(){ beep(250, 0.25, 'sawtooth', 0.1); }, 220);
  setTimeout(function(){ beep(200, 0.4, 'sawtooth', 0.1); }, 440);
}
function soundYay() {
  beep(523, 0.1); setTimeout(function(){ beep(659, 0.1); }, 100); setTimeout(function(){ beep(784, 0.2); }, 200);
}
/* ===== TAP REACTIONS ===== */
var tapCount = 0;
var tapResetTimer = null;

function tapCharacter(ev) {
  var wrapper = document.getElementById('charTap');
  if (!wrapper) return;

  tapCount++;
  if (tapResetTimer) clearTimeout(tapResetTimer);
  tapResetTimer = setTimeout(function(){ tapCount = 0; }, 3000);

  // Remove any existing reaction classes
  wrapper.classList.remove('react-giggle','react-dizzy','react-angry','react-love','react-sleep');

  var emoji, cls, sound;
  if (tapCount === 1) {
    emoji = ['😄','😊','🥰','🤭'][Math.floor(Math.random()*4)];
    cls = 'react-giggle'; sound = 'giggle';
  } else if (tapCount === 2) {
    emoji = ['😵\u200d💫','🥴','😳'][Math.floor(Math.random()*3)];
    cls = 'react-dizzy'; sound = 'boing';
  } else if (tapCount === 3) {
    emoji = ['😤','💢','😡'][Math.floor(Math.random()*3)];
    cls = 'react-angry'; sound = 'ouch';
  } else if (tapCount === 4) {
    emoji = '😍';
    cls = 'react-love'; sound = 'purr';
  } else {
    emoji = '😴';
    cls = 'react-sleep'; sound = 'snore';
  }

  wrapper.classList.add(cls);

  // Float emoji above character
  var stage = wrapper.parentElement;
  if (stage) {
    var old = stage.querySelector('.reaction-bubble');
    if (old) old.remove();
    var bubble = document.createElement('div');
    bubble.className = 'reaction-bubble';
    bubble.textContent = emoji;
    stage.appendChild(bubble);
    setTimeout(function(){ if (bubble.parentElement) bubble.remove(); }, 1200);
  }

  // Sound + haptic
  if (sound === 'giggle') soundGiggle();
  else if (sound === 'boing') soundBoing();
  else if (sound === 'ouch') soundOuch();
  else if (sound === 'purr') soundPurr();
  else if (sound === 'snore') soundSnore();
  if (navigator.vibrate) navigator.vibrate(tapCount >= 3 ? 30 : 10);

  // Sassy toast on over-tap
  if (tapCount === 6 && charName) {
    showToast(charName + ' is getting dizzy. Please stop poking. 🥴');
  }
  if (tapCount === 10 && charName) {
    showToast('OK, ' + charName + ' has filed a restraining order. 😤');
    tapCount = 0;
  }

  // Cleanup
  setTimeout(function() {
    wrapper.classList.remove('react-giggle','react-dizzy','react-angry','react-love');
    // Note: react-sleep is removed on next tap or navigation
  }, 1200);
}
function soundPurr()     { beep(400, 0.08, 'sine', 0.06); setTimeout(function(){ beep(520, 0.15, 'sine', 0.06); }, 70); }
function soundOuch()     { beep(700, 0.08, 'square', 0.07); setTimeout(function(){ beep(300, 0.2, 'square', 0.07); }, 80); }
function soundGasp()     { beep(300, 0.05); setTimeout(function(){ beep(900, 0.12); }, 50); }
function soundChime()    { beep(880, 0.1); setTimeout(function(){ beep(1320, 0.25, 'sine', 0.06); }, 90); }
function soundFanfare()  {
  beep(523, 0.1); setTimeout(function(){ beep(659, 0.1); }, 90);
  setTimeout(function(){ beep(784, 0.1); }, 180); setTimeout(function(){ beep(1047, 0.35); }, 270);
}
function soundSnore()    { beep(120, 0.5, 'sawtooth', 0.05); }
function soundGiggle()   { beep(880, 0.06); setTimeout(function(){ beep(1200, 0.06); }, 60); setTimeout(function(){ beep(880, 0.08); }, 120); }
/* ====== STATE ====== */
var DAYS = ['S','M','T','W','T','F','S'];
var habits = JSON.parse(localStorage.getItem('hb_habits') || 'null') || [
  { id:1, name:'Drink Water', icon:'💧', goal:8,  current:0, unit:'glasses', freq:'daily', reminder:'09:00', days:[0,1,2,3,4,5,6] },
  { id:2, name:'Exercise',    icon:'🏃', goal:1,  current:0, unit:'session', freq:'daily', reminder:'18:00', days:[1,2,3,4,5] },
  { id:3, name:'Reading',     icon:'📖', goal:20, current:0, unit:'pages',   freq:'daily', reminder:'21:00', days:[0,1,2,3,4,5,6] },
  { id:4, name:'Meditation',  icon:'🧘', goal:1,  current:0, unit:'session', freq:'daily', reminder:'07:00', days:[0,1,2,3,4,5,6] },
  { id:5, name:'Sleep',       icon:'😴', goal:8,  current:0, unit:'hours',   freq:'daily', reminder:'23:00', days:[0,1,2,3,4,5,6] }
];
var xp = parseInt(localStorage.getItem('hb_xp') || '0');
var streak = parseInt(localStorage.getItem('hb_streak') || '0');
var lastCompletedDate = localStorage.getItem('hb_lastCompleted') || '';
var charName = localStorage.getItem('hb_name') || '';
var charType = localStorage.getItem('hb_charType') || 'frog';
var journal = JSON.parse(localStorage.getItem('hb_journal') || '[]');
var selectedType = charType;
var tab = 'today';
var currentChallenge = null;
var selectedJournalMood = '🙂';
var selectedDays = [0,1,2,3,4,5,6];
var skipCount = 0;
var chatHistory = JSON.parse(localStorage.getItem('hb_chat') || '[]');
var chatBusy = false;
var currentMsg = '';
var typewriterTimer = null; // FIX #10: track timer for cleanup

function save() {
  localStorage.setItem('hb_habits', JSON.stringify(habits));
  localStorage.setItem('hb_xp', xp);
  localStorage.setItem('hb_streak', streak);
  localStorage.setItem('hb_lastCompleted', lastCompletedDate);
  localStorage.setItem('hb_name', charName);
  localStorage.setItem('hb_charType', charType);
  localStorage.setItem('hb_journal', JSON.stringify(journal));
  localStorage.setItem('hb_chat', JSON.stringify(chatHistory)); 
}
function moodFor(p) { return p<=20?'struggling' : p<=50?'surviving' : p<=80?'good' : 'thriving'; }
function pickMsg(mood) {
  var arr = MOOD_MESSAGES[mood] || MOOD_MESSAGES.good;
  return arr[Math.floor(Math.random()*arr.length)];
}
// FIX #2: fallback for unknown moods
function moodBg(m) {
  var map = {
    struggling: 'linear-gradient(160deg,#FFDDDD,#FFE8E8)',
    surviving:  'linear-gradient(160deg,#FFF3C8,#FFF8DC)',
    good:       'linear-gradient(160deg,#C8F0D8,#E0F8E8)',
    thriving:   'linear-gradient(160deg,#B8E8FF,#DCF0FF)'
  };
  return map[m] || 'linear-gradient(160deg,#E0F5E8,#FFF8F0)';
}
function progress() {
  if (!habits.length) return 0;
  var s = 0;
  for (var i=0; i<habits.length; i++) s += Math.min(habits[i].current / habits[i].goal, 1);
  return Math.round((s / habits.length) * 100);
}
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, function(ch){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]; });
}
function todayStr() {
  var d = new Date();
  var m = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return d.getDate() + ' ' + m[d.getMonth()] + ' ' + d.getFullYear();
}
// FIX #5: proper date key for streak logic
function dateKey(d) {
  d = d || new Date();
  return d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate();
}
function statusLabel(p) {
  if (p <= 20) return '🔴 Currently a raisin';
  if (p <= 50) return '🟡 Surviving on caffeine and prayers';
  if (p <= 80) return '🔵 Doing better than the average college student';
  return '🟢 Peak performance (for once)';
}

function showToast(text) {
  var el = document.createElement('div');
  el.className = 'joke-toast';
  el.textContent = text;
  document.body.appendChild(el);
  setTimeout(function(){ el.remove(); }, 3000);
}

// FIX #5: streak logic based on real dates
function updateStreak() {
  var today = dateKey();
  if (progress() < 100) return;

  if (lastCompletedDate === today) return; // already counted today

  var yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  var yKey = dateKey(yesterday);

  if (lastCompletedDate === yKey) {
    streak += 1;
  } else if (lastCompletedDate === '') {
    streak = 1;
  } else {
    streak = 1; // missed a day, restart
  }
    lastCompletedDate = today;
  save();

  // 🎉 Fire milestone celebration
  if (MILESTONES[streak]) {
    celebrateMilestone(streak);
  }
}
/* ===== MILESTONE CELEBRATIONS ===== */
var MILESTONES = {
  3:   { emoji:'🌱', title:'3-Day Sprout!',   sub:'Tiny roots. Big vibes.' },
  7:   { emoji:'🔥', title:'7-Day Streak!',   sub:'A whole week. Show-off.' },
  14:  { emoji:'⚡', title:'2 Weeks Strong!', sub:'This is becoming a habit. Literally.' },
  30:  { emoji:'💎', title:'30 Days!',        sub:'Certified habit machine.' },
  50:  { emoji:'👑', title:'50-Day Royalty!', sub:'Bow down.' },
  100: { emoji:'🏆', title:'100 DAYS!!',      sub:'Okay this is legendary.' },
  365: { emoji:'🌟', title:'1 YEAR!',         sub:'You are officially unstoppable.' }
};

function celebrateMilestone(days) {
  var m = MILESTONES[days];
  if (!m) return;

  // 1. Flash + big confetti
  var flash = document.createElement('div');
  flash.className = 'milestone-flash';
  document.body.appendChild(flash);
  setTimeout(function(){ flash.remove(); }, 900);

  confetti(200);
  soundFanfare();
  if (navigator.vibrate) navigator.vibrate([50, 30, 50, 30, 100]);

  // 2. Banner
  setTimeout(function() {
    var banner = document.createElement('div');
    banner.className = 'milestone-banner';
    banner.innerHTML = m.emoji + ' ' + m.title + '<div class="sub">' + m.sub + '</div>';
    document.body.appendChild(banner);
    setTimeout(function(){ banner.remove(); }, 2400);
  }, 200);

  // 3. Character message override for a moment
  currentMsg = '"' + days + ' days. I... I don\'t know what to say. I\'m proud of you."';
}
/* ===== CHAOS EVENTS ===== */
function rollChaosEvent() {
  // Only fire on the "today" tab and only once per day per user
  if (tab !== 'today') return;

  var today = dateKey();
  var lastChaos = localStorage.getItem('hb_lastChaos');
  if (lastChaos === today) return;

  // 35% chance per app open (once-per-day gate applies first)
  if (Math.random() > 0.35) return;

  localStorage.setItem('hb_lastChaos', today);

  var events = ['rain', 'flies', 'glitch', 'gold', 'mail'];
  var pick = events[Math.floor(Math.random() * events.length)];

  setTimeout(function() { triggerChaos(pick); }, 800);
}

function triggerChaos(type) {
  var stage = document.querySelector('.char-stage');
  var wrapper = document.querySelector('.char-wrapper');
  if (!stage || !wrapper) return;

  if (type === 'rain') {
    var rain = document.createElement('div');
    rain.className = 'chaos-rain';
    for (var i = 0; i < 20; i++) {
      var drop = document.createElement('div');
      drop.className = 'drop';
      drop.style.left = (Math.random() * 100) + '%';
      drop.style.animationDuration = (0.8 + Math.random() * 0.8) + 's';
      drop.style.animationDelay = (Math.random() * 0.5) + 's';
      rain.appendChild(drop);
    }
    stage.appendChild(rain);
    setTimeout(function(){ rain.remove(); }, 4000);
    if (charName) showToast(charName + ' is getting soaked. Nice going. ☔');
    soundSnore();
  }

  else if (type === 'flies') {
    var flies = [];
    for (var f = 0; f < 3; f++) {
      var fly = document.createElement('div');
      fly.className = 'chaos-fly';
      fly.textContent = '🪰';
      fly.style.top = (10 + Math.random() * 40) + 'px';
      fly.style.left = (10 + Math.random() * 40) + 'px';
      fly.style.animationDelay = (f * 0.4) + 's';
      stage.appendChild(fly);
      flies.push(fly);
    }
    setTimeout(function(){ flies.forEach(function(el){ el.remove(); }); }, 5000);
    if (charName) showToast('Who left the window open? ' + charName + ' is not amused. 🪰');
  }

  else if (type === 'glitch') {
    wrapper.classList.add('chaos-glitch');
    soundOuch();
    setTimeout(function(){ wrapper.classList.remove('chaos-glitch'); }, 1200);
    if (charName) showToast(charName + ' just glitched. Do not panic. 😵\u200d💫');
  }

  else if (type === 'gold') {
    wrapper.classList.add('chaos-gold');
    soundChime();
    setTimeout(function(){ wrapper.classList.remove('chaos-gold'); }, 8000);
    if (charName) showToast(charName + ' is glowing. Must be the vibes. ✨');
  }

  else if (type === 'mail') {
    var mail = document.createElement('div');
    mail.className = 'reaction-bubble';
    mail.textContent = '💌';
    stage.appendChild(mail);
    setTimeout(function(){ mail.remove(); }, 1200);
    soundChime();
    var mails = [
      charName + ' got fan mail. From you. Sort of.',
      'A mysterious letter arrives for ' + charName + '.',
      charName + ' just received a compliment. Rare. 💌'
    ];
    showToast(mails[Math.floor(Math.random() * mails.length)]);
  }
}
// FIX #9: filter habits by today's day-of-week
function activeHabits() {
  var today = new Date().getDay();
  return habits.filter(function(h) {
    return !h.days || h.days.length === 0 || h.days.indexOf(today) >= 0;
  });
}

// FIX #1: real "most completed habit" calculation
function mostCompletedHabit() {
  if (!habits.length) return null;
  var best = habits[0], bestRatio = -1;
  for (var i=0; i<habits.length; i++) {
    var r = habits[i].goal > 0 ? habits[i].current / habits[i].goal : 0;
    if (r > bestRatio) { bestRatio = r; best = habits[i]; }
  }
  return best;
}

/* ====== RENDER ====== */
function render() {
  if (!charName) return;
  var p = progress();
  var mood = moodFor(p);
  if (!currentMsg) currentMsg = pickMsg(mood);
  var el = document.getElementById('content');
  document.getElementById('xpVal').textContent = xp;
    document.getElementById('xpVal').textContent = xp;

  // Chaos event (once per day, only on Today tab)
  if (tab === 'today') rollChaosEvent();

  if (tab === 'today') {
    var flyHTML = (mood === 'struggling') ? '<div class="fly">🪰</div>' : '';
    var html = '';
    html += '<div class="char-card" style="background:' + moodBg(mood) + '">';
    html += '<div class="char-name-row">';
    html += '<span class="char-name">' + escapeHtml(charName) + '</span>';
    html += '<button class="edit-btn" onclick="switchTab(\'profile\')">✏️</button>';
    html += '</div>';
    html += '<div class="char-stage">' + flyHTML + '<div class="char-wrapper mood-' + mood + '" id="charTap" onclick="tapCharacter(event)">' + characterSVG(charType, mood) + '</div></div>';
    html += '<div class="char-status">' + statusLabel(p) + '</div>';
    html += '<div class="char-msg" id="charMsg"></div>';
    html += '<div class="bar-bg"><div class="bar-fill" style="width:' + p + '%"></div></div>';
    html += '<div class="pct">' + p + '% today</div>';
    html += '</div>';
    html += '<div class="row">';
    html += '<div class="streak"><div class="snum">🔥 ' + streak + '</div><div class="slbl">Day Streak</div></div>';
    html += '<button class="cbtn" onclick="rollChallenge()">🎲 Random Challenge</button>';
    html += '</div>';
    html += '<h2>Today\u2019s Habits</h2>';

    // FIX #9: only render habits scheduled for today
    var todayHabits = activeHabits();
    if (todayHabits.length === 0) {
      html += '<div class="jempty">No habits scheduled for today.<br>Enjoy the rest. 😌</div>';
    }
        for (var i=0; i<todayHabits.length; i++) {
      var h = todayHabits[i];
      var pct = Math.min(100, (h.current / h.goal) * 100);
      var done = h.current >= h.goal;
      html += '<div class="habit">';
      // Delete button appears only when habit is completed
      if (done) {
        html += '<button class="del-btn" onclick="deleteHabit(' + h.id + ')" aria-label="Delete habit">✕</button>';
      }
      html += '<div class="hicon">' + h.icon + '</div>';
      html += '<div class="hbody">';
      html += '<div class="hname">' + escapeHtml(h.name) + '</div>';
      html += '<div class="hmeta">' + (h.freq||'daily') + ' • ⏰ ' + (h.reminder||'--:--') + '</div>';
      html += '<div class="mini"><div class="mfill" style="width:' + pct + '%;background:' + (done ? '#4CD964' : '#8AB4F8') + '"></div></div>';
      html += '<div class="hgoal">' + h.current + '/' + h.goal + ' ' + h.unit + '</div>';
      html += '</div>';
      html += '<button class="plus ' + (done ? 'done' : '') + '" onclick="increment(' + h.id + ')">' + (done ? '✓' : '+') + '</button>';
      html += '</div>';
    }
    html += '<button class="addbtn" onclick="openAddHabit()">+ Add a Habit</button>';
    el.innerHTML = html;
    var msgEl = document.getElementById('charMsg');
    if (msgEl) {
      typewriter(msgEl, '"' + charName + ' ' + currentMsg + '"', 25);
    }
  } else if (tab === 'stats') {
    var health = Math.min(100, p + 10);
    var energy = Math.min(100, Math.round(p * 0.85));
    var brain  = Math.min(100, Math.round(p * 1.1));
    var ignored = '—', ignoredIcon = '';
    var minR = 2;
    for (var j=0; j<habits.length; j++) {
      var r = habits[j].current / habits[j].goal;
      if (r < minR) { minR = r; ignored = habits[j].name; ignoredIcon = habits[j].icon; }
    }
    var comment = STAT_COMMENTS[Math.floor(Math.random()*STAT_COMMENTS.length)];

    // FIX #1: dynamic "most completed"
    var best = mostCompletedHabit();
    var bestName = best ? (escapeHtml(best.name) + ' ' + best.icon) : '—';

    var s = '';
    s += '<h2 style="font-size:22px">🔥 ' + streak + ' Day Streak</h2>';
    s += '<div class="statbar"><div class="lbl">❤️ Health: ' + health + '%</div><div class="bg"><div class="fll" id="f1" style="width:0%;background:#FF6B6B"></div></div></div>';
    s += '<div class="statbar"><div class="lbl">⚡ Energy: ' + energy + '%</div><div class="bg"><div class="fll" id="f2" style="width:0%;background:#FFC93C"></div></div></div>';
    s += '<div class="statbar"><div class="lbl">🧠 Brain: ' + brain + '%</div><div class="bg"><div class="fll" id="f3" style="width:0%;background:#8AB4F8"></div></div></div>';
    s += '<div class="comment">' + comment + '</div>';
    s += '<div class="info"><div class="l">Most completed habit</div><div class="v">' + bestName + '</div></div>';
    s += '<div class="info"><div class="l">Most ignored habit</div><div class="v">' + escapeHtml(ignored) + ' ' + ignoredIcon + ' 💀</div></div>';
    s += '<div class="info"><div class="l">Diagnosis</div><div class="v">' + statusLabel(p) + '</div></div>';
    s += '<div class="badge">' + statusLabel(p) + '</div>';
    el.innerHTML = s;
    setTimeout(function(){
      var a = document.getElementById('f1'), b = document.getElementById('f2'), c = document.getElementById('f3');
      if (a) a.style.width = health + '%';
      if (b) b.style.width = energy + '%';
      if (c) c.style.width = brain + '%';
    }, 100);
  } else if (tab === 'journal') {
    var js = '<h2>📔 Daily Journal</h2>';
    js += '<div style="margin:0 16px 12px;color:#666;font-size:13px">Confess how you neglected ' + escapeHtml(charName) + ' today.</div>';
    js += '<button class="addbtn" onclick="openJournal()">+ New Entry</button>';
    if (journal.length === 0) {
      js += '<div class="jempty">No entries yet.<br>Tap above to admit your mistakes ✍️</div>';
    } else {
      for (var k = journal.length-1; k >= 0; k--) {
        var e = journal[k];
        js += '<div class="jentry">';
        js += '<div class="jmood">' + e.mood + '</div>';
        js += '<div class="jdate">' + e.date + '</div>';
        js += '<div class="jtext">' + escapeHtml(e.text) + '</div>';
        if (e.excuse) js += '<div class="jexcuse">Excuse: ' + escapeHtml(e.excuse) + '</div>';
        js += '</div>';
      }
    }
    el.innerHTML = js;
    } else if (tab === 'glance') {
    renderGlance(el);
  } else if (tab === 'chat') {
    renderChat(el);
  } else if (tab === 'profile') {
    var members = [
      { name: charName, type: charType, mood: mood,       status: statusLabel(p) },
      { name:'Larissa', type:'cat',     mood:'good',       status:'Doing better than you' },
      { name:'Omar',    type:'dragon',  mood:'struggling', status:'Currently a raisin' },
      { name:'Maya',    type:'bunny',   mood:'surviving',  status:'Surviving. Barely.' }
    ];

    // FIX #7: match achievements by habit NAME, not by index
    function hasHabit(name) {
      return habits.some(function(h){ return h.name.toLowerCase() === name.toLowerCase(); });
    }
    function habitProgress(name) {
      var h = habits.find(function(x){ return x.name.toLowerCase() === name.toLowerCase(); });
      return h ? h.current : 0;
    }
    var achs = [
      { icon:'🔥', name:'7-Day Survivor',   unlocked: streak >= 7 },
      { icon:'💧', name:'Hydration Master', unlocked: hasHabit('Drink Water') && habitProgress('Drink Water') >= 4 },
      { icon:'📖', name:'Bookworm',         unlocked: hasHabit('Reading') && habitProgress('Reading') >= 10 },
      { icon:'🏃', name:'Finally Moved 😂', unlocked: hasHabit('Exercise') && habitProgress('Exercise') >= 1 }
    ];
    var s2 = '';
    s2 += '<h2 style="font-size:20px">👤 Profile</h2>';
    s2 += '<div class="profile-head">';
    s2 += '<div class="avatar mood-' + mood + '">' + characterSVG(charType, mood) + '</div>';
    s2 += '<div class="info-b"><div class="pname">' + escapeHtml(charName) + '</div>';
    s2 += '<div class="pstat">' + statusLabel(p) + ' • ' + CHAR_LABELS[charType] + '</div></div>';
    s2 += '</div>';
    s2 += '<div class="prow">';
    s2 += '<div class="pstat-box"><div class="num">' + xp + '</div><div class="lbl2">Total XP</div></div>';
    s2 += '<div class="pstat-box"><div class="num">🔥 ' + streak + '</div><div class="lbl2">Streak</div></div>';
    s2 += '<div class="pstat-box"><div class="num">' + habits.length + '</div><div class="lbl2">Habits</div></div>';
    s2 += '</div>';
    s2 += '<div class="prow">';
    s2 += '<button class="cbtn" onclick="openRename()">✏️ Rename</button>';
    s2 += '<button class="cbtn" onclick="openCharPick()">🎨 Change Buddy</button>';
    s2 += '</div>';
        s2 += '<h2 style="font-size:20px">🤝 Accountability Partner</h2>';
    s2 += '<div class="share-card">';
    s2 += '<h3>Share your progress</h3>';
    s2 += '<div class="sc-sub">Send this link to a friend. They\'ll see your buddy\'s mood, streak, and can poke you once a day.</div>';
    s2 += '<div class="sc-link-box" id="shareLinkBox">' + escapeHtml(buildShareLink()) + '</div>';
    s2 += '<div class="sc-btn-row">';
    s2 += '<button class="sc-btn" onclick="shareViaSystem()">📤 Share</button>';
    s2 += '<button class="sc-btn secondary" onclick="copyShareLink()">📋 Copy</button>';
    s2 += '</div>';
    s2 += '</div>';
    s2 += '<h2 style="font-size:20px">👥 Team View</h2>';
    s2 += '<div style="margin:0 16px 12px;color:#666;font-size:13px">Everyone\u2019s dysfunction is unique!</div>';
    for (var m2=0; m2<members.length; m2++) {
      var mb = members[m2];
      s2 += '<div class="tcard" style="background:' + moodBg(mb.mood) + '">';
      s2 += '<div style="width:50px;height:50px;margin-right:10px">' + characterSVG(mb.type, mb.mood, 50) + '</div>';
      s2 += '<div><div class="nm">' + escapeHtml(mb.name) + '</div><div class="st">' + mb.status + '</div></div>';
      s2 += '</div>';
    }
    s2 += '<h2 style="font-size:20px;margin-top:20px">🏆 Achievements</h2>';
    s2 += '<div class="agrid">';
    for (var a=0; a<achs.length; a++) {
      s2 += '<div class="acard ' + (achs[a].unlocked ? '' : 'locked') + '">';
      s2 += '<div class="ai">' + achs[a].icon + '</div>';
      s2 += '<div class="an">' + achs[a].name + '</div>';
      if (!achs[a].unlocked) s2 += '<div class="lk">🔒</div>';
      s2 += '</div>';
    }
    s2 += '</div>';
    s2 += '<button class="danger-btn" onclick="resetAll()">🗑️ Reset Everything</button>';
    el.innerHTML = s2;
  }
}
/* ===== AT-A-GLANCE TAB ===== */
function renderGlance(el) {
  var p = progress();
  var mood = moodFor(p);
  var todayHabits = activeHabits();

  // Pick the "at risk" habit: lowest completion ratio, not done, has schedule today
  var atRisk = null, lowestRatio = 2;
  for (var i = 0; i < todayHabits.length; i++) {
    var h = todayHabits[i];
    var r = h.goal > 0 ? h.current / h.goal : 0;
    if (r < 1 && r < lowestRatio) { lowestRatio = r; atRisk = h; }
  }

  // Ring circumference for radius 28 = 2*pi*28 ≈ 175.9
  var CIRC = 175.9;
  var offset = CIRC - (CIRC * p / 100);

  var html = '<div class="glance-wrap">';

  // Hero card
  html += '<div class="glance-hero" style="background:' + moodBg(mood) + '">';
  html += '<div class="glance-face mood-' + mood + '">' + characterSVG(charType, mood) + '</div>';
  html += '<div class="glance-info">';
  html += '<div class="glance-name">' + escapeHtml(charName) + '</div>';
  html += '<div class="glance-status">' + statusLabel(p) + '</div>';
  html += '</div>';
  html += '<div class="glance-ring">';
  html += '<svg width="64" height="64" viewBox="0 0 64 64">';
  html += '<circle class="bg-circle" cx="32" cy="32" r="28"/>';
  html += '<circle class="fg-circle" cx="32" cy="32" r="28" stroke-dasharray="' + CIRC + '" stroke-dashoffset="' + offset + '"/>';
  html += '</svg>';
  html += '<div class="pct-text">' + p + '%</div>';
  html += '</div>';
  html += '</div>';

  // Streak + habit count mini row
  html += '<div class="glance-streak-row">';
  html += '<div class="glance-streak-box"><div class="gsb-num">🔥 ' + streak + '</div><div class="gsb-lbl">Day Streak</div></div>';
  html += '<div class="glance-streak-box"><div class="gsb-num">⭐ ' + xp + '</div><div class="gsb-lbl">Total XP</div></div>';
  html += '<div class="glance-streak-box"><div class="gsb-num">' + todayHabits.length + '</div><div class="gsb-lbl">Today</div></div>';
  html += '</div>';

  // At-risk habit
  if (atRisk) {
    html += '<div class="glance-section-title">🎯 Most at risk</div>';
    html += renderGlanceTile(atRisk, true);
  }

  // Remaining habits
  var remaining = todayHabits.filter(function(h) { return h.current < h.goal; });
  if (atRisk) {
    remaining = remaining.filter(function(h) { return h.id !== atRisk.id; });
  }

  if (remaining.length > 0) {
    html += '<div class="glance-section-title">📋 Still to do</div>';
    for (var j = 0; j < remaining.length; j++) {
      html += renderGlanceTile(remaining[j], false);
    }
  }

  // Completed habits
  var completed = todayHabits.filter(function(h) { return h.current >= h.goal; });
  if (completed.length > 0) {
    html += '<div class="glance-section-title">✅ Done today</div>';
    for (var k = 0; k < completed.length; k++) {
      html += renderGlanceTile(completed[k], false);
    }
  }

  // Empty state
  if (todayHabits.length === 0) {
    html += '<div class="glance-empty">';
    html += '<div class="ce-emoji">🎉</div>';
    html += '<div>No habits scheduled today.<br>Enjoy the rest, ' + escapeHtml(charName) + ' is watching.</div>';
    html += '</div>';
  }

  // If everything is done
  if (todayHabits.length > 0 && p === 100) {
    html += '<div class="glance-empty" style="margin-top:14px">';
    html += '<div class="ce-emoji">🏆</div>';
    html += '<div>You finished everything today.<br>' + escapeHtml(charName) + ' is suspiciously proud.</div>';
    html += '</div>';
  }

  html += '</div>';
  el.innerHTML = html;
}

function renderGlanceTile(h, highlight) {
  var pct = Math.min(100, (h.current / h.goal) * 100);
  var done = h.current >= h.goal;
  var t = '<div class="glance-tile">';
  t += '<div class="gt-icon">' + h.icon + '</div>';
  t += '<div class="gt-body">';
  t += '<div class="gt-name">' + escapeHtml(h.name) + '</div>';
  t += '<div class="gt-meta">' + h.current + '/' + h.goal + ' ' + (h.unit || 'times') + ' • ⏰ ' + (h.reminder || '--:--') + '</div>';
  t += '<div class="gt-progress"><div class="gt-fill ' + (done ? 'done' : '') + '" style="width:' + pct + '%"></div></div>';
  t += '</div>';
  t += '<button class="gt-action ' + (done ? 'done' : '') + '" onclick="increment(' + h.id + ')">' + (done ? '✓' : '+') + '</button>';
  t += '</div>';
  return t;
}
/* ===== AI CHAT ===== */
function renderChat(el) {

  if (!GROQ_API_KEY) {
    el.innerHTML =
      '<div class="chat-wrap" style="justify-content:center;align-items:center;text-align:center;padding:40px 24px">' +
        '<div style="font-size:48px;margin-bottom:14px">🔑</div>' +
        '<h3 style="color:#2D2D2D;margin-bottom:8px">Enter your Groq API key</h3>' +
        '<p style="color:#888;font-size:13px;line-height:1.5;margin-bottom:16px">' +
          'Get a free key at <b>console.groq.com/keys</b>. It stays on your device only — never sent anywhere except Groq.' +
        '</p>' +
        '<input id="apiKeyInput" placeholder="gsk_..." style="width:100%;padding:14px;border-radius:12px;border:2px solid #EEE;font-family:monospace;font-size:14px;outline:none;margin-bottom:12px" />' +
        '<button onclick="saveApiKey()" style="width:100%;background:#4CD964;color:#0A1A0E;border:none;padding:14px;border-radius:12px;font-weight:900;font-size:15px;cursor:pointer">Save key</button>' +
      '</div>';
    return;
  }
  var mood = moodFor(progress());
  var html = '';
  html += '<div class="chat-wrap">';
  html += '<div class="chat-header">';
  html += '<div class="ch-face mood-' + mood + '">' + characterSVG(charType, mood) + '</div>';
  html += '<div class="ch-info">';
  html += '<div class="ch-name">' + escapeHtml(charName) + '</div>';
  html += '<div class="ch-status">● online (judging)</div>';
  html += '</div>';
  html += '<button class="ch-clear" onclick="clearChat()" aria-label="Clear chat">🗑️</button>';
  html += '</div>';
  html += '<div class="chat-body" id="chatBody"></div>';
  html += '<div class="chat-suggestions" id="chatSuggestions"></div>';
  html += '<div class="chat-input-row">';
  html += '<textarea class="chat-input" id="chatInput" rows="1" placeholder="Say something..." maxlength="300"></textarea>';
  html += '<button class="chat-send" id="chatSend" onclick="sendChat()" aria-label="Send">➤</button>';
  html += '</div>';
  html += '</div>';
  el.innerHTML = html;

  // Render messages
  var body = document.getElementById('chatBody');
  if (chatHistory.length === 0) {
    // First-time greeting
    var greet = 'Hey. It\'s me, ' + charName + '. Talk to me. Or don\'t. I\'ll judge either way.';
    addChatMessage(body, 'buddy', greet, false);
    chatHistory.push({ role: 'assistant', content: greet });
    save();
  } else {
    for (var i = 0; i < chatHistory.length; i++) {
      var m = chatHistory[i];
      if (m.role === 'user' || m.role === 'assistant') {
        addChatMessage(body, m.role === 'user' ? 'user' : 'buddy', m.content, false);
      }
    }
  }

  renderChatSuggestions();
  bindChatInput();
  setTimeout(function() {
    body.scrollTop = body.scrollHeight;
  }, 50);
}

function renderChatSuggestions() {
  var el = document.getElementById('chatSuggestions');
  if (!el) return;

  var suggestions = [
    'How am I doing?',
    'Roast me 🔥',
    'I skipped a habit',
    'Motivate me',
    'Tell me a joke',
    'Why do you hate me?',
    'What should I do today?'
  ];

  var html = '';
  for (var i = 0; i < suggestions.length; i++) {
    html += '<button class="chat-chip" onclick="useChatSuggestion(\'' + suggestions[i].replace(/'/g, "\\'") + '\')">' + suggestions[i] + '</button>';
  }
  el.innerHTML = html;
}

function useChatSuggestion(text) {
  var input = document.getElementById('chatInput');
  if (!input) return;
  input.value = text;
  sendChat();
}

function bindChatInput() {
  var input = document.getElementById('chatInput');
  var send = document.getElementById('chatSend');
  if (!input || !send) return;

  input.addEventListener('input', function() {
    // Auto-grow
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 100) + 'px';
  });

  input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendChat();
    }
  });

  // Focus on tab open
  setTimeout(function() { input.focus(); }, 150);
}

function addChatMessage(body, who, text, animate) {
  var div = document.createElement('div');
  div.className = 'chat-msg ' + who;
  div.textContent = text;
  if (!animate) div.style.animation = 'none';
  body.appendChild(div);
  return div;
}

function addTypingIndicator(body) {
  var div = document.createElement('div');
  div.className = 'chat-msg buddy thinking';
  div.id = 'typingIndicator';
  div.innerHTML = '<span class="typing-dots"><span></span><span></span><span></span></span>';
  body.appendChild(div);
  body.scrollTop = body.scrollHeight;
  return div;
}

function clearChat() {
  if (!confirm('Clear the entire chat history?')) return;
  chatHistory = [];
  save();
  render();
  showToast('Chat cleared. ' + charName + ' will remember nothing. Probably.');
}

async function sendChat() {
  if (chatBusy) return;

  var input = document.getElementById('chatInput');
  var send = document.getElementById('chatSend');
  var body = document.getElementById('chatBody');
  if (!input || !body) return;

  var text = input.value.trim();
  if (!text) return;

  // Guard: API key missing
  if (!GROQ_API_KEY || GROQ_API_KEY.indexOf('gsk_') !== 0) {
    body.innerHTML += '<div class="chat-err">AI key missing. Paste your Groq key in app.js.</div>';
    return;
  }

  // Add user message
  addChatMessage(body, 'user', text, true);
  chatHistory.push({ role: 'user', content: text });
  save();

  input.value = '';
  input.style.height = 'auto';
  send.disabled = true;
  chatBusy = true;

  // Typing indicator
  addTypingIndicator(body);

  // Build the personality prompt
  var systemPrompt = buildBuddySystemPrompt();

  try {
    // Trim history to last 12 messages to stay under token limits
    var trimmed = chatHistory.slice(-12);

    var res = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + GROQ_API_KEY
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [{ role: 'system', content: systemPrompt }].concat(trimmed),
        temperature: 0.9,
        max_tokens: 180,
        top_p: 0.95
      })
    });

    if (!res.ok) {
      var errText = await res.text();
      throw new Error('API ' + res.status + ': ' + errText.slice(0, 120));
    }

    var data = await res.json();
    var reply = (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || '';

    // Remove typing indicator
    var ti = document.getElementById('typingIndicator');
    if (ti) ti.remove();

    if (!reply.trim()) throw new Error('Empty reply');

    reply = reply.trim();

    addChatMessage(body, 'buddy', reply, true);
    chatHistory.push({ role: 'assistant', content: reply });
    save();

    // Sound + haptic
    soundBoing();
    if (navigator.vibrate) navigator.vibrate(15);

    body.scrollTop = body.scrollHeight;
  } catch (err) {
    var ti2 = document.getElementById('typingIndicator');
    if (ti2) ti2.remove();

    var errDiv = document.createElement('div');
    errDiv.className = 'chat-err';
    errDiv.textContent = 'Couldn\'t reach the AI. ' + (err.message || 'Try again.');
    body.appendChild(errDiv);

    // Also speak a fallback in the buddy's voice
    setTimeout(function() {
      var fallback = pickMsg(moodFor(progress()));
      addChatMessage(body, 'buddy', 'Fine. ' + fallback, true);
    }, 400);

    console.error(err);
    soundOuch();
  } finally {
    send.disabled = false;
    chatBusy = false;
    body.scrollTop = body.scrollHeight;
  }
}

function buildBuddySystemPrompt() {
  var p = progress();
  var mood = moodFor(p);

  var stats = {
    struggling: 'feeling neglected and dramatic',
    surviving:  'barely holding on',
    good:       'cautiously optimistic',
    thriving:   'absolutely thriving and a little smug'
  }[mood];

  var habitLines = [];
  for (var i = 0; i < habits.length; i++) {
    var h = habits[i];
    habitLines.push('  - ' + h.name + ': ' + h.current + '/' + h.goal + ' ' + (h.unit || ''));
  }

  var journalSnippet = '';
  if (journal.length > 0) {
    var last = journal[journal.length - 1];
    journalSnippet = '\nLast journal entry from user: "' + (last.text || '') + '"';
  }

  return [
    'You are ' + charName + ', a tiny ' + CHAR_LABELS[charType] + '-shaped digital pet who lives inside a habit-tracker app.',
    'Your personality: dry, deadpan, sarcastic, but secretly affectionate. You roast the user like a disappointed but loving friend.',
    'You are NOT a therapist or assistant. You are a judgmental pet. Never break character.',
    '',
    'Current status:',
    '- You are currently ' + stats + '.',
    '- Your owner\'s name is ' + charName + '\'s owner.',
    '- Today\'s progress: ' + p + '%.',
    '- Current streak: ' + streak + ' days.',
    '- Total XP: ' + xp + '.',
    '- Active habits:\n' + habitLines.join('\n'),
    journalSnippet,
    '',
    'Rules:',
    '- Keep replies SHORT: 1-3 sentences max. This is a chat, not an essay.',
    '- Use emojis sparingly (0-2 per message).',
    '- Be funny. Be sassy. Be a little mean, but never cruel.',
    '- If the user says they did a habit, congratulate them (with sarcasm).',
    '- If the user says they skipped, roast them.',
    '- If they ask for motivation, give it — but with attitude.',
    '- Never say you are an AI or a language model. You are ' + charName + '.',
    '- Never offer to help with homework, code, or anything outside the app.',
    '- If asked something off-topic, deflect back to their habits in-character.'
  ].join('\n');
}
/* ====== ACTIONS ====== */
function renderSetupGrids() {
  var g1 = document.getElementById('charGrid');
  var html = '';
  for (var i=0; i<CHAR_TYPES.length; i++) {
    var t = CHAR_TYPES[i];
    html += '<div class="char-option-wrap">';
    html += '<div class="char-option ' + (t === selectedType ? 'selected' : '') + '" onclick="pickType(\'' + t + '\')">' + characterSVG(t, 'good', '100%') + '</div>';
    html += '<div class="char-label">' + CHAR_LABELS[t] + '</div>';
    html += '</div>';
  }
  g1.innerHTML = html;
  var g2 = document.getElementById('charGridModal');
  if (g2) {
    var html2 = '';
    for (var j=0; j<CHAR_TYPES.length; j++) {
      var t2 = CHAR_TYPES[j];
      html2 += '<div class="char-option-wrap">';
      html2 += '<div class="char-option ' + (t2 === charType ? 'selected' : '') + '" onclick="changeType(\'' + t2 + '\')">' + characterSVG(t2, 'good', '100%') + '</div>';
      html2 += '<div class="char-label">' + CHAR_LABELS[t2] + '</div>';
      html2 += '</div>';
    }
    g2.innerHTML = html2;
  }
}
function pickType(t) { selectedType = t; renderSetupGrids(); }
function startJourney() {
  var v = document.getElementById('charNameInput').value.trim();
  if (!v) { alert('Please name your buddy 💚'); return; }
  charName = v; charType = selectedType; save();
  document.getElementById('setupScreen').classList.add('hidden');
  document.getElementById('mainApp').classList.remove('hidden');
  currentMsg = pickMsg(moodFor(progress()));
  render();
  if (navigator.vibrate) navigator.vibrate(20);
}
function switchTab(t) {
  tab = t;
  if (t === 'today') currentMsg = pickMsg(moodFor(progress()));
  var items = document.querySelectorAll('.nitem');
  for (var i = 0; i < items.length; i++) {
    if (items[i].getAttribute('data-tab') === t) items[i].classList.add('active');
    else items[i].classList.remove('active');
  }
  render();
}
function increment(id) {
  var wasDone = false;
  for (var i=0; i<habits.length; i++) {
    if (habits[i].id === id) {
      if (habits[i].current >= habits[i].goal) return;
      habits[i].current++; xp += 10; wasDone = true; break;
    }
  }
  if (!wasDone) return;
  save();
  if (navigator.vibrate) navigator.vibrate(15);
  soundBoing();
  showFloatXp('+10 XP');
  var wrapper = document.querySelector('.char-wrapper');
  if (wrapper) {
    wrapper.classList.add('celebrate');
    setTimeout(function(){ wrapper.classList.remove('celebrate'); }, 600);
  }
  var badge = document.getElementById('xpBadge');
  badge.classList.add('pop');
  setTimeout(function(){ badge.classList.remove('pop'); }, 200);
  var p = progress();
  currentMsg = pickMsg(moodFor(p));
  // FIX #5: update streak when full completion is reached
  updateStreak();
  if (p === 100 && !sessionStorage.getItem('celebrated_' + dateKey())) {
    sessionStorage.setItem('celebrated_' + dateKey(), '1');
    confetti(120);
    soundYay();
    setTimeout(function(){ showToast('Okay, that\'s enough. Please stop clicking. 🎉'); }, 500);
  }
  render();
}
// Global state for the habit currently queued for deletion
var pendingDeleteId = null;

function deleteHabit(id) {
  var h = null;
  for (var i=0; i<habits.length; i++) {
    if (habits[i].id === id) { h = habits[i]; break; }
  }
  if (!h) return;

  // Store the id so confirmDelete() knows what to remove
  pendingDeleteId = id;

  // Populate the modal
  var nameEl = document.getElementById('delHabitName');
  var warnEl = document.getElementById('delWarnText');
  if (nameEl) nameEl.textContent = h.icon + '  ' + h.name;

  // Rotating guilt-trip message
  var warnings = [
    charName + ' will pretend not to care. (They will care.)',
    charName + ' is watching. This is your last chance.',
    'Deleting this won\'t delete the guilt. Just saying.',
    charName + ' has already started drafting the eulogy.',
    'Sure? ' + charName + ' just learned what "abandonment" means.',
    'This is a permanent decision. ' + charName + ' is crying.',
    'You can always add it back. ' + charName + ' will remember though.'
  ];
  if (warnEl) warnEl.textContent = warnings[Math.floor(Math.random() * warnings.length)];

  // Small vibrate + open popup
  if (navigator.vibrate) navigator.vibrate(15);
  openModal('deleteModal');
}

function confirmDelete() {
  if (pendingDeleteId == null) {
    closeModal('deleteModal');
    return;
  }

  var idx = -1;
  for (var i=0; i<habits.length; i++) {
    if (habits[i].id === pendingDeleteId) { idx = i; break; }
  }
  if (idx < 0) {
    pendingDeleteId = null;
    closeModal('deleteModal');
    return;
  }

  var removed = habits[idx];
  habits.splice(idx, 1);
  save();

  // Feedback
  soundTrombone();
  if (navigator.vibrate) navigator.vibrate(30);

  // Close modal + refresh
  closeModal('deleteModal');
  pendingDeleteId = null;

  // Update character message + recompute streak if needed
  currentMsg = pickMsg(moodFor(progress()));
  var p = progress();
  if (p === 100) updateStreak();

  render();

  // Roast toast
  var roasts = [
    charName + ' didn\'t need that habit anyway. 😤',
    'Gone. ' + charName + ' is drafting a eulogy. 🪦',
    'Poof. ' + charName + ' saw nothing. 👀',
    charName + ' just unfollowed that habit. 💔',
    'That habit has been yeeted into the void. 🌌',
    '"' + removed.name + '"? Never heard of it. — ' + charName
  ];
  setTimeout(function() {
    showToast(roasts[Math.floor(Math.random() * roasts.length)]);
  }, 250);
}
function rollChallenge() {
  currentChallenge = CHALLENGES[Math.floor(Math.random() * CHALLENGES.length)];
  document.getElementById('chText').textContent = currentChallenge.text;
  document.getElementById('chXp').textContent = '+ ' + currentChallenge.xp + ' XP';
  skipCount = 0;
  document.getElementById('skipBtn').textContent = SKIP_TEXT[0];
  openModal('chModal');
  if (navigator.vibrate) navigator.vibrate(30);
}
function completeChallenge() {
  xp += currentChallenge.xp; save();
  closeModal('chModal'); confetti(40);
  soundYay();
  showFloatXp('+' + currentChallenge.xp + ' XP');
  currentMsg = pickMsg(moodFor(progress()));
  render();
}
function skipChallenge() {
  document.body.classList.add('shake');
  setTimeout(function(){ document.body.classList.remove('shake'); }, 400);
  skipCount++;
  soundTrombone();
  if (skipCount < SKIP_TEXT.length) {
    document.getElementById('skipBtn').textContent = SKIP_TEXT[skipCount];
  } else {
    closeModal('chModal');
    showToast(charName + ' saw that. ' + charName + ' is very disappointed. 💀');
    currentMsg = pickMsg(moodFor(progress()));
    render();
  }
}
function openAddHabit() {
  selectedDays = [0,1,2,3,4,5,6];
  var dr = document.getElementById('nDays');
  var h = '';
  for (var i=0; i<7; i++) h += '<button class="day on" onclick="toggleDay(' + i + ',this)">' + DAYS[i] + '</button>';
  dr.innerHTML = h;
  openModal('addModal');
}
function toggleDay(i, btn) {
  var idx = selectedDays.indexOf(i);
  if (idx >= 0) { selectedDays.splice(idx,1); btn.classList.remove('on'); }
  else { selectedDays.push(i); btn.classList.add('on'); }
}
function addHabit() {
  var name = document.getElementById('nName').value.trim();
  var icon = document.getElementById('nIcon').value.trim() || '✨';
  var goal = parseInt(document.getElementById('nGoal').value) || 1;
  var freq = document.getElementById('nFreq').value;
  var reminder = document.getElementById('nReminder').value || '--:--';
  if (!name) { alert('Please enter a habit name'); return; }
  habits.push({ id: Date.now(), name:name, icon:icon, goal:goal, current:0, unit:'times', freq:freq, reminder:reminder, days:selectedDays.slice() });
  save();
  document.getElementById('nName').value = '';
  document.getElementById('nIcon').value = '';
  document.getElementById('nGoal').value = '';
  document.getElementById('nReminder').value = '';
  closeModal('addModal'); render();
}
function openJournal() {
  var prompts = [
    'How did ' + charName + ' survive today?',
    'Did ' + charName + ' smile today? Or just stare?',
    'What did you feed ' + charName + '? Emotionally?',
    'One win, one fail. Go.',
    charName + ' is judging your choices. Explain yourself.'
  ];
  document.getElementById('journalPrompt').textContent = prompts[Math.floor(Math.random()*prompts.length)];
  document.getElementById('jExcuse').value = '';
  document.getElementById('jText').value = '';
  selectedJournalMood = '🙂';
  var mp = document.getElementById('moodPick');
  var moods = ['😄','🙂','😐','😩','😴'];
  var mh = '';
  for (var i=0; i<moods.length; i++) mh += '<button class="' + (moods[i]===selectedJournalMood?'on':'') + '" onclick="pickMood(\'' + moods[i] + '\',this)">' + moods[i] + '</button>';
  mp.innerHTML = mh;
  openModal('journalModal');
}
function pickMood(m, btn) {
  selectedJournalMood = m;
  var b = btn.parentElement.querySelectorAll('button');
  for (var i=0; i<b.length; i++) b[i].classList.remove('on');
  btn.classList.add('on');
}
function saveJournal() {
  var t = document.getElementById('jText').value.trim();
  var excuse = document.getElementById('jExcuse').value;
  if (!t && !excuse) return;
  journal.push({ date: todayStr(), text: t || '(no words, just vibes)', mood: selectedJournalMood, excuse: excuse });
  save();
  closeModal('journalModal');
  soundTrombone();
  setTimeout(function(){ showToast(charName + ' read that. ' + charName + ' is crying. 😢'); }, 300);
  render();
}
function openRename() {
  var input = document.getElementById('renameInput');
  var sub = document.getElementById('renameSub');
  var counter = document.getElementById('renameCounter');
  if (!input) return;

  // Pre-fill with current name
  input.value = charName || '';

  // Rotating sassy subtitle
  var subs = [
    'Give them a name worth judging you with.',
    'Names have power. Choose wisely.',
    charName + ' is nervous about this.',
    'One name. Lifetime of guilt.',
    'This is legally binding. (Not really.)',
    'Make it iconic. Or don\'t. Whatever.'
  ];
  if (sub) sub.textContent = subs[Math.floor(Math.random() * subs.length)];

  // Live character counter
  updateRenameCounter();
  input.oninput = updateRenameCounter;
  input.onkeydown = function(e) {
    if (e.key === 'Enter') { e.preventDefault(); confirmRename(); }
    if (e.key === 'Escape') closeModal('renameModal');
  };

  // Auto-focus + select text so user can type-over immediately
  setTimeout(function() {
    input.focus();
    input.select();
  }, 100);

  if (navigator.vibrate) navigator.vibrate(15);
  openModal('renameModal');
}

function updateRenameCounter() {
  var input = document.getElementById('renameInput');
  var counter = document.getElementById('renameCounter');
  if (!input || !counter) return;
  var len = input.value.length;
  counter.textContent = len + '/12';
  if (len >= 10) counter.classList.add('warn');
  else counter.classList.remove('warn');
}

function confirmRename() {
  var input = document.getElementById('renameInput');
  if (!input) return;
  var v = input.value.trim();

  if (!v) {
    if (navigator.vibrate) navigator.vibrate([30, 40, 30]);
    soundOuch();
    showToast('They need a name. Even "Bob" would work.');
    input.focus();
    return;
  }

  if (v === charName) {
    closeModal('renameModal');
    showToast('Same name. Cool. Nothing changed.');
    return;
  }

  var oldName = charName;
  charName = v;
  save();

  // Update any pending notifications' content
  if (typeof scheduleNativeReminders === 'function') scheduleNativeReminders();

  // Refresh character message so the new name is used in roasts
  currentMsg = pickMsg(moodFor(progress()));

  closeModal('renameModal');
  soundChime();
  if (navigator.vibrate) navigator.vibrate(20);

  // Short screen flash for fun
  var flash = document.createElement('div');
  flash.className = 'milestone-flash';
  document.body.appendChild(flash);
  setTimeout(function(){ flash.remove(); }, 800);

  render();

  // Roast toast
  setTimeout(function() {
    var roasts = [
      oldName + ' → ' + charName + '. Bold choice.',
      charName + ' likes the new name. Doesn\'t like YOU though.',
      '"' + charName + '." Interesting. ' + oldName + ' is still processing.',
      charName + ' accepts. Reluctantly.',
      oldName + ' is dead. Long live ' + charName + '. 👑'
    ];
    showToast(roasts[Math.floor(Math.random() * roasts.length)]);
  }, 300);
}

// FIX #10: cancel previous typewriter interval before starting a new one
function typewriter(element, text, speed) {
  speed = speed || 30;
  if (typewriterTimer) { clearInterval(typewriterTimer); typewriterTimer = null; }
  element.textContent = '';
  var i = 0;
  typewriterTimer = setInterval(function() {
    element.textContent += text.charAt(i);
    i++;
    if (i >= text.length) { clearInterval(typewriterTimer); typewriterTimer = null; }
  }, speed);
}
function openCharPick() { renderSetupGrids(); openModal('charPickModal'); }
function changeType(t) { charType = t; save(); closeModal('charPickModal'); render(); }

// FIX #3: hard reset of memory + storage
function resetAll() {
  if (!confirm('This will erase ALL your data, including your buddy\'s trust in you. Continue?')) return;
  localStorage.clear();
  sessionStorage.clear();
  habits = [];
  xp = 0;
  streak = 0;
  lastCompletedDate = '';
  charName = '';
  charType = 'frog';
  journal = [];
  currentMsg = '';
  if (typewriterTimer) { clearInterval(typewriterTimer); typewriterTimer = null; }
  location.reload();
}
function openModal(id)  { document.getElementById(id).classList.add('show'); }
function closeModal(id) { document.getElementById(id).classList.remove('show'); }
function showFloatXp(text) {
  var el = document.createElement('div');
  el.className = 'fxp'; el.textContent = text;
  document.body.appendChild(el);
  setTimeout(function(){ el.remove(); }, 1000);
}
function confetti(count) {
  var colors = ['#FF6B6B','#FFC93C','#8AB4F8','#4CD964','#B8A4FF','#FF9FBE'];
  for (var i=0; i<count; i++) {
    (function(){
      var c = document.createElement('div');
      c.className = 'conf';
      c.style.left = Math.random() * 100 + 'vw';
      c.style.background = colors[Math.floor(Math.random() * colors.length)];
      c.style.animationDuration = (1.5 + Math.random() * 1.5) + 's';
      c.style.animationDelay = (Math.random() * 0.4) + 's';
      c.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      document.body.appendChild(c);
      setTimeout(function(){ c.remove(); }, 3500);
    })();
  }
}
/* ===== ACCOUNTABILITY PARTNER ===== */
function encodeSnapshot() {
  // Compact payload — only what the partner needs to see
  var snapshot = {
    n: charName,
    t: charType,
    s: streak,
    x: xp,
    p: progress(),
    m: dateKey(),
    h: habits.map(function(h) {
      return { i: h.icon, n: h.name, c: h.current, g: h.goal };
    })
  };
  var json = JSON.stringify(snapshot);
  // URL-safe base64 (btoa doesn't handle unicode; escape first)
  var encoded = btoa(unescape(encodeURIComponent(json)));
  // Make it URL-safe
  return encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function decodeSnapshot(str) {
  try {
    // Restore standard base64
    var b64 = str.replace(/-/g, '+').replace(/_/g, '/');
    while (b64.length % 4) b64 += '=';
    var json = decodeURIComponent(escape(atob(b64)));
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
}

function buildShareLink() {
  var base = location.href.split('?')[0].split('#')[0];
  return base + '?partner=' + encodeSnapshot();
}

function copyShareLink() {
  var link = buildShareLink();
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(link).then(function() {
      showToast('Link copied! Send it to your accountability partner. 🔗');
      soundChime();
    }).catch(function() {
      fallbackCopy(link);
    });
  } else {
    fallbackCopy(link);
  }
}

function fallbackCopy(text) {
  var ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand('copy'); showToast('Link copied! 🔗'); }
  catch (e) { showToast('Copy failed. Long-press the link to copy manually.'); }
  ta.remove();
}

function shareViaSystem() {
  var link = buildShareLink();
  var shareData = {
    title: 'Watch my buddy ' + charName,
    text: charName + ' needs accountability. Judge me:',
    url: link
  };
  if (navigator.share) {
    navigator.share(shareData).catch(function() { /* user cancelled */ });
  } else {
    copyShareLink();
  }
}

function openPartnerView() {
  var content = document.getElementById('partnerContent');
  var screen = document.getElementById('partnerScreen');
  if (!content || !screen) return;

  // Read the partner payload from URL
  var params = new URLSearchParams(location.search);
  var payload = params.get('partner');
  if (!payload) return false;

  var data = decodeSnapshot(payload);
  if (!data) {
    content.innerHTML = '<div class="partner-done"><div class="pd-emoji">😵</div><h3>Invalid link</h3><p>This partner link is broken or expired.</p></div>';
    screen.classList.remove('hidden');
    return true;
  }

  renderPartnerView(content, data);
  screen.classList.remove('hidden');
  return true;
}

function renderPartnerView(el, data) {
  var mood = moodFor(data.p);
  var todayHabits = data.h || [];
  var doneCount = todayHabits.filter(function(h) { return h.c >= h.g; }).length;
  var totalCount = todayHabits.length;

  var html = '';
  html += '<div class="partner-header">';
  html += '<div class="ph-badge">👀 Partner View</div>';
  html += '<h2>You\'re watching ' + escapeHtml(data.n) + '</h2>';
  html += '<p>Last updated: ' + escapeHtml(data.m || 'unknown') + '</p>';
  html += '</div>';

  html += '<div class="partner-hero" style="background:' + moodBg(mood) + '">';
  html += '<div class="ph-face">' + characterSVG(data.t, mood) + '</div>';
  html += '<div class="ph-name">' + escapeHtml(data.n) + '</div>';
  html += '<div class="ph-status">' + statusLabel(data.p) + '</div>';
  html += '</div>';

  html += '<div class="partner-stats">';
  html += '<div class="partner-stat"><div class="ps-num">🔥 ' + data.s + '</div><div class="ps-lbl">Streak</div></div>';
  html += '<div class="partner-stat"><div class="ps-num">' + data.p + '%</div><div class="ps-lbl">Today</div></div>';
  html += '<div class="partner-stat"><div class="ps-num">' + doneCount + '/' + totalCount + '</div><div class="ps-lbl">Done</div></div>';
  html += '</div>';

  // Send poke button
  html += '<button class="poke-btn" id="pokeBtn" onclick="sendPoke()">👉 Send a poke</button>';
  html += '<p style="text-align:center;color:#888;font-size:11px;margin-top:12px">Pokes are saved locally on your device. (No backend needed for the demo.)</p>';

  el.innerHTML = html;
}

function sendPoke() {
  var btn = document.getElementById('pokeBtn');
  if (!btn || btn.classList.contains('poked')) return;

  btn.classList.add('poked');
  btn.textContent = '✅ Poke sent!';

  // Record it locally so they see it next time (works in the same browser)
  var params = new URLSearchParams(location.search);
  var payload = params.get('partner');
  if (payload) {
    var key = 'hb_poke_' + payload.slice(0, 20);
    localStorage.setItem(key, String(Date.now()));
  }

  soundYay();
  if (navigator.vibrate) navigator.vibrate([30, 40, 30]);

  // Fun toast
  setTimeout(function() {
    showToast('Poke sent. They\'ll feel it. Probably. 👉');
  }, 200);

  // Show some confetti
  confetti(30);
}
function cleanupOldFiredFlags() {
  var today = dateKey();
  for (var i = 0; i < localStorage.length; i++) {
    var key = localStorage.key(i);
    if (key && key.indexOf('hb_fired_') === 0 && key.indexOf(today) < 0) {
      localStorage.removeItem(key);
      i--;
    }
  }
}
/* ====== INIT ====== */
/* ====== INIT ====== */
(function init(){
  // 👇 PARTNER VIEW TAKES OVER IF URL HAS ?partner=...
  if (openPartnerView()) {
    document.getElementById('setupScreen').classList.add('hidden');
    document.getElementById('mainApp').classList.add('hidden');
    return;
  }

  renderSetupGrids();
  updateThemeButton();
  cleanupOldFiredFlags();
  createNotificationChannel();
  async function createNotificationChannel() {
  // No-op on web; only matters for Capacitor native builds
  return;
}
  document.getElementById('charNameInput').addEventListener('keydown', function(e){
    if (e.key === 'Enter') startJourney();
  });
  if (charName) {
    document.getElementById('setupScreen').classList.add('hidden');
    document.getElementById('mainApp').classList.remove('hidden');
    currentMsg = pickMsg(moodFor(progress()));
    render();
    requestNotifPermission();
    startReminderLoop();
    checkForPokes();
  }
})();

/* ====== SERVICE WORKER (PWA) ====== */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('sw.js')
      .then(function(reg) { console.log('SW registered:', reg.scope); })
      .catch(function(err) { console.log('SW failed:', err); });
  });
}

/* ===== MODAL BACKDROP CLOSE ===== */
document.addEventListener('click', function(e) {
  if (e.target.classList && e.target.classList.contains('modal')) {
    var id = e.target.id;
    if (id === 'deleteModal' || id === 'addModal' || id === 'journalModal' || id === 'charPickModal' || id === 'renameModal') {
      e.target.classList.remove('show');
      if (id === 'deleteModal') pendingDeleteId = null;
    }
  }
});
function saveApiKey() {
  var input = document.getElementById('apiKeyInput');
  if (!input) return;
  var v = input.value.trim();
  if (!v || v.indexOf('gsk_') !== 0) {
    showToast('Key must start with gsk_');
    return;
  }
  localStorage.setItem('hb_groq_key', v);
  GROQ_API_KEY = v;
  showToast('Key saved. ' + charName + ' is online. 💬');
  soundChime();
  render();
}
function checkForPokes() {
  // Look for any poke keys related to our own current snapshot
  // (in the demo, partner is on the same browser so we can detect our own pokes)
  var keys = [];
  for (var i = 0; i < localStorage.length; i++) {
    var k = localStorage.key(i);
    if (k && k.indexOf('hb_poke_') === 0) keys.push(k);
  }
  if (keys.length === 0) return;

  // Count unread pokes (any poke in the last 24h not yet acknowledged)
  var recent = 0;
  for (var j = 0; j < keys.length; j++) {
    var ts = parseInt(localStorage.getItem(keys[j]), 10);
    if (Date.now() - ts < 24 * 60 * 60 * 1000) recent++;
  }

  if (recent > 0) {
    setTimeout(function() {
      showToast('👀 You got ' + recent + ' poke' + (recent > 1 ? 's' : '') + '! Someone is watching you.');
      soundChime();
    }, 2500);

    // Clear them so it doesn't repeat
    for (var m = 0; m < keys.length; m++) {
      localStorage.removeItem(keys[m]);
    }
  }
}
