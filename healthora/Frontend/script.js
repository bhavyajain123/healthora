
const API_BASE_URL = "https://healthora.onrender.com";
import { auth, db } from "./src/firebase.js";
import { onAuthStateChanged } from "firebase/auth";
onAuthStateChanged(auth, async function(user) {
    if (user) {
        await loadProfileFromMongoDB();
    }
});
import {
    doc,
    getDoc,
    updateDoc,
    arrayUnion,
    arrayRemove
} from "firebase/firestore";

function paintSavedWellnessAvatar(element, avatarData) {
    if (!element || !avatarData) return;

    const validColor = (value, fallback) =>
        typeof value === "string" &&
        /^#[0-9a-f]{6}$/i.test(value)
            ? value
            : fallback;

    const skin = validColor(avatarData.skinTone, "#E9B994");
    const hair = validColor(avatarData.hairColor, "#292522");
    const outfit = validColor(avatarData.outfit, "#9BD9B0");

    element.innerHTML = `
        <div class="healthora-avatar-art"
             style="--avatar-skin:${skin};
                    --avatar-hair:${hair};
                    --avatar-outfit:${outfit};">

            <div class="healthora-avatar-body"></div>

            <div class="healthora-avatar-face">
                <div class="healthora-avatar-hair"></div>

                <span class="healthora-avatar-eye left"></span>
                <span class="healthora-avatar-eye right"></span>

                <span class="healthora-avatar-smile"></span>
            </div>
        </div>
    `;

    element.classList.add("has-wellness-avatar");
}

async function loadSavedWellnessAvatar(user) {
    try {
        let avatarData = null;

        // First try the avatar saved in this browser.
        const localAvatar = localStorage.getItem(
            `healthoraAvatar_${user.uid}`
        );

        if (localAvatar) {
            try {
                avatarData = JSON.parse(localAvatar);
            } catch {
                avatarData = null;
            }
        }

        // If there is no valid local avatar, try Firestore.
        if (!avatarData || !avatarData.skinTone) {
            const avatarDocument = await getDoc(
                doc(db, "users", user.uid)
            );

            if (avatarDocument.exists()) {
                avatarData = avatarDocument.data().avatar || null;
            }
        }

        if (!avatarData) {
            console.info("No saved Healthora avatar found yet.");
            return;
        }

      paintSavedWellnessAvatar(
    document.getElementById("profile-avatar"),
    avatarData
);

    } catch (error) {
        console.error("Could not load Healthora avatar:", error);
    }
}

  const searchInput = document.querySelector(".search-input");

  
  const noResults = document.createElement("div");


noResults.textContent = "No results found";

noResults.style.display = "none";

noResults.style.textAlign = "center";
noResults.style.padding = "30px";

noResults.style.color = "#728080";
noResults.style.fontSize = "14px";




const searchableContent = document.querySelectorAll(

    ".content-card, .trending-item, .podcast-card, .video-card"
    
);




searchInput.addEventListener("input", function() {
  const searchText = searchInput.value

        .toLowerCase()
        .trim();



        
    if (searchText === "") {
        searchableContent.forEach(function(item) {
            item.style.display = "";

        });

        noResults.style.display = "none";


        return;


    }


    let found = false;




    searchableContent.forEach(function(item) {


        const itemText = item.textContent.toLowerCase();


        if (itemText.includes(searchText)) {

            item.style.display = "";
            found = true;

        }  else {

            item.style.display = "none";
        }
        

    });

    
    if (!found) {

    noResults.style.display = "block";

        const activePage = document.querySelector(".page.active");
   if (activePage) {
                activePage.appendChild(noResults);
        }
 
    }else {


          noResults.style.display = "none";

    }


});



let savedItems =
    document.querySelectorAll(".saved-item").length;
   

document.addEventListener("DOMContentLoaded", function() {

    const savedCount =
        Number(
            localStorage.getItem("healthoraSavedCount")
        ) || 0;

    savedItems = savedCount;

    updateSavedCount();

});




function updateSavedCount() {

    const rows = document.querySelectorAll(".stat-row");

    rows.forEach(function(row) {

        const text = row.textContent.trim();

        if (text.includes("Saved Items")) {

            const number = row.querySelector("strong");

            if (number) {
                number.textContent = savedItems;
            }

        }

    });

    // Save current count
    localStorage.setItem(
        "healthoraSavedCount",
        savedItems
    );

}

updateSavedCount();


 

function addToSavedPage(title, image, category, meta) {

    const savedList =
        document.getElementById("saved-content-list");

    if (!savedList) {
        return;
    }

   
onAuthStateChanged(auth, async function(user) {

    if (!user) {
        return;
    }

    try {

        const userRef = doc(
            db,
            "users",
            user.uid
        );

        const userSnapshot =
            await getDoc(userRef);

        if (!userSnapshot.exists()) {
            return;
        }

        const userData =
            userSnapshot.data();

        const savedArticles =
            userData.savedArticles || [];

        savedArticles.forEach(function(article) {

            addToSavedPage(
                article.title,
                article.image,
                article.category,
                article.meta
            );

        });

        console.log(
            "✅ Saved articles loaded from Firestore:",
            savedArticles.length
        );

    } catch (error) {

        console.error(
            "❌ Failed to load saved articles:",
            error
        );

    }

});


document.addEventListener("DOMContentLoaded", function() {

    const savedArticles =
        JSON.parse(
            localStorage.getItem("healthoraSavedArticles")
        ) || [];

    const savedTitles =
        savedArticles.map(function(article) {
            return article.title;
        });

    const allCards =
        document.querySelectorAll(
            ".content-card, .article-horizontal, .podcast-card, .video-card, .trending-item"
        );

    allCards.forEach(function(card) {

        const heading =
            card.querySelector("h3");

        const button =
            card.querySelector(".save");

        if (!heading || !button) {
            return;
        }

        const title =
            heading.textContent
                .replace(/\s+/g, " ")
                .trim();

        if (savedTitles.includes(title)) {

            button.classList.add("saved");

            button.textContent = "🔖";

        }

    });

});


   
    const existingItems =
        savedList.querySelectorAll(".saved-item");

    for (let i = 0; i < existingItems.length; i++) {

        const heading =
            existingItems[i].querySelector("h3");

        if (
            heading &&
            heading.textContent.trim() === title
        ) {
            return;
        }

    }


 
    const savedItem =
        document.createElement("article");

    savedItem.className = "saved-item";

    savedItem.innerHTML = `

        <img
            src="${image}"
            alt="${title}"
        >

        <div class="saved-item-content">

            <span class="category">
                ${category}
            </span>

            <h3>
                ${title}
            </h3>

            <p>
                Saved from your Healthora content.
            </p>

            <div class="article-meta">

                <span>
                    ${meta}
                </span>

                <span>
                    🔖 Saved now
                </span>

            </div>
            <button class="add-collection-btn">
    📁 Add to Collection
</button>

        </div>

    `;

    savedItem.addEventListener(
    "click",
    function(event) {

        /* Add to Collection button par
           click hone par article open nahi hoga */

        if (
            event.target.closest(
                ".add-collection-btn"
            )
        ) {
            return;
        }


        openPage("articles");


        setTimeout(function() {

           


            articles.forEach(
                function(article) {

                    const heading =
                        article.querySelector("h3");


                    if (!heading) {
                        return;
                    }


                    const articleTitle =
                        heading.textContent
                            .trim()
                            .replace(
                                /\s+/g,
                                " "
                            )
                            .toLowerCase();


                    const savedTitle =
                        title
                            .trim()
                            .replace(
                                /\s+/g,
                                " "
                            )
                            .toLowerCase();


                    if (
                        articleTitle.includes(
                            savedTitle
                        ) ||
                        savedTitle.includes(
                            articleTitle
                        )
                    ) {

                        article.scrollIntoView({
                            behavior: "smooth",
                            block: "center"
                        });


                        article.style.outline =
                            "3px solid #219653";


                        setTimeout(
                            function() {

                                article.style.outline =
                                    "";

                            },
                            2000
                        );

                    }

                }
            );

        }, 300);

    }
);

    savedList.appendChild(savedItem);
}




document.addEventListener("click", async function(event) {

    const button = event.target.closest(".save");

    if (!button) {
        return;
    }

    const card = button.closest(".content-card");

    if (!card) {
        return;
    }

    event.preventDefault();
    event.stopPropagation();

    const title =
        card.querySelector("h3")?.textContent.trim() ||
        "Health Content";

    const image =
        card.querySelector("img")?.src || "";

    const category =
        card.querySelector(".badge")?.textContent.trim() ||
        "Article";

    const meta =
        card.querySelector(".card-footer")?.textContent.trim() ||
        "";

    const articleData = {
        title: title,
        image: image,
        category: category,
        meta: meta
    };


    // ================= SAVE =================

    if (!button.classList.contains("saved")) {

        button.classList.add("saved");
        button.textContent = "🔖";

        savedItems++;

        updateSavedCount();


        // Local saved page
        addToSavedPage(
            title,
            image,
            category,
            meta
        );


        // LocalStorage
        let savedArticles =
            JSON.parse(
                localStorage.getItem(
                    "healthoraSavedArticles"
                )
            ) || [];

        const alreadySaved =
            savedArticles.some(function(article) {
                return article.title === title;
            });

        if (!alreadySaved) {

            savedArticles.push(articleData);

            localStorage.setItem(
                "healthoraSavedArticles",
                JSON.stringify(savedArticles)
            );
        }


        // ================= FIRESTORE =================

        const user = auth.currentUser;

        if (!user) {

            console.error(
                "❌ Firebase user not found"
            );

            return;
        }

        try {

            const userRef =
                doc(
                    db,
                    "users",
                    user.uid
                );

            await updateDoc(
                userRef,
                {
                    savedArticles:
                        arrayUnion(articleData)
                }
            );

            console.log(
                "✅ ARTICLE SAVED TO FIRESTORE:",
                articleData
            );

        } catch (error) {

            console.error(
                "❌ FIRESTORE SAVE ERROR:",
                error
            );
        }


    }

    // ================= UNSAVE =================

    else {

        button.classList.remove("saved");
        button.textContent = "♧";

        savedItems =
            Math.max(
                0,
                savedItems - 1
            );


        // Remove from localStorage

        let savedArticles =
            JSON.parse(
                localStorage.getItem(
                    "healthoraSavedArticles"
                )
            ) || [];

        savedArticles =
            savedArticles.filter(
                function(article) {
                    return article.title !== title;
                }
            );

        localStorage.setItem(
            "healthoraSavedArticles",
            JSON.stringify(savedArticles)
        );


        // Remove from Firestore

        const user = auth.currentUser;

        if (user) {

            try {

                const userRef =
                    doc(
                        db,
                        "users",
                        user.uid
                    );

                await updateDoc(
                    userRef,
                    {
                        savedArticles:
                            arrayRemove(articleData)
                    }
                );

                console.log(
                    "🗑️ ARTICLE REMOVED FROM FIRESTORE"
                );

            } catch (error) {

                console.error(
                    "❌ FIRESTORE UNSAVE ERROR:",
                    error
                );
            }
        }


        // Remove from Saved page

        const savedList =
            document.getElementById(
                "saved-content-list"
            );

        if (savedList) {

            const savedItemsList =
                savedList.querySelectorAll(
                    ".saved-item"
                );

            for (
                let i = 0;
                i < savedItemsList.length;
                i++
            ) {

                const heading =
                    savedItemsList[i]
                        .querySelector("h3");

                if (
                    heading &&
                    heading.textContent.trim() === title
                ) {

                    savedItemsList[i].remove();

                    break;
                }
            }
        }
    }


    updateSavedCount();

    localStorage.setItem(
        "healthoraSavedCount",
        savedItems
    );

});
// ================= LOAD SAVED ARTICLES FROM FIRESTORE =================

onAuthStateChanged(auth, async function(user) {

    if (!user) {
        console.log("No logged-in user");
        return;
    }

    try {

        const userRef = doc(
            db,
            "users",
            user.uid
        );

        const userSnapshot = await getDoc(userRef);

        if (!userSnapshot.exists()) {
            console.log("User document not found");
            return;
        }

        const userData = userSnapshot.data();

        const savedArticles =
            userData.savedArticles || [];

        console.log(
            "🔥 Firestore saved articles:",
            savedArticles
        );

        savedArticles.forEach(function(article, index) {
    console.log(
        "📌 SAVED ARTICLE " + index + ":",
        article.title
    );
});

        savedArticles.forEach(function(article) {

            addToSavedPage(
                article.title,
                article.image,
                article.category,
                article.meta
            );

        });

        savedItems = savedArticles.length;

        updateSavedCount();

        console.log(
            "✅ Saved articles loaded from Firestore:",
            savedArticles.length
        );

    } catch (error) {

        console.error(
            "❌ Error loading saved articles:",
            error
        );

    }

});


// ================= OPEN SAVED CONTENT =================

document.addEventListener("click", function(event) {

    const savedItem =
        event.target.closest(".saved-item");

    if (!savedItem) {
        return;
    }


    const heading =
        savedItem.querySelector("h3");

    if (!heading) {
        return;
    }


    // Saved title
    const title =
        heading.textContent
            .replace(/\s+/g, " ")
            .trim();


    // Find all possible content
    const allContent =
        document.querySelectorAll(
            ".content-card, .article-horizontal, .podcast-card, .video-card, .trending-item"
        );


    let originalContent = null;


    allContent.forEach(function(item) {

        const itemHeading =
            item.querySelector("h3");

        if (!itemHeading) {
            return;
        }


        const itemTitle =
            itemHeading.textContent
                .replace(/\s+/g, " ")
                .trim();


        if (itemTitle === title) {

            originalContent = item;

        }

    });


    if (!originalContent) {
        return;
    }


    // Find original page
    const originalPage =
        originalContent.closest(".page");


    if (!originalPage) {
        return;
    }


    // Open original page
    openPage(originalPage.id);


    // Scroll to content
    setTimeout(function() {

        originalContent.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });


        // Highlight
        originalContent.style.outline =
            "3px solid #219653";

        originalContent.style.outlineOffset =
            "3px";


        setTimeout(function() {

            originalContent.style.outline = "";

            originalContent.style.outlineOffset = "";

        }, 2000);

    }, 300);

});


// ================= COLLECTIONS =================

const newCollectionButton =
    document.getElementById("new-collection-btn");

const collectionList =
    document.getElementById("collection-list");


// Load saved collections

let myCollections =
    JSON.parse(
        localStorage.getItem("healthoraCollections")
    ) || [];

    // Remove old duplicate collection names

myCollections =
    myCollections.filter(function(collection) {

        return (
            collection.name !== "Fitness Journey" &&
            collection.name !== "Heart Health"
        );

    });

localStorage.setItem(
    "healthoraCollections",
    JSON.stringify(myCollections)
);

  // Get existing collections from HTML

const existingCollectionCards =
    collectionList.querySelectorAll(
        ".collection-card"
    );

existingCollectionCards.forEach(function(card) {

    const heading =
        card.querySelector("h3");

    if (!heading) {
        return;
    }

    const name =
        heading.textContent.trim();

    card.setAttribute(
        "data-name",
        name
    );

    const exists =
        myCollections.some(function(collection) {

            return (
                collection.name.toLowerCase() ===
                name.toLowerCase()
            );

        });

    if (!exists) {

        myCollections.push({
            name: name
        });

    }

});

localStorage.setItem(
    "healthoraCollections",
    JSON.stringify(myCollections)
);
// ================= GET COLLECTION ITEM COUNT =================

function getCollectionItemCount(collectionName) {

    const data =
        JSON.parse(
            localStorage.getItem(
                "healthoraCollectionItems"
            )
        ) || {};

    if (data[collectionName]) {
        return data[collectionName].length;
    }

    return 0;
}
function getCollectionProgress(collectionName) {

    const count =
        getCollectionItemCount(collectionName);

    const progress =
        count * 10;

    return Math.min(progress, 100);
}


// ================= SAVE COLLECTIONS =================

function saveCollections() {

    localStorage.setItem(
        "healthoraCollections",
        JSON.stringify(myCollections)
    );
    const card =
    document.querySelector(
        `[data-name="${collectionName}"]`
    );

if (card) {

    const countText =
        card.querySelector("p");

    if (countText) {

        countText.textContent =
            getCollectionItemCount(
                collectionName
            ) +
            " items · Created today";

    }

}

const progressBar =
    card.querySelector(
        ".collection-progress span"
    );

if (progressBar) {

    progressBar.style.width =
        getCollectionProgress(
            collectionName
        ) + "%";

}

}


// ================= SHOW COLLECTIONS =================

