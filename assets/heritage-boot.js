(function () {
  var PAGE_BOOT = {
    "mission": [
      {
        "id": "iron-forge",
        "image": "/images/heritage/EclecticLight.jpg",
        "color": "#301f13"
      }
    ],
    "home": [
      {
        "id": "iron-forge",
        "image": "/images/heritage/EclecticLight.jpg",
        "color": "#301f13",
        "placement": "top-left",
        "text": "Through the 1770s in the Midlands, a circle of manufacturers, physicians, and engineers known as the Lunar Society met to discuss steam, chemistry, and the machinery transforming England.\n\nWhat they were building was an attitude: that industrial skill and scientific curiosity belonged in the same venture; the factories and furnaces that followed were to prove their ideas had real-world merit."
      },
      {
        "id": "bernard",
        "image": "/images/heritage/Gathering.jpg",
        "color": "#503d2a",
        "placement": "top-right",
        "text": "Claude Bernard built one of the first laboratories in Europe where medicine was conducted as experiment. He demonstrated that the body maintains a stable internal environment, later named homeostasis, and insisted that a physicians should apply a scientific rigour to their practice.\n\nHe turned physiology into a universal discipline; a generation of researchers followed his methods and went on to create fields that would become industries in their own right."
      },
      {
        "id": "crystal-palace",
        "image": "/images/heritage/GreatExhibition.jpg",
        "color": "#9c9d9f",
        "placement": "top-left",
        "text": "When the Great Exhibition opened in Hyde Park in 1851, six million visitors came to see what European industry could produce. Inventors and manufacturers exhibited beneath Joseph Paxton's Crystal Palace, a building that was itself a demonstration of prefabricated engineering.\n\nThe exhibition was a wager that progress could be displayed, compared, and sold. Steam engines, textile machinery, and precision instruments competed for attention alongside the nations that built them."
      },
      {
        "id": "faraday",
        "image": "/images/heritage/Faradayv2.png",
        "color": "#4b4b4b",
        "placement": "bottom-left",
        "text": "In 1831, in the basement of the Royal Institution, Michael Faraday discovered that an electric current could be driven using only a coil and a magnetic field. Although he had little formal training, the discoveries he made would lead to the development of the modern electrical grid.\n\nFaraday's discoveries unlocked the ability to harness electrical power on an industrial scale, and was a key stepping stone on the path to modern technological society."
      },
      {
        "id": "steel-pour",
        "image": "/images/heritage/SteelWorks.jpg",
        "color": "#666666",
        "placement": "top-left",
        "text": "The Bessemer converter, patented in 1856 in England, made cheap steel possible by blowing air through molten pig iron to burn away impurities. Entrepreneurs who adopted it built steelworks that poured metal from overhead ladles.\n\nThe arrival of cheap and high quality steel reshaped Europe's cities, railways, and shipyards; engineers could dream up and build designs that wrought iron alone could not support. Previously unthinkable infrastructural plans suddenly became feasible."
      },
      {
        "id": "apprentice",
        "image": "/images/heritage/TheApprentice.jpg",
        "color": "#493e30",
        "placement": "center-right",
        "text": "Before the factory system spread, European industry grew through apprenticeship, with masters recruiting students, teaching by demonstration, and correcting by hand. The knowledge that mattered could not be written down easily: when metal was ready, how a joint should feel, how hard to strike.\n\nPost industrialisation, steam and steel still needed men formed over years in the workshop. Precision manufacturing remained reliant on trained skill."
      },
      {
        "id": "brunel",
        "image": "/images/heritage/BrunelNew.jpg",
        "color": "#544436",
        "placement": "top-right",
        "text": "By 1857, Isambard Kingdom Brunel was building the SS Great Eastern at Millwall, a ship five times the tonnage of any vessel then afloat. He had already staked his career on projects that others considered impossible.\n\nFrom the Great Western Railway to the Thames Tunnel and the Clifton Suspension Bridge, Brunel treated each venture as a problem in force, material, and nerve. The engineers who came after him attempted projects of a scale earlier generations would not have considered."
      },
      {
        "id": "apothecary",
        "image": "/images/heritage/europeana__285_gam4192.jpg",
        "color": "#404040",
        "placement": "bottom-right",
        "text": "Before dedicated research institutes, much European science happened in rooms like this: apothecary shops where balances, glassware, and calibrated preparations turned chemical theory into measured practice.\n\nThe pharmacist was part merchant, part experimenter. Knowledge was tested at the bench and sold across the counter."
      }
    ],
    "team": [
      {
        "id": "team",
        "image": "/images/Team2.jpg",
        "color": "#3f3128"
      }
    ],
    "news": [
      {
        "id": "europeana-109-https-hispana-mcu-es-lod-oai-bvpb-",
        "image": "/images/heritage/europeana__109_https___hispana_mcu_es_lod_oai_bvpb_mcu_es_407492_ent0.jpg",
        "color": "#b0aa97"
      }
    ],
    "contact": [
      {
        "id": "europeana-440-item-wkyikxdfaulsy4bunfyeoeeav3ziw",
        "image": "/images/heritage/europeana__440_item_WKYIKXDFAULSY4BUNFYEOEEAV3ZIWC7J.jpg",
        "color": "#74736d"
      },
      {
        "id": "europeana-0940415-nns0zs2",
        "image": "/images/heritage/europeana__0940415__nns0zs2.jpg",
        "color": "#8d826f"
      }
    ]
  };
  var hero = document.getElementById('heritageHero');
  if (!hero || hero.getAttribute('data-mode') !== 'backdrop') return;
  var page = hero.getAttribute('data-carousel') || 'mission';
  var SLIDES = PAGE_BOOT[page] || PAGE_BOOT.mission || [];
  if (!SLIDES.length) return;
  function pickSlide() {
    if (hero.getAttribute('data-static') === 'true') return SLIDES[0];
    return SLIDES[Math.floor(Math.random() * SLIDES.length)];
  }
  var slideA = hero.querySelector('.heritage-hero__slide--a');
  var tint = hero.querySelector('.heritage-hero__tint');
  if (!slideA) return;
  var slide = pickSlide();
  slideA.style.backgroundImage = 'url(' + slide.image + ')';
  slideA.style.transition = 'none';
  slideA.classList.add('is-visible');
  if (tint) {
    tint.style.backgroundColor = slide.color;
    tint.style.setProperty('--heritage-tint', slide.color);
    tint.style.setProperty('--heritage-tint-opacity', '0.12');
  }
  hero.setAttribute('data-booted', slide.id);
})();
