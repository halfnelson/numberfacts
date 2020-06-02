import { writable } from 'svelte/store'

export type AppPage = {
    page: "fresh-install" | "home" | "edit-profile" | "practice" | "select-profile" | "add-user",
    props?: any
}



function create_nav() {
    let { set, subscribe } = writable<AppPage>({page: "home"})
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