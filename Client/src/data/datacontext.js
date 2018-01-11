const CATEGORIES = "categories";
const ITEMS = "items"
const PROFILE = "profile"



export default {
    entities: {
        CATEGORIES,
        ITEMS,
        PROFILE
    },
    schema: [{
            name: CATEGORIES,
            type: "list"
        },
        {
            name: ITEMS,
            type: "list"
        },
        {
            name: PROFILE,
            type: "item"
        }

    ]



}