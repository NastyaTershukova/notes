const inputFile = document.querySelector("#picture__input");
const pictureImage = document.querySelector(".picture__image");
const pictureImageTxt = "Выберите файл...";
pictureImage.innerHTML = pictureImageTxt;
var loadedImage = 0;
var imagePaths = {}

inputFile.addEventListener("change", function (e) {
  const inputTarget = e.target;
  const file = inputTarget.files[0];

  if (file) {

    if (!validateFile(file)) {
      return;
    }

    const reader = new FileReader();

    reader.addEventListener("load", function (e) {
      const readerTarget = e.target;

      loadedImage = readerTarget.result;

      const img = document.createElement("img");
      img.src = readerTarget.result;
      img.classList.add("picture__img");

      pictureImage.innerHTML = "";
      pictureImage.appendChild(img);
    });

    reader.readAsDataURL(file);
  } else {
    pictureImage.innerHTML = pictureImageTxt;
  }
});

function newImagePopup(status) {
  let popup = document.querySelector('.new_image_popup');

  if (status == false) {
    popup.classList.add('hidden');
    loadedImage = 0;
    return true;
  }

  popup.querySelector('.popup_buttons').children[0].innerHTML = `Готово`;
  document.querySelector('.popup_buttons').classList.remove('disabled');
  document.querySelector('#picture__input').disabled = false;
  pictureImage.innerHTML = pictureImageTxt;
  file = 0;

  popup.classList.remove('hidden');
}

async function uploadImage() {

  try {

    document.querySelector('.popup_buttons').children[0].innerHTML = `<div class="spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>`;
    document.querySelector('.popup_buttons').classList.add('disabled');
    document.querySelector('#picture__input').disabled = true;

    const response = await fetch('php/upload_image.php', {
      method: 'POST',
      body: JSON.stringify({
        image: loadedImage
      })
    })
    const result = await response.json();
    // console.log(result);

    if (result.success) {
      // console.log(result.success);
      imagePaths[lastCreatedImage] = result.success;
      displayImage(document.getElementById(lastCreatedImage), result.success);

      newImagePopup(false);
    } else if (result.error) {
      console.log(result.error);
      //TODO ВЫВОДИТЬ ОШИБКУ
      pushToHistory();
      newImagePopup(false);
    }
  } catch (error) {
    console.error('Error: ', error)
  }
}

async function displayImage(obj, filename) {

  try {
    const response = await fetch('php/load_image.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        filename: filename
      })
    })
    const result = await response.json();

    if (result.error) {
      obj.src = '/img/image-broken.svg';
      obj.classList.add('broken');
      console.error('Error:', result.error)
      return
    }

    obj.src = 'data:image/jpeg;base64,' + result.image;
    obj.classList = '';
  } catch (error) {
    console.error('Error:', error)
  }
}

function validateFile(file) {
  if (!file) {
    alert('No file selected.');
    return false;
  }

  const allowedExtensions = ['jpeg', 'jpg', 'png', 'gif'];
  const maxFileSize = 15 * 1024 * 1024; // 15 MB

  const fileExtension = file.name.split('.').pop().toLowerCase();
  if (!allowedExtensions.includes(fileExtension)) {
    alert('Unsupported file type.');
    return false;
  }

  if (file.size > maxFileSize) {
    alert('File is too large.');
    return false;
  }

  return true;
}