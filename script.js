/* =============================================
   PORTFOLIO SCRIPT — Complete & Fixed
   ============================================= */
let D = {};

/* ================================================ LOAD DATA ================================================ */
function loadData() {
    const el = document.getElementById('D');
    if (el) { try { D = JSON.parse(el.textContent); } catch(e) { D = defaultData(); } }
    else { D = defaultData(); }
    renderAll();
}
function defaultData() {
    return {
        site:  { title:'Your Name', subtitle:'Your Title', description:'Portfolio', keywords:'portfolio',
                 url:'https://yoursite.com', logo1:'', logo2:'', logoMode:'none', faviconImg:'' },
        reel:  { label:'Showreel 2024', title:'Animation Reel', caption:'Character animation · Body mechanics',
                 embedUrl:'', reelSource:'youtube' },
        about: { nameEn:'Your Name', nameTh:'ชื่อของคุณ', profileImg:'', bio:['Write your bio here.'],
                 skills:['Skill 1','Skill 2'], resumeUrl:'resume.pdf', email:'you@example.com',
                 socials:[{label:'YouTube',url:'https://youtube.com'},{label:'TikTok',url:'https://tiktok.com'}] },
        portfolio: [], /* items: {type:'video'|'image', id:'ytId', src:'img/portfolio/x.jpg', title:''} */
        theme: { accent:'#c8f250', accent2:'#7ef2e2', bg:'#0a0a0c', surface:'#111116',
                 surface2:'#18181f', text:'#e8e8ed', bgImg:'', bgImgOpacity:0.15 }
    };
}

/* ================================================ RENDER ================================================ */
function renderAll() { renderMeta(); renderHeader(); renderReel(); renderPortfolio(); renderAbout(); renderTheme(); }

function renderMeta() {
    const s = D.site;
    document.title = s.title + (s.subtitle ? ' \u2014 ' + s.subtitle.split('/')[0].trim() : '');
    setMeta('description', s.description); setMeta('keywords', s.keywords);
    let fav = document.querySelector('link[rel="icon"]');
    if (!fav) { fav = document.createElement('link'); fav.rel='icon'; fav.type='image/png'; document.head.appendChild(fav); }
    fav.href = s.faviconImg || s.logo1 || '';
}
function setMeta(name, val) {
    let el = document.querySelector('meta[name="'+name+'"]');
    if (!el) { el = document.createElement('meta'); el.name=name; document.head.appendChild(el); }
    el.content = val||'';
}
function renderHeader() {
    const s = D.site;
    setText('header-name', s.title); setText('header-sub', s.subtitle);
    setText('footer-name', s.title); setText('footer-name-2', s.title);
    const l1 = document.getElementById('header-logo1');
    const l2 = document.getElementById('header-logo2');
    const mode = s.logoMode || 'none';
    if (l1) { l1.src=s.logo1||''; l1.style.display=(mode!=='none'&&s.logo1)?'':'none'; }
    if (l2) { l2.src=s.logo2||''; l2.style.display=(mode==='two'&&s.logo2)?'':'none'; }
}
function renderReel() {
    const r = D.reel;
    setText('reel-label', r.label); setText('reel-title', r.title); setText('reel-caption', r.caption);
    const iframe = document.getElementById('reel-iframe');
    if (iframe && r.embedUrl) iframe.src = r.embedUrl;
}
function renderPortfolio() {
    const grid = document.getElementById('portfolio-grid'); if (!grid) return;
    grid.innerHTML = '';
    D.portfolio.forEach((item, idx) => {
        // support legacy string IDs
        if (typeof item === 'string') item = {type:'video', id:item, title:''};
        const btn = document.createElement('button');
        btn.className = 'port-item';
        const label = item.title || (item.type==='image' ? 'Image '+(idx+1) : 'Video '+(idx+1));
        btn.setAttribute('aria-label', label);
        btn.onclick = () => openLightbox(idx);
        // thumbnail
        let thumb = '';
        if (item.type === 'image') {
            const src = 'img/portfolio/' + item.src;
            thumb = '<img src="'+src+'" alt="'+label+'" class="port-thumb" loading="lazy">';
        } else {
            const safeId = (item.id||'').replace(/[^A-Za-z0-9_\-]/g,'');
            thumb = '<img src="https://img.youtube.com/vi/'+safeId+'/hqdefault.jpg" alt="'+label+'" class="port-thumb" loading="lazy">';
        }
        const icon = item.type === 'image'
            ? '<span class="play-icon" style="font-size:1.4rem;">&#128247;</span>'
            : '<span class="play-icon">\u25B6</span>';
        const badge = item.type === 'image' ? '<span class="port-type-badge">IMG</span>' : '';
        btn.innerHTML = thumb
            + '<div class="port-overlay" aria-hidden="true">'+icon+'</div>'
            + badge
            + (item.title ? '<span class="port-hover-title">'+item.title+'</span>' : '');
        grid.appendChild(btn);
    });
}
function renderAbout() {
    const a = D.about;
    const pi = document.getElementById('about-profile-img');
    if (pi) { pi.src=a.profileImg||''; pi.style.display=a.profileImg?'':'none'; }
    setText('about-name-th', a.nameTh);
    const el = document.getElementById('about-email-link'); if (el) el.href='mailto:'+a.email;
    setText('about-email-text', a.email);
    const bio = document.getElementById('about-bio');
    if (bio) bio.innerHTML = a.bio.map(p=>'<p>'+p+'</p>').join('');
    const skills = document.getElementById('about-skills');
    if (skills) skills.innerHTML = a.skills.map(s=>'<span class="skill-chip">'+s+'</span>').join('');
    const sr = document.getElementById('about-socials');
    if (sr) sr.innerHTML = a.socials.map(s=>'<a href="'+s.url+'" target="_blank" rel="noopener noreferrer" class="social-btn">'+s.label+'</a>').join('');
}
function renderTheme() {
    if (!D.theme) return;
    const t = D.theme, rs = document.documentElement.style;
    rs.setProperty('--accent',   t.accent   ||'#c8f250');
    rs.setProperty('--accent2',  t.accent2  ||'#7ef2e2');
    rs.setProperty('--bg',       t.bg       ||'#0a0a0c');
    rs.setProperty('--surface',  t.surface  ||'#111116');
    rs.setProperty('--surface2', t.surface2 ||'#18181f');
    rs.setProperty('--text',     t.text     ||'#e8e8ed');
    const layer = document.getElementById('bg-img-layer'); if (!layer) return;
    if (t.bgImg) {
        layer.style.display=''; layer.style.backgroundImage='url("'+t.bgImg+'")';
        layer.style.opacity=String(t.bgImgOpacity??0.15);
    } else { layer.style.display='none'; layer.style.backgroundImage=''; }
}
function livePreviewBgOpacity(val) {
    const layer = document.getElementById('bg-img-layer');
    if (layer && layer.style.display!=='none') layer.style.opacity=String(parseInt(val)/100);
}

