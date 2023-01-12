// Initialize.
document.querySelector('#fetchArt').addEventListener('click', fetchData);

// Stored data.
let objectData;
let largeImages = [];
let webImages = [];
let thumbnailImages = [];

// Test object id
let manyAdditionalImages = 464120;

// Fetch call for random piece from the MET's collection.
function fetchData() {
  let randomObjectId = Math.floor(Math.random() * 789811);
  const URL = `https://collectionapi.metmuseum.org/public/collection/v1/objects/${manyAdditionalImages}`;
  fetch(URL)
      .then(res => res.json()) // parse response as JSON
      .then(data => {
        // Only return objects with pictures.
        if (data.primaryImage) {
          objectData = data;
          processData();
        } else fetchData();
      })
      .catch(err => {
          console.log(`error ${err}`)
      });
}

// Prepare image and info display.
function processData() {
  storeImages();
  // Reset display elements for new fetch.
  resetDisplay();
  // Make sure pictures are in a supported format.
  sanitizeImageFormat();
  // In case of additional images, prepare navigational elements.
  if (objectData.additionalImages[0]) {
    prepareNavigationButtons();
    storeImagesThumbnail();
    prepareThumbnails();
    prepareCarousel();
  }
  // Prepare displayed-on-page image bank.
  storeImagesPreview();
  // Show pictures and information on the page.
  displayInfo();
}

function displayInfo() {
  // Display first picture, set-up respective link and info.
  document.querySelector('img').src = webImages[0];
  document.querySelectorAll('.zoom').forEach( elem => elem.href = largeImages[0]);
  document.querySelector('figcaption').textContent = `${objectData.title}${', ' + objectData.objectDate}`;
  if (objectData.artistDisplayName) document.querySelector('figcaption').textContent += `${' | ' + objectData.artistDisplayName}`;
  // Display controls and extra info.
  document.querySelector('aside').classList.remove('hidden');
  document.querySelector('.imageControls').classList.remove('hidden');
  document.querySelector('#moreInfo').href = objectData.objectURL;
}

function resetDisplay() {
  document.querySelector('.slider').textContent = '';
  document.querySelectorAll('.imageSwitch').forEach( elem => elem.classList.add('hidden'));
  document.querySelector('#pictureDisplay').classList.remove('hidden');
}

// Image preparation
function sanitizeImageFormat() {
  largeImages.forEach( (elem, index) => {
    largeImages[index] = elem.slice(0, elem.lastIndexOf('.') + 1) + 'jpg';
  });
}

function storeImages() {
  largeImages = [];
  largeImages.push(objectData.primaryImage);
  objectData.additionalImages.forEach( elem => largeImages.push(elem));
}

function storeImagesPreview() {
  webImages = [];
  largeImages.forEach( elem => {
    let webImage = elem.split('');
    webImage.splice(42, 8, 'web-large');
    webImages.push(webImage.join(''));
  });
}

// Additional images preparation
function prepareNavigationButtons() {
  document.querySelector('#left').addEventListener('click', () => navigatePictures('left'));
  document.querySelector('#right').addEventListener('click', () => navigatePictures('right'));
  document.querySelectorAll('.imageSwitch').forEach( elem => elem.classList.remove('hidden'));
}

function storeImagesThumbnail() {
  thumbnailImages = [];
  largeImages.forEach( elem => {
    let thumbnail = elem.split('');
    thumbnail.splice(42, 8, 'web-additional');
    thumbnailImages.push(thumbnail.join(''));
  });
}

function prepareThumbnails() {
  for (let i = 0; i < thumbnailImages.length; i++) {
    let li = document.createElement('li');
    li.classList.add('thumbnailImg', `n${i}`);
    li.style['background-image'] = `url(${thumbnailImages[i]})`;
    li.addEventListener('click', () => {
      changeCurrentPicture(i);
    });
    document.querySelector('.slider').appendChild(li);
  }
  document.querySelector('.thumbnailImg').classList.add('focusedThumbnail');
}

function prepareCarousel() {
  let mouseDown = false;
  let startX;
  let scrollLeft;
  let slider = document.querySelector('.slider');

  slider.addEventListener('mousedown', start);
	slider.addEventListener('touchstart', start);

	slider.addEventListener('mousemove', move);
	slider.addEventListener('touchmove', move);

	slider.addEventListener('mouseleave', end);
	slider.addEventListener('mouseup', end);
	slider.addEventListener('touchend', end);
  
  function move(event) {
    if(!mouseDown) return;

    event.preventDefault();
    let x = event.pageX || event.touches[0].pageX - slider.offsetLeft;
    let distance = (x - startX);
    slider.scrollLeft = scrollLeft - distance;
  }

  function start(event) {
    mouseDown = true;
    slider.classList.add('active');
    startX = event.pageX || event.touches[0].pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;	
  }

  function end() {
    mouseDown = false;
    slider.classList.remove('active');
  }
}

function navigatePictures(direction) {
  let currentPictureIndex = webImages.indexOf(document.querySelector('.mainPicture').src);
  
  // Change current picture, its link, and thumbnail focus, taking into account direction and current list position.
  switch (direction) {
    case 'right':
      if (currentPictureIndex !== webImages.length - 1) {
        changeCurrentPicture(currentPictureIndex + 1)
      } else  {
        changeCurrentPicture(0);
      }
      break;

    case 'left':
      if (currentPictureIndex !== 0) {
        changeCurrentPicture(currentPictureIndex - 1);
      } else {
        changeCurrentPicture(webImages.length - 1);
      }
      break;
  }
}

function changeCurrentPicture(i) {
  document.querySelector('.mainPicture').src = webImages[i];
  document.querySelectorAll('.zoom').forEach(elem => elem.href = largeImages[i]);
  document.querySelector('.focusedThumbnail').classList.remove('focusedThumbnail');
  document.querySelector(`.n${i}`).classList.add('focusedThumbnail');
}