function showCollections() {

    

    if (!collectionList) {
        return;
    }


    myCollections.forEach(function(collection) {

        const alreadyExists =
            collectionList.querySelector(
                `[data-name="${collection.name}"]`
            );

        if (alreadyExists) {
            return;
        }


        const card =
            document.createElement("article");

        card.className = "collection-card";

        card.setAttribute(
            "data-name",
            collection.name
        );


        card.innerHTML = `

            <div class="collection-top">

                <div class="collection-icon">
                    📁
                </div>

                <button
    type="button"
    class="delete-collection-btn"
    title="Delete Collection"
>
    ⋮
</button>

            </div>


            <h3>
                ${collection.name}
            </h3>


           <p>
    
            ${getCollectionItemCount(collection.name)} items · Created today

            </p>


           <div class="collection-progress">

    <span
        style="
            width:${getCollectionProgress(collection.name)}%;
        "
    ></span>

</div>

            <div class="collection-preview">

                <div
                    style="
                        width:60px;
                        height:60px;
                        border-radius:10px;
                        background:#e3f5ea;
                        display:grid;
                        place-items:center;
                        font-size:24px;
                    "
                >
                    📁
                </div>

            </div>

            <button
    class="collection-open-btn"
>
    Open Collection
</button>

        `;


        collectionList.appendChild(card);

    });

}


// Show collections on page load

showCollections();


// ================= NEW COLLECTION =================

if (newCollectionButton) {

    newCollectionButton.addEventListener(
        "click",
        function() {

            const name =
                prompt(
                    "Enter collection name:"
                );


            if (!name) {
                return;
            }


            const cleanName =
                name.trim();


            if (cleanName === "") {
                return;
            }


            // Check duplicate

            const exists =
                myCollections.some(
                    function(collection) {

                        return (
                            collection.name
                                .toLowerCase() ===
                            cleanName.toLowerCase()
                        );

                    }
                );


            if (exists) {

                alert(
                    "Collection already exists."
                );

                return;
            }


            // Add collection

          // Add collection

myCollections.push({

    name: cleanName

});


saveCollections();


// Add notification

if (typeof addNotification === "function") {

    addNotification(
        "📁",
        "Collection Created",
        cleanName
    );

}


// Show new collection

showCollections();

        }
    );

}

// ================= ADD TO COLLECTION BUTTON =================

function addCollectionButtons() {

    const savedItems =
        document.querySelectorAll(".saved-item");

    savedItems.forEach(function(item) {

        // Agar button already hai to dobara mat banao
        if (item.querySelector(".add-collection-btn")) {
            return;
        }


        const button =
            document.createElement("button");

        button.className =
            "add-collection-btn";

        button.textContent =
            "📁 Add to Collection";


        item.querySelector(".saved-item-content")
            .appendChild(button);

    });

}

addCollectionButtons();

// ================= COLLECTION ITEMS =================

let collectionItems =
    JSON.parse(
        localStorage.getItem(
            "healthoraCollectionItems"
        )
    ) || {};


// ================= SAVE COLLECTION ITEM =================

function saveCollectionItem(
    collectionName,
    title
) {

    if (!collectionItems[collectionName]) {

        collectionItems[collectionName] = [];

    }


    // Duplicate check

    if (
        collectionItems[collectionName]
            .includes(title)
    ) {
        return;
    }


    collectionItems[collectionName].push(title);


    localStorage.setItem(
        "healthoraCollectionItems",
        JSON.stringify(collectionItems)
    );

}
// ================= ADD SAVED ARTICLE TO COLLECTION =================

document.addEventListener("click", function(event) {

    const button =
        event.target.closest(".add-collection-btn");

    if (!button) {
        return;
    }


    event.preventDefault();
    event.stopPropagation();


    const savedItem =
        button.closest(".saved-item");


    if (!savedItem) {
        return;
    }


    const heading =
        savedItem.querySelector("h3");


    if (!heading) {
        return;
    }


    const title =
        heading.textContent
            .replace(/\s+/g, " ")
            .trim();


    // Get collections

    const collections =
        JSON.parse(
            localStorage.getItem(
                "healthoraCollections"
            )
        ) || [];


    if (collections.length === 0) {

        alert(
            "First create a collection."
        );

        return;
    }


    // Show collection names

    let message =
        "Choose a collection:\n\n";


    collections.forEach(
        function(collection, index) {

            message +=
                (index + 1) +
                ". " +
                collection.name +
                "\n";

        }
    );


    const choice =
        prompt(message);


    if (!choice) {
        return;
    }


    const number =
        Number(choice);


    if (
        number < 1 ||
        number > collections.length
    ) {

        alert(
            "Invalid collection."
        );

        return;
    }


    const selectedCollection =
        collections[number - 1].name;


    saveCollectionItem(
        selectedCollection,
        title
    );


    alert(
        title +
        " added to " +
        selectedCollection
    );

});

// ================= OPEN COLLECTION =================



document.addEventListener("click", async function(event) {

    const button =
        event.target.closest(".collection-open-btn");

    if (!button) {
        return;
    }

    const card =
        button.closest(".collection-card");

    if (!card) {
        return;
    }

    const heading =
        card.querySelector("h3");

    if (!heading) {
        return;
    }

    const collectionName =
        heading.textContent.trim();

    const savedCollections =
        JSON.parse(
            localStorage.getItem(
                "healthoraCollectionItems"
            )
        ) || {};

    const items =
        savedCollections[collectionName] || [];

    if (items.length === 0) {

        alert(
            collectionName +
            " is empty."
        );

        return;
    }


    // Hide all collection cards

    const allCards =
        document.querySelectorAll(
            "#collection-list .collection-card"
        );

    allCards.forEach(function(item) {
        item.style.display = "none";
    });


    // Hide new collection button

    if (newCollectionButton) {
        newCollectionButton.style.display = "none";
    }


    // Create collection detail

    let detail =
        document.getElementById(
            "collection-detail"
        );

    if (!detail) {

        detail =
            document.createElement("div");

        detail.id =
            "collection-detail";

        collectionList.appendChild(detail);

    }


    detail.innerHTML = `
        <div class="collection-detail-header">

            <button id="back-collections">
                ← Back to Collections
            </button>

            <h2>
                ${collectionName}
            </h2>

            <p>
                ${items.length} items
            </p>

        </div>

        <div
            class="collection-detail-items"
            id="collection-detail-items"
        >
        </div>
    `;


    const detailItems =
        detail.querySelector(
            "#collection-detail-items"
        );


    // Find saved articles

    items.forEach(function(title) {

        const savedArticles =
            document.querySelectorAll(
                ".saved-item"
            );

        let foundArticle = null;

        savedArticles.forEach(function(article) {

            const articleHeading =
                article.querySelector("h3");

            if (!articleHeading) {
                return;
            }

            const articleTitle =
                articleHeading.textContent
                    .replace(/\s+/g, " ")
                    .trim();

            if (articleTitle === title) {
                foundArticle = article;
            }

        });


        // Create collection article card

        const articleCard =
            document.createElement("div");

        articleCard.className =
            "collection-detail-card";

        articleCard.setAttribute(
            "data-title",
            title
        );


        if (foundArticle) {

            const image =
                foundArticle.querySelector("img");

            const category =
                foundArticle.querySelector(
                    ".category"
                );

            articleCard.innerHTML = `

                ${
                    image
                    ? `<img src="${image.src}" alt="${title}">`
                    : ""
                }

                <div class="collection-detail-content">

                    <span>
                        ${
                            category
                            ? category.textContent
                            : "ARTICLE"
                        }
                    </span>

                    <h3>
                        ${title}
                    </h3>

                    <button
                        class="open-collection-article"
                    >
                        Open Article
                    </button>
                    <button
    class="remove-collection-article"
>
    Remove
</button>

                </div>
            `;

        } else {

            articleCard.innerHTML = `

                <div class="collection-detail-content">

                    <span>
                        ARTICLE
                    </span>

                    <h3>
                        ${title}
                    </h3>

                    <button
                        class="open-collection-article"
                    >
                        Open Article
                    </button>
                    <button
    class="remove-collection-article"
>
    Remove
</button>

                </div>
            `;
        }


        detailItems.appendChild(
            articleCard
        );

    });

});

// ================= BACK TO COLLECTIONS =================

document.addEventListener("click", function(event) {

    if (
        event.target.id !==
        "back-collections"
    ) {
        return;
    }

    const detail =
        document.getElementById(
            "collection-detail"
        );

    if (detail) {
        detail.remove();
    }

    const allCards =
        document.querySelectorAll(
            "#collection-list .collection-card"
        );

    allCards.forEach(function(card) {
        card.style.display = "";
    });

    if (newCollectionButton) {
        newCollectionButton.style.display = "";
    }

});

// ================= OPEN COLLECTION ARTICLE =================

document.addEventListener("click", function(event) {

    const button =
        event.target.closest(
            ".open-collection-article"
        );

    if (!button) {
        return;
    }

    const card =
        button.closest(
            ".collection-detail-card"
        );

    if (!card) {
        return;
    }

    const title =
        card.getAttribute(
            "data-title"
        );

    const allContent =
        document.querySelectorAll(
            ".content-card, .article-horizontal, .podcast-card, .video-card, .trending-item"
        );

    let originalContent = null;

    allContent.forEach(function(item) {

        const heading =
            item.querySelector("h3");

        if (!heading) {
            return;
        }

        const itemTitle =
            heading.textContent
                .replace(/\s+/g, " ")
                .trim();

        if (itemTitle === title) {
            originalContent = item;
        }

    });


    if (!originalContent) {

        alert(
            "Original article not found."
        );

        return;
    }


    const originalPage =
        originalContent.closest(".page");

    if (!originalPage) {
        return;
    }


    openPage(
        originalPage.id
    );


    setTimeout(function() {

        originalContent.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

        originalContent.style.outline =
            "3px solid #219653";

        originalContent.style.outlineOffset =
            "3px";


        setTimeout(function() {

            originalContent.style.outline = "";

            originalContent.style.outlineOffset = "";

        }, 2000);

    }, 300);

});

// ================= REMOVE FROM COLLECTION =================

// ================= REMOVE ARTICLE FROM COLLECTION =================

document.addEventListener("click", function(event) {

    if (!event.target.classList.contains("remove-collection-article")) {
        return;
    }

    const button = event.target;

    const card = button.closest(".collection-detail-card");

    if (!card) {
        return;
    }

    const title = card.getAttribute("data-title");

    const detail = document.getElementById("collection-detail");

    if (!detail) {
        return;
    }

    const heading = detail.querySelector(
       ".collection-detail-header h2"
    );

    if (!heading) {
        return;
    }

    const collectionName = heading.textContent.trim();

    let collectionData =
        JSON.parse(
            localStorage.getItem("healthoraCollectionItems")
        ) || {};

    if (!collectionData[collectionName]) {
        return;
    }

    // Article remove
    collectionData[collectionName] =
        collectionData[collectionName].filter(function(item) {
            return item !== title;
        });

    // Save updated data
    localStorage.setItem(
        "healthoraCollectionItems",
        JSON.stringify(collectionData)
    );

    // Remove card from screen
    card.remove();

    // Remaining items
    const remaining =
        collectionData[collectionName].length;

    // Update collection detail count
    const countText = detail.querySelector(
        ".collection-detail-header p"
    );

    if (countText) {
        countText.textContent =
            remaining + " items";
    }

    // Update collection card count
    const collectionCard =
        document.querySelector(
            `[data-name="${collectionName}"]`
        );

    if (collectionCard) {

        const cardText =
            collectionCard.querySelector("p");

        if (cardText) {
            cardText.textContent =
                remaining +
                " items · Created today";
        }

        const progress =
            collectionCard.querySelector(
                ".collection-progress span"
            );

        if (progress) {
            progress.style.width =
                Math.min(remaining * 10, 100) + "%";
        }
    }

    // Empty collection
    if (remaining === 0) {

        const itemsContainer =
            detail.querySelector(
                ".collection-detail-items"
            );

        if (itemsContainer) {

            itemsContainer.innerHTML = `
                <div style="
                    width:100%;
                    padding:50px 20px;
                    text-align:center;
                    color:#728080;
                ">
                    <h3>Collection is empty</h3>

                    <p style="
                        margin-top:8px;
                        font-size:12px;
                    ">
                        Add saved articles to this collection.
                    </p>
                </div>
            `;
        }
    }

});

// ================= PROFILE =================

// Default profile data
let profileData =
    JSON.parse(
        localStorage.getItem("healthoraProfile")
    ) || {
        name: "Bhavya Jain",
        email: "",
        bio: "Health enthusiast",
        image: ""
    };

    // ================= LOAD PROFILE FROM MONGODB =================

async function loadProfileFromMongoDB() {

    try {

        const user =
            auth.currentUser;

        if (!user) {

            console.log(
                "No Firebase user found"
            );

            return;

        }


        const token =
            await user.getIdToken();


        const response =
            await fetch(
                `https://healthora.onrender.com/api/users/profile`,
                {
                    method: "GET",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        const result =
            await response.json();


        console.log(
            "✅ MongoDB profile:",
            result
        );


        if (!response.ok) {

            throw new Error(
                result.message ||
                `HTTP ${response.status}`
            );

        }


        const mongoUser =
            result.data;


        // MongoDB data → frontend profile
        profileData.name =
            mongoUser.name ||
            profileData.name;


        profileData.email =
            mongoUser.email ||
            profileData.email;


        profileData.image =
            mongoUser.profileImage ||
            profileData.image;

localStorage.setItem(
    "healthoraProfile",
    JSON.stringify(profileData)
);

updateProfile();

const mongoUpdated =
    await updateMongoProfile();

if (mongoUpdated) {

    alert(
        "Profile updated successfully!"
    );

} else {

    alert(
        "Profile updated locally, but MongoDB update failed."
    );

}


        console.log(
            "✅ Profile loaded from MongoDB"
        );

    }

    catch (error) {

        console.error(
            "❌ MongoDB profile load error:",
            error
        );

    }

}

async function updateMongoProfile() {

    try {

        const user =
            auth.currentUser;

        if (!user) {

            console.log(
                "No Firebase user logged in"
            );

            return false;
        }


        const token =
            await user.getIdToken();


        const response =
            await fetch(
                `https://healthora.onrender.com/api/users/profile`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`
                    },

                    body: JSON.stringify({

                        name:
                            profileData.name,

                        profileImage:
                            profileData.image || ""

                    })
                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            console.error(
                "MongoDB profile update failed:",
                result
            );

            return false;
        }


        console.log(
            "✅ MongoDB profile updated:",
            result
        );


        return true;

    }

    catch (error) {

        console.error(
            "❌ MongoDB profile update error:",
            error
        );

        return false;

    }

}


// ================= EDIT PROFILE =================

// ================= EDIT PROFILE =================

document.addEventListener(
    "click",
    async function(event) {

        const button =
            event.target.closest(
                "#edit-profile-btn"
            );

        if (!button) {
            return;
        }


        const newName =
            prompt(
                "Enter your name:",
                profileData.name
            );


        if (newName === null) {
            return;
        }


        const cleanName =
            newName.trim();


        if (cleanName === "") {

            alert(
                "Name cannot be empty."
            );

            return;

        }


        const newBio =
            prompt(
                "Enter your bio:",
                profileData.bio ||
                "Health enthusiast"
            );


        if (newBio === null) {
            return;
        }


        const cleanBio =
            newBio.trim();


        try {

            const user =
                auth.currentUser;


            if (!user) {

                alert(
                    "Please login again."
                );

                return;

            }


            // Get fresh Firebase ID token

            const token =
                await user.getIdToken(
                    true
                );


            const response =
                await fetch(
                    `https://healthora.onrender.com/api/users/profile`,
                    {
                        method: "PUT",

                        headers: {

                            "Content-Type":
                                "application/json",

                            "Authorization":
                                `Bearer ${token}`

                        },

                        body: JSON.stringify({

                            name:
                                cleanName,

                            profileImage:
                                profileData.image || ""

                        })

                    }
                );


            const result =
                await response.json();


            console.log(
                "✅ Profile update response:",
                result
            );


            if (!response.ok) {

                throw new Error(
                    result.message ||
                    "Profile update failed"
                );

            }


            // Update local UI

            profileData.name =
                cleanName;

            profileData.bio =
                cleanBio;


            localStorage.setItem(
                "healthoraProfile",
                JSON.stringify(
                    profileData
                )
            );


            updateProfile();


            alert(
                "Profile updated successfully!"
            );


        } catch (error) {

            console.error(
                "❌ Profile update error:",
                error
            );


            alert(
                "Failed to update profile. Please try again."
            );

        }

    }
);



function updateProfile() {

    const nameElements =
        document.querySelectorAll(
            ".profile-name"
        );

    nameElements.forEach(function(element) {

        element.textContent =
            profileData.name;

    });

    const profileEmail =
        document.querySelector(
            ".profile-info p"
        );

    if (profileEmail) {
        profileEmail.textContent =
            profileData.email;
    }

    const profileBio =
        document.querySelector(
            ".profile-bio"
        );

    if (profileBio) {
        profileBio.textContent =
            profileData.bio;
    }

}
// Update Home greeting

const homeGreeting =
    document.getElementById(
        "home-greeting"
    );

if (homeGreeting) {

    homeGreeting.textContent =
        "Good Evening, " +
        profileData.name +
        " 👋";

}

// Update top-right header profile

// ================= TOP-RIGHT HEADER PROFILE =================

// Update top-right header profile

const headerAvatar =
    document.getElementById(
        "header-avatar"
    );

const headerName =
    document.getElementById(
        "header-user-name"
    );

if (headerAvatar) {

    if (profileData.image) {

        headerAvatar.innerHTML = `
            <img
                src="${profileData.image}"
                alt="Profile"
            >
        `;

    } else {

      
    }
}

if (headerName) {

    headerName.textContent =
        "Hi, " +
        profileData.name;
}


document.addEventListener(
    "click",
    async function(event) {

        const button =
            event.target.closest(
                "#save-profile-btn"
            );

        if (!button) {
            return;
        }


        const user =
            auth.currentUser;


        if (!user) {

            alert(
                "Please login first."
            );

            return;

        }


        try {

            const token =
                await user.getIdToken();


            const nameElements =
                document.querySelectorAll(
                    ".profile-name"
                );


            let name = "";

            if (nameElements.length > 0) {

                name =
                    nameElements[0]
                        .textContent
                        .trim();

            }


            const response =
                await fetch(
                    `https://healthora.onrender.com/api/users/profile`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json",

                            "Authorization":
                                `Bearer ${token}`
                        },

                        body: JSON.stringify({
                            name: name
                        })
                    }
                );


            const result =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    result.message ||
                    `HTTP ${response.status}`
                );

            }


            console.log(
                "✅ MongoDB profile updated:",
                result
            );


            // Keep existing local profile working
            localStorage.setItem(
                "healthoraProfile",
                JSON.stringify({
                    ...profileData,
                    name: name
                })
            );


            updateProfile();


            alert(
                "Profile updated successfully!"
            );


        } catch (error) {

            console.error(
                "❌ Profile update error:",
                error
            );


            alert(
                "Profile update failed: " +
                error.message
            );

        }

    }
);
// ================= PROFILE IMAGE =================

