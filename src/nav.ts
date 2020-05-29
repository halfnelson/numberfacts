import { writable } from 'svelte/store'

export type AppPage = {
    page: "fresh-install" | "home" | "edit-profile" | "practice",
    props?: any
}



function create_nav() {
    let { set, subscribe } = writable<AppPage>({page: null})
    return {
        subscribe,
        navigate(page: AppPage['page'], props?: any) {
            set({ page, props})
        }
    }
}

const nav = create_nav();

export {
    nav
}