/* ================================================ HELPERS ================================================ */
function setText(id, t) { const el=document.getElementById(id); if(el) el.textContent=t||''; }
function setField(id, val) { const el=document.getElementById(id); if(el) el.value=val||''; }
function getField(id) { const el=document.getElementById(id); return el?el.value.trim():''; }

/* ================================================ PAGE NAV ================================================ */
function switchPage(pageId, el) {
    document.querySelectorAll('.page').forEach(p=>{p.classList.remove('active');p.hidden=true;});
    const t = document.getElementById(pageId); if(t){t.classList.add('active');t.hidden=false;}
    document.querySelectorAll('.nav-btn[role="tab"]').forEach(b=>{b.classList.remove('active');b.setAttribute('aria-selected','false');});
    if(el){el.classList.add('active');el.setAttribute('aria-selected','true');}
    const shell = document.querySelector('.layout-shell');
    if(shell) window.scrollTo({top:shell.getBoundingClientRect().top+window.pageYOffset-16,behavior:'smooth'});
}

/* ================================================ VIDEO MODAL ================================================ */
function openModal(youtubeId, title) {
    const modal=document.getElementById('video-modal'), iframe=document.getElementById('modal-iframe');
    if(!modal||!iframe) return;
    iframe.src='https://www.youtube.com/embed/'+youtubeId+'?autoplay=1&rel=0';
    const lbl=document.getElementById('modal-title'); if(lbl) lbl.textContent=title||'Now Playing';
    modal.hidden=false; document.body.style.overflow='hidden';
    const cb=modal.querySelector('.modal-close'); if(cb) cb.focus();
}
function closeModal() {
    const modal=document.getElementById('video-modal'), iframe=document.getElementById('modal-iframe');
    if(!modal) return; if(iframe) iframe.src=''; modal.hidden=true; document.body.style.overflow='';
}

/* ================================================ PDF MODAL ================================================ */
function openResume() {
    const url=(D.about&&D.about.resumeUrl)?D.about.resumeUrl:'resume.pdf';
    const modal=document.getElementById('pdf-modal'), iframe=document.getElementById('pdf-iframe');
    if(!modal||!iframe) return;
    iframe.src=url+'#toolbar=1&navpanes=1&scrollbar=1';
    modal.hidden=false; document.body.style.overflow='hidden';
    const cb=modal.querySelector('.modal-close'); if(cb) cb.focus();
}
function closePdfModal() {
    const modal=document.getElementById('pdf-modal'), iframe=document.getElementById('pdf-iframe');
    if(!modal) return; if(iframe) iframe.src=''; modal.hidden=true; document.body.style.overflow='';
}
function downloadPdf() {
    const url=(D.about&&D.about.resumeUrl)?D.about.resumeUrl:'resume.pdf';
    const filename=url.split('/').pop()||'resume.pdf';
    fetch(url)
        .then(r=>{if(!r.ok) throw new Error(); return r.blob();})
        .then(blob=>{
            const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=filename;
            document.body.appendChild(a); a.click(); document.body.removeChild(a);
            setTimeout(()=>URL.revokeObjectURL(a.href),1000);
        })
        .catch(()=>{
            const a=document.createElement('a'); a.href=url; a.download=filename;
            document.body.appendChild(a); a.click(); document.body.removeChild(a);
        });
}