document.addEventListener("click", function(event) {

    const button =
        event.target.closest("#change-profile-image");

    if (!button) {
        return;
    }

    document
        .getElementById("profile-image-input")
        .click();

});


document.addEventListener("change", function(event) {

    if (
        event.target.id !==
        "profile-image-input"
    ) {
        return;
    }

    const file =
        event.target.files[0];

    if (!file) {
        return;
    }

    const reader =
        new FileReader();

    reader.onload = function(e) {

        profileData.image =
            e.target.result;

        localStorage.setItem(
            "healthoraProfile",
            JSON.stringify(profileData)
        );

        updateProfile();

    };

    reader.readAsDataURL(file);

});
const avatar =
    document.getElementById(
        "profile-avatar"
    );

if (
    avatar &&
    profileData.image
) {

    avatar.innerHTML = `
        <img
            src="${profileData.image}"
            alt="Profile"
        >
    `;

}

// ================= PROFILE STATISTICS =================

function updateProfileStats() {

    // Saved items
    const savedCount =
        parseInt(
            localStorage.getItem(
                "healthoraSavedCount"
            )
        ) || 0;


    // Collections
    const collections =
        JSON.parse(
            localStorage.getItem(
                "healthoraCollections"
            )
        ) || [];


    const collectionCount =
        collections.length;


    // Total activity
    const totalActivity =
        savedCount + collectionCount;


    // Update Saved Items
    const savedElement =
        document.getElementById(
            "profile-saved-count"
        );

    if (savedElement) {

        savedElement.textContent =
            savedCount +
            " Saved Items";

    }


    // Update Collections
    const collectionElement =
        document.getElementById(
            "profile-collection-count"
        );

    if (collectionElement) {

        collectionElement.textContent =
            collectionCount +
            " Collections";

    }


    // Update Total Activity
    const activityElement =
        document.getElementById(
            "profile-activity-count"
        );

    if (activityElement) {

        activityElement.textContent =
            totalActivity +
            " Total Activity";

    }

}


// Run when page loads
updateProfileStats();

// ================= RECENT ACTIVITY =================

function updateRecentActivity() {

    const activityList =
        document.getElementById(
            "recent-activity-list"
        );

    if (!activityList) {
        return;
    }


    const activities =
        JSON.parse(
            localStorage.getItem(
                "healthoraActivities"
            )
        ) || [];


    if (activities.length === 0) {

        activityList.innerHTML = `
            <div class="activity">

                <div class="activity-icon">
                    📖
                </div>

                <div class="activity-info">

                    <strong>
                        No recent activity
                    </strong>

                    <span>
                        Start exploring Healthora
                    </span>

                </div>

            </div>
        `;

        return;
    }


    activityList.innerHTML =
        activities
            .map(function(activity) {

                return `
                    <div class="activity">

                        <div class="activity-icon">
                            🔖
                        </div>

                        <div class="activity-info">

                            <strong>
                                ${activity.type}:
                                ${activity.title}
                            </strong>

                            <span>
                                ${activity.time}
                            </span>

                        </div>

                    </div>
                `;

            })
            .join("");
}


updateRecentActivity();

// ================= EDIT INTERESTS MODAL =================

const interestsModal =
    document.getElementById(
        "interests-modal"
    );

const interestsOptions =
    document.getElementById(
        "interests-options"
    );


// Open modal

document.addEventListener(
    "click",
    function(event) {

        const button =
            event.target.closest(
                "#edit-interests-btn"
            );

        if (!button) {
            return;
        }


        const savedInterests =
            JSON.parse(
                localStorage.getItem(
                    "healthoraInterests"
                )
            ) || [
                "🏋️ Fitness",
                "🍎 Nutrition",
                "🧠 Mental Health",
                "🪷 Yoga",
                "🌿 Wellness",
                "🔬 Medical Research"
            ];


        const checkboxes =
            interestsOptions.querySelectorAll(
                "input[type='checkbox']"
            );


        checkboxes.forEach(
            function(checkbox) {

                checkbox.checked =
                    savedInterests.includes(
                        checkbox.value
                    );

            }
        );


        interestsModal.classList.add(
            "active"
        );

    }
);


// Close button

document.addEventListener(
    "click",
    function(event) {

        if (
            event.target.closest(
                "#close-interests-modal"
            )
        ) {

            interestsModal.classList.remove(
                "active"
            );

        }

    }
);


// Cancel button

document.addEventListener(
    "click",
    function(event) {

        if (
            event.target.closest(
                "#cancel-interests"
            )
        ) {

            interestsModal.classList.remove(
                "active"
            );

        }

    }
);


// Save Interests

document.addEventListener(
    "click",
    function(event) {

        if (
            !event.target.closest(
                "#save-interests"
            )
        ) {
            return;
        }


        const selected = [];


        const checkboxes =
            interestsOptions.querySelectorAll(
                "input[type='checkbox']:checked"
            );


        checkboxes.forEach(
            function(checkbox) {

                selected.push(
                    checkbox.value
                );

            }
        );


        if (selected.length === 0) {

            alert(
                "Please select at least one interest."
            );

            return;

        }


        localStorage.setItem(
            "healthoraInterests",
            JSON.stringify(selected)
        );


        updateProfileInterests();


        interestsModal.classList.remove(
            "active"
        );

    }
);


// Update profile interests

function updateProfileInterests() {

    const savedInterests =
        JSON.parse(
            localStorage.getItem(
                "healthoraInterests"
            )
        ) || [];


    const interestRow =
        document.querySelector(
            "#profile .interest-row"
        );


    if (!interestRow) {
        return;
    }


    interestRow.innerHTML = "";


    savedInterests.forEach(
        function(interest) {

            const span =
                document.createElement(
                    "span"
                );

            span.className =
                "interest-pill";

            span.textContent =
                interest;

            interestRow.appendChild(
                span
            );

        }
    );

}


updateProfileInterests();



// ================= YOUR PROGRESS =================

function updateProgress() {

    const activities =
        JSON.parse(
            localStorage.getItem(
                "healthoraActivities"
            )
        ) || [];


    // Count saved activities
    const savedActivities =
        activities.filter(function(activity) {

            return activity.type === "Saved";

        });


    // Count article reading activities
    const articleActivities =
        activities.filter(function(activity) {

            return (
                activity.type === "Read" ||
                activity.type === "Article"
            );

        });


    // Count podcast activities
    const podcastActivities =
        activities.filter(function(activity) {

            return (
                activity.type === "Listened" ||
                activity.type === "Podcast"
            );

        });


    const savedCount =
        parseInt(
            localStorage.getItem(
                "healthoraSavedCount"
            )
        ) || 0;


    // Update Articles
    const articlesElement =
        document.getElementById(
            "progress-articles"
        );

    if (articlesElement) {

        articlesElement.textContent =
            articleActivities.length;

    }


    // Update Podcasts
    const podcastsElement =
        document.getElementById(
            "progress-podcasts"
        );

    if (podcastsElement) {

        podcastsElement.textContent =
            podcastActivities.length;

    }


    // Update Saved
    const savedElement =
        document.getElementById(
            "saved-count"
        );

    if (savedElement) {

        savedElement.textContent =
            savedCount;

    }


    // Calculate activity days
    const activityDates =
        activities.map(function(activity) {

            return new Date(
                activity.time
            ).toDateString();

        });


    const uniqueDays =
        [...new Set(activityDates)]
            .filter(Boolean);


    const streak =
        uniqueDays.length;


    const streakElement =
        document.getElementById(
            "progress-streak"
        );

    if (streakElement) {

        streakElement.textContent =
            streak;

    }


    // Wellness score
    let score =
        (
            savedCount * 5
        ) +
        (
            articleActivities.length * 10
        ) +
        (
            podcastActivities.length * 10
        ) +
        (
            streak * 5
        );


    score =
        Math.min(
            score,
            100
        );


    const wellnessScore =
        document.querySelector(
            ".progress-inner strong"
        );

    if (wellnessScore) {

        wellnessScore.textContent =
            score + "%";

    }

}


// Run on page load
updateProgress();

// ================= NOTIFICATIONS =================

const notificationButton =
    document.getElementById(
        "notification-btn"
    );

const notificationPanel =
    document.getElementById(
        "notification-panel"
    );


// Open / close notification panel

document.addEventListener(
    "click",
    function(event) {

        const button =
            event.target.closest(
                "#notification-btn"
            );

        if (button) {

            notificationPanel.classList.toggle(
                "active"
            );

            updateNotifications();

            return;
        }


        if (
            notificationPanel &&
            !event.target.closest(
                "#notification-panel"
            )
        ) {

            notificationPanel.classList.remove(
                "active"
            );

        }

    }
);


// Get notifications

function getNotifications() {

    return JSON.parse(
        localStorage.getItem(
            "healthoraNotifications"
        )
    ) || [];

}


// Save notification

function addNotification(
    icon,
    title,
    message
) {

    const notifications =
        getNotifications();


    notifications.unshift({

        id: Date.now(),

        icon: icon,

        title: title,

        message: message,

        time:
            new Date().toLocaleString(),

        read: false

    });


    const latest =
        notifications.slice(0, 20);


    localStorage.setItem(
        "healthoraNotifications",
        JSON.stringify(latest)
    );


    updateNotifications();

}


// Display notifications

function updateNotifications() {

    const list =
        document.getElementById(
            "notification-list"
        );

    const count =
        document.getElementById(
            "notification-count"
        );

        const notificationDot =
    document.querySelector(
        ".notification-dot"
    );


    if (!list) {
        return;
    }


    const notifications =
        getNotifications();


    const unread =
        notifications.filter(
            function(notification) {

                return !notification.read;

            }
        ).length;


    if (count) {

        count.textContent =
            unread + " unread";

    }
    if (notificationDot) {

    if (unread > 0) {

        notificationDot.textContent =
            unread;

        notificationDot.style.display =
            "flex";

    } else {

        notificationDot.textContent =
            "";

        notificationDot.style.display =
            "none";
    }
}


    if (
        notifications.length === 0
    ) {

        list.innerHTML = `
            <div class="empty-notifications">
                🔔
                <p>No notifications yet</p>
            </div>
        `;

        return;

    }


  list.innerHTML =
    notifications
        .map(function(notification) {

            return `
                <div
                    class="notification-item ${notification.read ? "" : "unread"}"
                    data-notification-id="${notification.id}"
                >

                    <div class="notification-icon">
                        ${notification.icon}
                    </div>

                    <div class="notification-content">

                        <strong>
                            ${notification.title}
                        </strong>

                        <p>
                            ${notification.message}
                        </p>

                        <span class="notification-time">
                            ${notification.time}
                        </span>

                    </div>

                </div>
            `;

        })
        .join("");

            // Notification click
    list.querySelectorAll(".notification-item")
        .forEach(function(item) {

            item.addEventListener("click", function() {

                const notificationId =
                    item.dataset.notificationId;

                const notifications =
                    getNotifications();

                const notification =
                    notifications.find(function(n) {

                        return n.id == notificationId;

                    });

                if (!notification) {
                    return;
                }

                // Mark as read
                notification.read = true;

                localStorage.setItem(
                    "healthoraNotifications",
                    JSON.stringify(notifications)
                );

                // Refresh notifications
                updateNotifications();

                // Open related page
if (
    notification.title
        .toLowerCase()
        .includes("article")
) {

    showPage("saved");

} else if (
    notification.title
        .toLowerCase()
        .includes("collection")
) {

    showPage("collections");

}

            });

        });
}


// Mark all read

document.addEventListener(
    "click",
    function(event) {

        if (
            !event.target.closest(
                "#mark-all-read"
            )
        ) {
            return;
        }


        const notifications =
            getNotifications();


        notifications.forEach(
            function(notification) {

                notification.read = true;

            }
        );


        localStorage.setItem(
            "healthoraNotifications",
            JSON.stringify(
                notifications
            )
        );


        updateNotifications();

    }
);


// Initial load

updateNotifications();

// ================= DELETE COLLECTION =================

document.addEventListener(
    "click",
    function(event) {

        const button =
            event.target.closest(
                ".delete-collection-btn"
            );

        if (!button) {
            return;
        }


        const card =
            button.closest(
                ".collection-card"
            );

        if (!card) {
            return;
        }


        const collectionName =
            card.getAttribute(
                "data-name"
            );

        if (!collectionName) {
            return;
        }


        const confirmDelete =
            confirm(
                'Delete "' +
                collectionName +
                '" collection?'
            );

        if (!confirmDelete) {
            return;
        }


        // Remove from collections array

        myCollections =
            myCollections.filter(
                function(collection) {

                    return (
                        collection.name !==
                        collectionName
                    );

                }
            );


        // Save updated collections

        localStorage.setItem(
            "healthoraCollections",
            JSON.stringify(
                myCollections
            )
        );


        // Remove collection items also

        let collectionData =
            JSON.parse(
                localStorage.getItem(
                    "healthoraCollectionItems"
                )
            ) || {};


        delete collectionData[
            collectionName
        ];


        localStorage.setItem(
            "healthoraCollectionItems",
            JSON.stringify(
                collectionData
            )
        );


        // Remove card from screen

        card.remove();


        // Add notification

        if (
            typeof addNotification ===
            "function"
        ) {

            addNotification(
                "🗑️",
                "Collection Deleted",
                collectionName
            );

        }

    }
);

/* =========================================================
   PERSONALIZED RECOMMENDATIONS
========================================================= */

const recommendationData = {

    Fitness: [
        {
            title: "10 Best Exercises for Beginners",
            image: "src/assets/fitness.png",
            type: "Article",
            time: "8 min read"
        },
        {
            title: "Strength Training Basics",
            image: "src/assets/fitness.png",
            type: "Article",
            time: "8 min read"
        },
        {
            title: "Simple Daily Fitness Routine",
            image: "src/assets/fitness.png",
            type: "Article",
            time: "6 min read"
        }
    ],

    Nutrition: [
        {
            title: "Healthy Breakfast Ideas",
            image: "src/assets/nutrition.png",
            type: "Nutrition",
            time: "5 min read"
        },
        {
            title: "How to Build a Balanced Diet",
            image: "src/assets/nutrition.png",
            type: "Nutrition",
            time: "7 min read"
        },
        {
            title: "Healthy Foods for Daily Energy",
            image: "src/assets/nutrition.png",
            type: "Nutrition",
            time: "6 min read"
        }
    ],

    "Mental Health": [
        {
            title: "The Benefits of Meditation",
            image: "src/assets/meditation.png",
            type: "Mental Health",
            time: "6 min read"
        },
        {
            title: "Simple Ways to Reduce Stress",
            image: "src/assets/meditation.png",
            type: "Mental Health",
            time: "5 min read"
        },
        {
            title: "Mindfulness for Beginners",
            image: "src/assets/meditation.png",
            type: "Mental Health",
            time: "7 min read"
        }
    ],

    Yoga: [
        {
            title: "Beginner Yoga Routine",
            image: "src/assets/Yoga.png",
            type: "Yoga",
            time: "10 min read"
        },
        {
            title: "Yoga for Flexibility",
            image: "src/assets/Yoga.png",
            type: "Yoga",
            time: "8 min read"
        },
        {
            title: "Morning Yoga for Beginners",
            image: "src/assets/Yoga.png",
            type: "Yoga",
            time: "6 min read"
        }
    ],

    Wellness: [
        {
            title: "Daily Wellness Habits",
            image: "src/assets/wellness.png",
            type: "Wellness",
            time: "6 min read"
        },
        {
            title: "Small Habits for Better Health",
            image: "src/assets/wellness.png",
            type: "Wellness",
            time: "7 min read"
        },
        {
            title: "Building a Healthy Lifestyle",
            image: "src/assets/wellness.png",
            type: "Wellness",
            time: "8 min read"
        }
    ]

};



