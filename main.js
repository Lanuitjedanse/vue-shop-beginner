let eventBus = new Vue();

Vue.component("product", {
    props: {
        premium: {
            type: Boolean,
            required: true,
        },
        cart: {
            type: Number,
            required: true,
        },
    },
    template: ` <div class="product">
                <div class="product-image">
                    <img :src="image" />
                </div>
                <div class="product-info">
                    <h1>{{ title }}</h1>
                    <p v-if="inStock">In Stock</p>
                    <p v-else :class="{ outOfStock: inStock === 0}">
                        Out of Stock
                    </p>
                    <p v-if="onSale">{{showSaleMsg}}</p>
                    <p>Shipping: {{shipping}}</p>

                    <ul>
                        <li v-for="detail in details">{{ detail  }}</li>
                    </ul>

                    <div
                        v-for="(variant, index) in variants"
                        :key="variant.variantId"
                        class="color-box"
                        :style="{ backgroundColor: variant.variantColor }"
                        @mouseover="updateProduct(index)"
                    ></div>
                    <h3 v-on:click="toggleSizes">Sizes</h3>
                    <div v-if="showSizes" v-for="size in sizes">
                        <p>{{ size.size }}</p>
                    </div>

                    <button
                        v-on:click="addToCart"
                        :disabled="!inStock"
                        :class="{ disabledButton: !inStock}"
                    >
                        Add to Cart
                    </button>
                    <button
                        v-on:click="deleteFromCart"
                        :disabled="!cart"
                        :class="{ disabledButton: cart === 0}"
                    >
                        Remove
                    </button>
                </div>

                <product-tab :reviews="reviews"></product-tab>
            </div>`,

    data() {
        return {
            brand: "Vue Mastery",
            product: "Socks",
            selectedVariant: 0,
            onSale: true,
            details: ["80% cotton", "20% polyester", "Gender-neutral"],
            variants: [
                {
                    variantId: 2234,
                    variantColor: "green",
                    variantImage: "socks-green.jpeg",
                    variantQuantity: 100,
                },
                {
                    variantId: 2235,
                    variantColor: "blue",
                    variantImage: "socks-blue.jpeg",
                    variantQuantity: 0,
                },
            ],
            sizes: [
                {
                    size: "XS",
                },
                {
                    size: "S",
                },
                {
                    size: "M",
                },
                {
                    size: "L",
                },
                {
                    size: "XL",
                },
            ],

            showSizes: false,
            reviews: [],
        };
    },
    methods: {
        addToCart: function () {
            this.$emit("add-to-cart");
        },

        toggleSizes: function () {
            this.showSizes === false
                ? (this.showSizes = true)
                : (this.showSizes = false);
        },
        updateProduct: function (index) {
            this.selectedVariant = index;
        },
        deleteFromCart: function () {
            this.$emit("remove-from-cart");
        },
    },
    computed: {
        title() {
            return this.brand + " " + this.product;
        },
        image() {
            return this.variants[this.selectedVariant].variantImage;
        },

        inStock() {
            return this.variants[this.selectedVariant].variantQuantity;
        },
        showSaleMsg() {
            return "50% off on " + this.brand + " " + this.product;
        },

        shipping() {
            if (this.premium) {
                return "Free";
            } else {
                return 2.99;
            }
        },
    },
    mounted() {
        eventBus.$on("review-submitted", (productReview) => {
            this.reviews.push(productReview);
        });
    },
});

Vue.component("product-review", {
    template: ` <form class="review-form" @submit.prevent="onSubmit">

    <p v-if="errors.length">
        <b>Please correct the following errors(s):</b>
        <ul>
            <li v-for="error in errors">{{error}}</li>
        </ul>
    </p>
    <p>
        <label for="name">Name:</label>
        <input id="name" v-model="name">

    </p>

     <p>
        <label for="review">Review:</label>
        <textarea id="review" v-model="review" ></textarea>

    </p>

        <label for="rating">Rating</label>
            <select id="rating" v-model.number="rating">
                <option>5</option>
                <option>4</option>
                <option>3</option>
                <option>2</option>
                <option>1</option>
                </select>
        <p>
            <input type="submit" value="Submit"></input>
        </p>
    </form>`,

    data() {
        return {
            name: null,
            review: null,
            rating: null,
            errors: [],
        };
    },
    methods: {
        onSubmit() {
            if (this.name && this.review && this.rating) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                };
                eventBus.$emit("review-submitted", productReview);
                this.name = null;
                this.review = null;
                this.rating = null;
            } else {
                !this.name && this.errors.push("Name required");
                !this.review && this.errors.push("Review required");
                !this.rating && this.errors.push("Rating required");
            }
        },
    },
});

Vue.component("product-tab", {
    props: {
        reviews: {
            type: Array,
            required: true,
        },
    },
    template: `
    <div>
        <span class="tab" 
        :class="{ activeTab: selectedTab === tab }" 
        v-for="(tab, index) in tabs" 
        :key="index" 
        @click="selectedTab = tab">
        {{ tab }}
        </span>
   
        <div v-show="selectedTab === 'Reviews'">
        <p v-if="!reviews.length">There are no reviews yet</p>
        <ul>
            <li v-for="review in reviews" class="review-box">
                <p>{{review.name}}</p>
                <p>{{review.review}}</p>
                <p>{{review.rating}}</p>
            </li>
        </ul>
        </div> 
            <product-review v-show="selectedTab === 'Make a Review'"></product-review>
 
    </div>
    
    
    `,
    data() {
        return {
            tabs: ["Reviews", "Make a Review"],
            selectedTab: "Reviews",
        };
    },
});

var app = new Vue({
    el: "#app",
    data: {
        premium: true,
        cart: 0,
    },
    methods: {
        updateCart() {
            this.cart += 1;
        },
        deleteFromCart() {
            this.cart -= 1;
        },
    },
});
