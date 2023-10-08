const models = ['psep.glb', 'isotope_heater.gltf', 'seismometer.glb', 'antenna.gltf', 'solar.gltf', 'lander.gltf']

const audios = ['psep', 'isotope_heater', 'seismometer', 'antenna', 'solar']

const hotspots = ['iso', 'seis', 'ant', 'slr']

hotspots.forEach((hotspot) => {
  document.getElementById(hotspot).addEventListener('click', () => {
    changeModel(document.querySelector(`.${hotspot}`));
  });
});
const descriptions = [
  ['PSEP', `The Passive Seismic Experiment was the first seismometer placed on the Moon's surface. It studied the propagation of seismic waves through the Moon and provided the first detailed look at the Moon's internal structure. This instrument featured four seismometers powered by two solar panels deployed on either side and a dedicated antenna pointed towards our planet.
<br><br>Regrettably, the seismic instrument package ceased responding to commands at 0400 UT on August 25, 1969. This was likely due to overheating caused by the scorching midday lunar sun. 
`], 
  ['Isotope Heater', `The first major use of nuclear energy in a NASA manned mission happened when a radioisotope heater was used to keep the instrument to a minimum of minus 54ºC as the temperatures can plummet to minus 170ºC during the 340 hour lunar night .`] ,
  ['Seismometer',  `This instrument featured four seismometers, strategically positioned to measure both meteorite impacts and moonquakes. Over its operational lifetime, it recorded an impressive tally of approximately 100 to 200 meteorite impacts.`],
  ['Antenna', `Crucial seismic event data, including strength, duration, and approximate direction, were relayed from the lunar surface to tracking stations on Earth via a dedicated antenna pointed towards our planet.`],
  ['Solar Panel', `The Passive Seismic Experiment (PSE) relied solely on solar cells situated on either side of the instrument, allowing the experiment to function exclusively during lunar daylight periods.`]
]

let audio_pref = 'en', audio = null;
let modelIndex = 0;

document.getElementById('audio-pref').addEventListener('change', (event) => {
  audio_pref = event.target.value;
});

document.getElementById('play_button').addEventListener('click', (event) => {
  if (!audio || audio.paused) {
    event.target.innerHTML = 'Pause Audio';
    audio = document.createElement('audio');
    audio.src = `../src/audio/${audios[modelIndex]}_${audio_pref}.mp3`;
    audio.play();
  } else {
    event.target.innerHTML = 'Play Audio';
    audio.pause();
  }

  audio.addEventListener('ended', () => {
    event.target.innerHTML = 'Play Audio';
  });
});



function changeModel(elem) {
  document.querySelector(".active").classList.remove("active");
  elem.classList.add("active");
  modelIndex = elem.getAttribute('data-i');
  console.log(typeof (modelIndex));
  document.querySelector('model-viewer').setAttribute('src', `../src/models/${models[modelIndex]}`);
  if (modelIndex != 0) {
    document.querySelectorAll('button').forEach((button) => {
      console.log('button removed');
      if (button.id !== 'play_button' && button.id !== 'ar_button_')
        button.style.display = 'none';
    });
  } else {
    document.querySelectorAll('button').forEach((button) => {
      console.log('button added');
      button.style.display = 'block';
    });
  }
  document.getElementById('desc_title').innerHTML = descriptions[modelIndex][0];
  document.getElementById('desc_body').innerHTML = descriptions[modelIndex][1];
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

document.querySelector('#ar_button_').addEventListener('click', () => {
  let model = document.querySelector('model-viewer').src.split('/').pop().replace('.', '_');
  window.location.href = `../htmls/model.html?model=${model}`;
});
