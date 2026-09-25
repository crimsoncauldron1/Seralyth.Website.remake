let data=null;
const $=s=>document.querySelector(s);
async function load(){
  const r=await fetch("/api/serverdata");
  data=await r.json();
  $("#menuVersion").textContent=data["menu-version"]||"—";
  $("#minVersion").textContent="Minimum "+(data["min-version"]||"—");
  $("#consoleVersion").textContent=data["min-console-version"]||"—";
  $("#adminCount").textContent=(data.admins||[]).length;
  $("#ownerCount").textContent=(data.owners||[]).length;
  $("#statusText").textContent="API online";
  $("#statusDetail").textContent="Serving live local JSON";
  renderAdmins(data.admins||[]);
  renderSupporters(data.patreon||[]);
  $("#jsonBox").textContent=JSON.stringify(data,null,2);
}
function renderAdmins(list){
  const owners=(data.owners||[]), supers=(data["super-admins"]||[]);
  $("#adminList").innerHTML=list.map(x=>{
    const role=owners.includes(x.name)?"OWNER":supers.includes(x.name)?"SUPER ADMIN":"ADMIN";
    return `<div class="person"><b>${esc(x.name)}</b><span>${esc(x["user-id"]||"")}</span><span>${esc(x["discord-id"]||"")}</span><em class="badge">${role}</em></div>`;
  }).join("")||'<div class="person">No administrators configured.</div>';
}
function renderSupporters(list){
  $("#supporterList").innerHTML=list.map(x=>`<div class="person"><b>${esc(x.name||"Unknown")}</b><span>${esc(x["discord-id"]||"")}</span><em class="badge">${esc(x.tier||"Supporter")}</em></div>`).join("")||'<div class="person">No supporter records configured.</div>';
}
function esc(v){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
$("#adminSearch").addEventListener("input",e=>{
  if(!data)return;
  const q=e.target.value.toLowerCase();
  renderAdmins((data.admins||[]).filter(x=>(x.name||"").toLowerCase().includes(q)||(x["user-id"]||"").toLowerCase().includes(q)));
});
$("#copyBtn").addEventListener("click",async()=>{
  await navigator.clipboard.writeText(JSON.stringify(data,null,2));
  $("#copyBtn").textContent="Copied";
  setTimeout(()=>$("#copyBtn").textContent="Copy JSON",1200);
});
load().catch(()=>{$("#statusText").textContent="API error";$("#statusDetail").textContent="Could not load server data";});