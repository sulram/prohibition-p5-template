export function calculateFeatures(tokenData, withParams) {

  // ┏━━━━━━━━━━━━━━┓
  // ┃ RANDOM FUNC  ┃
  // ┗━━━━━━━━━━━━━━┛

  let alphabet = "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ";
  let b58dec = (str) => [...str].reduce((p, c) => (p * alphabet.length + alphabet.indexOf(c)) | 0, 0);
  let trunc = tokenData.hash.slice(2);
  let regex = new RegExp(".{" + ((tokenData.hash.length / 4) | 0) + "}", "g");
  let hashes = trunc.match(regex).map((h) => b58dec(h));
  let sfc32 = (a, b, c, d) => {
    return () => {
      a |= 0;
      b |= 0;
      c |= 0;
      d |= 0;
      var t = (((a + b) | 0) + d) | 0;
      d = (d + 1) | 0;
      a = b ^ (b >>> 9);
      b = (c + (c << 3)) | 0;
      c = (c << 21) | (c >>> 11);
      c = (c + t) | 0;
      return (t >>> 0) / 4294967296;
    };
  };
  const FXRAND = sfc32(...hashes);

  const rndIndex = (arr) => Math.floor(arr.length * FXRAND());
  const rndItem = (arr) => arr[rndIndex(arr)];
  const rndFloat = (range) =>
    Number((FXRAND() * 2 * range - 1 * range).toFixed(3));
  const randomRange = (start, end) => Number((FXRAND() * (end-start) + start).toFixed(3));
  const rndPositive = (range, offset = 0) => Number((FXRAND() * range + offset).toFixed(3));
  const repeat = (num, val) => Array(num).fill(val)

  const capitalize = (string) => {
    return string
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
  }

  // ┏━━━━━━━━━━━━━━┓
  // ┃ PALETTES     ┃
  // ┗━━━━━━━━━━━━━━┛

  const COLOR_PALLETES = {
    "black_white": [
      [0, 0, 0],
      [1, 1, 1],
    ],
    "black_red": [
      [0, 0.000, 0.000], // background
      [1, 0.141, 0.141], // line
    ],
    "black_blue": [
      [0,0,0],
      [0.09, 0.259, 1],
    ],
  };

  const COLOR_NAMES = {
    "black_red": "Shades of Red",
    "black_blue": "Shades of Blue",
    "black_white": "Mono",
  }

// ┏━━━━━━━━━━━━━━┓
// ┃ COLOR PROB.  ┃
// ┗━━━━━━━━━━━━━━┛

const NORMAL_COLOR = [
 ...repeat(1, "black_red"), // Crimison 
 ...repeat(1, "black_blue"), // Azure
 ...repeat(1, "black_white"), // Ivory
];


  // check arrays
  // console.log(INVERTED_COLOR, NORMAL_COLOR)

  const palette = rndItem(NORMAL_COLOR)
  const paletteType = "normal"
  const paletteName = COLOR_NAMES[palette] || palette

  // ┏━━━━━━━━━━━━━━┓
  // ┃ SCALE        ┃
  // ┗━━━━━━━━━━━━━━┛

  const scaleArray = [
    ...repeat(40, "low"),
    ...repeat(25, "medium"),
    ...repeat(25, "high"),
  ]
  const scaleType = rndItem(scaleArray)

  let scale

  switch (scaleType) {
    case "low":
      scale = {x: randomRange(0.2, 0.4), y: rndPositive(0.2, 0.4)}
      break;
    case "medium":
        scale = {x: randomRange(0.4, 0.9), y: rndPositive(0.4, 0.9)}
        break;
    case "high":
      scale = {x: randomRange(1.0, 1.6), y: rndPositive(1.0, 1.6)}
      break;
  }

  // ┏━━━━━━━━━━━━━━┓
  // ┃ LINE DENSITY ┃
  // ┗━━━━━━━━━━━━━━┛


  const LINE_RULES = {
    perspective: ["high-density"],
    high: [
      ...repeat(50, "high-density"),
      ...repeat(50, "medium-density"),
    ],
    medium: [
      ...repeat(50, "high-density"),
      ...repeat(40, "medium-density"),
      ...repeat(10, "low-density"),
    ],
    low: ["high-density"]
  }

  const lineArray = LINE_RULES[scaleType]
  const lineType = rndItem(lineArray)

  let lines_density

  switch (lineType) {
    case "high-density":
      lines_density = randomRange(80,140)
    break;
    case "medium-density":
      lines_density = randomRange(40,80)
    break;
    case "low-density":
      lines_density = randomRange(20,40)
    break;
  }

  // ┏━━━━━━━━━━━━━━┓
  // ┃ OTHER        ┃
  // ┗━━━━━━━━━━━━━━┛

  
  const octaves = 8
  const offset = {x: rndFloat(2560), y: rndFloat(2560)};

  // ┏━━━━━━━━━━━━━━┓
  // ┃ SEND PARAMS  ┃
  // ┗━━━━━━━━━━━━━━┛

  const PARAMS = {
    offset,
    palette,
    paletteName,
    paletteType,
    scaleType,
    scale,
    lineType,
    lines_density,
    octaves,
  }

  // ┏━━━━━━━━━━━━━━┓
  // ┃ FEATURES     ┃
  // ┗━━━━━━━━━━━━━━┛

  return {
    "Palette": paletteName,
    "Scale": capitalize(scaleType),
    "Line Density": capitalize(lineType.split('-density')[0]),
    ...(withParams ? {PARAMS, PALETTE: COLOR_PALLETES[palette], FXRAND}: {})
  }
}