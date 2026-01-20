// ==UserScript==
// @name Chat Message Input Resizer
// @namespace Violentmonkey Scripts
// @match https://sai-library.saiapplications.com/free-chat*
// @grant none
// @version 1.0
// @description Redimensiona o campo chat-message-input para 80% da largura da página
// @author Elias Alves Chacon
// @require    https://raw.githubusercontent.com/elias-chacon/js-async-element-finder/refs/tags/v1.0.1/js-async-element-finder.js
// @require    https://raw.githubusercontent.com/elias-chacon/js-html-to-markdown/refs/heads/main/js-html-to-markdown.js
// @run-at document-end
// ==/UserScript==

(function() {
    'use strict';

    let resizeTimeout;
    const childClassList = ["chat-message-input", "user-message__messages", "assistant-message__response"];

    async function resizeContainer() {
        try {
            const chatMessageInput = await find(".chat-message-input", 5, 100);
            const assistantContainers = await find(".assistant-message__container", 3, 100).catch(() => []);
            const userContainers = await find(".user-message__container", 3, 100).catch(() => []);

            // Converte para array se necessário
            const assistantArray = Array.isArray(assistantContainers) ? assistantContainers :
                                 assistantContainers.length ? Array.from(assistantContainers) : [];
            const userArray = Array.isArray(userContainers) ? userContainers :
                            userContainers.length ? Array.from(userContainers) : [];

            const totalContainers = assistantArray.length + userArray.length;
            if (totalContainers === 0) {
                console.log("Nenhum container de mensagem encontrado");
                return;
            }

            const chatMessageInputRect = chatMessageInput.getBoundingClientRect();
            const chatMessageInputLeft = chatMessageInputRect.left;
            const marginLeft = Math.max(0, chatMessageInputLeft);
            const inputWidth = chatMessageInput.offsetWidth;

            let processedCount = 0;

            // Processa assistant containers
            assistantArray.forEach((container, index) => {
                container.style.marginLeft = marginLeft + 'px';
                container.style.marginRight = 'auto';
                container.style.marginTop = '0';
                container.style.marginBottom = '0';
                container.style.width = inputWidth + 'px';
                container.style.maxWidth = '80vw';
                processedCount++;
            });

            // Processa user containers
            userArray.forEach((container, index) => {
                container.style.marginLeft = marginLeft + 'px';
                container.style.marginRight = 'auto';
                container.style.marginTop = '0';
                container.style.marginBottom = '0';
                container.style.width = inputWidth + 'px';
                container.style.maxWidth = '80vw';
                processedCount++;
            });

            console.log(`Total de ${processedCount} containers reposicionados (${assistantArray.length} assistant + ${userArray.length} user)`);

        } catch (error) {
            console.log("Elementos necessários ainda não estão disponíveis:", error.message);
        }
    }

    function parentByClassName(elem, classname) {
        if (!elem || !elem.parentNode) {
            return null;
        }

        const parent = elem.parentNode;
        if (parent.classList && parent.classList.contains(classname)) {
            return parent;
        }

        return parentByClassName(parent, classname);
    }

    function createCopyButton(indicator) {
        if (indicator.querySelector('.copy-button')) {
            return;
        }

        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.innerHTML = ` <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect> <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path> </svg> `;
        copyButton.title = 'Copiar mensagem em Markdown';

        copyButton.addEventListener('click', async function(e) {
            e.preventDefault();
            e.stopPropagation();

            try {
                const messageContainer = parentByClassName(indicator, "assistant-message__container");

                if (!messageContainer) {
                    console.error('Container da mensagem não encontrado');
                    return;
                }

                const responseDiv = messageContainer.querySelector('.chat-response__messages') ||
                                  messageContainer.querySelector('.assistant-message__response');

                if (!responseDiv) {
                    console.error('Div de resposta não encontrada');
                    return;
                }

                const htmlContent = responseDiv.innerHTML;
                const markdownContent = htmlToMarkdown(htmlContent);

                if (!markdownContent.trim()) {
                    console.log('Conteúdo vazio');
                    return;
                }

                await navigator.clipboard.writeText(markdownContent);

                // Feedback visual
                const originalHTML = copyButton.innerHTML;
                copyButton.innerHTML = ` <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> <polyline points="20,6 9,17 4,12"></polyline> </svg> `;
                copyButton.style.color = '#10b981';

                setTimeout(() => {
                    copyButton.innerHTML = originalHTML;
                    copyButton.style.color = '';
                }, 2000);

                console.log('Conteúdo copiado em Markdown');

            } catch (error) {
                console.error('Erro ao copiar:', error);
                copyButton.style.color = '#ef4444';
                setTimeout(() => {
                    copyButton.style.color = '';
                }, 2000);
            }
        });

        indicator.appendChild(copyButton);
    }

    async function addCopyButtons() {
        try {
            const indicators = await find('.assistant-message__indicator', 5, 100);
            const indicatorArray = Array.isArray(indicators) ? indicators :
                                 indicators.length ? Array.from(indicators) : [indicators];

            indicatorArray.forEach(indicator => {
                createCopyButton(indicator);
            });

            console.log(`Botões de copiar adicionados a ${indicatorArray.length} indicators`);
        } catch (error) {
            console.log("Nenhum indicator encontrado ainda");
        }
    }

    async function resizeInputField(childClass) {
        try {
            const elements = await find(`.${childClass}`, 5, 100);
            const elementArray = Array.isArray(elements) ? elements :
                               elements.length ? Array.from(elements) : [elements];

            elementArray.forEach(inputField => {
                const viewportWidth = window.innerWidth;
                const targetWidth = Math.floor(viewportWidth * 0.8);

                inputField.style.width = targetWidth + 'px';
                inputField.style.maxWidth = '80vw';
                inputField.style.minWidth = '300px';
                inputField.style.boxSizing = 'border-box';
                inputField.style.margin = '0 auto';
                inputField.style.display = 'block';

                const parent = inputField.parentElement;
                if (parent) {
                    const parentComputedStyle = window.getComputedStyle(parent);
                    if (parentComputedStyle.display !== 'flex') {
                        parent.style.display = 'flex';
                        parent.style.flexDirection = 'column';
                        parent.style.alignItems = 'center';
                    } else if (parentComputedStyle.alignItems !== 'center') {
                        parent.style.alignItems = 'center';
                    }
                }
            });

            console.log(`${elementArray.length} campos redimensionados para 80% da viewport`);

            // Executa resizeContainer após redimensionar
            await resizeContainer();

        } catch (error) {
            console.log(`Elementos da classe ${childClass} não encontrados ainda`);
        }
    }

    async function resizeInputFields(childClassList) {
        for (const childClassName of childClassList) {
            await resizeInputField(childClassName);
        }
    }

    async function executeResize(reason = 'unknown') {
        console.log(`Executando resize por: ${reason}`);
        await resizeInputFields(childClassList);
    }

    async function moveResetButton() {
        try {
            const btnGrp = await find(".button-group-chat", 3, 100);
            const btnReset = await find(".chat-reset", 3, 100);

            if (btnGrp.contains(btnReset)) {
                return true;
            }

            btnGrp.appendChild(btnReset);
            console.log("Botão de reset movido com sucesso para o grupo");

            const actionButtons = document.querySelector(".action-buttons");
            if (actionButtons && actionButtons.children.length === 0) {
                actionButtons.remove();
            }

            return true;
        } catch (error) {
            console.log("Botões de reset/grupo não encontrados ainda");
            return false;
        }
    }

    function hasClassOrChild(node, className) {
        if (node.classList && node.classList.contains(className)) {
            return true;
        }
        if (node.querySelector && node.querySelector(`.${className}`)) {
            return true;
        }
        return false;
    }

    function observeDOM(childClassList) {
        const observer = new MutationObserver(function(mutations) {
            let shouldResize = false;
            let shouldMoveButton = false;
            let shouldRepositionContainer = false;
            let shouldAddCopyButtons = false;

            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1) {
                            const messageClasses = [
                                'chat-response__messages',
                                'assistant-message__container',
                                'user-message__container',
                                'user-message__messages'
                            ];

                            messageClasses.forEach(className => {
                                if (hasClassOrChild(node, className)) {
                                    shouldRepositionContainer = true;
                                }
                            });

                            if (hasClassOrChild(node, 'assistant-message__indicator') ||
                                hasClassOrChild(node, 'assistant-message__container')) {
                                shouldAddCopyButtons = true;
                            }

                            childClassList.forEach(className => {
                                if (hasClassOrChild(node, className)) {
                                    shouldResize = true;
                                }
                            });

                            const buttonClasses = ['chat-reset', 'button-group-chat', 'action-buttons'];
                            buttonClasses.forEach(className => {
                                if (hasClassOrChild(node, className)) {
                                    shouldMoveButton = true;
                                }
                            });
                        }
                    });
                }
            });

            // Executa as ações usando async/await em vez de setTimeout
            if (shouldRepositionContainer) {
                resizeContainer();
            }

            if (shouldAddCopyButtons) {
                addCopyButtons();
            }

            if (shouldResize) {
                executeResize('DOM mutation');
            }

            if (shouldMoveButton) {
                moveResetButton();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    function setupResizeListener() {
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(async () => {
                await executeResize('window resize');
            }, 150);
        });
    }

    async function init() {
        console.log('Iniciando script...');

        // Executa todas as operações iniciais usando o find()
        await Promise.allSettled([
            moveResetButton(),
            executeResize('initial load'),
            addCopyButtons()
        ]);

        // Configura observadores
        observeDOM(childClassList);
        setupResizeListener();

        // Tentativas adicionais após delays (para SPAs que carregam conteúdo dinamicamente)
        setTimeout(async () => {
            await Promise.allSettled([
                moveResetButton(),
                executeResize('delayed load 1s'),
                addCopyButtons()
            ]);
        }, 1000);

        setTimeout(async () => {
            await Promise.allSettled([
                moveResetButton(),
                executeResize('delayed load 3s'),
                addCopyButtons()
            ]);
        }, 3000);

        console.log('Script inicializado com sucesso');
    }

    // Inicia o script
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // CSS
    const style = document.createElement('style');
    style.textContent = ` .chat-message-input, .user-message__messages, .assistant-message__response { transition: width 0.3s ease, margin 0.3s ease !important; margin-left: auto !important; margin-right: auto !important; } .assistant-message__container, .user-message__container { transition: margin 0.3s ease, width 0.3s ease !important; } .chat-message-input:not(:only-child) { display: block !important; } .chat-container, .message-container, .input-container { display: flex !important; flex-direction: column !important; align-items: center !important; } .chat-response__messages { transition: all 0.3s ease !important; } /* Estilos para o botão de copiar */ .copy-button { background: none; border: none; cursor: pointer; padding: 4px; border-radius: 4px; display: inline-flex; align-items: center; justify-content: center; color: #6b7280; transition: all 0.2s ease; margin-left: 8px; } .copy-button:hover { background-color: #f3f4f6; color: #374151; } .copy-button:active { transform: scale(0.95); } .copy-button svg { width: 16px; height: 16px; } /* Garante que o indicator tenha espaço para o botão */ .assistant-message__indicator { display: flex !important; align-items: center !important; gap: 4px !important; } `;
    document.head.appendChild(style);

})();
