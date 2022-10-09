

class TransformMap {
    constructor(element) {
        this.element = element;
        if (element.style.transform == '') {
            this.originX = element.clientWidth/2, this.originY = element.clientHeight/2;

            this.translateX = (window.innerWidth - element.clientWidth)/2, this.translateY = (window.innerHeight - element.clientHeight)/2, this.scale = 1.0;
        }
        else {
            var x = this.element.style.transform.match(/-*\d+(.\d+)*/g); 
            this.scale = new Number(x[0]), this.translateX = new Number(x[4]), this.translateY = new Number(x[5]);
            x = this.element.style.transformOrigin.match(/-*\d+(.\d+)*/g); 
            this.originX = new Number(x[0]), this.originY = new Number(x[1]);
        }
        this.applyOrigin();
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

    zoomTo(coordX, coordY, scale) {
        this.originX = coordX, this.originY = coordY;
        this.applyOrigin();
        this.translateX =  window.innerWidth/2 - coordX; this.translateY = window.innerHeight/2 - coordY;
        this.scale = scale;
        this.apply();
    }

}

window.onload = () => {
    var map = document.getElementsByClassName("map")[0];
    addMapListener(map);

};

function moveParentMap(e) {
    e = e || window.event;
    e.preventDefault();

}

function info(e) {
    document.getElementById(e).innerHTML = `<div class="card-body">Clicked on ${e}</div>`;
}

function moveMap(e) {
    e = e || window.event;
    e.preventDefault();
    var target = document.getElementsByClassName("map")[0];
    //Ändere Mausaussehen passend zum Event
    target.style.cursor = "grabbing";

    document.onmouseup = () => {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;

        //Maus wird wieder zurückgesetzt
        target.style.cursor = "crosshair";
    };

    document.onmousemove = (e) => {
        e = e || window.event;
        e.preventDefault();
        // Move map in direction of the mouse
        if (e.clientY > 0 && e.clientX > 0 && (e.clientX < window.innerWidth && e.clientY < window.innerHeight)) {
            new TransformMap(target).move(e.movementX, e.movementY);
        } 
        /*else {
            document.onmousemove = null;
            document.onmouseup = null;
        }*/
    };
}

function zoomMap(e) {
    e = e || window.event;
    e.preventDefault();
    var target = document.getElementsByClassName("map")[0];
    // Ändere Mausaussehen
    //e.target.style.cursor = (e.deltaY > 0) ? "zoom-out": (e.deltaY == 0) ? "grab": "zoom-in";

    // Get previous variables of target
    var transformMap = new TransformMap(target);
    // Fokus zoom on Mouse
    transformMap.changeOrigin(e.clientX, e.clientY);
    // Zoom Element
    transformMap.zoom(Math.max(Math.min(1, transformMap.scale - e.deltaY * 0.01), (window.innerWidth/target.clientWidth)));
}

function addMapListener(map) {
    var transformMap = new TransformMap(map);
    transformMap.zoomTo(map.clientWidth/2, map.clientHeight/2, 0.7);
    

    map.onmousemove = (e) => {
        transformMap = new TransformMap(map);
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
            document.getElementById("card-info").innerHTML = this.responseText;
            }
        };
        xhttp.open("GET", "map.xml", true);
        xhttp.send();
        //document.getElementById("card-info").innerHTML = ``;
    }

    /*map.onmousedown = (e) => {
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
    };*/

    
    /*map.onwheel = (e) => {
        e = e || window.event;
        e.preventDefault();

        // Ändere Mausaussehen
        //map.style.cursor = (e.deltaY > 0) ? "zoom-out": (e.deltaY == 0) ? "grab": "zoom-in";
        
        transformMap.changeOrigin(e.clientX, e.clientY);
                
        transformMap.zoom(Math.max(Math.min(1, transformMap.scale - e.deltaY * 0.01), (window.innerWidth/map.clientWidth)));
    };*/
   
}
