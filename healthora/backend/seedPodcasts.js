require("dotenv").config();

const connectDB = require("./config/db");
const Podcast = require("./models/Podcast");


async function seedPodcasts() {

    try {

        await connectDB();


        const podcasts = [

            {
                title: "The Science of a Healthy Mindset",

                description:
                    "Explore the connection between everyday habits, mindset and overall well-being with Dr. Anjali Mehta.",

                thumbnail:
                    "src/assets/podcast.png",

                audioUrl:
                    "#",

                    videoUrl:
    "http://localhost:5000/videos/mental_health.mp4",
                    

                category:
                    "Mental Health",

                duration:
                    "32:00",

                host:
                    "Dr. Anjali Mehta",

                episodeNumber:
                    1,

                listens:
                    0,

                published:
                    true
            },


            {
                title: "The Wellness Way",

                description:
                    "A Healthora podcast focused on practical wellness and healthy daily habits.",

                thumbnail:
                    "src/assets/podcast.png",

                audioUrl:
                    "#",

                    videoUrl:
    "http://localhost:5000/videos/fitness.mp4",

                category:
                    "Lifestyle",

                duration:
                    "28 min",

                host:
                    "Dr. Anjali Mehta",

                episodeNumber:
                    2,

                listens:
                    0,

                published:
                    true
            },


            {
                title: "Mindful Living",

                description:
                    "A Healthora podcast about mindfulness and mental well-being.",

                thumbnail:
                    "src/assets/meditation.png",

                audioUrl:
                    "#",

                    videoUrl:
    "http://localhost:5000/videos/mental_health.mp4",

                category:
                    "Mental Health",

                duration:
                    "30 min",

                host:
                    "Emma Wilson",

                episodeNumber:
                    3,

                listens:
                    0,

                published:
                    true
            },


            {
                title: "Nutrition 101",

                description:
                    "A Healthora podcast exploring nutrition and healthy food choices.",

                thumbnail:
                    "src/assets/nutrition.png",

                audioUrl:
                    "#",

                    videoUrl:
    "http://localhost:5000/videos/nutrition.mp4",

                category:
                    "Nutrition",

                duration:
                    "35 min",

                host:
                    "Dr. Priya Sharma",

                episodeNumber:
                    4,

                listens:
                    0,

                published:
                    true
            },


            {
                title: "Fitness Mindset",

                description:
                    "A Healthora podcast focused on fitness, exercise and a healthy mindset.",

                thumbnail:
                    "src/assets/fitness.png",

                audioUrl:
                    "#",

                    videoUrl:
    "http://localhost:5000/videos/fitness.mp4",

                category:
                    "Fitness",

                duration:
                    "24 min",

                host:
                    "Rahul Kapoor",

                episodeNumber:
                    5,

                listens:
                    0,

                published:
                    true
            },


            {
                title: "Yoga Talks",

                description:
                    "A Healthora podcast about yoga, movement and everyday wellness.",

                thumbnail:
                    "src/assets/Yoga.png",

                audioUrl:
                    "#",

                    videoUrl:
    "http://localhost:5000/videos/yoga.mp4",

                category:
                    "General",

                duration:
                    "26 min",

                host:
                    "Meera Joshi",

                episodeNumber:
                    6,

                listens:
                    0,

                published:
                    true
            },


            {
                title: "Healthy Lifestyle",

                description:
                    "A Healthora podcast about building healthy and sustainable lifestyle habits.",

                thumbnail:
                    "src/assets/wellness.png",

                audioUrl:
                    "#",

                    videoUrl:
    "http://localhost:5000/videos/meditation.mp4",

                category:
                    "Lifestyle",

                duration:
                    "31 min",

                host:
                    "Dr. Arjun Singh",

                episodeNumber:
                    7,

                listens:
                    0,

                published:
                    true
            }

        ];


        // Remove old podcast records
        await Podcast.deleteMany({});


        // Insert new podcast records
        await Podcast.insertMany(
            podcasts
        );


        console.log(
            `✅ ${podcasts.length} podcasts inserted into MongoDB`
        );

        console.log(
            "✅ Podcast seeding completed successfully"
        );


        process.exit(0);

    }

    catch (error) {

        console.error(
            "❌ Podcast seeding failed:",
            error
        );

        process.exit(1);

    }

}


seedPodcasts();