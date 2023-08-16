import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";



const BASE_URL = "https://pixabay.com/api/";
const API_KEY = "38704294-b9169c0a05cb876a56f757da2";

const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const target = document.querySelector('.js-guard');
let galleryLightBox = '';

let currentPage = 1;
let searchImage = '';
let cards = '';


let options = {
  root: null,
  rootMargin: "400px",
  threshold: 1.0,
};

let observer = new IntersectionObserver(onLoad, options);


form.addEventListener('submit', handlerForm);

function handlerForm(evt) {
  evt.preventDefault();
  gallery.innerHTML = '';
  searchImage = evt.currentTarget.searchQuery.value;
  

  getImages(searchImage, currentPage)
    .then((resp) => {
         
      cards = resp.data.hits
      if (cards.length === 0) {
        Notify.failure("Sorry, there are no images matching your search query. Please try again.");
        return
      };
        
      Notify.success(`Hooray! We found ${resp.data.totalHits} images.`);
      
      gallery.insertAdjacentHTML('beforeend', createMurcup(cards));
      galleryLightBox = new SimpleLightbox('.gallery a');
      galleryLightBox.refresh();
      
      observer.observe(target);
      
    })
    .catch((err) =>
           
      Notify.failure("Sorry, there are no images matching your search query. Please try again.")
        
    );
  
}

function onLoad(entries, observer) {
 
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      
      currentPage += 1;
     
      getImages(searchImage, currentPage)
        .then((resp) => {
      //     if (cards.length === 0) {
      //   observer.unobserve(target);
      //   return
      // };
    
          gallery.insertAdjacentHTML('beforeend', createMurcup(cards));
          if (cards.length === 0) {
            observer.unobserve(target);
      };
          scrollPage();
          galleryLightBox = new SimpleLightbox('.gallery a');
          galleryLightBox.refresh();
          // Не спрацьовує refresh()
        })
        .catch((err) =>
           
          Notify.failure("We're sorry, but you've reached the end of search results.")
        
      );
    
    }
  })
}

async function getImages(reqest, page = 1) {
  
    const resp = await axios.get(BASE_URL,
        {
            params: {
                key: API_KEY,
                q: reqest,
                image_type: "photo",
                orientation: "horizontal",
                safesearch: true,
                page: page,
                per_page: 40,
            }
        }
            
    );
    return resp;          
    
};

function createMurcup(arr) {
  return arr.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => `<div class="photo-card">
    <a href="${largeImageURL}"><img src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
  
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      ${likes}
    </p>
    <p class="info-item">
      <b>Views</b>
      ${views}
    </p>
    <p class="info-item">
      <b>Comments</b>
      ${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>
      ${downloads}
    </p>
  </div>
</div>`).join('');
};

function scrollPage() {
  const { height: cardHeight } = document
    .querySelector(".gallery")
    .firstElementChild.getBoundingClientRect();


  window.scrollBy({
    top: cardHeight * 2,
    behavior: "smooth",
  });
};