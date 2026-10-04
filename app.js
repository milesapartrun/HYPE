const KEY="forge_sessions_v1";
const sportMeta={
  running:{icon:"🏃",label:"Laufen"},strength:{icon:"🏋️",label:"Gym"},
  hyrox:{icon:"🔥",label:"HYROX"},cycling:{icon:"🚴",label:"Rad"},
  swimming:{icon:"🏊",label:"Schwimmen"},mobility:{icon:"🧘",label:"Mobility"},
  rest:{icon:"😴",label:"Recovery"}
};
let sessions=JSON.parse(localStorage.getItem(KEY)||"[]");
let selected=new Date(); selected.setHours(12,0,0,0);

const pad=n=>String(n).padStart(2,"0");
const iso=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const startOfWeek=d=>{let x=new Date(d); let day=(x.getDay()+6)%7; x.setDate(x.getDate()-day); x.setHours(12,0,0,0); return x};
const esc=s=>String(s||"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

function weekDays(){
  const s=startOfWeek(selected); return Array.from({length:7},(_,i)=>{let d=new Date(s);d.setDate(s.getDate()+i);return d});
}
function render(){
  const days=weekDays(), today=iso(new Date());
  const end=new Date(days[6]);
  document.getElementById("weekTitle").textContent=`${days[0].toLocaleDateString("de-DE",{day:"2-digit",month:"short"})} – ${end.toLocaleDateString("de-DE",{day:"2-digit",month:"short"})}`;
  document.getElementById("selectedDateLabel").textContent=selected.toLocaleDateString("de-DE",{weekday:"long",day:"numeric",month:"long"});
  const strip=document.getElementById("weekStrip");
  strip.innerHTML=days.map(d=>{
    const list=sessions.filter(s=>s.date===iso(d));
    return `<button class="day ${iso(d)===iso(selected)?"active":""}" data-date="${iso(d)}">
      ${d.toLocaleDateString("de-DE",{weekday:"short"}).slice(0,2).toUpperCase()}
      <strong>${d.getDate()}</strong>${list.length?'<span class="dot"></span>':''}</button>`;
  }).join("");
  strip.querySelectorAll(".day").forEach(b=>b.onclick=()=>{selected=new Date(b.dataset.date+"T12:00:00");render()});
  renderSessions();
  const weekLoad=sessions.filter(s=>days.some(d=>iso(d)===s.date)).reduce((a,s)=>a+Number(s.duration||0)*Number(s.intensity||0),0);
  document.getElementById("loadScore").textContent=weekLoad;
  const count=sessions.filter(s=>days.some(d=>iso(d)===s.date)).length;
  document.getElementById("insightText").textContent=count===0?"Füge Trainings hinzu, um deine Belastung zu sehen.":`${count} Einheiten geplant. Deine Wochenbelastung liegt bei ${weekLoad} Punkten.`;
}
function renderSessions(){
  const list=sessions.filter(s=>s.date===iso(selected)).sort((a,b)=>a.created-b.created);
  const el=document.getElementById("sessions");
  if(!list.length){el.innerHTML='<div class="empty">Noch kein Training geplant.<br><br><button class="primary" id="emptyAdd">Erste Einheit planen</button></div>';document.getElementById("emptyAdd").onclick=openDialog;return}
  el.innerHTML=list.map(s=>{const m=sportMeta[s.sport]||sportMeta.running;return `<article class="session">
    <div class="sport-icon">${m.icon}</div><div><h4>${esc(s.title)}</h4><p>${m.label} · ${s.duration} min · ${"●".repeat(Number(s.intensity))}${"○".repeat(5-Number(s.intensity))}</p>${s.notes?`<p>${esc(s.notes)}</p>`:""}</div>
    <button class="icon-btn delete" data-id="${s.id}" aria-label="Löschen">×</button>
  </article>`}).join("");
  el.querySelectorAll(".delete").forEach(b=>b.onclick=()=>{sessions=sessions.filter(s=>s.id!==b.dataset.id);save();render()});
}
function save(){localStorage.setItem(KEY,JSON.stringify(sessions))}
const dialog=document.getElementById("sessionDialog");
function openDialog(){document.getElementById("sessionForm").reset();document.getElementById("duration").value=60;document.getElementById("intensity").value=3;dialog.showModal()}
document.getElementById("addBtn").onclick=openDialog;
document.getElementById("closeDialog").onclick=()=>dialog.close();
document.getElementById("sessionForm").addEventListener("submit",e=>{
 e.preventDefault();
 sessions.push({id:crypto.randomUUID(),date:iso(selected),sport:document.getElementById("sport").value,title:document.getElementById("title").value,duration:document.getElementById("duration").value,intensity:document.getElementById("intensity").value,notes:document.getElementById("notes").value,created:Date.now()});
 save();dialog.close();render();
});
document.getElementById("todayBtn").onclick=()=>{selected=new Date();selected.setHours(12,0,0,0);render()};
document.getElementById("allBtn").onclick=()=>{const s=startOfWeek(selected);selected=new Date(s);render()};
document.getElementById("settingsBtn").onclick=()=>alert("V1: Trainings werden lokal auf diesem Gerät gespeichert. Als Nächstes kommen Profil, Ziele, Apple Health und KI-Plananpassung.");
if("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(()=>{});
render();
