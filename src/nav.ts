import { writable } from 'svelte/store'

export type AppPage = "fresh-install" | "home" | "edit-profile"

function create_nav() {
    let { set, subscribe } = writable<AppPage>(null)
    return {
        subscribe,
        navigate(page: AppPage) {
            set(page)
        }
    }
}

const nav = create_nav();

export {
    nav
}