function showRecommendations(interest) {

    const grid =
        document.querySelector(
            "#home .recommendation-grid"
        );

    if (!grid) {
        return;
    }

    const recommendations =
        recommendationData[interest];

    if (!recommendations) {
        return;
    }

    grid.innerHTML = "";
    const subtitle =
    document.querySelector(
        "#recommendation-subtitle"
    );

if (subtitle) {
    subtitle.textContent =
        "Based on your interest: " + interest;
}

    recommendations.forEach(function(item) {

        const card =
            document.createElement("article");

       card.className =
    "content-card recently-viewable";

card.dataset.title =
    item.title;

card.dataset.image =
    item.image;

card.dataset.category =
    item.type;

        card.innerHTML = `
            <div class="image-container">

                <img
                    src="${item.image}"
                    class="content-image"
                    alt="${interest}"
                >

                <span class="badge">
                    ${item.type}
                </span>

            </div>

            <div class="content-body">

                <h3>
                    ${item.title}
                </h3>

                <div class="card-footer">

    <span>
        ${item.time}
    </span>

    <button
        class="save recommendation-save"
        data-title="${item.title}"
    >
        ♧
    </button>

</div>
            </div>
        `;

       card.addEventListener(
    "click",
    function(event) {

        if (
            event.target.closest(".save")
        ) {
            return;
        }

        addRecentlyViewed(
            item.title,
            item.image,
            item.type
        );


        window.location.href =
            "article.html?title=" +
            encodeURIComponent(
                item.title
            );

    }
);

        grid.appendChild(card);

    });

}


/* Interest click */

/* Interest click */

document
    .querySelectorAll(
        ".recommendation-interest"
    )
    .forEach(function(button) {

        button.addEventListener(
            "click",
            function() {

                const interest =
                    button.textContent
                        .trim()
                        .replace(
                            /^[^\w]+/,
                            ""
                        );

                localStorage.setItem(
                    "healthoraSelectedInterest",
                    interest
                );


                /* Remove active from all buttons */

                document
                    .querySelectorAll(
                        ".recommendation-interest"
                    )
                    .forEach(function(item) {

                        item.classList.remove(
                            "active"
                        );

                    });


                /* Make clicked button active */

                button.classList.add(
                    "active"
                );


                /* Show recommendations */

                showRecommendations(
                    interest
                );

            }
        );

    });

/* Restore selected interest */

const savedInterest =
    localStorage.getItem(
        "healthoraSelectedInterest"
    );

if (savedInterest) {

    document
        .querySelectorAll(
            ".recommendation-interest"
        )
        .forEach(function(button) {

            const interest =
                button.textContent
                    .trim()
                    .replace(
                        /^[^\w]+/,
                        ""
                    );

            if (interest === savedInterest) {

                button.classList.add(
                    "active"
                );

            }

        });


    showRecommendations(
        savedInterest
    );

}

/* =========================================================
   RECOMMENDATION SEE ALL
========================================================= */

const seeAllButton =
    document.getElementById(
        "recommendation-see-all"
    );

if (seeAllButton) {

    seeAllButton.addEventListener(
        "click",
        function() {

            const selectedInterest =
                localStorage.getItem(
                    "healthoraSelectedInterest"
                );

            openPage("articles");

            if (selectedInterest) {

                const filters =
                    document.querySelectorAll(
                        "#articles .filter-button"
                    );

                filters.forEach(function(button) {

                    button.classList.remove(
                        "active"
                    );

                    const filterText =
                        button.textContent
                            .trim();

                    if (
                        filterText
                            .toLowerCase()
                            ===
                        selectedInterest
                            .toLowerCase()
                    ) {

                        button.classList.add(
                            "active"
                        );

                    }

                });

            }

        }
    );

}


/* =========================================================
   ARTICLE CATEGORY FILTER
========================================================= */

const articleFilters =
    document.querySelectorAll(
        "#articles .filter-button"
    );

const articleItems =
    document.querySelectorAll(
        "#articles .article-horizontal"
    );


articleFilters.forEach(function(button) {
    

    button.addEventListener(
        "click",
        function() {

            const selectedCategory =
                button.textContent
                    .trim()
                    .toLowerCase();

                    const articleItems =
    document.querySelectorAll(
        "#articles .article-horizontal"
    );


            /* Active filter */

            articleFilters.forEach(
                function(item) {

                    item.classList.remove(
                        "active"
                    );

                }
            );

            button.classList.add(
                "active"
            );


            /* Show / hide articles */

            articleItems.forEach(
                function(article) {

                    if (
                        selectedCategory ===
                        "all"
                    ) {

                        article.style.display =
                            "";

                        return;

                    }


                    const categoryElement =
                        article.querySelector(
                            ".category"
                        );

                    if (!categoryElement) {
                        return;
                    }


                    const category =
                        categoryElement
                            .textContent
                            .trim()
                            .toLowerCase();


                    if (
                        category ===
                        selectedCategory
                    ) {

                        article.style.display =
                            "";

                    } else {

                        article.style.display =
                            "none";

                    }

                }
            );

        }
    );

});



/* =========================================================
   RECOMMENDATION SAVE
========================================================= */

document.addEventListener(
    "click",
    function(event) {

        const saveButton =
            event.target.closest(
                ".recommendation-save"
            );

        if (!saveButton) {
            return;
        }


        const title =
            saveButton.dataset.title;


        let savedArticles =
            JSON.parse(
                localStorage.getItem(
                    "healthoraSavedArticles"
                )
            ) || [];


        const alreadySaved =
            savedArticles.some(
                function(article) {
                    return article.title === title;
                }
            );


        if (alreadySaved) {

            alert(
                "Article already saved!"
            );

            return;
        }


        savedArticles.push({
            title: title,
            type: "Article"
        });


        localStorage.setItem(
            "healthoraSavedArticles",
            JSON.stringify(
                savedArticles
            )
        );


        saveButton.textContent = "✓";

        alert(
            "Article saved successfully!"
        );

    }
);


/* =========================================================
   TRENDING SEE ALL
========================================================= */

const trendingSeeAll =
    document.getElementById(
        "trending-see-all"
    );

if (trendingSeeAll) {

    trendingSeeAll.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            openPage("articles");

            setTimeout(function() {

                const allButton =
                    document.querySelector(
                        "#articles .filter-button"
                    );

                if (allButton) {
                    allButton.click();
                }

            }, 300);

        }
    );

}

/* =========================================================
   BECAUSE YOU READ - SEE ALL
========================================================= */

const becauseSeeAll =
    document.getElementById(
        "because-see-all"
    );

if (becauseSeeAll) {

    becauseSeeAll.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            openPage("articles");

            setTimeout(function() {

                const allButton =
                    document.querySelector(
                        "#articles .filter-button"
                    );

                if (allButton) {
                    allButton.click();
                }

            }, 300);

        }
    );

}

/* =========================================================
   HOME POPULAR PODCAST - SEE ALL
========================================================= */

const homePopularPodcastSeeAll =
    document.getElementById(
        "home-popular-podcast-see-all"
    );

if (homePopularPodcastSeeAll) {

    homePopularPodcastSeeAll.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            openPage("podcasts");

        }
    );

}

/* =========================================================
   POPULAR PODCAST - SEE ALL
========================================================= */

const popularPodcastSeeAll =
    document.getElementById(
        "popular-podcast-see-all"
    );

if (popularPodcastSeeAll) {

    popularPodcastSeeAll.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            openPage("podcasts");

        }
    );

}

/* =========================================================
   POPULAR PODCAST PLAY
========================================================= */

const popularPodcastPlay =
    document.getElementById(
        "popular-podcast-play"
    );

if (popularPodcastPlay) {

    popularPodcastPlay.addEventListener(
    "click",
    function() {

        let podcastCount =
            parseInt(
                localStorage.getItem(
                    "healthoraPodcastCount"
                )
            ) || 0;

        podcastCount++;

        localStorage.setItem(
            "healthoraPodcastCount",
            podcastCount
        );

        const podcastElement =
            document.getElementById(
                "progress-podcasts"
            );

        if (podcastElement) {
            podcastElement.textContent =
                podcastCount;
        }

        openPage("podcasts");

    }
);
}
/* =========================================================
   RECENT ACTIVITY - SEE ALL
========================================================= */

const recentActivitySeeAll =
    document.getElementById(
        "recent-activity-see-all"
    );

if (recentActivitySeeAll) {

    recentActivitySeeAll.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            openPage("saved");

        }
    );

}

/* =========================================================
   UPCOMING - VIEW ALL
========================================================= */

const upcomingViewAll =
    document.getElementById(
        "upcoming-view-all"
    );

if (upcomingViewAll) {

    upcomingViewAll.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            openPage("profile");

        }
    );

}

function updateAccountStatistics() {

    const savedItems =
        JSON.parse(
            localStorage.getItem(
                "healthoraSavedArticles"
            )
        ) || [];

    const collections =
        JSON.parse(
            localStorage.getItem(
                "healthoraCollections"
            )
        ) || [];

    const activities =
        JSON.parse(
            localStorage.getItem(
                "healthoraActivities"
            )
        ) || [];


    const savedCount =
        document.getElementById(
            "profile-saved-count"
        );

   const collectionsCount =
    document.getElementById(
        "profile-collection-count"
    );

    const activityCount =
        document.getElementById(
            "profile-activity-count"
        );


    if (savedCount) {
        savedCount.textContent =
            savedItems.length +
            " Saved Items";
    }


    if (collectionsCount) {
        collectionsCount.textContent =
            collections.length +
            " Collections";
    }


    if (activityCount) {
        activityCount.textContent =
            activities.length +
            " Total Activity";
    }
}


updateAccountStatistics();

function updateWellnessScore() {

    const scoreElement =
        document.getElementById(
            "wellness-score"
        );

    const progressCircle =
        document.querySelector(
            ".progress-circle"
        );

    if (!scoreElement || !progressCircle) {
        return;
    }


    const savedItems =
        JSON.parse(
            localStorage.getItem(
                "healthoraSavedArticles"
            )
        ) || [];


    const collections =
        JSON.parse(
            localStorage.getItem(
                "healthoraCollections"
            )
        ) || [];


    let completedReminders = 0;

    for (let i = 0; i < 3; i++) {

        if (
            localStorage.getItem(
                "healthoraReminder_" + i
            ) === "true"
        ) {
            completedReminders++;
        }
    }


    let score =
        (savedItems.length * 2) +
        (collections.length * 5) +
        (completedReminders * 20);


    score =
        Math.min(score, 100);


    scoreElement.textContent =
        score + "%";


    progressCircle.style.background =
        `conic-gradient(
            var(--green) ${score}%,
            #e3eee8 ${score}%
        )`;
}


updateWellnessScore();

function updateProgressStats() {

    const articlesElement =
        document.getElementById(
            "progress-articles"
        );

    if (!articlesElement) {
        return;
    }


    const recentlyViewed =
        JSON.parse(
            localStorage.getItem(
                "healthoraRecentlyViewed"
            )
        ) || [];


    articlesElement.textContent =
        recentlyViewed.length;
}


updateProgressStats();

function updateStreak() {

    const streakElement =
        document.getElementById(
            "progress-streak"
        );

    if (!streakElement) {
        return;
    }


    const today =
        new Date().toDateString();

    const lastVisit =
        localStorage.getItem(
            "healthoraLastVisit"
        );


    let streak =
        parseInt(
            localStorage.getItem(
                "healthoraStreak"
            )
        ) || 0;


    if (lastVisit === today) {

        // Same day — streak same rahega

    } else {

        streak++;

        localStorage.setItem(
            "healthoraStreak",
            streak
        );

        localStorage.setItem(
            "healthoraLastVisit",
            today
        );
    }


    streakElement.textContent =
        streak;
}


updateStreak();

const podcastMainPlay =
    document.getElementById(
        "podcast-main-play"
    );

if (podcastMainPlay) {

    podcastMainPlay.addEventListener(
        "click",
        function() {

            let podcastCount =
                parseInt(
                    localStorage.getItem(
                        "healthoraPodcastCount"
                    )
                ) || 0;

            podcastCount++;

            localStorage.setItem(
                "healthoraPodcastCount",
                podcastCount
            );


            const podcastElement =
                document.getElementById(
                    "progress-podcasts"
                );

            if (podcastElement) {

                podcastElement.textContent =
                    podcastCount;
            }
        }
    );
}


function showContinueReading() {

    const grid =
        document.getElementById(
            "continue-reading-grid"
        );

    if (!grid) {
        return;
    }


    const recentlyViewed =
        JSON.parse(
            localStorage.getItem(
                "healthoraRecentlyViewed"
            )
        ) || [];


    grid.innerHTML = "";


    if (recentlyViewed.length === 0) {

        grid.innerHTML = `
            <p>
                Start reading an article to see it here.
            </p>
        `;

        return;
    }


    const item =
        recentlyViewed[0];


    const card =
        document.createElement(
            "article"
        );

    card.className =
        "content-card";


    card.innerHTML = `

        <div class="image-container">

            <img
                src="${item.image}"
                class="content-image"
                alt="${item.category}"
            >

            <span class="badge">
                ${item.category}
            </span>

        </div>


        <div class="content-body">

            <h3>
                ${item.title}
            </h3>

            <div class="card-footer">

                <span>
                    Continue Reading →
                </span>

            </div>

        </div>

    `;


    card.addEventListener(
        "click",
        function() {

            const title =
                item.title
                    .toLowerCase();


            openPage("articles");


            setTimeout(function() {

                const articles =
                    document.querySelectorAll(
                        "#articles .article-horizontal"
                    );


                articles.forEach(
                    function(article) {

                        const heading =
                            article.querySelector(
                                "h3"
                            );


                        if (!heading) {
                            return;
                        }


                        const articleTitle =
                            heading.textContent
                                .trim()
                                .replace(
                                    /\s+/g,
                                    " "
                                )
                                .toLowerCase();


                        if (
                            articleTitle.includes(
                                title
                            ) ||
                            title.includes(
                                articleTitle
                            )
                        ) {

                            article.scrollIntoView({
                                behavior:
                                    "smooth",
                                block:
                                    "center"
                            });


                            article.style.outline =
                                "3px solid #219653";


                            setTimeout(
                                function() {

                                    article.style.outline =
                                        "";

                                },
                                2000
                            );
                        }

                    }
                );

            }, 300);

        }
    );


    grid.appendChild(card);
}


showContinueReading();








document.addEventListener(
    "DOMContentLoaded",
    function() {



        // ==============================
        // MANAGE BUTTON
        // ==============================

        if (homeManage) {

            homeManage.addEventListener(
                "click",
                function(event) {

                    event.preventDefault();

                    openPage("profile");

                }
            );

        }


       

        // ==============================
        // RESTORE SELECTED INTEREST
        // ==============================

        const savedInterest =
            localStorage.getItem(
                "healthoraSelectedInterest"
            );

        if (savedInterest) {

            homeInterests.forEach(
                function(button) {

                    if (
                        button.textContent
                            .trim() ===
                        savedInterest
                    ) {

                        button.classList.add(
                            "active"
                        );

                    }

                }
            );

        }

    }
);

// ==========================================
// HOME INTERESTS - DYNAMIC
// ==========================================

function getHomeInterests() {

    return JSON.parse(
        localStorage.getItem(
            "healthoraHomeInterests"
        )
    ) || [];
}


function saveHomeInterests(interests) {

    localStorage.setItem(
        "healthoraHomeInterests",
        JSON.stringify(interests)
    );

}


// ==========================================
// SHOW HOME INTERESTS
// ==========================================

