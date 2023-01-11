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
  // Prepare display elements for new fetch.
  prepareDisplay();
  // Make sure pictures are in a supported format.
  sanitizeImageFormat();
  // In case of additional images, prepare navigational elements.
  if (objectData.additionalImages[0]) {
    prepareNavigationButtons();
    storeImagesThumbnail();
    prepareThumbnails();
    prepareCarousel();
  }
  
  storeImagesPreview();
  document.querySelector('img').src = webImages[0];
  document.querySelectorAll('.big').forEach( elem => elem.href = largeImages[0]);
  document.querySelector('figcaption').textContent = `${objectData.title}${', ' + objectData.objectDate}`;
  if (objectData.artistDisplayName) document.querySelector('figcaption').textContent += `${' | ' + objectData.artistDisplayName}`;
  document.querySelector('aside').classList = '';
  document.querySelector('nav').classList = 'imgNav';
  document.querySelector('#moreInfo').href = objectData.objectURL;
}

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
    let small = elem.split('');
    small.splice(42, 8, 'web-large');
    webImages.push(small.join(''));
  });
}

function prepareDisplay() {
  document.querySelector('.slider').textContent = '';
  document.querySelectorAll('.switch').forEach( elem => elem.classList = 'switch hidden');
  document.querySelector('figure').classList = '';
}

// Additional images work
function prepareNavigationButtons() {
  document.querySelector('#left').addEventListener('click', () => changeImage('left'));
  document.querySelector('#right').addEventListener('click', () => changeImage('right'));
  document.querySelectorAll('.switch').forEach( elem => elem.classList = 'switch');
}

function changeImage(direction) {
  let currentPicture = document.querySelector('.mainPicture');
  let currentPictureLink = document.querySelectorAll('.big');
  let thumbnailList = [...document.querySelector('.slider').childNodes];
  let currentThumbnailIndex = thumbnailList.findIndex( elem => String(elem.classList).includes('focusedThumbnail'));
  let currentThumbnail = document.querySelector('.focusedThumbnail');
  
  // Reset focused thumbnail.
  currentThumbnail.classList = String(currentThumbnail.classList).slice(0, -16);
  // Change current picture, its link, and thumbnail focus, taking into account direction and current list position.
  switch (direction) {
    case 'right':
      if (webImages.indexOf(currentPicture.src) !== webImages.length - 1) {
        currentPictureLink.forEach(elem => elem.href = largeImages[webImages.indexOf(currentPicture.src) + 1]);
        currentPicture.src = webImages[webImages.indexOf(currentPicture.src) + 1];
        thumbnailList[currentThumbnailIndex + 1].classList += ' focusedThumbnail';
      } else  {
        currentPictureLink.forEach(elem => elem.href = largeImages[0]);
        currentPicture.src = webImages[0];
        thumbnailList[0].classList += ' focusedThumbnail';
      }
      break;

    case 'left':
      if (webImages.indexOf(currentPicture.src) !== 0) {
        currentPictureLink.forEach(elem => elem.href = largeImages[webImages.indexOf(currentPicture.src) - 1]);
        currentPicture.src = webImages[webImages.indexOf(currentPicture.src) - 1];
        thumbnailList[currentThumbnailIndex - 1].classList += ' focusedThumbnail';
      } else {
        currentPictureLink.forEach(elem => elem.href = largeImages[webImages.length - 1]);
        currentPicture.src = webImages[webImages.length - 1];
        thumbnailList[webImages.length - 1].classList += ' focusedThumbnail';
      }
      break;
  }
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
    li.classList = `thumbnailImg n${i}`;
    li.style['background-image'] = `url(${thumbnailImages[i]})`;
    li.addEventListener('click', () => {
      document.querySelector('img').src = webImages[i];
      document.querySelector('.big').href = largeImages[i];
      let string = String(document.querySelector('.focusedThumbnail').classList);
      document.querySelector('.focusedThumbnail').classList = string.slice(0, -10);
      document.querySelector(`.n${i}`).classList += ' focusedThumbnail';
    });
    document.querySelector('.slider').appendChild(li);
  }
  document.querySelector('.thumbnailImg').classList += ' focusedThumbnail';
}

function prepareCarousel() {
  let isDown = false;
  let startX;
  let scrollLeft;
  const slider = document.querySelector('.slider');

  slider.addEventListener('mousedown', start);
	slider.addEventListener('touchstart', start);

	slider.addEventListener('mousemove', move);
	slider.addEventListener('touchmove', move);

	slider.addEventListener('mouseleave', end);
	slider.addEventListener('mouseup', end);
	slider.addEventListener('touchend', end);

  function end() {
    isDown = false;
    slider.classList.remove('active');
  }

  function start(e) {
    isDown = true;
    slider.classList.add('active');
    startX = e.pageX || e.touches[0].pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;	
  }

  function move(e) {
    if(!isDown) return;

    e.preventDefault();
    const x = e.pageX || e.touches[0].pageX - slider.offsetLeft;
    const dist = (x - startX);
    slider.scrollLeft = scrollLeft - dist;
  }
}