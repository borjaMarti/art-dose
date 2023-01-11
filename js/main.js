// Initialize.

document.querySelector('button').addEventListener('click', getFetch);

// Stored data.

let objectData;
let largeImages = [];
let webImages = [];
let thumbnailImages = [];

// Fetch call for random piece from the MET's collection.

function getFetch() {
  const url = `https://collectionapi.metmuseum.org/public/collection/v1/objects/${Math.floor(Math.random() * 789811)}`;
  fetch(url)
      .then(res => res.json()) // parse response as JSON
      .then(data => {
        // Only return pieces with pictures.
        if (data.primaryImage) {
          objectData = data;
          processData();
        } else getFetch();
      })
      .catch(err => {
          console.log(`error ${err}`)
      });
}

// Prepare image and info display.

function processData() {
  storeImages();
  document.querySelector('.slider').textContent = '';
  document.querySelectorAll('.swap').forEach( elem => elem.classList = 'swap hidden');
  document.querySelector('figure').classList = '';

  if (objectData.additionalImages[0]) {
    document.querySelector('#left').addEventListener('click', changeImageLeft);
    document.querySelector('#right').addEventListener('click', changeImageRight);
    document.querySelectorAll('.swap').forEach( elem => elem.classList = 'swap navBtt');
    sanitizeImages();
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

function sanitizeImages() {
  objectData.additionalImages.forEach( (elem, index) => {
    objectData.additionalImages[index] = elem.slice(0, elem.lastIndexOf('.') + 1) + 'jpg';
  });
}

function changeImageRight() {
  let currentImg = document.querySelector('img').src;
  let ulArray = [...document.querySelector('.slider').childNodes];
  let thumbIndex = ulArray.findIndex( elem => String(elem.classList).includes('thumbFocus'));
  let string = String(document.querySelector('.thumbFocus').classList);

  document.querySelector('.thumbFocus').classList = string.slice(0, -10);

  if (webImages.indexOf(currentImg) === webImages.length - 1) {
    document.querySelector('img').src = webImages[0];
    document.querySelector('.big').href = largeImages[0];
    ulArray[0].classList += ' thumbFocus';
  }
  else  {
    document.querySelector('img').src = webImages[webImages.indexOf(currentImg) + 1];
    document.querySelector('.big').href = largeImages[webImages.indexOf(currentImg) + 1];
    ulArray[thumbIndex + 1].classList += ' thumbFocus';
  }
}

function changeImageLeft() {
  let currentImg = document.querySelector('img').src;
  let ulArray = [...document.querySelector('.slider').childNodes];
  let thumbIndex = ulArray.findIndex( elem => String(elem.classList).includes('thumbFocus'));
  let string = String(document.querySelector('.thumbFocus').classList);

  document.querySelector('.thumbFocus').classList = string.slice(0, -10);

  if (webImages.indexOf(currentImg) === 0) {
    document.querySelector('img').src = webImages[webImages.length - 1];
    document.querySelector('.big').href = largeImages[webImages.length - 1];
    ulArray[webImages.length - 1].classList += ' thumbFocus';
  }
  else {
    document.querySelector('img').src = webImages[webImages.indexOf(currentImg) - 1];
    document.querySelector('.big').href = largeImages[webImages.indexOf(currentImg) - 1];
    ulArray[thumbIndex - 1].classList += ' thumbFocus';
  }
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
      let string = String(document.querySelector('.thumbFocus').classList);
      document.querySelector('.thumbFocus').classList = string.slice(0, -10);
      document.querySelector(`.n${i}`).classList += ' thumbFocus';
    });
    document.querySelector('.slider').appendChild(li);
  }
  document.querySelector('.thumbnailImg').classList += ' thumbFocus';
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



let testFetch = 464120;
let testFetch2 = 685946;
let randomFetch = `${Math.floor(Math.random() * 789811)}`;