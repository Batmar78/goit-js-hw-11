import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import createMurcup from "./murcup";
import getImages from './getImages';

const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const target = document.querySelector('.js-guard');

let currentPage = '';
let searchImage = '';
let cards = '';
let data = '';

let options = {
  root: null,
  rootMargin: "400px",
  threshold: 1.0,
};

let galleryLightBox = new SimpleLightbox('.gallery a');
let observer = new IntersectionObserver(onLoad, options);


form.addEventListener('submit', handlerForm);

function handlerForm(evt) {
  evt.preventDefault();
  gallery.innerHTML = '';
  currentPage = 1;
  observer.unobserve(target);
  searchImage = evt.currentTarget.searchQuery.value;
  
  getImages(searchImage, currentPage)
    .then((resp) => {
      data = resp.data;   
      cards = data.hits
      
      if (cards.length === 0) {
        Notify.failure("Sorry, there are no images matching your search query. Please try again.");
        return
      };
        
      Notify.success(`Hooray! We found ${data.totalHits} images.`);
      
      gallery.insertAdjacentHTML('beforeend', createMurcup(cards));
      
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
      data = resp.data;   
      cards = data.hits
      
      if (cards.length === 0) {
        Notify.failure("Sorry, there are no images matching your search query. Please try again.");
        return
      };
        
      
      
      gallery.insertAdjacentHTML('beforeend', createMurcup(cards));
      
      galleryLightBox.refresh();
      
      observer.observe(target);

      let totalPages = data.totalHits / data.hits.length;
      
      if (currentPage > totalPages) {
        Notify.failure("We're sorry, but you've reached the end of search results.");
        observer.unobserve(target);
        
          };
      
    })
    .catch((err) =>
           
      Notify.failure("Sorry, there are no images matching your search query. Please try again.")
        
    );
     
      
    }
  })
};