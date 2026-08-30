const STREAM_URL = "https://radiomas.co:8443/rocktrainradio.mp3";
const METADATA_URL = "https://radiomas.co:8443/status-json.xsl";

const audio = document.getElementById("radio");
const playButton = document.getElementById("playButton");
const playIcon = document.getElementById("playIcon");
const statusEl = document.getElementById("status");
const errorEl = document.getElementById("error");
const volume = document.getElementById("volume");
const nowPlaying = document.getElementById("nowPlaying");

audio.src = STREAM_URL;
audio.volume = Number(volume.value);

function error(msg) {
    errorEl.textContent = msg;
    errorEl.hidden = false;
}

playButton.addEventListener("click", async () => {
    errorEl.hidden = true;

    if (!audio.paused) {
        audio.pause();
        return;
    }

    try {
        statusEl.textContent = "Conectando con Rock Train Radio…";
        await audio.play();
    } catch (e) {
        statusEl.textContent = "No fue posible iniciar la reproducción";
        error(`${e.name || "Error"}${e.message ? ": " + e.message : ""}`);
    }
});

audio.addEventListener("playing", () => {
    playIcon.textContent = "❚❚";
    statusEl.textContent = "Reproduciendo en vivo";
});

audio.addEventListener("pause", () => {
    playIcon.textContent = "▶";

    if (!audio.error) {
        statusEl.textContent = "Pausado";
    }
});

audio.addEventListener("waiting", () => {
    statusEl.textContent = "Conectando / cargando señal…";
});

audio.addEventListener("stalled", () => {
    statusEl.textContent = "La señal está tardando en responder…";
});

audio.addEventListener("error", () => {
    const e = audio.error;

    const codes = {
        1: "MEDIA_ERR_ABORTED",
        2: "MEDIA_ERR_NETWORK",
        3: "MEDIA_ERR_DECODE",
        4: "MEDIA_ERR_SRC_NOT_SUPPORTED"
    };

    error(
        `${codes[e?.code] || "MEDIA_ERROR"}${e?.message ? ": " + e.message : ""}`
    );

    statusEl.textContent = "Error de reproducción";
});

volume.addEventListener("input", () => {
    audio.volume = Number(volume.value);

    document.getElementById("volumeValue").textContent =
        `${Math.round(Number(volume.value) * 100)}%`;
});


/* =========================================
   ACTUALIZAR CANCIÓN ACTUAL DESDE ICECAST
   ========================================= */

async function updateNowPlaying() {

    try {

        const response = await fetch(
            METADATA_URL + "?t=" + Date.now(),
            {
                cache: "no-store"
            }
        );

        if (!response.ok) {
            throw new Error("No se pudo consultar Icecast");
        }

        const data = await response.json();

        const sources = data?.icestats?.source;

        if (!sources) {
            nowPlaying.textContent = "Rock Train Radio";
            return;
        }

        const sourceList = Array.isArray(sources)
            ? sources
            : [sources];

        const rockTrain = sourceList.find(
            source =>
                source.server_name === "Rock Train Radio" ||
                source.listenurl?.includes("rocktrainradio.mp3")
        );

        if (rockTrain && rockTrain.title) {

            nowPlaying.textContent = rockTrain.title;

        } else {

            nowPlaying.textContent = "Rock Train Radio";

        }

    } catch (e) {

        console.log("Error obteniendo metadata:", e);

    }
}


/* Consultar inmediatamente */
updateNowPlaying();

/* Actualizar cada 10 segundos */
setInterval(updateNowPlaying, 10000);


/* Año del sitio */
document.getElementById("year").textContent =
    new Date().getFullYear();