function renderHomeInterests() {

    const container =
        document.getElementById(
            "home-interests"
        );

    if (!container) {
        return;
    }

    const interests =
        getHomeInterests();

    container.innerHTML = "";


    interests.forEach(
        function(interest) {

            const button =
                document.createElement(
                    "button"
                );

            button.className =
                "interest-pill active";

            button.textContent =
                interest;

            container.appendChild(
                button
            );

        }
    );


    // ADD BUTTON

    const addButton =
        document.createElement(
            "button"
        );

    addButton.className =
        "interest-pill";

    addButton.id =
        "home-add-interest";

    addButton.textContent =
        "+ Add";

    container.appendChild(
        addButton
    );
}


// ==========================================
// SELECT INTEREST
// ==========================================

document.addEventListener(
    "click",
    function(event) {

        const button =
            event.target.closest(
                ".recommendation-interest"
            );

        if (!button) {
            return;
        }


        const selectedInterest =
            button.textContent.trim();


        let interests =
            getHomeInterests();


        // Already selected → remove
        if (
            interests.includes(
                selectedInterest
            )
        ) {

            interests =
                interests.filter(
                    function(item) {
                        return item !==
                            selectedInterest;
                    }
                );

        }

        // New interest → add
        else {

            interests.push(
                selectedInterest
            );

        }


        saveHomeInterests(
            interests
        );

        renderHomeInterests();

    }
);


// ==========================================
// HOME ADD BUTTON
// ==========================================

document.addEventListener(
    "click",
    function(event) {

        if (
            event.target.id !==
            "home-add-interest"
        ) {
            return;
        }

        openPage("profile");

    }
);


// ==========================================
// HOME MANAGE
// ==========================================

const homeManage =
    document.getElementById(
        "home-manage-interests"
    );

if (homeManage) {

    homeManage.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            openPage("profile");

        }
    );

}


// ==========================================
// LOAD HOME INTERESTS
// ==========================================

renderHomeInterests();

// ==========================================
// HOME INTERESTS - PROFILE SYNC
// ==========================================




// ==========================================
// HOME MANAGE BUTTON
// ==========================================

const homeManageButton =
    document.getElementById(
        "home-manage-interests"
    );

if (homeManageButton) {

    homeManageButton.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            openPage("profile");

        }
    );

}

// ==========================================
// PROFILE INTERESTS -> HOME
// ==========================================

function loadHomeInterests() {

    const homeInterests =
        document.getElementById(
            "home-interests"
        );

    if (!homeInterests) {
        return;
    }

    const saved =
        JSON.parse(
            localStorage.getItem(
                "healthoraInterests"
            )
        ) || [];

    if (saved.length === 0) {
        return;
    }

    homeInterests.innerHTML = "";

    saved.forEach(
        function(interest) {

            const button =
                document.createElement(
                    "button"
                );

            button.className =
                "interest-pill";

            button.textContent =
                interest;

            homeInterests.appendChild(
                button
            );

        }
    );

    // + Add button
    const addButton =
        document.createElement(
            "button"
        );

    addButton.className =
        "interest-pill";

    addButton.id =
        "home-add-interest";

    addButton.textContent =
        "+ Add";

    homeInterests.appendChild(
        addButton
    );

    addButton.addEventListener(
        "click",
        function() {

            const modal =
                document.getElementById(
                    "interests-modal"
                );

            if (modal) {

                modal.classList.add(
                    "active"
                );

            }

        }
    );
}


// Initial Home load
loadHomeInterests();


// ==========================================
// UPDATE HOME AFTER PROFILE SAVE
// ==========================================

document.addEventListener(
    "click",
    function(event) {

        if (
            event.target.closest(
                "#save-interests"
            )
        ) {

            setTimeout(
                function() {

                    loadHomeInterests();

                },
                50
            );

        }

    }
);
function openArticleDetail(item) {

    console.log("ARTICLE OPENING:", item.title);

    const modal =
        document.getElementById(
            "article-detail-modal"
        );

    const image =
        document.getElementById(
            "article-detail-image"
        );

    const category =
        document.getElementById(
            "article-detail-category"
        );

    const title =
        document.getElementById(
            "article-detail-title"
        );

    const time =
        document.getElementById(
            "article-detail-time"
        );

    const body =
        document.getElementById(
            "article-detail-body"
        );

    if (!modal || !body) {
        return;
    }

    image.src = item.image;
    image.alt = item.title;

    category.textContent = item.type;
    title.textContent = item.title;
    time.textContent = item.time;

    if (
        item.title ===
        "10 Best Exercises for Beginners"
    ) {

        body.innerHTML = `

            <p>
                Starting a fitness journey does not
                have to be complicated. Beginners can
                build strength, flexibility and
                endurance with simple exercises.
            </p>

            <h3>1. Walking</h3>

            <p>
                Walking is an easy way to improve
                cardiovascular fitness. Start with
                20 to 30 minutes and gradually
                increase your duration.
            </p>

            <h3>2. Bodyweight Squats</h3>

            <p>
                Squats help strengthen the legs and
                improve lower-body mobility.
            </p>

            <h3>3. Push-Ups</h3>

            <p>
                Push-ups work the chest, shoulders
                and arms. Beginners can start with
                modified push-ups.
            </p>

            <h3>4. Lunges</h3>

            <p>
                Lunges help improve leg strength,
                balance and coordination.
            </p>

            <h3>5. Plank</h3>

            <p>
                Planks strengthen the core muscles.
                Start with 15 to 30 seconds and
                gradually increase the duration.
            </p>

            <h3>6. Glute Bridge</h3>

            <p>
                Glute bridges strengthen the glutes
                and hips without requiring equipment.
            </p>

            <h3>7. Step-Ups</h3>

            <p>
                Step-ups strengthen the legs and
                can help improve balance.
            </p>

            <h3>8. Jumping Jacks</h3>

            <p>
                Jumping jacks are a simple full-body
                cardio movement.
            </p>

            <h3>9. Bird Dog</h3>

            <p>
                Bird dog exercises help improve core
                stability and coordination.
            </p>

            <h3>10. Stretching</h3>

            <p>
                Finish your workout with gentle
                stretching and controlled breathing.
            </p>

            <h3>Beginner Tip</h3>

            <p>
                Focus on consistency and proper
                technique instead of exercising at
                maximum intensity.
            </p>

        `;

    } else {

        body.innerHTML = `
            <p>
                Full article content will be available soon.
            </p>
        `;

    }

    modal.classList.add("active");
}
document.addEventListener(
    "click",
    function(event) {

        if (
            event.target.closest(
                "#article-detail-close"
            )
        ) {

            const modal =
                document.getElementById(
                    "article-detail-modal"
                );

            modal.classList.remove("active");
        }

    }
);

/* =========================================================
   ARTICLE CARD CLICK
========================================================= */

document.addEventListener(
    "click",
    function(event) {

        const clickedCard =
            event.target.closest(
                ".article-horizontal"
            );

        if (!clickedCard) {
            return;
        }


        const titleElement =
            clickedCard.querySelector("h3");

        if (!titleElement) {
            return;
        }


        const articleTitle =
            titleElement.textContent.trim();


        if (!articleTitle) {
            return;
        }


        window.location.href =
            "article.html?title=" +
            encodeURIComponent(
                articleTitle
            );

    }
);



/* =========================================================
   LOAD PODCASTS FROM BACKEND
========================================================= */

async function loadPodcastsFromBackend() {

    const podcastLibrary =
        document.querySelector(
            "#podcasts .podcast-library"
        );

    if (!podcastLibrary) {
        return;
    }

    try {

        console.log(
            "Loading podcasts from backend..."
        );

        const response =
            await fetch(
                `${API_BASE_URL}/api/podcasts`
            );

        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status}`
            );

        }

        const result =
            await response.json();

        console.log(
            "✅ Podcasts from backend:",
            result
        );

        const podcasts =
            result.data || [];


        if (podcasts.length === 0) {

            podcastLibrary.innerHTML = `
                <p style="
                    padding:20px;
                    color:#718080;
                ">
                    No podcasts available.
                </p>
            `;

            return;
        }


        
        podcastLibrary.innerHTML = "";


        
        podcasts.forEach(function(podcast) {

            const card =
                document.createElement(
                    "article"
                );

            card.className =
                "podcast-card";


            card.innerHTML = `

                <img
                   src="${
    podcast.thumbnail
        ? "/" + podcast.thumbnail.replace(/^src\/assets\//, "assets/")
        : ""
}"
                    alt="${podcast.title}"
                >

                <h3>
                    ${podcast.title}
                </h3>

                <p>
                    ${podcast.host || "Healthora Team"}
                    ·
                    ${podcast.duration || "00:00"}
                </p>

            `;


            
           card.addEventListener(
    "click",
    function() {

        window.location.href =
            "podcast.html?id=" +
            encodeURIComponent(
                podcast._id
            );

    }
);

            podcastLibrary.appendChild(
                card
            );

        });


        console.log(
            `✅ ${podcasts.length} podcasts rendered`
        );

    }

    catch (error) {

        console.error(
            "❌ Failed to load podcasts:",
            error
        );

        podcastLibrary.innerHTML = `
            <p style="
                padding:20px;
                color:#d32f2f;
            ">
                Failed to load podcasts.
            </p>
        `;

    }

}




loadPodcastsFromBackend();

loadProfileFromMongoDB();

// ================= HEALTHORA WELLNESS TRACKER =================
(() => {
    const STORAGE_KEY = "healthoraWellnessLogsV1";
    const WATER_GOAL = 2000;

    const $ = (selector) => document.querySelector(selector);

    const todayKey = () => {
        const d = new Date();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const loadLogs = () => {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
        } catch {
            return {};
        }
    };

    let logs = loadLogs();

    const getToday = () => {
        const key = todayKey();

        if (!logs[key]) {
            logs[key] = {
                waterMl: 0,
                sleepHours: null,
                mood: "",
                activities: []
            };
        }

        return logs[key];
    };

    const saveLogs = () => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
        } catch (error) {
            console.error("Unable to save wellness data:", error);
        }
    };

    const getActivityMinutes = (day) =>
        (day.activities || []).reduce(
            (total, activity) => total + activity.minutes,
            0
        );

    const getScore = (day) => {
        let score = 0;

        if (day.waterMl >= WATER_GOAL) score += 25;
        if (day.sleepHours >= 7 && day.sleepHours <= 9) score += 25;
        if (day.mood) score += 25;
        if (getActivityMinutes(day) >= 30) score += 25;

        return score;
    };

    const showStatus = (message) => {
        const status = $("#wellness-save-status");
        if (status) status.textContent = message;
    };

    const render = () => {
        const day = getToday();
        const activityMinutes = getActivityMinutes(day);
        const score = getScore(day);

        const waterSummary = $("#wellness-water-summary");
        const sleepSummary = $("#wellness-sleep-summary");
        const activitySummary = $("#wellness-activity-summary");
        const scoreSummary = $("#wellness-score-summary");

        if (waterSummary) {
            waterSummary.textContent = `${day.waterMl} / ${WATER_GOAL} ml`;
        }

        if (sleepSummary) {
            sleepSummary.textContent =
                day.sleepHours === null ? "-- hours" : `${day.sleepHours} hours`;
        }

        if (activitySummary) {
            activitySummary.textContent = `${activityMinutes} min`;
        }

        if (scoreSummary) {
            scoreSummary.textContent = `${score}%`;
        }

        const waterProgress = $("#water-progress-bar");
        if (waterProgress) {
            waterProgress.style.width =
                `${Math.min((day.waterMl / WATER_GOAL) * 100, 100)}%`;
        }

        const waterText = $("#water-progress-text");
        if (waterText) {
            waterText.textContent =
                `${Math.min(Math.round((day.waterMl / WATER_GOAL) * 100), 100)}% of daily water goal`;
        }

        const moodStatus = $("#wellness-mood-status");
        if (moodStatus) {
            moodStatus.textContent = day.mood
                ? `Today's mood: ${day.mood}`
                : "Select how you're feeling today.";
        }

        document.querySelectorAll("[data-mood]").forEach((button) => {
            const selected = button.dataset.mood === day.mood;
            button.classList.toggle("active", selected);
            button.setAttribute("aria-pressed", String(selected));
        });

        renderActivities(day);
        renderWeeklyProgress();
    };

    const renderActivities = (day) => {
        const list = $("#wellness-activity-list");
        if (!list) return;

        list.replaceChildren();

        if (!day.activities || day.activities.length === 0) {
            const empty = document.createElement("p");
            empty.textContent = "No activities added yet.";
            list.appendChild(empty);
            return;
        }

        day.activities.forEach((activity) => {
            const item = document.createElement("div");
            item.className = "wellness-activity-item";

            const name = document.createElement("span");
            name.textContent = activity.type;

            const duration = document.createElement("span");
            duration.textContent = `${activity.minutes} min`;

            item.append(name, duration);
            list.appendChild(item);
        });
    };

    const renderWeeklyProgress = () => {
        const container = $("#wellness-weekly-progress");
        if (!container) return;

        container.replaceChildren();

        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);

            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const dayNumber = String(date.getDate()).padStart(2, "0");
            const key = `${year}-${month}-${dayNumber}`;

            const dayData = logs[key] || {
                waterMl: 0,
                sleepHours: null,
                mood: "",
                activities: []
            };

            const row = document.createElement("div");
            row.className = "wellness-day-row";

            const dateLabel = document.createElement("span");
            dateLabel.textContent = date.toLocaleDateString("en-IN", {
                weekday: "short",
                day: "numeric",
                month: "short"
            });

            const progress = document.createElement("div");
            progress.className = "wellness-day-progress";

            const bar = document.createElement("div");
            bar.className = "wellness-day-progress-bar";
            bar.style.width = `${getScore(dayData)}%`;

            progress.appendChild(bar);

            const scoreLabel = document.createElement("span");
            scoreLabel.textContent = `${getScore(dayData)}%`;

            row.append(dateLabel, progress, scoreLabel);
            container.appendChild(row);
        }
    };

    // Water tracker
    document.querySelectorAll("[data-water]").forEach((button) => {
        button.addEventListener("click", () => {
            const amount = Number(button.dataset.water);
            if (!Number.isFinite(amount) || amount <= 0) return;

            const day = getToday();
            day.waterMl += amount;

            saveLogs();
            render();
            showStatus("Water intake updated!");
        });
    });

    const waterReset = $("#water-reset");
    if (waterReset) {
        waterReset.addEventListener("click", () => {
            getToday().waterMl = 0;
            saveLogs();
            render();
            showStatus("Water tracker reset.");
        });
    }

    // Sleep tracker
    const saveSleep = $("#wellness-save-sleep");
    if (saveSleep) {
        saveSleep.addEventListener("click", () => {
            const input = $("#wellness-sleep-hours");
            const hours = Number(input?.value);

            if (
                !input ||
                input.value.trim() === "" ||
                !Number.isFinite(hours) ||
                hours < 0 ||
                hours > 24
            ) {
                showStatus("Please enter sleep between 0 and 24 hours.");
                return;
            }

            getToday().sleepHours = hours;
            saveLogs();
            render();
            showStatus("Sleep hours saved!");
        });
    }

    // Mood tracker
    document.querySelectorAll("[data-mood]").forEach((button) => {
        button.addEventListener("click", () => {
            getToday().mood = button.dataset.mood;
            saveLogs();
            render();
            showStatus("Mood saved!");
        });
    });

    // Activity tracker
    const saveActivity = $("#wellness-save-activity");
    if (saveActivity) {
        saveActivity.addEventListener("click", () => {
            const type = $("#wellness-activity-type")?.value;
            const minutesInput = $("#wellness-activity-minutes");
            const minutes = Number(minutesInput?.value);

            if (
                !type ||
                !minutesInput ||
                minutesInput.value.trim() === "" ||
                !Number.isFinite(minutes) ||
                minutes <= 0 ||
                minutes > 1440
            ) {
                showStatus("Enter a valid activity duration (1–1440 minutes).");
                return;
            }

            getToday().activities.push({ type, minutes });
            saveLogs();
            render();

            minutesInput.value = "";
            showStatus("Activity saved!");
        });
    }

    render();
})();


/* ==========================================
   HEALTHORA FUTURESELF
   Simulation + Mood Patterns + Reset
   Uses existing Wellness Tracker localStorage
========================================== */

