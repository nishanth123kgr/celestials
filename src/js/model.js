const models = ['psep.glb', 'isotope_heater.gltf', 'seismometer.glb', 'antenna.gltf', 'solar.gltf']




function changeModel(elem) {
  document.querySelector(".active").classList.remove("active");
  elem.classList.add("active");
  let modelIndex = elem.getAttribute('data-i');
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

