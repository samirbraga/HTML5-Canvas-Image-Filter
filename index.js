window.loadFilterScript = function (workerBlob) {
    const bar = document.getElementById('js-progressbar');
    const inputFile = document.querySelector('.js-upload input');
    const canvas = document.querySelector('canvas');
    const blurBtn = document.querySelector('#blur-btn');
    const flattenBtn = document.querySelector('#flatten-btn');
    const edgeBtn = document.querySelector('#edge-btn');
    const embossingBtn = document.querySelector('#embossing-btn');
    const spinner = document.querySelector('.canvas-loading-overlay');
    const worker = new Worker(workerBlob);
    
    class ImageFilter {
        constructor(canvas) {
            this.canvas = canvas;
            this.ctx = this.canvas.getContext('2d');
        }
    
        setImage(image) {
            this.image = image;
            return this;
        }
    
        draw() {
            const maxSize = 1300;
            const size = Math.max(this.image.width, this.image.height);
            const resizeFactor = maxSize / size < 1 ? maxSize / size : 1;
            const imgWidth = parseInt(resizeFactor * this.image.width);
            const imgHeight = parseInt(resizeFactor * this.image.height);

            this.canvas.width = imgWidth;
            this.canvas.height = imgHeight;
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.drawImage(this.image, 0, 0, imgWidth, imgHeight);
            this.imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
            return this;
        }
    
        setImageData() {
            this.ctx.putImageData(this.imageData, 0, 0);
        }
    
        filter(kernel, n, startCallback, endCallback) {
            const salt = Math.round(Math.random() * 1000);
            this.event = `data-${salt}`;
    
            startCallback && startCallback();
            
            worker.postMessage([
                this.event,
                this.imageData,
                kernel,
                n,
                [0, 0],
                [this.imageData.width, this.imageData.height]
            ]);

            worker.addEventListener('message', e => this.onMessage(e, endCallback));
        }
    
        onMessage(e, endCallback) {
            const [message, imageData, startPixel, endPixel] = e.data;
            if (message === this.event) {
                this.imageData = imageData;   
                this.setImageData();
                endCallback && endCallback();
            }
        }
    
        blur(startCallback, endCallback) {
            this.filter([
                [1, 2, 1],
                [2, 4, 2],
                [1, 2, 1]
            ], 16, startCallback, endCallback);
        }
    
        flatten(startCallback, endCallback) {
            this.filter([
                [0, -1, 0],
                [-1, 5, -1],
                [0, -1, 0]
            ], 1, startCallback, endCallback);
        }
    
        edge(startCallback, endCallback) {
            this.filter([
                [0, 1, 0],
                [-1, 0, 1],
                [0, -1, 0]
            ], 1, startCallback, endCallback);
        }
    
        embossing(startCallback, endCallback) {
            this.filter([
                [1, 1, 0],
                [1, 0, -1],
                [0, -1, -1]
            ], 1, startCallback, endCallback);
        }
    }

    function startFilterLoading() {
        spinner.classList.add('loading');
    }

    function endFilterLoading() {
        spinner.classList.remove('loading');
    }

    const filter = new ImageFilter(canvas);
    inputFile.addEventListener('change', e => {
        if (inputFile.files[0]) {
            const file = inputFile.files[0];
            const fileReader = new FileReader();
            const image = new Image();
    
            image.addEventListener("load", () => {
                filter.setImage(image).draw();
            });
    
            fileReader.addEventListener("load", () => {
                image.src = fileReader.result;
            }, false);
    
            fileReader.readAsDataURL(file);
    
            blurBtn.addEventListener("click", () => filter.blur(startFilterLoading, endFilterLoading));
            flattenBtn.addEventListener("click", () => filter.flatten(startFilterLoading, endFilterLoading));
            edgeBtn.addEventListener("click", () => filter.edge(startFilterLoading, endFilterLoading));
            embossingBtn.addEventListener("click", () => filter.embossing(startFilterLoading, endFilterLoading));
            
            inputFile.value = '';
        }
    });
}
