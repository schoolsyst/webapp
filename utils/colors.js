import tinycolor from 'tinycolor2'

export const lightColor = baseColor => {
  /* see https://codepen.io/ewen-lbh/pen/dyYKWVL */
  const { h, s } = tinycolor(baseColor).toHsl()
  return tinycolor({ h, s: Math.min(2 * s, 1), l: 0.85 }).toHslString()
}
export const darkColor = baseColor => {
  /* see https://codepen.io/ewen-lbh/pen/dyYKWVL */
  const { h, s } = tinycolor(baseColor).toHsl()
  return tinycolor({ h, s: Math.min(0.25 * s, 1), l: 0.3 }).toHslString()
}

export const blackOrWhite = bgColor =>
  tinycolor(bgColor).isLight() ? 'black' : 'white'
