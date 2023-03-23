import React, { useEffect, useRef } from "react";

import "./Map.css";

export default function Map(props) {
  const mapRef = useRef();

  const { center, zoom } = props;

  useEffect(() => {
    const map = new window.google.maps.Map(mapRef.current, {
      center: center,
      zoom: zoom,
    });

    new window.google.maps.Marker({
      position: props.center,
      map: map,
    });
  }, [center, zoom]);

  return (
    <section
      className={`map ${props.className}`}
      style={props.style}
      ref={mapRef}
    >
      Map
    </section>
  );
}