/* ================================================ ESC ================================================ */
document.addEventListener('keydown', e => {
    const lb=document.getElementById('lightbox');
    if(lb&&!lb.hidden){
        if(e.key==='ArrowLeft')  { lightboxNav(-1); return; }
        if(e.key==='ArrowRight') { lightboxNav(1);  return; }
        if(e.key==='Escape')     { closeLightbox(); return; }
    }
    if(e.key!=='Escape') return;
    const vm=document.getElementById('video-modal'); if(vm&&!vm.hidden) closeModal();
    const pm=document.getElementById('pdf-modal');   if(pm&&!pm.hidden) closePdfModal();
    const ap=document.getElementById('admin-panel'); if(ap&&!ap.hidden) closeAdmin();
});

/* ================================================ ADMIN TRIGGER ================================================ */
(function(){
    const SECRET='admin'; let buf='', timer;
    document.addEventListener('keydown', e=>{
        const tag=(document.activeElement||{}).tagName||'';
        if(['INPUT','TEXTAREA','SELECT'].includes(tag.toUpperCase())) return;
        const ap=document.getElementById('admin-panel'); if(ap&&!ap.hidden) return;
        buf+=e.key.toLowerCase();
        clearTimeout(timer); timer=setTimeout(()=>{buf='';},2000);
        if(buf.length>SECRET.length) buf=buf.slice(-SECRET.length);
        if(buf===SECRET){buf='';openAdmin();}
    });
})();

/* ================================================ ADMIN PANEL ================================================ */
function openAdmin() {
    const panel=document.getElementById('admin-panel'); if(!panel) return;
    panel.hidden=false; document.body.style.overflow='hidden';
    populateDashboard();
    const firstTab=panel.querySelector('.atab'); if(firstTab) firstTab.click();
}
function closeAdmin() {
    const panel=document.getElementById('admin-panel'); if(!panel) return;
    panel.hidden=true; document.body.style.overflow='';
}
function populateDashboard() {
    setField('f-site-title',    D.site.title);
    setField('f-site-subtitle', D.site.subtitle);
    setField('f-site-url',      D.site.url);
    setLogoMode(D.site.logoMode||'none', true);
    updateImgPreview('logo1',   D.site.logo1||'');
    updateImgPreview('logo2',   D.site.logo2||'');
    setField('f-reel-label',    D.reel.label);
    setField('f-reel-title',    D.reel.title);
    setField('f-reel-caption',  D.reel.caption);
    const reelSrc = D.reel.reelSource||'youtube';
    setReelSource(reelSrc, true);
    setField(reelSrc==='youtube'?'f-reel-yt':'f-reel-vm', D.reel.embedUrl||'');
    setField('f-about-nameth',  D.about.nameTh);
    setField('f-about-email',   D.about.email);
    setField('f-about-resume',  D.about.resumeUrl);
    setField('f-about-bio',     D.about.bio.join(' || '));
    setField('f-about-skills',  D.about.skills.join(', '));
    updateImgPreview('profile', D.about.profileImg||'');
    renderSocialList(); renderAdminList(); populateThemeTab();
}

/* ================================================ LOGO MODE ================================================ */
function setLogoMode(mode, silently) {
    D.site.logoMode = mode;
    document.querySelectorAll('.logo-mode-btn[data-mode]').forEach(b=>b.classList.toggle('active',b.dataset.mode===mode));
    const s1=document.getElementById('logo1-section'), s2=document.getElementById('logo2-section');
    if(s1) s1.style.display=(mode==='one'||mode==='two')?'':'none';
    if(s2) s2.style.display=mode==='two'?'':'none';
    if(!silently) renderHeader();
}

