import "./style.css";
import EmblaCarousel from "embla-carousel";

import Carousel from "../src/carousel";

let carouselValue = "";
let dotCarousel = "";
let loopCarousel = "";
const selectCarousel = "";
let yAxis = "";
document.querySelector(".new-slide")?.addEventListener("click", () => {});

function displayOrHideArrows(carousel, leftArrow, rightArrow) {
  if (!carousel.canScrollPrev()) {
    document.querySelector(leftArrow).style.display = "none";
  } else {
    document.querySelector(leftArrow).style.display = "block";
  }
  if (!carousel.canScrollNext()) {
    document.querySelector(rightArrow).style.display = "none";
  } else {
    document.querySelector(rightArrow).style.display = "block";
  }
}

document.querySelector(".left-arrow").style.display = "none";
document.querySelector(".left-arrow.dots").style.display = "none";

carouselValue = Carousel({
  parent: ".parent2 .inner",
  child: ".parent2 .slider",
  slidesToScroll: 4,
  whileScrolling: () => {
    displayOrHideArrows(carouselValue, ".left-arrow", ".right-arrow");
  },
  whileDragging: () => {
    displayOrHideArrows(carouselValue, ".left-arrow", ".right-arrow");
  },
});

loopCarousel = Carousel({
  parent: ".carousel-item",
  child: ".carousel-item .slider",
  loop: true,
});

dotCarousel = Carousel({
  parent: ".dots-parent .inner",
  child: ".dots-parent .slider",
  displayDots: true,
  whileScrolling: () => {
    displayOrHideArrows(dotCarousel, ".left-arrows.dots", ".right-arrows.dots");
  },
  whileDragging: () => {
    displayOrHideArrows(dotCarousel, ".left-arrows.dots", ".right-arrows.dots");
  },
  selectedState: true,
});

Carousel({
  parent: ".autoplay .inner",
  child: ".autoplay .slider",
  autoplay: true,
  selectedState: true,
});

yAxis = Carousel({
  parent: ".axis",
  child: ".axis .slider",
  autoplay: true,
  axis: "y",
  whileScrolling: () => {
    displayOrHideArrows(yAxis, ".up-arrow.dots", ".down-arrow.dots");
  },
  whileDragging: () => {
    displayOrHideArrows(yAxis, ".up-arrow.dots", ".down-arrow.dots");
  },
  selectedState: false,
});

const emblaNode = document.querySelector(".embla");
const options = {
  align: "start",
  loop: true,
  containScroll: "trimSnaps",
  dragFree: false,
};

EmblaCarousel(emblaNode, options);

document.querySelector(".left-arrow").addEventListener("click", () => {
  carouselValue.scrollPrev();
  displayOrHideArrows(carouselValue, ".left-arrow", ".right-arrow");

  console.log(carouselValue.slidesInView(), "slides in view");
  console.log(carouselValue.slidesNotInView(), "slides not in view");
});

document.querySelector(".right-arrow").addEventListener("click", () => {
  carouselValue.scrollNext();
  displayOrHideArrows(carouselValue, ".left-arrow", ".right-arrow");
  console.log(carouselValue.slidesInView(), "slides in view");
  console.log(carouselValue.slidesNotInView(), "slides not in view");
  console.log(carouselValue.slideNodes(), "slide nodes");
  console.log(carouselValue.rootNode(), "root node");
  console.log(carouselValue.containerNode(), "container node");
});

document.querySelector(".left-arrow.dots").addEventListener("click", () => {
  dotCarousel.scrollPrev();
  displayOrHideArrows(dotCarousel, ".left-arrow.dots", ".right-arrow.dots");
});
document.querySelector(".right-arrow.dots").addEventListener("click", () => {
  dotCarousel.scrollNext();
  displayOrHideArrows(dotCarousel, ".left-arrow.dots", ".right-arrow.dots");
});

document.querySelector(".left-arrow.select")?.addEventListener("click", () => {
  dotCarousel.scrollPrev();
  displayOrHideArrows(
    selectCarousel,
    ".left-arrow.selected",
    ".right-arrow.selected",
  );
});
document.querySelector(".right-arrow.select")?.addEventListener("click", () => {
  dotCarousel.scrollNext();
  displayOrHideArrows(
    selectCarousel,
    ".left-arrow.selected",
    ".right-arrow.selected",
  );
});

document
  .querySelectorAll(".carousel-item .slider")[0]
  .addEventListener("click", () => {});

document.querySelector("#next-button")?.addEventListener("click", () => {
  loopCarousel.scrollNext(true);
});
document.querySelector("#previous-button").addEventListener("click", () => {
  loopCarousel.scrollPrev(true);
});

document.querySelector(".up-arrow").addEventListener("click", () => {
  yAxis.scrollPrev();
  displayOrHideArrows(yAxis, ".up-arrow.dots", ".down-arrow.dots");
});

document.querySelector(".down-arrow").addEventListener("click", () => {
  yAxis.scrollNext();
  displayOrHideArrows(yAxis, ".up-arrow.dots", ".down-arrow.dots");
});
