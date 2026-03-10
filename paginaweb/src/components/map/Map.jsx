import React, { useEffect, useRef, useState }  from "react";
import { MapContainer, TileLayer, Marker, Popup, GeoJSON} from "react-leaflet";
import 'leaflet/dist/leaflet.css'
const Map = () => {

    const [geodata,setGeoData] = useState(null); 
    const mapRef = useRef(); 
    const position = [20.73822228680415, -103.4472214186193]; 

    useEffect(() => {
        fetch("/data/guadalajara_sublocs.geojson")
        .then((res) =>res.json())
        .then((data) => setGeoData(data)) 
        .catch((err) => console.error("Failed to load GeoJSON", err))
    })

    return(
        <>
        <div style={{height:"600px"}}>
            <h4>Sublocations</h4>     
            <MapContainer 
            center={position} 
            zoom={13} 
            scrollWheelZoom={true}
            ref={mapRef}
            style={{height:"100%", width: "100%"}}
            
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {geodata && <GeoJSON data={geodata}/> }
            </MapContainer>
        </div>
        </>
    )
}

export default Map 