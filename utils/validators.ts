export const isHexColor = (value: string): boolean => /^#([0-9a-fA-F]{3}){1,2}$/.test(value)
export const isURL = (value: string): boolean => /^(ftp|https?):\/\/([\w\d\-]+\.)+\w{2,}(\/.+)?$/.test(value)
