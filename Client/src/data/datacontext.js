const CATEGORIES = "categories";
const ITEMS = "items";
const PROFILE = "profile";
const CUSTOMER = "customer";

export default {
  entities: {
    CATEGORIES,
    ITEMS,
    PROFILE,
    CUSTOMER
  },
  schema: [
    {
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
    },
    {
      name: CUSTOMER,
      type: "list"
    }
  ]
};
