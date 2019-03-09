class Color {
    constructor(...color) {
        this.r = color[0];
        this.g = color[1];
        this.b = color[2];
    }

    sum(color) {
        this.r += color.r;
        this.g += color.g;
        this.b += color.b;
        return this;
    }

    times(factor) {
        this.r *= factor;
        this.g *= factor;
        this.b *= factor;
        return this;
    }
}

class DataImage {
    constructor(imageData, width) {
        if (imageData instanceof ImageData) {
            this.imageData = imageData;
            this.height = imageData.height;
        } else {
            this.data = imageData;
        }
        this.width = width;
    }

    getPixelColor(i, j) {
        if (i < 0 || j < 0) {
            return new Color(255, 255, 255);
        } else if (i >= this.width || j >= this.height) {
            return new Color(255, 255, 255);
        }

        return new Color(
            this.data[j * 4 * this.width + i * 4],
            this.data[j * 4 * this.width + i * 4 + 1],
            this.data[j * 4 * this.width + i * 4 + 2]
        );;
    }

    setPixelColor(i, j, color) {
        this.imageData.data[j * 4 * this.width + i * 4] = color.r;
        this.imageData.data[j * 4 * this.width + i * 4 + 1] = color.g;
        this.imageData.data[j * 4 * this.width + i * 4 + 2] = color.b;
        return this;
    }
}