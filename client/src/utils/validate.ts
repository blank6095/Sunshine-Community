export const isPhone = (val: string) => /^1[3-9]\d{9}$/.test(val)
export const isIdCard = (val: string) => /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(val)
