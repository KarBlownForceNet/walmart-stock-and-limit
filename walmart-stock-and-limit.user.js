// ==UserScript==
// @name         Walmart Stock and Limit 4
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  Display current stock and max quantity on Walmart
// @author       Discord: dark.risk
// @match        https://www.walmart.com/*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/KarBlownForceNet/walmart-stock-and-limit/main/walmart-stock-and-limit.user.js
// @downloadURL  https://raw.githubusercontent.com/KarBlownForceNet/walmart-stock-and-limit/main/walmart-stock-and-limit.user.js
// ==/UserScript==

(function() {
    'use strict';

    function getProductDataFromNextData() {
        let productData = {
            Shipping: {
                availableQuantity: '0',
                maxOrderQuantity: '0'
            },
            Pickup: {
                availableQuantity: '0',
                maxOrderQuantity: '0'
            }
        };

        if (window.__NEXT_DATA__
            && window.__NEXT_DATA__.props
            && window.__NEXT_DATA__.props.pageProps
            && window.__NEXT_DATA__.props.pageProps.initialData) {

            const data = window.__NEXT_DATA__.props.pageProps.initialData;

            if (data && data.data && data.data.product && data.data.product.fulfillmentOptions) {
                const fulfillmentOptions = data.data.product.fulfillmentOptions;

                for (let option of fulfillmentOptions) {
                    if (option.type === "SHIPPING") {
                        productData.Shipping.availableQuantity = option.availableQuantity !== null ? option.availableQuantity.toString() : '0';
                        productData.Shipping.maxOrderQuantity = option.maxOrderQuantity !== null ? option.maxOrderQuantity.toString() : '0';
                    } else if (option.type === "PICKUP") {
                        productData.Pickup.availableQuantity = option.availableQuantity !== null ? option.availableQuantity.toString() : '0';
                        productData.Pickup.maxOrderQuantity = option.maxOrderQuantity !== null ? option.maxOrderQuantity.toString() : '0';
                    }
                }
            }
        }

        return productData;
    }

    function createStockInfoTable(productData) {
        const stockInfoTable = document.createElement('div');
        stockInfoTable.className = 'f7 mt1 ws-normal ttn';

        const infoContainer = document.createElement('div');
        infoContainer.style.display = 'flex';
        infoContainer.style.justifyContent = 'space-around';
        infoContainer.style.marginBottom = '10px';

        const createInfoColumn = (title, stock, limit) => {
            const column = document.createElement('div');
            column.style.textAlign = 'center';
            column.style.flex = '1';
            column.style.display = 'flex';
            column.style.flexDirection = 'column';
            column.style.alignItems = 'center';

            const header = document.createElement('div');
            header.textContent = title;
            header.className = 'mt1 ttc f6';
            column.appendChild(header);

            const stockLimitRow = document.createElement('div');
            stockLimitRow.style.display = 'flex';
            stockLimitRow.style.justifyContent = 'center';
            stockLimitRow.style.alignItems = 'center';

            const stockSpan = document.createElement('span');
            stockSpan.textContent = `Stock: ${stock}`;
            stockSpan.style.marginRight = '10px';

            const separator = document.createElement('span');
            separator.textContent = '|';
            separator.style.margin = '0 10px';

            const limitSpan = document.createElement('span');
            limitSpan.textContent = `Limit: ${limit}`;
            limitSpan.style.marginLeft = '10px';

            stockLimitRow.appendChild(stockSpan);
            stockLimitRow.appendChild(separator);
            stockLimitRow.appendChild(limitSpan);

            column.appendChild(stockLimitRow);

            return column;
        };

        const shippingColumn = createInfoColumn('Shipping', productData.Shipping.availableQuantity, productData.Shipping.maxOrderQuantity);
        const pickupColumn = createInfoColumn('Pickup', productData.Pickup.availableQuantity, productData.Pickup.maxOrderQuantity);

        infoContainer.appendChild(shippingColumn);
        infoContainer.appendChild(pickupColumn);

        stockInfoTable.appendChild(infoContainer);

        return stockInfoTable;
    }

    function displayStockInfo(productData) {
        const targetElement = document.querySelector('.flex.items-start.justify-center.w-100');

        if (targetElement) {
            const stockInfoTable = createStockInfoTable(productData);
            targetElement.parentElement.insertBefore(stockInfoTable, targetElement.nextSibling);
        }
    }

   window.addEventListener('load', function() {
       let productData = getProductDataFromNextData();
       displayStockInfo(productData);
   });
})();