(() => {
    "use strict";

    const LOG_KEY = "healthoraWellnessLogsV1";

    const $ = (id) => document.getElementById(id);

    const page = $("futureself");

    // Do nothing if the FutureSelf page is not present
    if (!page) return;

    const waterSlider = $("fs-water");
    const sleepSlider = $("fs-sleep");
    const activitySlider = $("fs-activity");
    const moodSelect = $("fs-mood");

    const simulateBtn = $("fs-simulate");
    const resetBtn = $("fs-reset");
    const refreshPatternsBtn = $("fs-refresh-patterns");

    // Stop safely if the main controls are missing
    if (
        !waterSlider ||
        !sleepSlider ||
        !activitySlider ||
        !moodSelect
    ) {
        console.error("FutureSelf: Required controls are missing.");
        return;
    }

    /* ==========================================
       1. READ WELLNESS DATA
    ========================================== */

    function getLogs() {
        try {
            const saved = localStorage.getItem(LOG_KEY);

            if (!saved) return {};

            const parsed = JSON.parse(saved);

            return parsed && typeof parsed === "object" &&
                !Array.isArray(parsed)
                ? parsed
                : {};
        } catch (error) {
            console.error("FutureSelf: Could not read wellness data.", error);
            return {};
        }
    }

    function getTodayKey() {
        const now = new Date();

        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }

    function getTodayLog() {
        const logs = getLogs();

        return logs[getTodayKey()] || {
            waterMl: 0,
            sleepHours: null,
            mood: "",
            activities: []
        };
    }

    function getActivityMinutes(activities) {
        if (!Array.isArray(activities)) return 0;

        return activities.reduce((total, activity) => {
            const minutes = Number(
                activity?.minutes ?? activity?.duration ?? 0
            );

            return total + (
                Number.isFinite(minutes) && minutes > 0
                    ? minutes
                    : 0
            );
        }, 0);
    }

    /* ==========================================
       2. SCORE CALCULATION
       Four criteria, 25 points each
    ========================================== */

    function calculateScore(data) {
        let score = 0;

        const water = Number(data.waterMl) || 0;
        const sleep = Number(data.sleepHours) || 0;
        const activity = Number(data.activityMinutes) || 0;
        const mood = String(data.mood || "").toLowerCase();

        if (water >= 2000) score += 25;

        if (sleep >= 7 && sleep <= 9) score += 25;

        if (["great", "good", "okay", "low"].includes(mood)) {
            score += 25;
        }

        if (activity >= 30) score += 25;

        return score;
    }

    function getActualTodayData() {
        const today = getTodayLog();

        return {
            waterMl: Number(today.waterMl) || 0,
            sleepHours: Number(today.sleepHours) || 0,
            activityMinutes: getActivityMinutes(today.activities),
            mood: today.mood || ""
        };
    }

    /* ==========================================
       3. UPDATE SLIDER LABELS
    ========================================== */

    function updateSliderLabels() {
        const waterValue = Number(waterSlider.value) || 0;
        const sleepValue = Number(sleepSlider.value) || 0;
        const activityValue = Number(activitySlider.value) || 0;

        if ($("fs-water-value")) {
            $("fs-water-value").textContent =
                `${waterValue.toLocaleString()} ml`;
        }

        if ($("fs-sleep-value")) {
            $("fs-sleep-value").textContent =
                `${sleepValue} hours`;
        }

        if ($("fs-activity-value")) {
            $("fs-activity-value").textContent =
                `${activityValue} minutes`;
        }
    }

    /* ==========================================
       4. CURRENT WELLNESS SCORE
    ========================================== */

    function updateCurrentScore() {
        const actualData = getActualTodayData();
        const score = calculateScore(actualData);

        if ($("fs-current-score")) {
            $("fs-current-score").textContent = `${score}/100`;
        }

        return score;
    }

    /* ==========================================
       5. FUTURESELF SIMULATION
    ========================================== */

    function getSimulationData() {
        return {
            waterMl: Number(waterSlider.value) || 0,
            sleepHours: Number(sleepSlider.value) || 0,
            activityMinutes: Number(activitySlider.value) || 0,
            mood: moodSelect.value || ""
        };
    }

    function getInsight(data, score, difference) {
        if (score === 100) {
            return {
                insight:
                    "Your selected habits meet all four FutureSelf wellness targets. Keep building consistent routines.",
                next:
                    "Maintain your hydration, sleep, movement and emotional check-ins."
            };
        }

        if (data.mood === "") {
            return {
                insight:
                    "Your emotional check-in has not been selected. FutureSelf includes mood as one part of your wellness picture.",
                next:
                    "Choose a mood and explore how your overall score changes."
            };
        }

        if (data.waterMl < 2000) {
            return {
                insight:
                    "Your selected hydration level is below the 2,000 ml target used in this simulation.",
                next:
                    "Try increasing your water target gradually, according to your needs."
            };
        }

        if (data.sleepHours < 7) {
            return {
                insight:
                    "Your selected sleep duration is below the 7-hour target used in this simulation.",
                next:
                    "Explore a consistent bedtime and wake-up routine."
            };
        }

        if (data.sleepHours > 9) {
            return {
                insight:
                    "Your selected sleep duration is above the 7–9 hour range used in this simulation. Sleep needs vary by person.",
                next:
                    "Consider your energy levels and usual sleep schedule when planning your routine."
            };
        }

        if (data.activityMinutes < 30) {
            return {
                insight:
                    "Your selected activity is below the 30-minute target used in this simulation.",
                next:
                    "Consider adding a walk or another activity that suits your ability."
            };
        }

        if (difference > 0) {
            return {
                insight:
                    "Your selected habits improve your simulated score compared with today's recorded habits.",
                next:
                    "Choose small, realistic changes that you can maintain consistently."
            };
        }

        return {
            insight:
                "Your score reflects the four selected wellness targets, not a medical assessment or a prediction of your actual future health.",
            next:
                "Adjust one habit at a time and compare the results."
        };
    }

    function runSimulation() {
        updateSliderLabels();

        const actualScore = updateCurrentScore();
        const simulationData = getSimulationData();
        const futureScore = calculateScore(simulationData);
        const difference = futureScore - actualScore;

        if ($("fs-future-score")) {
            $("fs-future-score").textContent = `${futureScore}/100`;
        }

        if ($("fs-score-change")) {
            if (difference > 0) {
                $("fs-score-change").textContent =
                    `+${difference} points`;
            } else if (difference < 0) {
                $("fs-score-change").textContent =
                    `${difference} points`;
            } else {
                $("fs-score-change").textContent = "No change";
            }
        }

        if ($("fs-score-bar")) {
            $("fs-score-bar").style.width = `${futureScore}%`;
            $("fs-score-bar").setAttribute(
                "aria-valuenow",
                String(futureScore)
            );
        }

        const result = getInsight(
            simulationData,
            futureScore,
            difference
        );

        if ($("fs-insight")) {
            $("fs-insight").textContent = result.insight;
        }

        if ($("fs-next-step")) {
            $("fs-next-step").textContent = result.next;
        }
    }

    /* ==========================================
       6. MOOD PATTERN ANALYSIS
    ========================================== */

    function refreshMoodPatterns() {
        // Always fetch the latest saved data
        const logs = getLogs();
        const entries = Object.entries(logs).filter(
            ([, record]) =>
                record &&
                typeof record === "object" &&
                !Array.isArray(record)
        );

        const moodCounts = {
            Great: 0,
            Good: 0,
            Okay: 0,
            Low: 0
        };

        const sleepRecords = [];
        const lowMoodSleep = [];
        const otherMoodSleep = [];

        let recordedDays = 0;

        entries.forEach(([, record]) => {
            const mood = String(record.mood || "").toLowerCase();

            const hasWater = Number(record.waterMl) > 0;
            const hasSleep =
                record.sleepHours !== null &&
                record.sleepHours !== undefined &&
                record.sleepHours !== "";

            const hasMood = [
                "great",
                "good",
                "okay",
                "low"
            ].includes(mood);

            const hasActivity =
                Array.isArray(record.activities) &&
                record.activities.length > 0;

            if (hasWater || hasSleep || hasMood || hasActivity) {
                recordedDays++;
            }

            if (hasMood) {
                const displayMood =
                    mood.charAt(0).toUpperCase() + mood.slice(1);

                moodCounts[displayMood]++;
            }

            if (hasSleep) {
                const sleep = Number(record.sleepHours);

                if (Number.isFinite(sleep) && sleep > 0 && sleep <= 24) {
                    sleepRecords.push(sleep);

                    if (mood === "low") {
                        lowMoodSleep.push(sleep);
                    } else if (hasMood) {
                        otherMoodSleep.push(sleep);
                    }
                }
            }
        });

        // Total days with at least one recorded wellness activity
        if ($("fs-days-recorded")) {
            $("fs-days-recorded").textContent = String(recordedDays);
        }

        // Most frequently recorded mood
        const moodEntries = Object.entries(moodCounts).filter(
            ([, count]) => count > 0
        );

        let commonMood = "Not enough data";

        if (moodEntries.length > 0) {
            const maxCount = Math.max(
                ...moodEntries.map(([, count]) => count)
            );

            const mostCommon = moodEntries
                .filter(([, count]) => count === maxCount)
                .map(([mood]) => mood);

            commonMood = mostCommon.join(" / ");
        }

        if ($("fs-common-mood")) {
            $("fs-common-mood").textContent = commonMood;
        }

        // Average sleep duration
        let averageSleep = "Not enough data";

        if (sleepRecords.length > 0) {
            const average =
                sleepRecords.reduce((sum, hours) => sum + hours, 0) /
                sleepRecords.length;

            averageSleep = `${average.toFixed(1)} hours`;
        }

        if ($("fs-average-sleep")) {
            $("fs-average-sleep").textContent = averageSleep;
        }

        // Look for a possible sleep/mood association
        let patternInsight =
            "Record your sleep and mood across multiple days to explore possible patterns.";

        if (
            lowMoodSleep.length >= 2 &&
            otherMoodSleep.length >= 2
        ) {
            const lowAverage =
                lowMoodSleep.reduce((sum, value) => sum + value, 0) /
                lowMoodSleep.length;

            const otherAverage =
                otherMoodSleep.reduce((sum, value) => sum + value, 0) /
                otherMoodSleep.length;

            const difference = lowAverage - otherAverage;

            if (difference <= -0.5) {
                patternInsight =
                    `On recorded Low-mood days, average sleep was ${Math.abs(difference).toFixed(1)} hours lower than on other mood-recorded days. This is an association, not proof that sleep caused the mood.`;
            } else if (difference >= 0.5) {
                patternInsight =
                    `On recorded Low-mood days, average sleep was ${difference.toFixed(1)} hours higher than on other mood-recorded days. This is an association, not proof that sleep caused the mood.`;
            } else {
                patternInsight =
                    "Your recorded sleep averages are fairly similar between Low-mood days and other mood-recorded days. More data may reveal different patterns.";
            }
        } else if (sleepRecords.length >= 3) {
            patternInsight =
                "Sleep records are available, but more days with recorded moods are needed to explore a sleep/mood pattern.";
        }

        if ($("fs-pattern-insight")) {
            $("fs-pattern-insight").textContent = patternInsight;
        }

        // Return a result so the refresh action can be checked in the console
        return {
            recordedDays,
            moodCounts,
            averageSleep,
            patternInsight
        };
    }

    /* ==========================================
       7. RESET SIMULATION
    ========================================== */

    function resetSimulation() {
        waterSlider.value = "2000";
        sleepSlider.value = "8";
        activitySlider.value = "30";
        moodSelect.value = "0";

        updateSliderLabels();

        if ($("fs-future-score")) {
            $("fs-future-score").textContent = "—";
        }

        if ($("fs-score-change")) {
            $("fs-score-change").textContent = "—";
        }

        if ($("fs-score-bar")) {
            $("fs-score-bar").style.width = "0%";
            $("fs-score-bar").setAttribute("aria-valuenow", "0");
        }

        if ($("fs-insight")) {
            $("fs-insight").textContent =
                "Adjust your habits and select Simulate My Future to explore a possible wellness score.";
        }

        if ($("fs-next-step")) {
            $("fs-next-step").textContent =
                "Small, consistent habits can help you build a routine.";
        }

        updateCurrentScore();
    }

    /* ==========================================
       8. EVENT LISTENERS
    ========================================== */

    // Update values as the sliders move
    waterSlider.addEventListener("input", updateSliderLabels);
    sleepSlider.addEventListener("input", updateSliderLabels);
    activitySlider.addEventListener("input", updateSliderLabels);

    // Simulate button
    if (simulateBtn) {
        simulateBtn.addEventListener("click", (event) => {
            event.preventDefault();
            runSimulation();
        });
    }

    // Reset button
    if (resetBtn) {
        resetBtn.addEventListener("click", (event) => {
            event.preventDefault();
            resetSimulation();
        });
    }

    // FIX: Refresh Patterns button explicitly refreshes the analysis
    if (refreshPatternsBtn) {
        refreshPatternsBtn.addEventListener("click", (event) => {
            event.preventDefault();

            refreshMoodPatterns();
            updateCurrentScore();

            refreshPatternsBtn.textContent = "Patterns Refreshed!";

            window.setTimeout(() => {
                if (refreshPatternsBtn.isConnected) {
                    refreshPatternsBtn.textContent = "Refresh Patterns";
                }
            }, 1500);
        });
    }

    // Refresh if Wellness Tracker data changes in another browser tab
    window.addEventListener("storage", (event) => {
        if (event.key === LOG_KEY || event.key === null) {
            updateCurrentScore();
            refreshMoodPatterns();
        }
    });

    /* ==========================================
       9. INITIAL LOAD
    ========================================== */

    updateSliderLabels();
    updateCurrentScore();
    refreshMoodPatterns();

})();

/* ==========================================
   HEALTHORA — SMART HABIT STREAKS
   Connects to Wellness Tracker localStorage
========================================== */

