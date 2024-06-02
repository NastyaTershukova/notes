const inputFile = document.querySelector("#picture__input");
const pictureImage = document.querySelector(".picture__image");
const pictureImageTxt = "Выберите файл...";
pictureImage.innerHTML = pictureImageTxt;
var loadedImage = 0;

inputFile.addEventListener("change", function (e) {
  const inputTarget = e.target;
  const file = inputTarget.files[0];

  if (file) {
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

  document.querySelector('.popup_buttons').children[0].innerHTML = `Готово`;
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
    //console.log(result);

    if (result.success) {
      console.log(result.success);

      newImagePopup(false);
    }
  } catch (error) {
    console.error('Error: ', error)
  }
}