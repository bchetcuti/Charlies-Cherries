(function(){
  const key='charliesCherries.funGames.cherryParkour';
  const defaults={started:false,completed:false,bestCherries:0,voucherUnlocked:false,completionDate:''};
  const read=()=>{try{return {...defaults,...JSON.parse(localStorage.getItem(key)||'{}')}}catch(e){return defaults}};
  const write=v=>{try{localStorage.setItem(key,JSON.stringify(v))}catch(e){}};
  const progress=read();
  const status=document.querySelector('[data-level-status]');
  const best=document.querySelector('[data-best-cherries]');
  const panel=document.querySelector('[data-voucher-panel]');
  const date=document.querySelector('[data-completion-date]');
  if(status) status.textContent=progress.completed?'Completed':progress.started||progress.bestCherries>0?'In progress':'Not started';
  if(best) best.textContent=`${progress.bestCherries||0} / 10`;
  if(progress.voucherUnlocked && panel){panel.hidden=false; if(date) date.textContent=progress.completionDate||'Completed on this device';}
  document.querySelector('[data-print-voucher]')?.addEventListener('click',()=>window.print());
  document.querySelector('[data-reset-games]')?.addEventListener('click',()=>{write(defaults); location.reload();});
})();