/* ================================================ REEL SOURCE ================================================ */
function setReelSource(src, silently) {
    document.querySelectorAll('.logo-mode-btn[data-reel]').forEach(b=>b.classList.toggle('active',b.dataset.reel===src));
    const ytDiv=document.getElementById('reel-youtube-input'), vmDiv=document.getElementById('reel-vimeo-input');
    if(ytDiv) ytDiv.style.display=src==='youtube'?'':'none';
    if(vmDiv) vmDiv.style.display=src==='vimeo'?'':'none';
}
function parseReelUrl(raw, type) {
    raw=raw.trim();
    if(type==='youtube') {
        let id=null;
        for(const p of [/(?:v=|youtu\.be\/|embed\/|shorts\/)([A-Za-z0-9_\-]{11})/,/^([A-Za-z0-9_\-]{11})$/]) {
            const m=raw.match(p); if(m){id=m[1];break;}
        }
        return id ? 'https://www.youtube.com/embed/'+id+'?rel=0&modestbranding=1' : null;
    }
    if(type==='vimeo') {
        let id=null;
        for(const p of [/vimeo\.com\/(?:video\/)?(\d+)/,/^(\d+)$/]) {
            const m=raw.match(p); if(m){id=m[1];break;}
        }
        return id ? 'https://player.vimeo.com/video/'+id+'?title=0&byline=0&portrait=0' : null;
    }
    return null;
}

/* ================================================ IMAGE BROWSE ================================================ */
function onImagePicked(key, input) {
    const file=input.files[0]; if(!file) return;
    const reader=new FileReader();
    reader.onload=function(e){
        const b64=e.target.result;
        if(key==='logo1')   {D.site.logo1=b64;    renderHeader();}
        if(key==='logo2')   {D.site.logo2=b64;    renderHeader();}
        if(key==='profile') {D.about.profileImg=b64; renderAbout();}
        if(key==='bgimg')   {D.theme.bgImg=b64;   renderTheme();}
        updateImgPreview(key, b64); input.value='';
    };
    reader.readAsDataURL(file);
}
function clearImage(key) {
    if(key==='logo1')   {D.site.logo1='';    renderHeader();}
    if(key==='logo2')   {D.site.logo2='';    renderHeader();}
    if(key==='profile') {D.about.profileImg=''; renderAbout();}
    if(key==='bgimg')   {D.theme.bgImg='';   renderTheme();}
    updateImgPreview(key,'');
    const inp=document.getElementById('file-'+key); if(inp) inp.value='';
}
function updateImgPreview(key, src) {
    const ids={logo1:'prev-logo1',logo2:'prev-logo2',profile:'prev-profile',bgimg:'prev-bgimg'};
    const box=document.getElementById(ids[key]); if(!box) return;
    box.innerHTML=(src&&src.length>10)
        ?'<img src="'+src+'" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;">'
        :'<span>ไม่มีรูป</span>';
}

