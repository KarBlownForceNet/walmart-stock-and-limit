// ==UserScript==
// @name         Walmart Stock and Limit
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  Display current stock and max quantity on Walmart
// @author       Discord:  dark.risk
// @match        https://www.walmart.com/*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/KarBlownForceNet/walmart-stock-and-limit/main/walmart-stock-and-limit.user.js
// @downloadURL  https://raw.githubusercontent.com/KarBlownForceNet/walmart-stock-and-limit/main/walmart-stock-and-limit.user.js
// ==/UserScript==

(function() {
    'use strict';

    function getProductDataFromScripts() {
        const scripts = document.getElementsByTagName('script');
        let productData = {
            maxOrderQuantity: 'Unknown',
            availableQuantity: 'Unknown'
        };

        for (let script of scripts) {
            if (script.textContent.includes('maxOrderQuantity')) {
                const maxQtyMatch = script.textContent.match(/"maxOrderQuantity":(\d+)/);
                if (maxQtyMatch) {
                    productData.maxOrderQuantity = maxQtyMatch[1];
                }
            }

            if (script.textContent.includes('availableQuantity')) {
                const availableQtyMatch = script.textContent.match(/"availableQuantity":(\d+)/);
                if (availableQtyMatch) {
                    productData.availableQuantity = availableQtyMatch[1];
                }
            }
        }
        return productData;
    }

    function displayStockInfo(productData) {
        let currentStock = productData.availableQuantity;
        let maxQuantity = productData.maxOrderQuantity;

        const addToCartButton = document.querySelector('[data-automation-id="atc"]');
        if (addToCartButton) {
            const stockInfoDiv = document.createElement('div');
            stockInfoDiv.style.display = 'flex';
            stockInfoDiv.style.justifyContent = 'center';
            stockInfoDiv.style.alignItems = 'center';
            stockInfoDiv.style.marginTop = '10px';

            const stockSpan = document.createElement('span');
            stockSpan.textContent = `Stock: ${currentStock}`;

            const separatorSpan = document.createElement('span');
            separatorSpan.textContent = ' | ';
            separatorSpan.style.margin = '0 10px';

            const limitSpan = document.createElement('span');
            limitSpan.textContent = `Limit: ${maxQuantity}`;

            stockInfoDiv.appendChild(stockSpan);
            stockInfoDiv.appendChild(separatorSpan);
            stockInfoDiv.appendChild(limitSpan);

            addToCartButton.parentElement.appendChild(stockInfoDiv);
        }
    }

    window.addEventListener('load', function() {
        const productIdMatch = window.location.pathname.match(/\/ip\/.*\/(\d+)/);
        if (productIdMatch) {
            const productId = productIdMatch[1];
            let productData = getProductDataFromScripts();
            displayStockInfo(productData);
        }
    });
})();
