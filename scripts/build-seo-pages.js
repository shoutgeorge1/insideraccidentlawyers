/**
 * Build SEO pages from ial-rewrite content.
 * Run: node scripts/build-seo-pages.js
 * Fetches content from ial-rewrite.vercel.app and generates HTML pages.
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const BASE = 'https://ial-rewrite.vercel.app';
const PUBLIC = path.join(__dirname, '..', 'public');
const SITE = 'https://www.insiderlawyers.com';

const PAGES = [
  { path: '/personal-injury', file: 'personal-injury.txt', related: ['/personal-injury/auto-accidents', '/personal-injury/brain-injuries', '/personal-injury/truck-accidents', '/personal-injury/wrongful-death', '/attorney-referrals'] },
  { path: '/personal-injury/auto-accidents', file: 'personal-injury-auto-accidents.txt', related: ['/personal-injury', '/personal-injury/brain-injuries', '/personal-injury/truck-accidents', '/personal-injury/wrongful-death', '/'] },
  { path: '/personal-injury/brain-injuries', file: 'personal-injury-brain-injuries.txt', related: ['/personal-injury', '/personal-injury/auto-accidents', '/personal-injury/truck-accidents', '/personal-injury/wrongful-death', '/brain-injury'] },
  { path: '/personal-injury/truck-accidents', file: 'personal-injury-truck-accidents.txt', related: ['/personal-injury', '/personal-injury/auto-accidents', '/personal-injury/brain-injuries', '/personal-injury/wrongful-death', '/injuries-truck-accidents'] },
  { path: '/personal-injury/wrongful-death', file: 'personal-injury-wrongful-death.txt', related: ['/personal-injury', '/personal-injury/auto-accidents', '/personal-injury/brain-injuries', '/personal-injury/truck-accidents'] },
  { path: '/personal-injury/animal-attacks', file: 'personal-injury-animal-attacks.txt', related: ['/personal-injury', '/personal-injury/slip-and-fall', '/post-dog-bite'] },
  { path: '/personal-injury/bicycle-accidents', file: 'personal-injury-bicycle-accidents.txt', related: ['/personal-injury', '/personal-injury/auto-accidents', '/personal-injury/pedestrian-accidents'] },
  { path: '/personal-injury/catastrophic-injuries', file: 'personal-injury-catastrophic-injuries.txt', related: ['/personal-injury', '/personal-injury/brain-injuries', '/personal-injury/spine-injuries'] },
  { path: '/personal-injury/motorcycle-accidents', file: 'personal-injury-motorcycle-accidents.txt', related: ['/personal-injury', '/personal-injury/auto-accidents', '/motorcycle-accident-case'] },
  { path: '/personal-injury/pedestrian-accidents', file: 'personal-injury-pedestrian-accidents.txt', related: ['/personal-injury', '/personal-injury/auto-accidents', '/pedestrian-right-of-way'] },
  { path: '/personal-injury/premises-liability', file: 'personal-injury-premises-liability.txt', related: ['/personal-injury', '/personal-injury/slip-and-fall', '/personal-injury/product-liability'] },
  { path: '/personal-injury/product-liability', file: 'personal-injury-product-liability.txt', related: ['/personal-injury', '/personal-injury/premises-liability'] },
  { path: '/personal-injury/slip-and-fall', file: 'personal-injury-slip-and-fall.txt', related: ['/personal-injury', '/personal-injury/premises-liability', '/personal-injury/animal-attacks'] },
  { path: '/personal-injury/spine-injuries', file: 'personal-injury-spine-injuries.txt', related: ['/personal-injury', '/personal-injury/brain-injuries', '/personal-injury/catastrophic-injuries'] },
  { path: '/personal-injury/uber-and-lyft-accidents', file: 'personal-injury-uber-and-lyft-accidents.txt', related: ['/personal-injury', '/personal-injury/auto-accidents', '/uber-or-lyft-accident'] },
  { path: '/attorney-referrals', file: 'attorney-referrals.txt', related: ['/lit-referral-core', '/personal-injury'] },
  { path: '/lit-referral-core', file: 'lit-referral-core.txt', related: ['/attorney-referrals', '/lit-referral-process'] },
  { path: '/lit-referral-process', file: 'lit-referral-process.txt', related: ['/attorney-referrals', '/lit-referral-core'] },
  { path: '/lit-referral-criteria', file: 'lit-referral-criteria.txt', related: ['/attorney-referrals', '/lit-referral-core'] },
  { path: '/lit-referral-economics', file: 'lit-referral-economics.txt', related: ['/attorney-referrals', '/lit-referral-core'] },
  { path: '/lit-referral-trial-ready-cocounsel', file: 'lit-referral-trial-ready-cocounsel.txt', related: ['/attorney-referrals', '/lit-referral-core'] },
  { path: '/lit-referral-catastrophic-cases', file: 'lit-referral-catastrophic-cases.txt', related: ['/attorney-referrals', '/personal-injury/catastrophic-injuries'] },
  { path: '/lit-referral-truck-litigation', file: 'lit-referral-truck-litigation.txt', related: ['/attorney-referrals', '/personal-injury/truck-accidents'] },
  { path: '/lit-referral-brain-injury', file: 'lit-referral-brain-injury.txt', related: ['/attorney-referrals', '/personal-injury/brain-injuries'] },
  { path: '/lit-referral-wrongful-death', file: 'lit-referral-wrongful-death.txt', related: ['/attorney-referrals', '/personal-injury/wrongful-death'] },
  { path: '/lit-referral-coverage-disputes', file: 'lit-referral-coverage-disputes.txt', related: ['/attorney-referrals', '/insurance-company-playbook'] },
  { path: '/insurance-company-playbook', file: 'insurance-company-playbook.txt', related: ['/adjuster-claim-valuation', '/personal-injury'] },
  { path: '/adjuster-claim-valuation', file: 'adjuster-claim-valuation.txt', related: ['/insurance-company-playbook', '/proving-claim-value'] },
  { path: '/proving-claim-value', file: 'proving-claim-value.txt', related: ['/insurance-company-playbook', '/adjuster-claim-valuation'] },
  { path: '/demand-letter-negotiation', file: 'demand-letter-negotiation.txt', related: ['/insurance-company-playbook', '/lowball-offer-response'] },
  { path: '/lowball-offer-response', file: 'lowball-offer-response.txt', related: ['/insurance-company-playbook', '/demand-letter-negotiation'] },
  { path: '/personal-injury-court', file: 'personal-injury-court.txt', related: ['/personal-injury', '/insurance-company-playbook'] },
  { path: '/post-dog-bite', file: 'post-dog-bite.txt', related: ['/personal-injury/animal-attacks', '/personal-injury'] },
  { path: '/major-car-accident', file: 'major-car-accident.txt', related: ['/personal-injury/auto-accidents', '/personal-injury'] },
  { path: '/pedestrian-right-of-way', file: 'pedestrian-right-of-way.txt', related: ['/personal-injury/pedestrian-accidents', '/personal-injury'] },
  { path: '/brain-injury', file: 'brain-injury.txt', related: ['/personal-injury/brain-injuries', '/personal-injury'] },
  { path: '/uber-or-lyft-accident', file: 'uber-or-lyft-accident.txt', related: ['/personal-injury/uber-and-lyft-accidents', '/personal-injury'] },
  { path: '/injuries-truck-accidents', file: 'injuries-truck-accidents.txt', related: ['/personal-injury/truck-accidents', '/personal-injury'] },
  { path: '/motorcycle-accident-case', file: 'motorcycle-accident-case.txt', related: ['/personal-injury/motorcycle-accidents', '/personal-injury'] },
  { path: '/california-car-accident-lawyer', file: 'california-car-accident-lawyer.txt', related: ['/personal-injury/auto-accidents', '/personal-injury'] },
  { path: '/truck-accident-legal-rights', file: 'truck-accident-legal-rights.txt', related: ['/personal-injury/truck-accidents', '/proving-truck-accident-case'] },
  { path: '/proving-truck-accident-case', file: 'proving-truck-accident-case.txt', related: ['/personal-injury/truck-accidents', '/truck-accident-legal-rights'] },
];

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function parseContent(raw) {
  const lines = raw.split('\n');
  const out = { h1: '', meta: '', intro: '', sections: [] };
  let section = null;
  let inBody = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (line.startsWith('ENHANCED BODY CONTENT:')) { inBody = true; continue; }
    if (!inBody) continue;
    if (trimmed.startsWith('Improved Meta Description:')) {
      out.meta = trimmed.replace(/^Improved Meta Description:\s*/, '').trim();
      continue;
    }
    if (trimmed.startsWith('H1:')) {
      out.h1 = trimmed.replace(/^H1:\s*/, '').trim();
      continue;
    }
    if (trimmed.startsWith('Intro:')) {
      out.intro = trimmed.replace(/^Intro:\s*/, '').trim();
      continue;
    }
    if (trimmed.startsWith('H2:')) {
      if (section) out.sections.push(section);
      section = { h2: trimmed.replace(/^H2:\s*/, '').trim(), short: '', subs: [], bullets: [], plus: [], quote: null, insight: [], faqs: [] };
      continue;
    }
    if (trimmed.startsWith('Short answer:')) {
      if (section) section.short = trimmed.replace(/^Short answer:\s*/, '').trim();
      continue;
    }
    if (trimmed.startsWith('H3:')) {
      if (section) section.subs.push(trimmed.replace(/^H3:\s*/, '').trim());
      continue;
    }
    if (trimmed.startsWith('- ') && section) {
      const bullet = trimmed.slice(2).trim();
      if (bullet.endsWith('?')) {
        section.faqs.push({ q: bullet, answer: '' });
      } else {
        section.bullets.push(bullet);
      }
      continue;
    }
    if (trimmed.startsWith('+ ') && section) {
      section.plus.push(trimmed.slice(2).trim());
      continue;
    }
    if (trimmed.startsWith('Quote:') && section) {
      section.quote = trimmed.replace(/^Quote:\s*"?|"?\s*$/, '').replace(/^Quote:\s*/, '').trim();
      continue;
    }
    if (trimmed.startsWith('Book Insight:') && section) {
      section.insight.push(trimmed.replace(/^Book Insight:\s*/, '').trim());
      continue;
    }
    if (trimmed.startsWith('Answer:') && section) {
      const last = section.faqs[section.faqs.length - 1];
      if (last) last.answer = trimmed.replace(/^Answer:\s*/, '').trim();
      continue;
    }
    if (trimmed.startsWith('Closing:') || trimmed.startsWith('Related:') || trimmed.startsWith('See also:')) continue;
  }
  if (section) out.sections.push(section);
  return out;
}