(() => {
    "use strict";

    const LOG_KEY = "healthoraWellnessLogsV1";
    const $ = (id) => document.getElementById(id);

    const page = $("habitstreaks");

    if (!page) return;

    // Read wellness logs safely
    function getLogs() {
        try {
            const parsed = JSON.parse(
                localStorage.getItem(LOG_KEY) || "{}"
            );

            return parsed &&
                typeof parsed === "object" &&
                !Array.isArray(parsed)
                ? parsed
                : {};
        } catch (error) {
            console.error("Habit Streaks: Unable to read wellness logs.", error);
            return {};
        }
    }

    function dateKey(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }

    function parseDate(key) {
        const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(key);

        if (!match) return null;

        const date = new Date(
            Number(match[1]),
            Number(match[2]) - 1,
            Number(match[3])
        );

        return dateKey(date) === key ? date : null;
    }

    function shiftDate(date, amount) {
        const result = new Date(date);
        result.setDate(result.getDate() + amount);
        return result;
    }

    function getActivityMinutes(activities) {
        if (!Array.isArray(activities)) return 0;

        return activities.reduce((total, item) => {
            const minutes = Number(
                item?.minutes ?? item?.duration ?? 0
            );

            return total + (
                Number.isFinite(minutes) && minutes > 0
                    ? minutes
                    : 0
            );
        }, 0);
    }

    // Determine which of the four habits were completed
    function getHabitStatus(log) {
        if (!log || typeof log !== "object") {
            return {
                water: false,
                sleep: false,
                mood: false,
                activity: false
            };
        }

        const water = Number(log.waterMl) || 0;
        const sleep = Number(log.sleepHours) || 0;
        const mood = String(log.mood || "").toLowerCase();
        const activity = getActivityMinutes(log.activities);

        return {
            water: water >= 2000,
            sleep: sleep >= 7 && sleep <= 9,
            mood: ["great", "good", "okay", "low"].includes(mood),
            activity: activity >= 30
        };
    }

    function getCompletedCount(status) {
        return Object.values(status).filter(Boolean).length;
    }

    // Update each habit status on the page
    function updateHabitRow(id, completed) {
        const element = $(id);

        if (!element) return;

        element.textContent = completed ? "✓ Complete" : "Pending";
        element.classList.toggle("completed", completed);
    }

    function updateChecklist(todayLog) {
        const status = getHabitStatus(todayLog);
        const completed = getCompletedCount(status);
        const percentage = Math.round((completed / 4) * 100);

        updateHabitRow("streak-water-status", status.water);
        updateHabitRow("streak-sleep-status", status.sleep);
        updateHabitRow("streak-mood-status", status.mood);
        updateHabitRow("streak-activity-status", status.activity);

        if ($("streak-completed")) {
            $("streak-completed").textContent = `${completed}/4`;
        }

        if ($("streak-progress-bar")) {
            $("streak-progress-bar").style.width = `${percentage}%`;
        }

        if ($("streak-progress-text")) {
            $("streak-progress-text").textContent =
                `${percentage}% completed today`;
        }

        if ($("streak-message")) {
            if (completed === 4) {
                $("streak-message").textContent =
                    "🎉 Amazing! All four wellness goals are complete today.";
            } else if (completed > 0) {
                $("streak-message").textContent =
                    `Nice progress! ${completed} of 4 habits completed. Keep going at your own pace.`;
            } else {
                $("streak-message").textContent =
                    "Start by recording your water, sleep, mood and activity in Wellness Tracker.";
            }
        }
    }

    /*
      A streak day is a day on which all four wellness goals
      were recorded as complete. Only saved dates count.
    */
    function getStreakStats(logs) {
        const today = new Date();
        const todayKey = dateKey(today);

        const completeDates = new Set();

        Object.entries(logs).forEach(([key, log]) => {
            if (!parseDate(key)) return;

            const status = getHabitStatus(log);

            if (getCompletedCount(status) === 4) {
                completeDates.add(key);
            }
        });

        // Current streak can include today, or yesterday if today
        // has not yet been completed.
        let cursor = today;

        if (!completeDates.has(todayKey)) {
            const yesterdayKey = dateKey(shiftDate(today, -1));

            if (completeDates.has(yesterdayKey)) {
                cursor = shiftDate(today, -1);
            } else {
                cursor = null;
            }
        }

        let currentStreak = 0;

        if (cursor) {
            while (completeDates.has(dateKey(cursor))) {
                currentStreak++;
                cursor = shiftDate(cursor, -1);

                // Safety limit for malformed or extremely old data
                if (currentStreak > 10000) break;
            }
        }

        // Calculate the longest consecutive completed streak
        const sortedDates = [...completeDates].sort();
        let bestStreak = 0;
        let runningStreak = 0;
        let previousDate = null;

        sortedDates.forEach((key) => {
            const currentDate = parseDate(key);

            if (!currentDate) return;

            if (
                previousDate &&
                dateKey(shiftDate(previousDate, 1)) === key
            ) {
                runningStreak++;
            } else {
                runningStreak = 1;
            }

            bestStreak = Math.max(bestStreak, runningStreak);
            previousDate = currentDate;
        });

        // Count days with at least one actual wellness entry
        const recordedDays = Object.entries(logs).filter(
            ([key, log]) => {
                if (!parseDate(key) || !log || typeof log !== "object") {
                    return false;
                }

                const hasWater = Number(log.waterMl) > 0;

                const hasSleep =
                    log.sleepHours !== null &&
                    log.sleepHours !== undefined &&
                    log.sleepHours !== "" &&
                    Number(log.sleepHours) > 0;

                const hasMood = Boolean(log.mood);

                const hasActivity =
                    Array.isArray(log.activities) &&
                    log.activities.length > 0;

                return hasWater || hasSleep || hasMood || hasActivity;
            }
        ).length;

        return {
            currentStreak,
            bestStreak,
            recordedDays
        };
    }

    function updateAchievements(currentStreak, bestStreak) {
        const highestStreak = Math.max(currentStreak, bestStreak);

        const achievements = [
            { id: "badge-3", target: 3 },
            { id: "badge-7", target: 7 },
            { id: "badge-30", target: 30 }
        ];

        achievements.forEach(({ id, target }) => {
            const card = $(id);

            if (!card) return;

            const unlocked = highestStreak >= target;
            card.classList.toggle("unlocked", unlocked);

            const status = card.querySelector("strong");

            if (status) {
                status.textContent = unlocked ? "✓ Unlocked" : "Locked";
            }
        });
    }

    function updateNextMilestone(currentStreak) {
        const milestones = [3, 7, 30];

        const next = milestones.find(
            (milestone) => milestone > currentStreak
        );

        if ($("streak-next-goal")) {
            $("streak-next-goal").textContent =
                next !== undefined ? `${next} Days` : "All achieved!";
        }
    }

    function refreshHabitStreaks() {
        const logs = getLogs();
        const todayKey = dateKey(new Date());
        const todayLog = logs[todayKey] || {};

        updateChecklist(todayLog);

        const stats = getStreakStats(logs);

        if ($("streak-current")) {
            $("streak-current").textContent =
                `${stats.currentStreak} ${stats.currentStreak === 1 ? "Day" : "Days"}`;
        }

        if ($("streak-best")) {
            $("streak-best").textContent =
                `Best streak: ${stats.bestStreak} ${stats.bestStreak === 1 ? "day" : "days"}`;
        }

        if ($("streak-total-days")) {
            $("streak-total-days").textContent =
                String(stats.recordedDays);
        }

        updateAchievements(stats.currentStreak, stats.bestStreak);
        updateNextMilestone(stats.currentStreak);
    }

    // Refresh whenever the user navigates to Habit Streaks
    document.querySelectorAll('[data-page="habitstreaks"]').forEach((button) => {
        button.addEventListener("click", refreshHabitStreaks);
    });

    // Also refresh when Wellness Tracker data changes in another tab
    window.addEventListener("storage", (event) => {
        if (event.key === LOG_KEY || event.key === null) {
            refreshHabitStreaks();
        }
    });

    // Refresh on initial load
    refreshHabitStreaks();

    // Expose a namespaced refresh function for same-tab updates
    window.healthoraHabitStreaksRefresh = refreshHabitStreaks;
})();

/* ==========================================
   HEALTHORA — WEEKLY WELLNESS REPORTS
   Uses healthoraWellnessLogsV1
========================================== */

(() => {
    "use strict";

    const LOG_KEY = "healthoraWellnessLogsV1";
    const $ = (id) => document.getElementById(id);

    if (!$("wellnessreports")) return;

    function getLogs() {
        try {
            const value = JSON.parse(
                localStorage.getItem(LOG_KEY) || "{}"
            );

            return value &&
                typeof value === "object" &&
                !Array.isArray(value)
                ? value
                : {};
        } catch (error) {
            console.error("Wellness Reports: Could not read saved data.", error);
            return {};
        }
    }

    function getDateKey(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }

    function getActivityMinutes(activities) {
        if (!Array.isArray(activities)) return 0;

        return activities.reduce((total, activity) => {
            const minutes = Number(
                activity?.minutes ?? activity?.duration ?? 0
            );

            return total + (
                Number.isFinite(minutes) && minutes > 0
                    ? minutes
                    : 0
            );
        }, 0);
    }

    function getDayData(log) {
        const record = log && typeof log === "object" ? log : {};

        const water = Number(record.waterMl) || 0;
        const sleep = Number(record.sleepHours) || 0;
        const activity = getActivityMinutes(record.activities);
        const mood = String(record.mood || "").toLowerCase();

        const hasWater = water > 0;
        const hasSleep =
            record.sleepHours !== null &&
            record.sleepHours !== undefined &&
            record.sleepHours !== "" &&
            sleep > 0 &&
            sleep <= 24;

        const hasActivity = Array.isArray(record.activities) &&
            record.activities.length > 0;

        const hasMood = ["great", "good", "okay", "low"].includes(mood);

        const recorded = hasWater || hasSleep || hasActivity || hasMood;

        const waterDone = water >= 2000;
        const sleepDone = sleep >= 7 && sleep <= 9;
        const activityDone = activity >= 30;
        const moodDone = hasMood;

        const score =
            (waterDone ? 25 : 0) +
            (sleepDone ? 25 : 0) +
            (moodDone ? 25 : 0) +
            (activityDone ? 25 : 0);

        return {
            water,
            sleep: hasSleep ? sleep : null,
            activity,
            mood,
            recorded,
            waterDone,
            sleepDone,
            activityDone,
            moodDone,
            score
        };
    }

    function setText(id, value) {
        const element = $(id);
        if (element) element.textContent = value;
    }

    function setProgress(barId, labelId, percentage) {
        const safePercentage = Math.max(0, Math.min(100, percentage));
        const bar = $(barId);

        if (bar) {
            bar.style.width = `${safePercentage}%`;
            bar.setAttribute("aria-valuemin", "0");
            bar.setAttribute("aria-valuemax", "100");
            bar.setAttribute("aria-valuenow", String(safePercentage));
        }

        setText(labelId, `${safePercentage}%`);
    }

    function createInsight(text) {
        const item = document.createElement("div");
        item.textContent = text;
        return item;
    }

    function renderMessages(containerId, messages, emptyMessage) {
        const container = $(containerId);
        if (!container) return;

        container.replaceChildren();

        if (!messages.length) {
            const paragraph = document.createElement("p");
            paragraph.textContent = emptyMessage;
            container.appendChild(paragraph);
            return;
        }

        messages.forEach((message) => {
            container.appendChild(createInsight(message));
        });
    }

    function buildReport() {
        const logs = getLogs();
        const today = new Date();

        const days = [];

        // Last seven calendar days, including today
        for (let offset = 6; offset >= 0; offset--) {
            const date = new Date(today);
            date.setDate(today.getDate() - offset);

            const key = getDateKey(date);
            const data = getDayData(logs[key]);

            days.push({ key, data });
        }

        const recordedDays = days.filter(
            (day) => day.data.recorded
        );

        // Averages use only days with the corresponding data recorded
        const average = (values) => {
            if (!values.length) return null;

            return values.reduce((sum, value) => sum + value, 0) /
                values.length;
        };

        const waterValues = recordedDays
            .filter((day) => day.data.water > 0)
            .map((day) => day.data.water);

        const sleepValues = recordedDays
            .filter((day) => day.data.sleep !== null)
            .map((day) => day.data.sleep);

        const activityValues = recordedDays
            .filter((day) => Array.isArray(logs[day.key]?.activities) &&
                logs[day.key].activities.length > 0)
            .map((day) => day.data.activity);

        const averageWater = average(waterValues);
        const averageSleep = average(sleepValues);
        const averageActivity = average(activityValues);

        const recordedScores = recordedDays.map(
            (day) => day.data.score
        );

        const weeklyScore = average(recordedScores);

        setText(
            "wr-week-score",
            weeklyScore === null ? "—" : Math.round(weeklyScore)
        );

        // Show denominator separately in existing HTML
        const scoreHeading = $("wr-week-score");
        if (scoreHeading) {
            const small = scoreHeading.querySelector("small");

            if (small) small.textContent = "/100";
        }

        setText("wr-days", `${recordedDays.length}/7`);

        setText(
            "wr-water",
            averageWater === null
                ? "—"
                : `${Math.round(averageWater).toLocaleString()} ml`
        );

        setText(
            "wr-sleep",
            averageSleep === null
                ? "—"
                : `${averageSleep.toFixed(1)} hrs`
        );

        setText(
            "wr-activity",
            averageActivity === null
                ? "—"
                : `${Math.round(averageActivity)} min`
        );

        const goalPercentage = (property) => {
            const eligibleDays = recordedDays.filter(
                (day) => day.data.recorded
            );

            if (!eligibleDays.length) return 0;

            return Math.round(
                eligibleDays.filter((day) => day.data[property]).length /
                eligibleDays.length * 100
            );
        };

        setProgress(
            "wr-water-bar",
            "wr-water-percent",
            goalPercentage("waterDone")
        );

        setProgress(
            "wr-sleep-bar",
            "wr-sleep-percent",
            goalPercentage("sleepDone")
        );

        setProgress(
            "wr-activity-bar",
            "wr-activity-percent",
            goalPercentage("activityDone")
        );

        setProgress(
            "wr-mood-bar",
            "wr-mood-percent",
            goalPercentage("moodDone")
        );

        /* Weekly summary */

        let summary;

        if (recordedDays.length === 0) {
            summary =
                "No wellness entries were found in the last seven days. Start logging your habits to build your weekly report.";
        } else if (weeklyScore >= 75) {
            summary =
                `Your average recorded habit score is ${Math.round(weeklyScore)}/100 across ${recordedDays.length} recorded day(s). Several of your selected wellness targets are being met.`;
        } else if (weeklyScore >= 50) {
            summary =
                `Your average recorded habit score is ${Math.round(weeklyScore)}/100 across ${recordedDays.length} recorded day(s). Small, consistent changes may help you meet more of your chosen targets.`;
        } else {
            summary =
                `Your average recorded habit score is ${Math.round(weeklyScore)}/100 across ${recordedDays.length} recorded day(s). Focus on achievable routines and continue recording your progress.`;
        }

        setText("wr-week-summary", summary);

        /* Insights */

        const insights = [];
        const recommendations = [];

        if (!recordedDays.length) {
            insights.push(
                "Your report will become more informative after you record daily wellness data."
            );

            recommendations.push(
                "Start with a water entry, a sleep record, a mood check-in and an activity entry in Wellness Tracker."
            );
        } else {
            if (averageWater !== null) {
                const waterPercent = goalPercentage("waterDone");

                insights.push(
                    `Average recorded water intake: ${Math.round(averageWater).toLocaleString()} ml per day with water data.`
                );

                if (waterPercent < 100) {
                    recommendations.push(
                        "Review your hydration routine and set a realistic water goal that suits your needs."
                    );
                }
            }

            if (averageSleep !== null) {
                insights.push(
                    `Average recorded sleep: ${averageSleep.toFixed(1)} hours on days with sleep data.`
                );

                if (goalPercentage("sleepDone") < 100) {
                    recommendations.push(
                        "Consider a consistent sleep and wake-up schedule. Individual sleep needs can vary."
                    );
                }
            }

            if (averageActivity !== null) {
                insights.push(
                    `Average recorded activity: ${Math.round(averageActivity)} minutes on days with activity entries.`
                );

                if (goalPercentage("activityDone") < 100) {
                    recommendations.push(
                        "Consider adding manageable movement sessions that fit your routine and abilities."
                    );
                }
            }

            const moodCounts = {
                great: 0,
                good: 0,
                okay: 0,
                low: 0
            };

            recordedDays.forEach(({ data }) => {
                if (Object.prototype.hasOwnProperty.call(
                    moodCounts,
                    data.mood
                )) {
                    moodCounts[data.mood]++;
                }
            });

            const moodsRecorded = Object.values(moodCounts).reduce(
                (sum, count) => sum + count,
                0
            );

            if (moodsRecorded > 0) {
                const mostCommonMood = Object.entries(moodCounts)
                    .filter(([, count]) => count > 0)
                    .sort((a, b) => b[1] - a[1])[0][0];

                insights.push(
                    `Your most frequently recorded mood was "${mostCommonMood.charAt(0).toUpperCase() + mostCommonMood.slice(1)}". This reflects your check-ins, not a clinical assessment.`
                );
            } else {
                recommendations.push(
                    "Record your mood when you use Wellness Tracker to include emotional check-ins in future reports."
                );
            }

            insights.push(
                `${recordedDays.length} out of 7 days had at least one recorded wellness entry.`
            );

            if (recordedDays.length < 7) {
                recommendations.push(
                    "Try recording your habits regularly. Missing entries are not counted as completed goals."
                );
            }
        }

        renderMessages(
            "wr-insights",
            insights,
            "No insights available yet."
        );

        renderMessages(
            "wr-recommendations",
            recommendations,
            "Keep recording your habits to receive suggestions."
        );
    }

    // Refresh button
    const refreshButton = $("wr-refresh");

    if (refreshButton) {
        refreshButton.addEventListener("click", (event) => {
            event.preventDefault();
            buildReport();

            refreshButton.textContent = "Report Updated!";

            window.setTimeout(() => {
                if (refreshButton.isConnected) {
                    refreshButton.textContent = "Refresh Report";
                }
            }, 1500);
        });
    }

    // Refresh when opening this page
    document.querySelectorAll(
        '[data-page="wellnessreports"]'
    ).forEach((button) => {
        button.addEventListener("click", buildReport);
    });

    // Sync changes made in another browser tab
    window.addEventListener("storage", (event) => {
        if (event.key === LOG_KEY || event.key === null) {
            buildReport();
        }
    });

    // Initial render
    buildReport();

    // Available for same-tab Wellness Tracker integration
    window.healthoraWellnessReportsRefresh = buildReport;
})();


/* ===== Healthora Smart Health Insights ===== */

