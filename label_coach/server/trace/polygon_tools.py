import potrace
from cairosvg import svg2png
import imageio

def stroke2img():
    pass


def svg2img():
    svg_code = """
        <svg xmlns="http://www.w3.org/2000/svg" width="1625" height="814">
            <g transform="translate(19.48441247002388,178.6258652637545) scale(1586.0311750599524) rotate(0)">
            <path stroke="#37946e" stroke-alignment="inner" fill="none" id="MAIN_0" stroke-width="0.03" stroke-linecap="round" opacity="1" mask="url(#eraser_2)" d="M0.5852174165288777,0.07800307487018826C0.5942457382105804,0.07630222686353572,0.604320289308541,0.07315967085351822,0.6291822585791779,0.06936443013372785C0.6540442278498148,0.06556918941393748,0.7006294781423144,0.05889536738897108,0.7343892321526992,0.05523163055144606C0.7681489861630841,0.05156789371392104,0.8040002320656746,0.049213394057184855,0.8317407826414875,0.04738200910857773C0.8594813332173005,0.04555062415997061,0.888008973206084,0.0450284763921523,0.9008325356075769,0.044243320859803315"></path>
            </g>
            </svg>
    """

    svg2png(bytestring=svg_code, write_to='output.png')
    im = imageio.imread('output.png')
    bmp = potrace.Bitmap(im)
    path = bmp.trace()
    return path



