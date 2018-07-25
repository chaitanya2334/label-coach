import re
from unicodedata import normalize

import openslide
from openslide import open_slide, ImageSlide
from openslide.deepzoom import DeepZoomGenerator


def slugify(text):
    text = normalize('NFKD', text.lower()).encode('ascii', 'ignore').decode()
    return re.sub('[^a-z0-9]+', '-', text)


def load_slide(slidefile):
    if slidefile is None:
        raise ValueError('No slide file specified')

    slide = open_slide(slidefile)
    slides = {
        "slide": DeepZoomGenerator(slide, tile_size=254, overlap=1, limit_bounds=True)
    }
    associated_images = []
    slide_properties = slide.properties
    for name, image in slide.associated_images.items():
        associated_images.append(name)
        slug = slugify(name)
        slides[slug] = DeepZoomGenerator(ImageSlide(image), tile_size=254, overlap=1, limit_bounds=True)
    try:
        mpp_x = slide.properties[openslide.PROPERTY_NAME_MPP_X]
        mpp_y = slide.properties[openslide.PROPERTY_NAME_MPP_Y]
        slide_mpp = (float(mpp_x) + float(mpp_y)) / 2
    except (KeyError, ValueError):
        slide_mpp = 0

    return slides, associated_images, slide_properties, slide_mpp


if __name__ == '__main__':
    print(load_slide("../web_client/static/images/TCGA-GM-A2DO-01A-01-TSA.7DC927D1-16BB-4AE0-91A6-B73CD8F64C53.svs"))