/* ================================================ APPLY SECTIONS ================================================ */
function applySection(section) {
    if(section==='site') {
        D.site.title    = getField('f-site-title')    ||D.site.title;
        D.site.subtitle = getField('f-site-subtitle') ||D.site.subtitle;
        D.site.url      = getField('f-site-url')      ||D.site.url;
        renderMeta(); renderHeader(); showMsg('msg-site','\u2713 บันทึกแล้ว');
    }
    if(section==='reel') {
        D.reel.label   = getField('f-reel-label')   ||D.reel.label;
        D.reel.title   = getField('f-reel-title')   ||D.reel.title;
        D.reel.caption = getField('f-reel-caption') ||D.reel.caption;
        const srcBtn=document.querySelector('.logo-mode-btn[data-reel].active');
        const isYT=!srcBtn||srcBtn.dataset.reel==='youtube';
        const raw=getField(isYT?'f-reel-yt':'f-reel-vm');
        if(raw){
            const embed=parseReelUrl(raw,isYT?'youtube':'vimeo');
            if(!embed){showMsg('msg-reel','URL ไม่ถูกต้อง','error');return;}
            D.reel.embedUrl=embed; D.reel.reelSource=isYT?'youtube':'vimeo';
        }
        renderReel(); showMsg('msg-reel','\u2713 บันทึกแล้ว');
    }
    if(section==='about') {
        D.about.nameTh    = getField('f-about-nameth') ||D.about.nameTh;
        D.about.email     = getField('f-about-email')  ||D.about.email;
        D.about.resumeUrl = getField('f-about-resume') ||D.about.resumeUrl;
        const bioRaw=getField('f-about-bio'); if(bioRaw) D.about.bio=bioRaw.split('||').map(s=>s.trim()).filter(Boolean);
        const skRaw=getField('f-about-skills'); if(skRaw) D.about.skills=skRaw.split(',').map(s=>s.trim()).filter(Boolean);
        D.about.socials=[];
        document.querySelectorAll('.social-edit-row').forEach(row=>{
            const label=row.querySelector('.se-label').value.trim(), url=row.querySelector('.se-url').value.trim();
            if(label&&url) D.about.socials.push({label,url});
        });
        renderAbout(); showMsg('msg-about','\u2713 บันทึกแล้ว');
    }
    if(section==='theme') {
        if(!D.theme) D.theme={};
        const readColor=(cId,hId,fb)=>{ const h=getField(hId); if(/^#[0-9a-fA-F]{6}$/.test(h)) return h; const c=document.getElementById(cId); return(c&&c.value)?c.value:fb; };
        D.theme.accent   = readColor('f-th-accent', 'f-th-accent-hex', D.theme.accent  ||'#c8f250');
        D.theme.accent2  = readColor('f-th-accent2','f-th-accent2-hex',D.theme.accent2 ||'#7ef2e2');
        D.theme.bg       = readColor('f-th-bg',     'f-th-bg-hex',     D.theme.bg      ||'#0a0a0c');
        D.theme.text     = readColor('f-th-text',   'f-th-text-hex',   D.theme.text    ||'#e8e8ed');
        D.theme.surface  = adjustBrightness(D.theme.bg,8);
        D.theme.surface2 = adjustBrightness(D.theme.bg,14);
        const opEl=document.getElementById('f-th-opacity');
        D.theme.bgImgOpacity=opEl?parseInt(opEl.value)/100:0.15;
        renderTheme(); showMsg('msg-theme','\u2713 บันทึก Theme แล้ว');
    }
}
function adjustBrightness(hex,amount){
    hex=(hex||'').replace('#',''); if(hex.length!==6) return '#111116';
    const r=Math.min(255,parseInt(hex.substr(0,2),16)+amount);
    const g=Math.min(255,parseInt(hex.substr(2,2),16)+amount);
    const b=Math.min(255,parseInt(hex.substr(4,2),16)+amount);
    return '#'+[r,g,b].map(v=>v.toString(16).padStart(2,'0')).join('');
}

/* ================================================ THEME TAB ================================================ */
function populateThemeTab() {
    const t=D.theme||{};
    const pairs=[['f-th-accent','f-th-accent-hex',t.accent||'#c8f250'],['f-th-accent2','f-th-accent2-hex',t.accent2||'#7ef2e2'],['f-th-bg','f-th-bg-hex',t.bg||'#0a0a0c'],['f-th-text','f-th-text-hex',t.text||'#e8e8ed']];
    pairs.forEach(([cId,hId,val])=>{
        const c=document.getElementById(cId),h=document.getElementById(hId);
        if(c) c.value=val; if(h) h.value=val;
        if(c&&h){ c.oninput=()=>{h.value=c.value;}; h.oninput=()=>{if(/^#[0-9a-fA-F]{6}$/.test(h.value))c.value=h.value;}; }
    });
    updateImgPreview('bgimg',t.bgImg||'');
    const opEl=document.getElementById('f-th-opacity'), opValEl=document.getElementById('f-th-opacity-val');
    const pct=Math.round((t.bgImgOpacity??0.15)*100);
    if(opEl) opEl.value=pct; if(opValEl) opValEl.textContent=pct+'%';
}
const PRESETS={dark:{accent:'#c8f250',accent2:'#7ef2e2',bg:'#0a0a0c',surface:'#111116',surface2:'#18181f',text:'#e8e8ed'},light:{accent:'#1a73e8',accent2:'#00897b',bg:'#f5f5f7',surface:'#ffffff',surface2:'#f0f0f5',text:'#1a1a2e'},blue:{accent:'#38bdf8',accent2:'#34d399',bg:'#0c1220',surface:'#121e34',surface2:'#1a2a46',text:'#e2e8f0'},rose:{accent:'#fb7185',accent2:'#f472b6',bg:'#0d0a0b',surface:'#1a1015',surface2:'#24181e',text:'#fce7f3'},purple:{accent:'#a78bfa',accent2:'#c084fc',bg:'#0d0b14',surface:'#13101e',surface2:'#1c1730',text:'#ede9fe'}};
function applyPreset(name){ const p=PRESETS[name]; if(!p||!D.theme) return; Object.assign(D.theme,p); populateThemeTab(); renderTheme(); showMsg('msg-theme','\u2713 Preset: '+name); }

/* ================================================ SOCIALS ================================================ */
function renderSocialList() {
    const list=document.getElementById('admin-socials-list'); if(!list) return;
    list.innerHTML='';
    D.about.socials.forEach(s=>{
        const row=document.createElement('div'); row.className='social-edit-row admin-row'; row.style.cssText='display:flex;gap:8px;align-items:center;margin-bottom:6px;';
        row.innerHTML='<input class="se-label" type="text" value="'+esc(s.label)+'" placeholder="Label" style="flex:0 0 90px;background:var(--surface2);border:1px solid var(--border-hi);border-radius:var(--radius);color:var(--text);font-size:0.85rem;padding:7px 10px;outline:none;">'+'<input class="se-url" type="text" value="'+esc(s.url)+'" placeholder="https://..." style="flex:1;background:var(--surface2);border:1px solid var(--border-hi);border-radius:var(--radius);color:var(--text);font-size:0.85rem;padding:7px 10px;outline:none;">'+'<button class="abtn del" onclick="this.closest(\'.social-edit-row\').remove()" aria-label="ลบ">\u2715</button>';
        list.appendChild(row);
    });
}
function addSocial() {
    const list=document.getElementById('admin-socials-list'); if(!list) return;
    const row=document.createElement('div'); row.className='social-edit-row admin-row'; row.style.cssText='display:flex;gap:8px;align-items:center;margin-bottom:6px;';
    row.innerHTML='<input class="se-label" type="text" placeholder="Label" style="flex:0 0 90px;background:var(--surface2);border:1px solid var(--border-hi);border-radius:var(--radius);color:var(--text);font-size:0.85rem;padding:7px 10px;outline:none;">'+'<input class="se-url" type="text" placeholder="https://..." style="flex:1;background:var(--surface2);border:1px solid var(--border-hi);border-radius:var(--radius);color:var(--text);font-size:0.85rem;padding:7px 10px;outline:none;">'+'<button class="abtn del" onclick="this.closest(\'.social-edit-row\').remove()" aria-label="ลบ">\u2715</button>';
    list.appendChild(row); row.querySelector('.se-label').focus();
}
function esc(s){return(s||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}


/* ================================================ LIGHTBOX ================================================ */
let lbCurrentIdx = 0;
function openLightbox(idx) {
    lbCurrentIdx = idx;
    renderLightbox();
    const lb = document.getElementById('lightbox');
    if(lb){ lb.hidden=false; document.body.style.overflow='hidden'; }
    // focus close btn
    setTimeout(()=>{ const cb=document.querySelector('#lightbox .modal-close'); if(cb) cb.focus(); },100);
}
function closeLightbox() {
    const lb=document.getElementById('lightbox'); if(!lb) return;
    lb.hidden=true; document.body.style.overflow='';
    // stop any playing video
    const content=document.getElementById('lightbox-content');
    if(content){ const fr=content.querySelector('iframe'); if(fr) fr.src=fr.src; content.innerHTML=''; }
}
function lightboxNav(dir) {
    const next = lbCurrentIdx + dir;
    if(next < 0 || next >= D.portfolio.length) return;
    // stop current video before switching
    const content=document.getElementById('lightbox-content');
    if(content){ const fr=content.querySelector('iframe'); if(fr) fr.src=''; }
    lbCurrentIdx = next;
    renderLightbox();
}
function renderLightbox() {
    const items = D.portfolio;
    const idx   = lbCurrentIdx;
    let item = items[idx];
    if(typeof item==='string') item = {type:'video',id:item,title:''};

    // title & counter
    const titleEl   = document.getElementById('lightbox-title');
    const counterEl = document.getElementById('lightbox-counter');
    if(titleEl)   titleEl.textContent   = item.title || (item.type==='image' ? 'Image' : 'Video') + ' '+(idx+1);
    if(counterEl) counterEl.textContent = (idx+1)+' / '+items.length;

    // nav buttons
    const prevBtn = document.getElementById('lb-prev');
    const nextBtn = document.getElementById('lb-next');
    if(prevBtn) prevBtn.disabled = idx===0;
    if(nextBtn) nextBtn.disabled = idx===items.length-1;

    // content
    const content = document.getElementById('lightbox-content');
    if(!content) return;
    if(item.type==='image') {
        const src = 'img/portfolio/'+item.src;
        content.innerHTML = '<img src="'+src+'" alt="'+(item.title||'')+'"+draggable="false">';
    } else {
        const safeId = (item.id||'').replace(/[^A-Za-z0-9_\-]/g,'');
        content.innerHTML = '<iframe src="https://www.youtube.com/embed/'+safeId+'?autoplay=1&rel=0" frameborder="0" allow="autoplay;fullscreen;picture-in-picture" allowfullscreen></iframe>';
    }
}

/* ================================================ YOUTUBE OEMBED ================================================ */
function fetchYouTubeTitle(ytId, callback) {
    const url='https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v='+ytId+'&format=json';
    fetch(url).then(r=>r.ok?r.json():null).then(d=>callback(d&&d.title?d.title:'')).catch(()=>callback(''));
}

/* ================================================ PORTFOLIO ================================================ */
function renderAdminList() {
    const list=document.getElementById('admin-port-list'); if(!list) return;
    list.innerHTML='';
    const total = D.portfolio.length;
    D.portfolio.forEach((item,idx)=>{
        if (typeof item === 'string') item = D.portfolio[idx] = {type:'video', id:item, title:''};
        const row=document.createElement('div'); row.className='admin-row'; row.style.cssText='align-items:flex-start;gap:8px;';
        // thumb
        let thumbSrc = item.type==='image'
            ? 'img/portfolio/'+item.src
            : 'https://img.youtube.com/vi/'+(item.id||'').replace(/[^A-Za-z0-9_\-]/g,'')+'/mqdefault.jpg';
        const typeTag = item.type==='image'
            ? '<span style="font-size:0.6rem;background:rgba(120,200,255,0.15);color:var(--accent2);border-radius:3px;padding:1px 5px;letter-spacing:0.06em;">IMG</span>'
            : '<span style="font-size:0.6rem;background:rgba(200,242,80,0.12);color:var(--accent);border-radius:3px;padding:1px 5px;letter-spacing:0.06em;">YT</span>';
        const idLabel = item.type==='image' ? (item.src||'') : (item.id||'');
        row.innerHTML=
            '<span class="admin-num">'+(idx+1)+'</span>'+
            '<img src="'+thumbSrc+'" class="admin-thumb" loading="lazy" alt="" onerror="this.style.opacity=0.3">'+
            '<div class="admin-id-wrap" style="flex:1;min-width:0;">'+
              typeTag+
              '<span class="admin-id" title="'+esc(idLabel)+'" style="display:block;margin-top:2px;">'+esc(idLabel)+'</span>'+
              '<div style="display:flex;gap:4px;align-items:center;margin-top:4px;">'+
                '<input class="admin-title-input port-title-inp" type="text" placeholder="ชื่อผลงาน..." value="'+esc(item.title||'')+'" data-idx="'+idx+'">'+
                (item.type==='video'?'<button class="abtn" data-fetch="'+idx+'" data-ytid="'+(item.id||'')+'" title="ดึงชื่อจาก YouTube" style="font-size:0.6rem;padding:0 5px;flex-shrink:0;">YT</button>':'')+
              '</div>'+
            '</div>'+
            '<div class="admin-actions">'+
              '<button class="abtn" onclick="moveItem('+idx+',-1)" '+(idx===0?'disabled':'')+' aria-label="ขึ้น">\u2191</button>'+
              '<button class="abtn" onclick="moveItem('+idx+',1)" '+(idx===total-1?'disabled':'')+' aria-label="ลง">\u2193</button>'+
              '<button class="abtn del" onclick="deleteItem('+idx+')" aria-label="ลบ">\u2715</button>'+
            '</div>';
        list.appendChild(row);
    });
    // live-sync title inputs
    list.querySelectorAll('.port-title-inp').forEach(inp=>{
        inp.addEventListener('input', ()=>{
            const i=parseInt(inp.dataset.idx,10);
            if(!isNaN(i) && D.portfolio[i]) D.portfolio[i].title=inp.value;
            renderPortfolio();
        });
    });
    // YT fetch buttons
    list.querySelectorAll('button[data-fetch]').forEach(btn=>{
        btn.addEventListener('click',()=>{
            const i=parseInt(btn.dataset.fetch,10), ytid=btn.dataset.ytid;
            if(!ytid) return; btn.textContent='...'; btn.disabled=true;
            fetchYouTubeTitle(ytid,t=>{
                if(t&&D.portfolio[i]){D.portfolio[i].title=t;renderAdminList();renderPortfolio();}
                else{btn.textContent='YT';btn.disabled=false;}
            });
        });
    });
}
function addPortItem() {
    const titleVal = (document.getElementById('new-port-title')||{value:''}).value.trim();
    const typeBtn  = document.querySelector('.logo-mode-btn[data-ptype].active');
    const ptype    = typeBtn ? typeBtn.dataset.ptype : 'video';

    if (ptype === 'image') {
        const fn = (document.getElementById('new-img-filename')||{value:''}).value.trim();
        if (!fn) { showMsg('add-msg','กรุณาใส่ชื่อไฟล์','error'); return; }
        const cleanFn = fn.replace(/[^A-Za-z0-9_\-\.]/g,'');
        D.portfolio.push({type:'image', src:cleanFn, title:titleVal});
        document.getElementById('new-img-filename').value='';
        document.getElementById('new-port-title').value='';
        renderAdminList(); renderPortfolio(); showMsg('add-msg','\u2713 เพิ่มรูปแล้ว');
        return;
    }

    // video
    const input=document.getElementById('new-yt-input'); if(!input) return;
    const raw=input.value.trim(); let ytId=raw;
    const m=raw.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_\-]{11})/); if(m) ytId=m[1];
    if(!/^[A-Za-z0-9_\-]{11}$/.test(ytId)){showMsg('add-msg','YouTube ID ไม่ถูกต้อง','error');return;}
    if(D.portfolio.some(x=>(typeof x==='string'?x:x.id)===ytId)){showMsg('add-msg','วิดีโอนี้มีอยู่แล้ว','error');return;}
    D.portfolio.push({type:'video', id:ytId, title:titleVal});
    input.value=''; document.getElementById('new-port-title').value='';
    renderAdminList(); renderPortfolio(); showMsg('add-msg','\u2713 เพิ่มแล้ว');
    // auto-fetch title if blank
    if (!titleVal) {
        const newIdx = D.portfolio.length-1;
        showMsg('add-msg','กำลังดึงชื่อ...','ok');
        fetchYouTubeTitle(ytId, t=>{
            if(t && D.portfolio[newIdx]){ D.portfolio[newIdx].title=t; renderAdminList(); renderPortfolio(); }
            showMsg('add-msg','\u2713 '+t,'ok');
        });
    }
}
function onPortImgPick(input) {
    const file = input.files[0]; if(!file) return;
    // just fill the filename — user needs to put the file in img/portfolio/ themselves
    document.getElementById('new-img-filename').value = file.name;
    input.value='';
}
function setPortType(type, btn) {
    document.querySelectorAll('.logo-mode-btn[data-ptype]').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('port-video-input').style.display = type==='video' ? '' : 'none';
    document.getElementById('port-image-input').style.display = type==='image' ? '' : 'none';
    const fetchBtn = document.getElementById('fetch-yt-title-btn');
    if(fetchBtn) fetchBtn.style.display = type==='video' ? '' : 'none';
}
function fetchNewYtTitle() {
    const raw = (document.getElementById('new-yt-input')||{value:''}).value.trim();
    if(!raw) return;
    let ytId=raw;
    const m=raw.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_\-]{11})/); if(m) ytId=m[1];
    if(!/^[A-Za-z0-9_\-]{11}$/.test(ytId)) return;
    const btn=document.getElementById('fetch-yt-title-btn'); if(btn){btn.textContent='...';btn.disabled=true;}
    fetchYouTubeTitle(ytId, t=>{
        if(t){ const ti=document.getElementById('new-port-title'); if(ti) ti.value=t; }
        if(btn){btn.textContent='YT';btn.disabled=false;}
    });
}
function deleteItem(idx){const item=D.portfolio[idx];const label=item&&item.type==='image'?'รูปภาพ':'วิดีโอ';if(!confirm('ลบ'+label+'ที่ '+(idx+1)+' ออก?'))return;D.portfolio.splice(idx,1);renderAdminList();renderPortfolio();showMsg('add-msg','\u2713 ลบแล้ว');}
function moveItem(idx,dir){const a=D.portfolio,ni=idx+dir;if(ni<0||ni>=a.length)return;[a[idx],a[ni]]=[a[ni],a[idx]];renderAdminList();renderPortfolio();}
function showMsg(id,text,type){const el=document.getElementById(id);if(!el)return;el.textContent=text;el.style.color=type==='error'?'#f28b82':'#c8f250';clearTimeout(el._t);el._t=setTimeout(()=>{el.textContent='';},3000);}

