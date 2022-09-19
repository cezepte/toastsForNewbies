"use strict";
const DEFUALT_OPTIONS = {
    autoClose: 3000,
    position: "bottom-right",
    onClose: () => { },
    canClose: true,
    showProgress: true,
    design: "default"
}

export default class Toast {
    #toastElem
    #autoCloseTimeout
    #autoClose
    #removeBinded
    #visibleSince = 0


    constructor(options) {
        this.#toastElem = document.createElement('div')
        this.#toastElem.classList.add('toast-msg')
        requestAnimationFrame(() => {
            this.#toastElem.classList.add('show');
        })
        this.#visibleSince = new Date()
        this.#removeBinded = this.remove.bind(this)
        this.update({ ...DEFUALT_OPTIONS, ...options })
    }

    set position(value) {
        const currentContainer = this.#toastElem.parentElement
        const selector = `.toast-msg-container[data-position="${value}"]`
        const container = document.querySelector(selector) || createContainer(value);
        value.includes('top') ? container.prepend(this.#toastElem) : container.append(this.#toastElem)
        if (currentContainer == null || currentContainer.hasChildNodes()) return
        currentContainer.remove()
    }

    set design(value) {
        this.#toastElem.classList.add(value);
    }

    set text(value) {
        this.#toastElem.textContent = value;
    }

    set autoClose(value) {
        this.#autoClose = value
        if (value === false) return
        if (this.#autoCloseTimeout != null) clearTimeout(this.#autoCloseTimeout)
        this.#autoCloseTimeout = setTimeout(() => { this.remove() }, value)
    }

    set canClose(value) {
        this.#toastElem.classList.toggle('can-close', value)
        if (value) {
            this.#toastElem.addEventListener('click', this.#removeBinded)
        } else {
            this.#toastElem.removeEventListener('click', this.#removeBinded)

        }
    }

    set showProgress(value) {
        this.#toastElem.classList.toggle('progress', value)
        this.#toastElem.style.setProperty('--progress', 1)
        if (value) {
            setInterval(() => {
                const timeVisible = new Date() - this.#visibleSince
                this.#toastElem.style.setProperty('--progress', timeVisible / this.#autoClose)
            }, 10)
        }
    }

    update(options) {
        Object.entries(options).forEach(([key, value]) => {
            this[key] = value;
        })
    }
    remove() {
        const container = this.#toastElem.parentElement
        this.#toastElem.classList.remove('show')
        this.#toastElem.addEventListener('transitionend', () => {
            this.#toastElem.remove()
            if (container.hasChildNodes()) return
            container.remove()
        })
        this.onClose()
    }
    show() {

    }
}

function createContainer(position) {
    const container = document.createElement('div');
    container.classList.add('toast-msg-container');
    container.dataset.position = position;
    document.body.append(container);
    return container;
}