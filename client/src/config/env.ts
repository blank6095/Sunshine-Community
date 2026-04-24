export const env = {
  isH5: process.env.UNI_PLATFORM === 'h5',
  isMP: process.env.UNI_PLATFORM?.startsWith('mp-') || false,
  isApp: process.env.UNI_PLATFORM === 'app'
}
