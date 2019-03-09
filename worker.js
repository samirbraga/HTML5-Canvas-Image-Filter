self.onmessage = function (e) {
    let [event, imageData, kernel, n, startPixel, endPixel] = e.data;
    let [xStart, yStart] = startPixel;
    let [xEnd, yEnd] = endPixel;
    const oldImageData = new DataImage(Array.from(imageData.data), imageData.width);
    const newImageData = new DataImage(imageData, imageData.width);
    for (let i = xStart; i <= xEnd; i++) {
        for (let j = yStart; j <= yEnd; j++) {
            const newColor = oldImageData.getPixelColor(i, j)
                .times(kernel[1][1])
                .sum(oldImageData.getPixelColor(i - 1, j - 1).times(kernel[0][0]))
                .sum(oldImageData.getPixelColor(i + 1, j - 1).times(kernel[2][0]))
                .sum(oldImageData.getPixelColor(i + 1, j + 1).times(kernel[2][2]))
                .sum(oldImageData.getPixelColor(i - 1, j + 1).times(kernel[0][2]))
                .sum(oldImageData.getPixelColor(i - 1, j).times(kernel[0][1]))
                .sum(oldImageData.getPixelColor(i + 1, j).times(kernel[2][1]))
                .sum(oldImageData.getPixelColor(i, j - 1).times(kernel[1][0]))
                .sum(oldImageData.getPixelColor(i, j + 1).times(kernel[1][2]))
                .times(1 / n);
            newImageData.setPixelColor(i, j, newColor);
        }
    }

    self.postMessage([event, newImageData.imageData, startPixel, endPixel]);
}