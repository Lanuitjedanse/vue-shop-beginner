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
