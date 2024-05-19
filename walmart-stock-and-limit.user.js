// ==UserScript==
// @name         Walmart Stock and Limit
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Display current stock and max quantity on Walmart
// @author       Discord:  dark.risk
// @match        https://www.walmart.com/*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/KarBlownForceNet/walmart-stock-and-limit/main/walmart-stock-and-limit.user.js
// @downloadURL  https://raw.githubusercontent.com/KarBlownForceNet/walmart-stock-and-limit/main/walmart-stock-and-limit.user.js
// ==/UserScript==

(function() {
    'use strict';

    let messageDisplayed = false;

    function getProductDataFromScripts() {
        console.log('Getting product data from scripts');
        const scripts = document.getElementsByTagName('script');
        let productData = {
            maxOrderQuantity: 'Unknown',
            availableQuantity: 'Unknown'
        };

        for (let script of scripts) {
            if (script.textContent.includes('maxOrderQuantity')) {
                console.log('Found maxOrderQuantity in script');
                const maxQtyMatch = script.textContent.match(/"maxOrderQuantity":(\d+)/);
                if (maxQtyMatch) {
                    productData.maxOrderQuantity = maxQtyMatch[1];
                    console.log('maxOrderQuantity:', maxQtyMatch[1]);
                }
            }

            if (script.textContent.includes('availableQuantity')) {
                console.log('Found availableQuantity in script');
                const availableQtyMatch = script.textContent.match(/"availableQuantity":(\d+)/);
                if (availableQtyMatch) {
                    productData.availableQuantity = availableQtyMatch[1];
                    console.log('availableQuantity:', availableQtyMatch[1]);
                }
            }
        }
        return productData;
    }

    function displayStockInfo(productData) {
        console.log('Displaying stock info');
        let currentStock = productData.availableQuantity;
        let maxQuantity = productData.maxOrderQuantity;

        const addToCartButton = document.querySelector('[data-automation-id="atc"]');
        if (addToCartButton) {
            console.log('Add to Cart button found');
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
            console.log('Stock info displayed:', stockInfoDiv.innerHTML);
        } else {
            console.log('Add to Cart button not found');
        }
    }

    function displayVariantChangeMessage() {
        if (messageDisplayed) return; // Ensure the message is displayed only once

        const mv3Element = document.querySelector('.mv3');
        if (mv3Element) {
            console.log('Displaying variant change message');
            const variantChangeDiv = document.createElement('div');
            variantChangeDiv.style.fontSize = 'small';
            variantChangeDiv.style.fontWeight = 'bold';
            variantChangeDiv.style.color = 'red';
            variantChangeDiv.style.marginTop = '10px';
            variantChangeDiv.style.textAlign = 'center';

            const messageSpan = document.createElement('span');
            messageSpan.innerHTML = 'Variant changed. <a href="#" style="color: red; text-decoration: underline;">Refresh</a> to update stock information.';
            messageSpan.querySelector('a').addEventListener('click', function(e) {
                e.preventDefault();
                window.location.reload();
            });

            variantChangeDiv.appendChild(messageSpan);

            mv3Element.parentElement.insertBefore(variantChangeDiv, mv3Element);
            messageDisplayed = true; // Set flag to true after displaying the message
            console.log('Variant change message displayed');
        } else {
            console.log('mv3 element not found');
        }
    }

    window.addEventListener('load', function() {
        console.log('Window loaded');
        const productIdMatch = window.location.pathname.match(/\/ip\/.*\/(\d+)/);
        if (productIdMatch) {
            console.log('Product ID found:', productIdMatch[1]);
            const productId = productIdMatch[1];
            let productData = getProductDataFromScripts();
            displayStockInfo(productData);

            const variantButtons = document.querySelectorAll('[data-testid="variant-tile-chip"]');
            variantButtons.forEach(button => {
                button.addEventListener('click', () => {
                    console.log('Variant button clicked');
                    setTimeout(displayVariantChangeMessage, 500);
                });
            });
        } else {
            console.log('Product ID not found');
        }
    });
})();
