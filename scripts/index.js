/**
 * @typedef {object} Product
 * @property {number} id ID of the product
 * @property {string} product_name Name of the product
 * @property {number} price Price of the product
 */

/**
 * @typedef {object} CartItem
 * @property {Product} product Product linked with cart item
 * @property {number} count Cart item count
 */

/**
 * @typedef {Map<number, CartItem>} CartItems
 */

$(function () {
    /**
     * @type {CartItems}
     */
    const cartItems = new Map((window.localStorage && window.localStorage['cartItems'] && Array.isArray(JSON.parse(localStorage.getItem('cartItems'))) && JSON.parse(localStorage.getItem('cartItems'))) || []);

    /**
     * @type {Array<Product>}
     */
    let currentProducts = [];

    let currentPage = 1;
    let productsPerPage = 20;

    const $cartCount = $('#btnCart > div.cart-count');

    /**
     * Fetch products list from server and render products list
     *
     * @param {number} page Page number to fetch
     */
    function fetchProducts() {
        const start = (currentPage - 1) * productsPerPage;
        const end = start + productsPerPage;

        $.getJSON('products.json')
            .catch(function () {
                debugger;
            })
            .done(function (/** @type {Array<Product>} */ response) {
                var $productsList = $('#productsList').empty();
                var $paginator = $('#paginator').empty();

                if (Array.isArray(response)) {
                    var items = (currentProducts = response.slice(start, end));

                    items.forEach((product) => {
                        $productsList.append(//
                        /*html*/ `
                        <div id="${product.id}" class="product">
                            <img class='product-image' src="https://via.placeholder.com/300?text=Product" />
                            <div class="product-name">${product.product_name}</div>
                            <div class="product-price">${product.price}</div>
                            <div class="spacer"></div>
                            <button class="add-cart" data-product-id="${product.id}">Add to Cart</button>
                        </div>
                        `);
                    });

                    const totalPages = Math.ceil(response.length / productsPerPage);
                    for (let i = 1; i <= totalPages; i++) {
                        $paginator.append(
                            //
                            /*html*/ `<button id="page-${i}" data-page="${i}" class="page ${(i == currentPage && 'selected') || ''}">${i}</button>`
                        );
                    }
                }
            });
    }

    /**
     * Shows toast message
     *
     * @param {string} message Toast message text
     * @param {number} timeout Timeout in milli seconds
     */
    function createToast(message, timeout = 5000) {
        $('.toast').remove();

        const $toast = $(//
        /*html*/ `
            <div class="toast">
                ${message}
            </div>
            `)
            .hide()
            .appendTo(document.body);

        const fadeDelay = Math.min(timeout / 10, 1000);

        $toast.fadeIn(fadeDelay, function () {
            setTimeout(() => {
                if ($toast.closest('body').length) {
                    $toast.fadeOut(fadeDelay, function () {
                        $(this).remove();
                    });
                }
            }, timeout);
        });
    }

    function updateCartState() {
        $cartCount.text(cartItems.size);
        if (cartItems.size) {
            $cartCount.show();
        } else {
            $cartCount.hide();
        }

        const $cartList = $('#cartList > tbody').empty();

        for (const cartItem of cartItems.values()) {
            $cartList.append(//
            /*html*/ `
                <tr>
                    <td>${cartItem.product.product_name}</td>
                    <td>${cartItem.product.price}</td>
                    <td>${cartItem.count}</td>
                    <td>${(cartItem.product.price * cartItem.count).toFixed(2)}</td>
                    <td>
                        <button class="remove-cart-item icon-only" data-product-id="${cartItem.product.id}">
                            <i class="gg-trash-empty"></i>
                        </button>
                    </td>
                </tr>
                `);
        }
    }

    $('#btnCart').on('click', function () {
        $('#cart').show();
    });

    $('#btnCloseCart').on('click', function () {
        $('#cart').hide();
    });

    $('#btnClear').on('click', function () {
        cartItems.clear();
        updateCartState();
    });

    $('#btnPay').on('click', function () {
        const amount = Array.from(cartItems.values()).reduce((total, item) => total + item.product.price * 100 * item.count, 0);

        var options = {
            key: 'rzp_test_oegddROuYIqMMa',
            amount: amount,
            name: 'jQuery Test',
            description: 'description',
            image: 'img/logo.png', // COMPANY LOGO
            handler: function (response) {
                if (response && response.razorpay_payment_id) {
                    createToast('Payment successful!');
                    $('#btnClear, #btnCloseCart').trigger('click');
                }
            },
        };

        var propay = new Razorpay(options);
        propay.open();
    });

    $('#paginator').on('click', 'button.page', function () {
        currentPage = Number($(this).attr('data-page'));
        fetchProducts();
    });

    $('#productsList').on('click', 'div.product > button.add-cart', function () {
        const productId = Number($(this).attr('data-product-id'));

        const product = currentProducts.find((item) => item.id == productId);

        if (!cartItems.has(productId)) {
            cartItems.set(productId, {
                count: 1,
                product,
            });
            createToast('Item added to cart!', 2000);
        } else {
            cartItems.get(productId).count++;
            createToast('Cart updated!', 2000);
        }

        updateCartState();
    });

    $('#cartList').on('click', 'button.remove-cart-item', function () {
        const productId = Number($(this).attr('data-product-id'));

        if (cartItems.has(productId)) {
            cartItems.delete(productId);
            updateCartState();
        }
    });

    $('#cart').hide();

    fetchProducts();
    updateCartState();

    window.onunload = function () {
        if (window.localStorage) {
            window.localStorage.setItem('cartItems', JSON.stringify(Array.from(cartItems.entries())));
        }
    };

    $('div.preloader').fadeOut('slow', function () {
        $(this).remove();
    });
});
