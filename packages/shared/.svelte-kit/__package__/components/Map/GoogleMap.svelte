<script lang="ts">
import * as Gm from "@googlemaps/js-api-loader";
import { lightStyle } from "./google-map-style.js";

type Props = {
	apiKey: string;
	from: { lat: number; lng: number };
	to: { lat: number; lng: number };
};

let { apiKey, from, to }: Props = $props();

let container = $state<HTMLElement>();
let map = $state<google.maps.Map>();
let directionsRenderer = $state<google.maps.DirectionsRenderer>();
let show = $state<boolean>(false);

// Module-level flag to ensure setOptions is only called once globally
let googleMapsConfigured = false;

// Initialize Google Maps API configuration (only once)
$effect(() => {
	if (!apiKey || googleMapsConfigured) return;

	Gm.setOptions({
		key: apiKey,
		libraries: ["places"],
		language: "cs",
	});

	googleMapsConfigured = true;
});

// Initialize and update map when dependencies change
$effect(() => {
	if (!googleMapsConfigured || !container || !from || !to) return;

	let mounted = true;
	let showTimeout: number | undefined;

	const initMap = async () => {
		try {
			const { Map: GoogleMap } = (await Gm.importLibrary("maps")) as google.maps.MapsLibrary;

			if (!mounted || !container) return;

			// Create map instance
			const mapInstance = new GoogleMap(container, {
				zoom: 14,
				center: { lat: from.lat, lng: from.lng },
				disableDefaultUI: true,
				zoomControl: false,
				scaleControl: false,
				scrollwheel: false,
				draggable: false,
				disableDoubleClickZoom: true,
				styles: lightStyle,
			});

			if (!mounted) return;

			// Create directions service and renderer
			const directionsService = new google.maps.DirectionsService();
			const renderer = new google.maps.DirectionsRenderer({
				polylineOptions: {
					strokeColor: "#00bdff",
					strokeWeight: 3,
				},
				suppressMarkers: false,
			});

			renderer.setMap(mapInstance);

			// Calculate and display route
			const origin = new google.maps.LatLng(from.lat, from.lng);
			const destination = new google.maps.LatLng(to.lat, to.lng);

			directionsService.route(
				{
					origin,
					destination,
					travelMode: google.maps.TravelMode.DRIVING,
				},
				(response, status) => {
					if (!mounted) return;

					if (status === google.maps.DirectionsStatus.OK && response) {
						renderer.setDirections(response);

						// Show map after route is rendered
						showTimeout = setTimeout(() => {
							if (mounted) {
								show = true;
							}
						}, 500) as unknown as number;
					} else {
						console.error(`Directions request failed: ${status}`);
					}
				},
			);

			map = mapInstance;
			directionsRenderer = renderer;
		} catch (error) {
			console.error("Failed to initialize map:", error);
		}
	};

	initMap();

	// Cleanup function
	return () => {
		mounted = false;

		if (showTimeout !== undefined) {
			clearTimeout(showTimeout);
		}

		if (directionsRenderer) {
			directionsRenderer.setMap(null);
		}

		// Clear map instance
		map = undefined;
		directionsRenderer = undefined;
		show = false;
	};
});
</script>

<div class="px-10 py-5">
  <div class="map-wrapper rounded-base bg-two overflow-hidden">
    <div
      class="map min-h-full w-full"
      class:opacity-0={!show}
      bind:this={container}
    ></div>
  </div>
</div>

<style>
  .map-wrapper {
    flex: 1 0 40%;
  }
  .map {
    height: 100%;
    min-height: 500px;
  }
</style>