(() => {
  const STORAGE_KEY = "healthoraWellnessLogsV1";

  const $ = (id) => document.getElementById(id);

  const elements = {
    summary: $("shi-summary"),
    water: $("shi-water"),
    sleep: $("shi-sleep"),
    activity: $("shi-activity"),
    mood: $("shi-mood"),
    recommendations: $("shi-recommendations"),
    refresh: $("shi-refresh")
  };

  // Prevent errors if the section has not been added yet.
  if (Object.values(elements).some((element) => !element)) {
    console.warn(
      "Healthora Smart Insights: Required HTML elements were not found."
    );
    return;
  }

  function getLogs() {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");

      if (!stored || typeof stored !== "object" || Array.isArray(stored)) {
        return {};
      }

      return stored;
    } catch (error) {
      console.error("Could not read wellness records:", error);
      return {};
    }
  }

  function getRecentRecords(logs, days = 7) {
    const records = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - i
      );

      const key = [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0")
      ].join("-");

      if (logs[key] && typeof logs[key] === "object") {
        records.push({ date: key, ...logs[key] });
      }
    }

    return records;
  }

  function average(values) {
    return values.length
      ? values.reduce((sum, value) => sum + value, 0) / values.length
      : null;
  }

  function addRecommendation(title, message) {
    const card = document.createElement("div");
    card.className = "shi-recommendation";

    const heading = document.createElement("strong");
    heading.textContent = title;

    const description = document.createElement("span");
    description.textContent = message;

    card.append(heading, description);
    elements.recommendations.appendChild(card);
  }

  function renderInsights() {
    const records = getRecentRecords(getLogs());

    elements.recommendations.replaceChildren();

    if (!records.length) {
      elements.summary.textContent =
        "Your wellness journey starts here. Record your daily habits to unlock personalized insights.";

      elements.water.textContent = "No water records found for the last 7 days.";
      elements.sleep.textContent = "No sleep records found for the last 7 days.";
      elements.activity.textContent = "No activity records found for the last 7 days.";
      elements.mood.textContent = "No mood records found for the last 7 days.";

      addRecommendation(
        "Start with one small step",
        "Log your water intake, sleep, mood, and activity in Wellness Tracker. Your insights will update from those records."
      );

      return;
    }

    const waterValues = records
      .filter((record) =>
        Number.isFinite(Number(record.waterMl)) &&
        record.waterMl !== null &&
        record.waterMl !== ""
      )
      .map((record) => Number(record.waterMl));

    const sleepValues = records
      .filter((record) =>
        record.sleepHours !== null &&
        record.sleepHours !== "" &&
        Number.isFinite(Number(record.sleepHours)) &&
        Number(record.sleepHours) >= 0 &&
        Number(record.sleepHours) <= 24
      )
      .map((record) => Number(record.sleepHours));

    const activityValues = records
      .map((record) => {
        if (!Array.isArray(record.activities)) return null;

        return record.activities.reduce((sum, activity) => {
          const minutes = Number(activity.minutes);
          return sum + (
            Number.isFinite(minutes) && minutes > 0 ? minutes : 0
          );
        }, 0);
      })
      .filter((value) => value !== null);

    const moodValues = records
      .map((record) => record.mood)
      .filter((mood) =>
        typeof mood === "string" && mood.trim().length > 0
      );

    const avgWater = average(waterValues);
    const avgSleep = average(sleepValues);
    const avgActivity = average(activityValues);

    const moodCounts = {};
    moodValues.forEach((mood) => {
      moodCounts[mood] = (moodCounts[mood] || 0) + 1;
    });

    const commonMood = Object.entries(moodCounts)
      .sort((a, b) => b[1] - a[1])[0];

    elements.summary.textContent =
      `Found ${records.length} day(s) with saved wellness records in the last 7 days. ` +
      "Here is a summary of the information you have logged.";

    elements.water.textContent =
      avgWater === null
        ? "Not enough water data to calculate an average."
        : `Average: ${Math.round(avgWater)} ml per recorded day.`;

    elements.sleep.textContent =
      avgSleep === null
        ? "Not enough sleep data to calculate an average."
        : `Average: ${avgSleep.toFixed(1)} hours per recorded night.`;

    elements.activity.textContent =
      avgActivity === null
        ? "No activity logs available to calculate an average."
        : `Average: ${Math.round(avgActivity)} minutes per recorded day.`;

    elements.mood.textContent =
      commonMood
        ? `Most frequently logged mood: ${commonMood[0]} (${commonMood[1]} time(s)).`
        : "No mood entries available yet.";

    // Personalized suggestions based on logged data.
    if (avgWater !== null) {
      if (avgWater < 1500) {
        addRecommendation(
          "💧 Build a hydration routine",
          "Your logged water intake has been relatively low. Try keeping water nearby and drinking regularly. Individual hydration needs vary."
        );
      } else if (avgWater < 2000) {
        addRecommendation(
          "💧 Keep an eye on hydration",
          "Your recorded intake is approaching 2 litres a day. Review your personal needs, activity level, and climate rather than treating one target as universal."
        );
      } else {
        addRecommendation(
          "💧 Hydration tracking",
          "Your logged intake averages around 2 litres or more per day. Keep tracking and adjust to your own needs."
        );
      }
    }

    if (avgSleep !== null) {
      if (avgSleep < 7) {
        addRecommendation(
          "😴 Make room for sleep",
          "Your recorded sleep averages below 7 hours. If possible, try a consistent bedtime and a relaxing wind-down routine."
        );
      } else if (avgSleep <= 9) {
        addRecommendation(
          "😴 Maintain your sleep routine",
          "Your logged sleep averages 7–9 hours. Consistency and how rested you feel also matter."
        );
      } else {
        addRecommendation(
          "😴 Review your sleep pattern",
          "Your recorded sleep averages over 9 hours. Sleep needs differ; consider how rested you feel and seek professional advice if this is a persistent concern."
        );
      }
    }

    if (avgActivity !== null) {
      if (avgActivity < 30) {
        addRecommendation(
          "🏃 Add movement gradually",
          "Your logged activity averages under 30 minutes per recorded day. If suitable for you, try a short walk or another comfortable activity and build gradually."
        );
      } else {
        addRecommendation(
          "🏃 Keep moving consistently",
          "Your activity logs show regular movement. Choose activities that feel comfortable and sustainable for you."
        );
      }
    }

    if (commonMood) {
      if (commonMood[0].toLowerCase() === "low") {
        addRecommendation(
          "😊 Take care of your wellbeing",
          "You have logged Low as your most frequent mood. Consider a gentle activity, a break, or talking with someone you trust if you need support."
        );
      } else if (commonMood[0].toLowerCase() === "okay") {
        addRecommendation(
          "😊 Check in with yourself",
          "Okay is your most frequently logged mood. Notice whether rest, activity, or your daily routine seems to affect how you feel."
        );
      } else {
        addRecommendation(
          "😊 Notice what supports your mood",
          `${commonMood[0]} is your most frequently logged mood. Reflect on which routines help you feel well without assuming they caused the mood.`
        );
      }
    }

    if (
      avgWater === null &&
      avgSleep === null &&
      avgActivity === null &&
      !commonMood
    ) {
      addRecommendation(
        "Start logging daily habits",
        "Your recent records do not yet contain enough detail for personalized suggestions. Add entries in Wellness Tracker and refresh."
      );
    }

    addRecommendation(
      "📌 Remember",
      "These suggestions use your logged habits only. They cannot diagnose a condition or predict your health."
    );
  }

  console.log("✅ Smart Insights refresh button connected:", elements.refresh);

 elements.refresh.addEventListener("click", async () => {

    // Loading state
    elements.refresh.disabled = true;
    elements.refresh.textContent = "Refreshing...";

    elements.refresh.classList.add("refreshing");

    // Small delay so user can actually see the refresh
    await new Promise(resolve => setTimeout(resolve, 700));

    // Recalculate insights from latest wellness records
    renderInsights();

    // Show updated state
    elements.refresh.textContent = "✓ Insights Updated";

    // Add/update last refreshed text
    let refreshInfo =
        document.getElementById("shi-last-refresh");

    if (!refreshInfo) {

        refreshInfo =
            document.createElement("p");

        refreshInfo.id = "shi-last-refresh";

        refreshInfo.style.marginTop = "8px";
        refreshInfo.style.fontSize = "11px";
        refreshInfo.style.color = "#71827a";

        const header =
            document.querySelector("#smartinsights .section-header");

        if (header) {
            header.appendChild(refreshInfo);
        }
    }

    const now = new Date();

    refreshInfo.textContent =
        "Last updated: " +
        now.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });


    // Restore button
    setTimeout(() => {

        elements.refresh.disabled = false;

        elements.refresh.textContent =
            "Refresh Insights";

        elements.refresh.classList.remove(
            "refreshing"
        );

    }, 1500);

});

  // Refresh when the Smart Insights page is opened.
  document.querySelectorAll('[data-page="smartinsights"]').forEach((button) => {
    button.addEventListener("click", () => {
      renderInsights();
    });
  });

  // Update if another tab changes the wellness records.
  window.addEventListener("storage", (event) => {
    if (event.key === STORAGE_KEY) {
      renderInsights();
    }
  });

  // Allow the Wellness Tracker to refresh this section after saving.
  window.healthoraRefreshSmartInsights = renderInsights;

  renderInsights();
})();

/* ===== Healthora Daily Wellness Tips ===== */
(() => {
  const nextButton = document.getElementById("nextHealthTip");

  if (!nextButton || nextButton.dataset.initialized === "true") {
    return;
  }

  nextButton.dataset.initialized = "true";

  const tips = [
    {
      icon: "💧",
      title: "Stay Hydrated",
      text: "Drink water regularly throughout the day to support your overall well-being.",
      category: "Hydration"
    },
    {
      icon: "🏃",
      title: "Keep Your Body Moving",
      text: "Take short movement breaks during long periods of sitting. Every little bit counts!",
      category: "Fitness"
    },
    {
      icon: "😴",
      title: "Prioritize Your Sleep",
      text: "Try to maintain a consistent bedtime and wake-up time to support healthy sleep habits.",
      category: "Sleep"
    },
    {
      icon: "🥗",
      title: "Build a Balanced Plate",
      text: "Include a variety of vegetables, fruits, protein sources and whole grains in your meals.",
      category: "Nutrition"
    },
    {
      icon: "🧘",
      title: "Take a Mindful Break",
      text: "Pause for a few minutes, breathe slowly and give yourself time to reset.",
      category: "Mental Wellness"
    },
    {
      icon: "☀️",
      title: "Get Some Daylight",
      text: "Spend a little time outdoors when practical and comfortable. Remember sun protection when needed.",
      category: "Lifestyle"
    },
    {
      icon: "🚶",
      title: "Choose a Short Walk",
      text: "A comfortable walk can be a simple way to add movement to your daily routine.",
      category: "Activity"
    }
  ];

  let currentTip = 0;

  nextButton.addEventListener("click", () => {
    currentTip = (currentTip + 1) % tips.length;

    const tip = tips[currentTip];

    document.getElementById("dailyTipTitle").textContent = tip.title;
    document.getElementById("dailyTipText").textContent = tip.text;
    document.getElementById("dailyTipCategory").textContent =
      "🌿 " + tip.category;
    document.querySelector("#dailyTipCard .daily-tip-icon").textContent =
      tip.icon;
  });
})();


/* ===== Healthora Daily Wellness Challenge ===== */
/* ===== Healthora Daily Wellness Challenge ===== */
(() => {
  const challenge = document.getElementById("wellnessChallenge");
  const completeButton = document.getElementById("completeChallengeBtn");

  if (!challenge || !completeButton) {
    return;
  }

  // Prevent duplicate initialization
  if (completeButton.dataset.initialized === "true") {
    return;
  }

  const emojiElement = document.getElementById("challengeEmoji");
  const titleElement = document.getElementById("challengeTitle");
  const descriptionElement =
    document.getElementById("challengeDescription");

  const progressBar =
    document.getElementById("challengeProgressBar");

  const progressText =
    document.getElementById("challengeProgressText");

  const statusElement =
    document.getElementById("challengeStatus");


  const challenges = [
    {
      emoji: "💧",
      title: "Stay Hydrated",
      description:
        "Remember to drink water regularly throughout the day."
    },
    {
      emoji: "🚶",
      title: "Take a Walking Break",
      description:
        "Take a short, comfortable walk or move around between tasks."
    },
    {
      emoji: "🧘",
      title: "Practice Mindful Breathing",
      description:
        "Take two minutes to pause and breathe slowly and comfortably."
    },
    {
      emoji: "🥗",
      title: "Add Some Colour to Your Plate",
      description:
        "Include a fruit or vegetable in one of your meals today."
    },
    {
      emoji: "😴",
      title: "Create a Relaxing Bedtime",
      description:
        "Set aside some time to wind down before going to sleep."
    },
    {
      emoji: "☀️",
      title: "Take a Fresh-Air Break",
      description:
        "Spend a few minutes outside if the weather and your schedule allow."
    },
    {
      emoji: "🧍",
      title: "Stretch and Reset",
      description:
        "Try a few gentle stretches during a break from sitting."
    }
  ];


  // ================= DATE =================

  const today = new Date();

  const dateKey = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0")
  ].join("-");


  const dayNumber = Math.floor(
    new Date(dateKey + "T00:00:00").getTime() /
      86400000
  );


  const dailyChallenge =
    challenges[
      ((dayNumber % challenges.length) +
        challenges.length) %
        challenges.length
    ];


  // ================= SHOW CHALLENGE =================

  emojiElement.textContent = dailyChallenge.emoji;
  titleElement.textContent = dailyChallenge.title;
  descriptionElement.textContent =
    dailyChallenge.description;


  // ================= UPDATE UI =================

  function updateChallenge(isCompleted) {

    progressBar.style.width =
      isCompleted ? "100%" : "0%";

    progressText.textContent =
      isCompleted
        ? "100% completed"
        : "0% completed";


    completeButton.disabled =
      isCompleted;


    completeButton.textContent =
      isCompleted
        ? "✓ Challenge Completed!"
        : "✓ Complete Today's Challenge";


    statusElement.textContent =
      isCompleted
        ? "Amazing work! You completed today's wellness challenge. 🎉"
        : "You've got this! Complete the challenge when you're ready.";
  }


  // ================= FIREBASE AUTH =================

  onAuthStateChanged(auth, function(user) {

    if (!user) {
      console.warn(
        "No logged-in user found for daily challenge."
      );

      return;
    }


    // IMPORTANT:
    // Every user gets a separate localStorage key
    const storageKey =
      `healthoraDailyChallengeCompletedDate_${user.uid}`;


    let completedToday = false;


    try {

      completedToday =
        localStorage.getItem(storageKey) === dateKey;

    } catch (error) {

      console.warn(
        "Could not read challenge status.",
        error
      );

    }


    updateChallenge(completedToday);


    // Prevent duplicate click listener
    if (completeButton.dataset.initialized === "true") {
      return;
    }

    completeButton.dataset.initialized = "true";


    // ================= COMPLETE BUTTON =================

    completeButton.addEventListener(
      "click",
      function() {

        if (completedToday) {
          return;
        }


        try {

          localStorage.setItem(
            storageKey,
            dateKey
          );


          completedToday = true;


          updateChallenge(true);


          console.log(
            "✅ Daily challenge completed for user:",
            user.uid
          );


        } catch (error) {

          console.warn(
            "Could not save challenge status.",
            error
          );


          completedToday = true;


          updateChallenge(true);


          statusElement.textContent =
            "Challenge completed for this session! Saving may be unavailable.";
        }

      }
    );

  });

})();

/* =========================================================
   LOAD VIDEOS
========================================================= */

function loadVideos() {

    const videoGrid =
        document.querySelector(
            "#videos .video-grid"
        );

    if (!videoGrid) {
        return;
    }


    const videos = [

        {
            title: "Full Body Beginner Workout",
            category: "Fitness",
            duration: "12 min",
            views: "24K",
            thumbnail: "src/assets/fitness.png",
            videoUrl:
                `${API_BASE_URL}/videos/fitness.mp4`
        },

        {
            title: "Morning Yoga Routine",
            category: "Yoga",
            duration: "18 min",
            views: "18K",
            thumbnail: "src/assets/Yoga.png",
            videoUrl:
                `${API_BASE_URL}/videos/yoga.mp4`
        },

        {
            title: "Guided Meditation for Beginners",
            category: "Meditation",
            duration: "15 min",
            views: "16K",
            thumbnail: "src/assets/meditation.png",
            videoUrl:
                `${API_BASE_URL}/videos/meditation.mp4`
        },

        {
            title: "Build a Balanced Breakfast",
            category: "Nutrition",
            duration: "10 min",
            views: "13K",
            thumbnail: "src/assets/nutrition.png",
            videoUrl:
                `${API_BASE_URL}/videos/nutrition.mp4`
        }

    ];


    videoGrid.innerHTML = "";


    videos.forEach(function(video) {

        const card =
            document.createElement("article");

        card.className =
            "video-card";


        card.dataset.category =
            video.category.toLowerCase();


        card.innerHTML = `

            <div class="video-thumbnail">

                <img
                   src="${
    video.thumbnail
        ? "/" + video.thumbnail.replace(/^src\/assets\//, "assets/")
        : ""
}"
                    alt="${video.title}"
                >

                <button
                    class="video-play"
                    type="button"
                >
                    ▶
                </button>

            </div>


            <div class="video-info">

                <h3>
                    ${video.title}
                </h3>

                <p>
                    ${video.category}
                    ·
                    ${video.duration}
                    ·
                    ${video.views} views
                </p>

            </div>

        `;


        const playButton =
            card.querySelector(
                ".video-play"
            );


        playButton.addEventListener(
            "click",
            function(event) {

                event.stopPropagation();


                window.location.href =
                    video.videoUrl;

            }
        );


        videoGrid.appendChild(card);

    });


    console.log(
        `✅ ${videos.length} videos rendered`
    );

}


loadVideos();

// ==========================================
// MOTIVATION - KEEP GOING
// ==========================================

const keepGoingButton =
    document.getElementById(
        "motivation-keep-going"
    );

if (keepGoingButton) {

    keepGoingButton.addEventListener(
        "click",
        function() {

            openPage("wellness");

        }
    );

}