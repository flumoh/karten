class MapData {
    constructor(name, width, height) {
        this.name = name;
        this.width = width;
        this.height = height;
    }
}




function scrollElement(elmnt, offsetLeft, offsetTop) {
    elmnt.parentElement.scrollLeft = Math.round(offsetLeft);
    elmnt.parentElement.scrollTop = Math.round(offsetTop);

}

function zoomTo(elmnt, coordX, coordY, zoomFactor, map_dim){
        
    elmnt.style.width = `${Math.round(zoomFactor * map_dim.width)}px`;
    elmnt.style.height = `${Math.round(zoomFactor * map_dim.height)}px`;
    scrollElement(elmnt, Math.round(coordX*elmnt.clientWidth - window.clientWidth/2), Math.round(coordY*elmnt.clientHeight - window.clientY/2));
    return zoomFactor;
}





function loadMap(elmnt, map_id) {
    elmnt.id = map_id;
    return new MapData(map_id, elmnt.clientWidth, elmnt.clientHeight);
    /*Object.assign(elmnt.style, {
            position: "absolute",
            positionTop: "0",
            positionLeft: "0",
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundImage: 'url("src\\Swordcoast faded.jpg")'
        }
    );*/
}

   

window.onload = () => {
    window.localStorage.removeItem("map");
    const map = document.getElementsByClassName("map")[0];
    const map_data = loadMap(map, "swordcoastmap");
    //map.innerHTML = `${map_dim[0]} ${map_dim[1]}`
    var scale = zoomTo(map, 0.5, 0.5, 0.2, map_data);
    map.onmousedown = (e) => {
        e = e || window.event;
        e.preventDefault();

        //Ändere Mausaussehen passend zum Event
        map.style.cursor = "grabbing";
        // get the mouse cursor position at startup:

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
            // calculate the new cursor position:
            // set the element's new position:
            scrollElement(map, map.parentElement.scrollLeft - e.movementX, map.parentElement.scrollTop - e.movementY);
        };
    };
    window.onwheel = (e) => {
        e = e || window.event;
        e.preventDefault();
        
        // Ändere Mausaussehen
        map.style.cursor = (e.deltaY > 0) ? "zoom-out": (e.deltaY == 0) ? "grab": "zoom-in";
        
        scale += e.deltaY * -0.01;
        var posX = (e.clientX + map.parentElement.scrollLeft)/map.clientWidth ;
        var posY = (e.clientY + map.parentElement.scrollTop)/map.clientHeight;

        if (scale*map_data.width > window.innerWidth && scale <= 1) {
            map.style.width = `${Math.round(scale * map_data.width)}px`;
            map.style.height = `${Math.round(scale * map_data.height)}px`;
            scrollElement(map, posX*map.clientWidth - e.clientX, posY*map.clientHeight - e.clientY);
        } else {
            scale -= e.deltaY * -0.01;
            map.parentElement.scrollTop -= e.deltaY;
        }
        //scale = scaleTo(map, scale, e.deltaY, e.clientX, e.clientY);
    };
    //dragElement(map); 
    //zoomElement(map);
    
};
