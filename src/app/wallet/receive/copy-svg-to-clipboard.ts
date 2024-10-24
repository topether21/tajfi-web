export const copySVGToClipboard = async (svgElement: SVGElement | null | undefined) => {
  if (svgElement) {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    const svgData = new XMLSerializer().serializeToString(svgElement)
    const img = new Image()
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(svgBlob)

    img.onload = async () => {
      canvas.width = img.width
      canvas.height = img.height
      context?.drawImage(img, 0, 0)
      URL.revokeObjectURL(url)

      canvas.toBlob(async (blob) => {
        if (blob) {
          try {
            await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
          } catch (error) {
            console.error('Failed to copy QR Code image:', error)
          }
        }
      }, 'image/png')
    }
    img.src = url
  }
}