/* ================================================ EXPORT ================================================ */
function exportHTML() {
    /* 1. อัปเดต data */
    const dataEl=document.getElementById('D');
    if(dataEl) dataEl.textContent='\n'+JSON.stringify(D,null,4)+'\n';

    /* 2. ปิดทุก panel + reset overflow ก่อน serialize */
    ['admin-panel','video-modal','pdf-modal','lightbox'].forEach(id=>{const el=document.getElementById(id);if(el)el.hidden=true;});
    const mi=document.getElementById('modal-iframe'); if(mi) mi.src='';
    const pi=document.getElementById('pdf-iframe');   if(pi) pi.src='';
    document.body.style.overflow='';

    /* 3. Serialize */
    const html='<!DOCTYPE html>\n'+document.documentElement.outerHTML;

    /* 4. คืนค่า admin (user ยังอยู่ใน panel) */
    const ap=document.getElementById('admin-panel'); if(ap) ap.hidden=false;
    document.body.style.overflow='hidden';

    /* 5. Download */
    const blob=new Blob([html],{type:'text/html;charset=utf-8'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a'); a.href=url; a.download='index.html';
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
    const msg=document.getElementById('export-msg');
    if(msg){msg.textContent='\u2713 index.html ดาวน์โหลดแล้ว — รูปทั้งหมดฝังอยู่แล้ว';msg.style.color='#c8f250';}
}

/* ================================================ INIT ================================================ */
document.addEventListener('DOMContentLoaded', () => {
    /* force reset ทุกอย่างก่อน — ป้องกัน state ค้างจาก Export */
    ['admin-panel','video-modal','pdf-modal','lightbox'].forEach(id=>{const el=document.getElementById(id);if(el)el.hidden=true;});
    document.body.style.overflow='';

    /* force หน้าแรกเป็น reels เสมอ */
    document.querySelectorAll('.page').forEach(p=>{p.classList.remove('active');p.hidden=true;});
    document.querySelectorAll('.nav-btn[role="tab"]').forEach(b=>{b.classList.remove('active');b.setAttribute('aria-selected','false');});
    const reelsPage=document.getElementById('reels'); if(reelsPage){reelsPage.classList.add('active');reelsPage.hidden=false;}
    const reelsBtn=document.querySelector('.nav-btn[role="tab"]'); if(reelsBtn){reelsBtn.classList.add('active');reelsBtn.setAttribute('aria-selected','true');}

    const yr=document.getElementById('year'); if(yr) yr.textContent=new Date().getFullYear();
    loadData();
});
