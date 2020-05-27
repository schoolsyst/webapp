export const removeByProp = (
  arrayOfObjects: Record<string, any>[],
  propName: string,
  propValue: any
) => {
  const arr = [...arrayOfObjects]
  return arr.splice(
    arr.findIndex(obj => obj[propName] === propValue),
    1
  )
}
