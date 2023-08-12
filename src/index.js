import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

// console.dir(axios);
// console.dir(Notify);

const BASE_URL = "https://pixabay.com/api/";
const API_KEY = "38704294-b9169c0a05cb876a56f757da2";

const form = document.querySelector('.search-form');
const galery = document.querySelector('.gallery');

form.addEventListener('submit', handlerForm);

function handlerForm(evt) {
    evt.preventDefault();
    const searchImage = evt.currentTarget.searchQuery.value;
    getImages(searchImage)
        .then(resp => {
            const cards = resp.data.hits
            Notify.success(`Hooray! We found ${resp.data.totalHits} images.`)
            console.log(cards)
            galery.insertAdjacentHTML('beforeend', createMurcup(cards)) 
        })
        .catch((e) =>
           
        Notify.failure("Sorry, there are no images matching your search query. Please try again.")
        
        );

}

async function getImages(searchImage) {
  
    const resp = await axios.get(BASE_URL,
        {
            params: {
                key: API_KEY,
                q: searchImage,
                image_type: "photo",
                orientation: "horizontal",
                safesearch: true,
            }
        }
            
    );
    return resp;
    
          
    
};

function createMurcup(arr) {
    return arr.map(({webformatURL, largeImageURL, tags, likes, views, comments, downloads}) => `<div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>${likes}
    </p>
    <p class="info-item">
      <b>Views</b>${views}
    </p>
    <p class="info-item">
      <b>Comments</b>${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>${downloads}
    </p>
  </div>
</div>`).join('');
}

// getImages()
//     .then(resp => console.log(resp))
//     .catch((e) =>
//         Notify.failure("Sorry, there are no images matching your search query. Please try again.")
        
//         );

// console.log(form);