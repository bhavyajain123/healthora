const API_URL = "http://localhost:5000/api/articles";


const params = new URLSearchParams(
    window.location.search
);

const title = params.get("title") || "";


const image = document.getElementById(
    "article-image"
);

const category = document.getElementById(
    "article-category"
);

const articleTitle = document.getElementById(
    "article-title"
);

const time = document.getElementById(
    "article-time"
);

const content = document.getElementById(
    "article-content"
);


function normalizeTitle(value) {

    return value
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();

}


async function loadArticle() {

    try {

        console.log("Loading article from backend...");

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(
                `HTTP Error: ${response.status}`
            );
        }

        const result = await response.json();

        console.log(
            "Articles from backend:",
            result
        );


        const articles = result.data || [];


        const article = articles.find(
            (item) =>
                normalizeTitle(item.title) ===
                normalizeTitle(title)
        );


        if (!article) {

            articleTitle.textContent =
                "Article Not Found";

            content.innerHTML = `
                <p>
                    Sorry, this article could not be found.
                </p>
            `;

            return;
        }


        // =========================
        // DISPLAY ARTICLE
        // =========================

        image.src =
            article.image || "";

        image.alt =
            article.title;


        category.textContent =
            article.category || "General";


        articleTitle.textContent =
            article.title;


        time.textContent =
            article.readingTime ||
            "5 min read";


        content.innerHTML =
            article.content || "";


        console.log(
            "✅ Article loaded:",
            article.title
        );

    }

    catch (error) {

        console.error(
            "❌ Backend Article Error:",
            error
        );

        articleTitle.textContent =
            "Unable to Load Article";

        content.innerHTML = `
            <p>
                Unable to connect to the backend.
            </p>
        `;

    }

}


loadArticle();