function sectionToHtml(s) {
  let html = '';
  if (s.h2) html += `<h2>${escapeHtml(s.h2)}</h2>`;
  if (s.short) html += `<p class="lead-text">${escapeHtml(s.short)}</p>`;
  if (s.quote) html += `<blockquote class="content-quote">${escapeHtml(s.quote)}</blockquote>`;
  for (const i of s.insight) html += `<p class="book-insight">${escapeHtml(i)}</p>`;
  for (const h3 of s.subs) html += `<h3>${escapeHtml(h3)}</h3>`;
  if (s.bullets.length) {
    html += '<ul>';
    for (const b of s.bullets) html += `<li>${escapeHtml(b)}</li>`;
    html += '</ul>';
  }
  if (s.plus.length) {
    html += '<ul class="plus-list">';
    for (const p of s.plus) html += `<li>${escapeHtml(p)}</li>`;
    html += '</ul>';
  }
  if (s.faqs.length) {
    for (const faq of s.faqs) {
      if (faq.answer) html += `<div class="faq-item"><h4>${escapeHtml(faq.q)}</h4><p>${escapeHtml(faq.answer)}</p></div>`;
    }
  }
  return html;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function linkify(text) {
  return text.replace(/\/([a-zA-Z0-9-/]+)/g, (_, p) => `<a href="${p}">${p}</a>`);
}

const HEADER = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SEO_TITLE | Insider Accident Lawyers</title>
    <meta name="description" content="SEO_META">
    <link rel="canonical" href="SITE canonical">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
        :root{--brand-navy:#01366c;--brand-blue:#01468a;--brand-light-blue:#f3f6fa;--brand-accent-yellow:#fbba00;--brand-white:#fff;--brand-gray-900:#1f2937;--brand-gray-700:#374151;--brand-border:#e5e7eb;--card-radius:12px;--card-shadow:0 10px 24px rgba(12,35,52,.12)}
        *{margin:0;padding:0;box-sizing:border-box}
        html{scroll-behavior:smooth}
        body{font-family:"Inter","Poppins",sans-serif;line-height:1.7;color:var(--brand-gray-900);background:var(--brand-white);font-size:16px}
        .container{max-width:1200px;margin:0 auto;padding:0 20px}
        section{padding:48px 0}
        .section-content{padding:48px;margin-bottom:32px}
        h1,h2,h3,h4{font-weight:700;color:var(--brand-navy)}
        h1{font-size:36px;margin-bottom:24px}
        h2{font-size:28px;margin:32px 0 16px}
        h3{font-size:22px;margin:24px 0 12px}
        h4{font-size:18px;margin:16px 0 8px}
        p{margin-bottom:16px;line-height:1.75}
        .lead-text{font-size:18px;color:var(--brand-gray-700);margin-bottom:24px}
        blockquote.content-quote{border-left:4px solid var(--brand-blue);padding:16px 20px;margin:24px 0;background:var(--brand-light-blue);font-style:italic}
        .book-insight{font-size:15px;color:var(--brand-gray-700);margin:12px 0}
        ul{margin:16px 0;padding-left:24px}
        li{margin:8px 0}
        .plus-list{list-style:none;padding-left:0}
        .plus-list li:before{content:"✓ ";color:var(--brand-blue);font-weight:700}
        .faq-item{margin:24px 0;padding:20px;background:var(--brand-light-blue);border-radius:var(--card-radius)}
        .faq-item h4{margin-top:0}
        .btn-primary{display:inline-block;background:var(--brand-accent-yellow);color:var(--brand-navy);font-weight:600;padding:14px 28px;border-radius:8px;text-decoration:none;font-size:18px;margin:24px 0;transition:all .3s}
        .btn-primary:hover{background:#e6b300;transform:translateY(-2px)}
        .btn-secondary{display:inline-block;background:var(--brand-blue);color:var(--brand-white);font-weight:600;padding:14px 28px;border-radius:8px;text-decoration:none;font-size:18px;margin:24px 0;transition:all .3s}
        .btn-secondary:hover{background:#0f3261;transform:translateY(-2px)}
        .sticky-header{position:sticky;top:0;background:var(--brand-white);border-bottom:2px solid var(--brand-border);padding:12px 0;z-index:1000;box-shadow:0 4px 12px rgba(0,0,0,.08)}
        .header-content{display:flex;justify-content:space-between;align-items:center;gap:24px}
        .header-logo{max-width:120px;height:auto}
        .header-nav{display:flex;gap:24px;align-items:center}
        .header-nav a{color:var(--brand-gray-900);text-decoration:none;font-weight:600}
        .header-nav a:hover{color:var(--brand-blue)}
        @media(max-width:768px){.header-nav{display:none}h1{font-size:28px}h2{font-size:24px}}
        footer{background:var(--brand-navy);color:var(--brand-white);padding:48px 0 24px}
        .footer-content{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:32px;margin-bottom:32px}
        .footer-section h3{color:var(--brand-white);margin-bottom:16px}
        .related-pages{margin-top:32px;padding-top:24px;border-top:1px solid rgba(255,255,255,.2)}
        .related-pages h4{color:var(--brand-white);font-size:16px;margin-bottom:12px}
        .related-pages ul{list-style:none;padding-left:0}
        .related-pages a{color:rgba(255,255,255,.9);text-decoration:none}
        .related-pages a:hover{color:var(--brand-accent-yellow)}
        .footer-disclaimer{font-size:12px;color:rgba(255,255,255,.7);margin-top:24px;padding-top:24px;border-top:1px solid rgba(255,255,255,.2)}
    </style>
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s);j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i;f.parentNode.insertBefore(j,f)})(window,document,'script','dataLayer','GTM-WS8XT5FC');</script>
</head>
<body>
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-WS8XT5FC" height="0" width="0" style="display:none"></iframe></noscript>
    <header class="sticky-header">
        <div class="container">
            <div class="header-content">
                <a href="/"><img src="/images/la/logo.png" alt="Insider Accident Lawyers" class="header-logo" style="filter:brightness(0)"></a>
                <nav class="header-nav">
                    <a href="/">Home</a>
                    <a href="/#case-evaluation">Free Case Review</a>
                    <a href="/#footer-contact">Contact</a>
                </nav>
                <a href="tel:844-467-4335" class="btn-secondary" data-callrail-phone="844-467-4335" style="padding:10px 20px;font-size:16px">Call 844-467-4335</a>
            </div>
        </div>
    </header>
    <main>`;

const FOOTER = `    </main>
    <footer id="footer-contact">
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h3>Insider Accident Lawyers</h3>
                    <p>Los Angeles personal injury attorneys. Free consultation. No fee unless we win.</p>
                    <p style="margin-top:16px"><a href="tel:844-467-4335" style="color:var(--brand-accent-yellow);text-decoration:none;font-weight:700" data-callrail-phone="844-467-4335">844-467-4335</a></p>
                </div>
                <div class="footer-section">
                    <h3>Quick Links</h3>
                    <p><a href="/" style="color:rgba(255,255,255,.9)">Home</a></p>
                    <p><a href="/#case-evaluation" style="color:rgba(255,255,255,.9)">Free Case Review</a></p>
                </div>
                <div class="footer-section RELATED_SECTION">
                    <div class="related-pages">
                        <h4>Related Pages</h4>
                        <ul>RELATED_LINKS</ul>
                    </div>
                </div>
            </div>
            <div class="footer-disclaimer">
                <p>Attorney advertising. Prior results do not guarantee a similar outcome. This site does not provide legal advice. Countrywide Trial Lawyers DBA Insider Accident Lawyers. 3435 Wilshire Blvd Suite 1620, Los Angeles, CA 90010.</p>
            </div>
        </div>
    </footer>
</body>
</html>`;

function relatedLinks(related) {
  const labels = {
    '/': 'Home',
    '/personal-injury': 'Personal Injury',
    '/personal-injury/auto-accidents': 'Auto Accidents',
    '/personal-injury/brain-injuries': 'Brain Injuries',
    '/personal-injury/truck-accidents': 'Truck Accidents',
    '/personal-injury/wrongful-death': 'Wrongful Death',
    '/personal-injury/animal-attacks': 'Animal Attacks',
    '/personal-injury/bicycle-accidents': 'Bicycle Accidents',
    '/personal-injury/catastrophic-injuries': 'Catastrophic Injuries',
    '/personal-injury/motorcycle-accidents': 'Motorcycle Accidents',
    '/personal-injury/pedestrian-accidents': 'Pedestrian Accidents',
    '/personal-injury/premises-liability': 'Premises Liability',
    '/personal-injury/product-liability': 'Product Liability',
    '/personal-injury/slip-and-fall': 'Slip and Fall',
    '/personal-injury/spine-injuries': 'Spine Injuries',
    '/personal-injury/uber-and-lyft-accidents': 'Uber & Lyft Accidents',
    '/attorney-referrals': 'Attorney Referrals',
    '/lit-referral-core': 'Litigation Referrals',
    '/lit-referral-process': 'Referral Process',
    '/insurance-company-playbook': 'Insurance Company Playbook',
    '/adjuster-claim-valuation': 'Adjuster Claim Valuation',
    '/proving-claim-value': 'Proving Claim Value',
    '/brain-injury': 'Brain Injury Guide',
    '/uber-or-lyft-accident': 'Uber/Lyft Claim Guide',
    '/injuries-truck-accidents': 'Truck Accident Injuries',
    '/motorcycle-accident-case': 'Motorcycle Negligence',
    '/california-car-accident-lawyer': 'California Car Accident Lawyer',
    '/truck-accident-legal-rights': 'Truck Accident Legal Rights',
    '/proving-truck-accident-case': 'Proving a Truck Case',
    '/post-dog-bite': 'After a Dog Bite',
    '/major-car-accident': 'After a Major Car Accident',
    '/pedestrian-right-of-way': 'Pedestrian Right-of-Way',
    '/personal-injury-court': 'Do I Have to Go to Court?',
    '/demand-letter-negotiation': 'Demand Letter Negotiation',
    '/lowball-offer-response': 'Lowball Offer Response',
  };
  return related.map(p => `<li><a href="${p}">${labels[p] || p}</a></li>`).join('');
}

async function build() {
  for (const page of PAGES) {
    const url = `${BASE}/CONTENT_ENRICHED/${page.file}`;
    console.log('Fetching', page.file);
    let raw;
    try {
      raw = await fetch(url);
    } catch (e) {
      console.error('Failed to fetch', url, e.message);
      continue;
    }
    const content = parseContent(raw);
    const title = content.h1 || page.path.split('/').pop().replace(/-/g, ' ');
    const meta = content.meta || title;
    const canonical = SITE + page.path;
    let bodyHtml = '';
    if (content.intro) bodyHtml += `<p class="lead-text">${escapeHtml(content.intro)}</p>`;
    for (const s of content.sections) bodyHtml += sectionToHtml(s);
    bodyHtml += `<p style="margin-top:32px"><a href="/#case-evaluation" class="btn-primary">Get My Free Case Review</a> <a href="tel:844-467-4335" class="btn-secondary" data-callrail-phone="844-467-4335">Call 844-467-4335</a></p>`;
    const html = HEADER
      .replace('SEO_TITLE', escapeHtml(title))
      .replace('SEO_META', escapeHtml(meta))
      .replace('SITE canonical', canonical)
      + `\n    <section class="section-content">\n      <div class="container">\n        <h1>${escapeHtml(content.h1 || title)}</h1>\n        ${bodyHtml}\n      </div>\n    </section>\n`
      + FOOTER
        .replace('RELATED_SECTION', '')
        .replace('RELATED_LINKS', relatedLinks(page.related));
    const outPath = path.join(PUBLIC, page.path.replace(/^\//, ''), 'index.html');
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, html, 'utf8');
    console.log('Wrote', outPath);
  }
  console.log('Done. Add rewrites to vercel.json for each path.');
}

build().catch(console.error);
