require("dotenv").config();

const connectDB = require("./config/db");
const Article = require("./models/Article");


function createSlug(title) {

    return title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

}


function cleanDescription(content) {

    const text = content
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim();

    return text.length > 180
        ? text.substring(0, 180) + "..."
        : text;

}


function normalizeCategory(category) {

    const value =
        (category || "")
            .trim()
            .toLowerCase();

    const categoryMap = {

        "fitness": "Fitness",

        "nutrition": "Nutrition",

        "mental health": "Mental Health",

        "disease prevention":
            "Disease Prevention",

        "lifestyle": "Lifestyle",

        "general": "General"

    };

    return categoryMap[value] || "General";

}


async function seedArticles() {

    try {

        await connectDB();


        // Existing frontend article data
        const { articleData } =
            await import(
                "../Frontend/articleData.js"
            );


        const articles =
            Object.entries(articleData).map(
                ([title, article]) => {

                    return {

                        title: title,

                        slug: createSlug(title),

                        description:
                            cleanDescription(
                                article.content || ""
                            ),

                        content:
                            article.content || "",

                        image:
                            article.image || "",

                        category:
                            normalizeCategory(
                                article.category
                            ),

                        readingTime:
                            article.time ||
                            "5 min read",

                        tags: [],

                        author:
                            "Healthora Team",

                        views: 0,

                        likes: 0,

                        published: true

                    };

                }
            );


        // Remove old seeded articles
        await Article.deleteMany({});


        // Insert articles
        await Article.insertMany(
            articles
        );


        console.log(
            `✅ ${articles.length} articles inserted into MongoDB`
        );


        console.log(
            "✅ Article seeding completed successfully"
        );


        process.exit(0);

    }

    catch (error) {

        console.error(
            "❌ Article seeding failed:",
            error
        );

        process.exit(1);

    }

}


seedArticles();