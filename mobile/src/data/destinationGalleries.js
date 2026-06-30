const GALLERIES = {
  Kopaonik: [
    require('../../assets/galleries/kopaonik/1.png'),
    require('../../assets/galleries/kopaonik/2.png'),
    require('../../assets/galleries/kopaonik/3.png'),
    require('../../assets/galleries/kopaonik/4.png'),
  ],
  Dubrovnik: [
    require('../../assets/galleries/dubrovnik/1.png'),
    require('../../assets/galleries/dubrovnik/2.png'),
    require('../../assets/galleries/dubrovnik/3.png'),
    require('../../assets/galleries/dubrovnik/4.png'),
  ],
  Beograd: [
    require('../../assets/galleries/beograd/1.png'),
    require('../../assets/galleries/beograd/2.png'),
    require('../../assets/galleries/beograd/3.png'),
    require('../../assets/galleries/beograd/4.png'),
  ],
  Santorini: [
    require('../../assets/galleries/santorini/1.png'),
    require('../../assets/galleries/santorini/2.png'),
    require('../../assets/galleries/santorini/3.png'),
    require('../../assets/galleries/santorini/4.png'),
  ],
  Prag: [
    require('../../assets/galleries/prag/1.png'),
    require('../../assets/galleries/prag/2.png'),
    require('../../assets/galleries/prag/3.png'),
    require('../../assets/galleries/prag/4.png'),
  ],
  Zermatt: [
    require('../../assets/galleries/zermatt/1.png'),
    require('../../assets/galleries/zermatt/2.png'),
    require('../../assets/galleries/zermatt/3.png'),
    require('../../assets/galleries/zermatt/4.png'),
  ],
  Barcelona: [
    require('../../assets/galleries/barcelona/1.jpg'),
    require('../../assets/galleries/barcelona/2.png'),
    require('../../assets/galleries/barcelona/3.png'),
    require('../../assets/galleries/barcelona/4.png'),
  ],
  Budva: [
    require('../../assets/galleries/budva/1.png'),
    require('../../assets/galleries/budva/2.png'),
    require('../../assets/galleries/budva/3.png'),
    require('../../assets/galleries/budva/4.png'),
  ],
};

export function getDestinationGallery(destination) {
  return GALLERIES[destination?.naziv] || [];
}
