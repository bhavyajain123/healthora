const API_URL =
    "http://localhost:5000/api/podcasts";


const params =
    new URLSearchParams(
        window.location.search
    );


const selectedId =
    params.get("id");


const selectedTitle =
    params.get("title");


const image =
    document.getElementById(
        "podcast-image"
    );


const category =
    document.getElementById(
        "podcast-category"
    );


const title =
    document.getElementById(
        "podcast-title"
    );


const host =
    document.getElementById(
        "podcast-host"
    );


const duration =
    document.getElementById(
        "podcast-duration"
    );


const content =
    document.getElementById(
        "podcast-content"
    );


const playButton =
    document.getElementById(
        "podcast-play"
    );


const podcastVideo =
    document.getElementById(
        "podcast-video"
    );


// =========================
// VIDEO FILES
// =========================

const videoFiles = {

    fitness:
        "fitness.mp4",

    meditation:
        "meditation.mp4",

    mental:
        "mental_health.mp4",

    mental_health:
        "mental_health.mp4",

    nutrition:
        "nutrition.mp4",

    workout:
        "workout.mp4",

    yoga:
        "yoga.mp4"

};


// =========================
// FIND VIDEO
// =========================

function getVideoFile(podcast) {

    const title =
        podcast.title
            .trim()
            .toLowerCase();


    // =========================
    // EXACT PODCAST MAPPING
    // =========================

    if (title === "the wellness way") {
        return "nutrition.mp4";
    }

    if (title === "healthy lifestyle") {
        return "fitness.mp4";
    }

    if (title === "mindful living") {
        return "meditation.mp4";
    }

    if (title === "the science of a healthy mindset") {
        return "mental_health.mp4";
    }


    // =========================
    // OTHER PODCASTS
    // =========================

    if (title.includes("fitness")) {
        return "fitness.mp4";
    }

    if (title.includes("meditation")) {
        return "meditation.mp4";
    }

    if (title.includes("mental")) {
        return "mental_health.mp4";
    }

    if (title.includes("nutrition")) {
        return "nutrition.mp4";
    }

    if (title.includes("workout")) {
        return "workout.mp4";
    }

    if (title.includes("yoga")) {
        return "yoga.mp4";
    }


    return null;
}


// =========================
// LOAD PODCAST
// =========================

async function loadPodcast() {

    try {

        console.log(
            "Loading podcast from backend..."
        );


        const response =
            await fetch(API_URL);


        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status}`
            );

        }


        const result =
            await response.json();


        const podcasts =
            result.data || [];


        let podcast = null;


        // =========================
        // SEARCH BY MONGODB ID
        // =========================

        if (selectedId) {

            podcast =
                podcasts.find(
                    item =>
                        item._id ===
                        selectedId
                );

        }


        // =========================
        // SEARCH BY TITLE
        // =========================

        if (
            !podcast &&
            selectedTitle
        ) {

            podcast =
                podcasts.find(
                    item =>
                        item.title
                            .trim()
                            .toLowerCase() ===
                        selectedTitle
                            .trim()
                            .toLowerCase()
                );

        }


        // =========================
        // PODCAST NOT FOUND
        // =========================

        if (!podcast) {

            title.textContent =
                "Podcast Not Found";

            content.textContent =
                "Sorry, this podcast could not be found.";

            return;

        }


        // =========================
        // DISPLAY DATA
        // =========================

        image.src =
            podcast.thumbnail || "";

        image.alt =
            podcast.title;


        category.textContent =
            (
                podcast.category ||
                "General"
            ).toUpperCase();


        title.textContent =
            podcast.title;


        host.textContent =
            `By ${
                podcast.host ||
                "Healthora Team"
            }`;


        duration.textContent =
            podcast.duration ||
            "00:00";


        content.textContent =
            podcast.description || "";


        // =========================
        // FIND VIDEO
        // =========================

        const videoFile =
            getVideoFile(podcast);


        console.log(
            "Podcast:",
            podcast.title
        );


        console.log(
            "Video:",
            videoFile
        );


        // =========================
        // PLAY PODCAST
        // =========================

        if (playButton) {

            playButton.onclick =
                function () {

                    if (!videoFile) {

                        alert(
                            "Video for this podcast is not available."
                        );

                        return;

                    }


                    podcastVideo.src =
                        `http://localhost:5000/videos/${videoFile}`;


                    podcastVideo.style.display =
                        "block";


                    podcastVideo.load();


                    podcastVideo.play();


                    playButton.textContent =
                        "▶ Playing Podcast";

                };

        }


        console.log(
            "✅ Podcast loaded:",
            podcast.title
        );

    }

    catch (error) {

        console.error(
            "❌ Podcast API Error:",
            error
        );


        title.textContent =
            "Unable to Load Podcast";


        content.textContent =
            "Unable to connect to the backend.";

    }

}


loadPodcast();