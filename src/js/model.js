const models = ['psep.glb', 'isotope_heater.gltf', 'seismometer.glb', 'antenna.gltf', 'solar.gltf']

const audios = ['psep', 'isotope_heater', 'seismometer', 'antenna', 'solar']

let audio_pref = 'en', audio = null;
let modelIndex = 0;

document.getElementById('audio-pref').addEventListener('change', (event) => {
  audio_pref = event.target.value;
});

document.getElementById('play_button').addEventListener('click', (event) => {
  if(!audio || audio.paused){
    event.target.innerHTML = 'Pause Audio';
    audio = document.createElement('audio');
    audio.src = `../src/audio/${audios[modelIndex]}_${audio_pref}.mp3`;
    audio.play();
  } else {
    event.target.innerHTML = 'Play Audio';
    audio.pause();
  }
});



function changeModel(elem) {
  document.querySelector(".active").classList.remove("active");
  elem.classList.add("active");
  modelIndex = elem.getAttribute('data-i');
  document.querySelector('model-viewer').setAttribute('src', `../src/models/${models[modelIndex]}`);
  if(modelIndex !== 0){
    document.querySelectorAll('button').forEach((button) => {
      button.style.display = 'none';
    });
  } else {
    document.querySelectorAll('button').forEach((button) => {
      button.style.display = 'block';
    });
  }
}



const onProgress = (event) => {
  const progressBar = event.target.querySelector('.progress-bar');
  const updatingBar = event.target.querySelector('.update-bar');
  updatingBar.style.width = `${event.detail.totalProgress * 100}%`;
  if (event.detail.totalProgress === 1) {
    progressBar.classList.add('hide');
    event.target.removeEventListener('progress', onProgress);
  } else {
    progressBar.classList.remove('hide');
  }
};
document.querySelector('model-viewer').addEventListener('progress', onProgress);

