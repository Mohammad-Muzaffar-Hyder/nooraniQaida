/* ---------- installable, offline app ----------
   Android/desktop Chrome: shows an "Install app" button that opens the browser's install prompt.
   iPhone/iPad Safari: shows a short guide (Share → Add to Home Screen), because iOS has no install prompt.
   Nothing shows when already installed, or when the page is embedded in another site (e.g. a preview frame). */
const PWA={prompt:null};
const isStandalone=()=>matchMedia("(display-mode: standalone)").matches||navigator.standalone===true;
const isIOS=()=>/iphone|ipad|ipod/i.test(navigator.userAgent)||(navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1);
const topLevel=(()=>{try{return window.self===window.top}catch(e){return false}})();
function canOfferInstall(){return topLevel&&!isStandalone()&&(PWA.prompt||isIOS())}
function installHTML(){
  if(!canOfferInstall())return "";
  return `<button type="button" class="cv-btn ghost cv-install" data-install>⬇ Install app · works offline</button>`;
}
function updateInstallUI(){
  const b=document.getElementById("installBtn");if(b)b.hidden=!canOfferInstall();
  if(typeof show==="function"&&typeof idx!=="undefined"&&idx===0&&SEQ)show(0,true);
}
async function doInstall(){
  if(PWA.prompt){PWA.prompt.prompt();try{await PWA.prompt.userChoice}catch(e){}PWA.prompt=null;updateInstallUI();return}
  if(isIOS())document.getElementById("iosGuide").hidden=false;
}
addEventListener("beforeinstallprompt",e=>{e.preventDefault();PWA.prompt=e;updateInstallUI()});
addEventListener("appinstalled",()=>{PWA.prompt=null;updateInstallUI()});
document.addEventListener("click",e=>{
  if(e.target.closest("[data-install]")){e.preventDefault();e.stopPropagation();doInstall()}
  if(e.target.closest("[data-iosclose]")||e.target.id==="iosGuide")document.getElementById("iosGuide").hidden=true;
},true);
if(topLevel&&"serviceWorker" in navigator&&location.protocol!=="file:"){
  addEventListener("load",()=>{navigator.serviceWorker.register("sw.js").then(reg=>{
    reg.addEventListener("updatefound",()=>{const w=reg.installing;if(!w)return;w.addEventListener("statechange",()=>{
      if(w.state==="installed"&&navigator.serviceWorker.controller){const t=document.getElementById("updToast");if(t)t.hidden=false}})})
  }).catch(()=>{})});
}
document.addEventListener("DOMContentLoaded",updateInstallUI);
setTimeout(updateInstallUI,0);
