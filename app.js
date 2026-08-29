const STREAM_URL="https://radiomas.co:8443/rocktrainradio.mp3";
const audio=document.getElementById("radio"),playButton=document.getElementById("playButton"),playIcon=document.getElementById("playIcon"),statusEl=document.getElementById("status"),errorEl=document.getElementById("error"),volume=document.getElementById("volume");
audio.src=STREAM_URL; audio.volume=Number(volume.value);
function error(msg){errorEl.textContent=msg;errorEl.hidden=false}
playButton.addEventListener("click",async()=>{errorEl.hidden=true;if(!audio.paused){audio.pause();return}try{statusEl.textContent="Conectando con Rock Train Radio…";await audio.play()}catch(e){statusEl.textContent="No fue posible iniciar la reproducción";error(`${e.name||"Error"}${e.message?": "+e.message:""}`)}});
audio.addEventListener("playing",()=>{playIcon.textContent="❚❚";statusEl.textContent="Reproduciendo en vivo"});
audio.addEventListener("pause",()=>{playIcon.textContent="▶";if(!audio.error)statusEl.textContent="Pausado"});
audio.addEventListener("waiting",()=>statusEl.textContent="Conectando / cargando señal…");
audio.addEventListener("stalled",()=>statusEl.textContent="La señal está tardando en responder…");
audio.addEventListener("error",()=>{const e=audio.error;const c={1:"MEDIA_ERR_ABORTED",2:"MEDIA_ERR_NETWORK",3:"MEDIA_ERR_DECODE",4:"MEDIA_ERR_SRC_NOT_SUPPORTED"};error(`${c[e?.code]||"MEDIA_ERROR"}${e?.message?": "+e.message:""}`);statusEl.textContent="Error de reproducción"});
volume.addEventListener("input",()=>{audio.volume=Number(volume.value);document.getElementById("volumeValue").textContent=`${Math.round(Number(volume.value)*100)}%`});
document.getElementById("year").textContent=new Date().getFullYear();