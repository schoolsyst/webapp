import tinycolor from 'tinycolor2'

export const lightColor = baseColor => {
  /* see https://codepen.io/ewen-lbh/pen/dyYKWVL */
  const { h, s } = tinycolor(baseColor).toHsl()
  return tinycolor({ h, s: 2 * s, l: 0.9 }).toHslString()
}
export const darkColor = baseColor => {
  /* see https://codepen.io/ewen-lbh/pen/dyYKWVL */
  const { h, s } = tinycolor(baseColor).toHsl()
  return tinycolor({ h, s: 0.25 * s, l: 0.4 }).toHslString()
}
