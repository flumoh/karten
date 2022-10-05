

class TransformMap {
    constructor(element, originX = 0.0, originY = 0.0, translateX = 0.0, translateY = 0.0, scale = 1.0) {
        this.element = element, this.originX = originX, this.originY = originY, this.translateX = translateX, this.translateY = translateY, this.scale = scale;
        this.apply();
    }

    
    apply(scale = this.scale, translateX = this.translateX, translateY = this.translateY) {
        this.element.style.transform = `matrix(${scale}, 0, 0, ${scale}, ${translateX}, ${translateY})`;
    }

    applyOrigin(originX = this.originX, originY = this.originY) {
        this.element.style.transformOrigin = `${originX}px ${originY}px`;
    }

    move(movementX, movementY) {
        this.translateX += movementX, this.translateY += movementY;
        this.apply();
    }
    
    verschiebung(coord, origin, scale) {
        return (coord - origin) * (1 - scale) / scale;
    }

    changeOrigin(clientX, clientY) {
        this.translateX -= this.verschiebung(clientX - this.translateX, this.originX, this.scale), this.translateY -= this.verschiebung(clientY - this.translateY, this.originY, this.scale);

        
        this.element.style.transform = `matrix(${1}, 0, 0, ${1}, ${this.translateX}, ${this.translateY})`;

        this.originX = clientX - this.translateX, this.originY = clientY - this.translateY;

        this.applyOrigin();
        this.apply();
    }

    boundScale(scale = this.scale) {
        return Math.max(Math.min(1, scale), (window.innerWidth/this.element.clientWidth));
    }

    zoom(scale) {
        this.scale = scale;
        this.apply();
    }

    zoomTo(coordX, coordY, scale, windowX, windowY) {
        this.originX = coordX, this.originY = coordY;
        this.applyOrigin();
        this.translateX =  windowX/2 - coordX; this.translateY = windowY/2 - coordY;
        this.scale = scale;
        this.apply();
    }

}

window.onload = () => {

    var map = document.getElementsByClassName("map")[0];

    addMapListener(map);
};

function addMapListener(map) {
    var transformMap = new TransformMap(map);
    transformMap.zoomTo(4606, 2452, 0.7, window.innerWidth, window.innerHeight)

    map.onmousedown = (e) => {
        e = e || window.event;
        e.preventDefault();
        
        //Ändere Mausaussehen passend zum Event
        map.style.cursor = "grabbing";

        document.onmouseup = () => {
            // stop moving when mouse button is released:
            document.onmouseup = null;
            document.onmousemove = null;

            //Maus wird wieder zurückgesetzt
            map.style.cursor = "grab";
        };

        document.onmousemove = (e) => {
            e = e || window.event;
            e.preventDefault();
            // Move map in direction of the mouse
            transformMap.move(e.movementX, e.movementY);
        };
    };

    
    map.onwheel = (e) => {
        e = e || window.event;
        e.preventDefault();

        // Ändere Mausaussehen
        //map.style.cursor = (e.deltaY > 0) ? "zoom-out": (e.deltaY == 0) ? "grab": "zoom-in";
        
        transformMap.changeOrigin(e.clientX, e.clientY);
                
        transformMap.zoom(Math.max(Math.min(1, transformMap.scale - e.deltaY * 0.01), (window.innerWidth/map.clientWidth)));
    };
   
}
