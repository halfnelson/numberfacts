import { writable } from 'svelte/store'
import { StatusCollection } from './facts';


export type Profile = {
    readonly id: string;
    name: string;
    color: string;
    status: StatusCollection;
    lastResults: number[];
}

function profileKey(id: string) {
    return `profile_${id}`;
}

function loadProfile(id: string): Profile {
    try {
        if (id) {
            let profstr = localStorage.getItem(profileKey(id));
            if (profstr) { 
                return JSON.parse(profstr);
            }
        }
    } catch (e) {
        console.error("couldn't load profile",e)
        return null;
    }
}

function storeProfile(profile: Profile) {
    localStorage.setItem(profileKey(profile.id), JSON.stringify(profile));
}

function storeProfiles(profileIds: string[]) {
    localStorage.setItem("profiles", JSON.stringify(profileIds));
}


function create_profile() {
    let saved_profile_id = localStorage.getItem("current_profile");
    let current_profile = null
    if (saved_profile_id) {
        current_profile = loadProfile(saved_profile_id)
    }

    let { set, subscribe } = writable<Profile>(current_profile)

    return {
        subscribe,
        set: (profile: Profile) => {
            storeProfile(profile);
            if (profile.id != saved_profile_id) {
                localStorage.setItem("current_profile", profile.id)
                saved_profile_id = profile.id;
            }
            set(profile);
        }
    }
}
const profile = create_profile();


export function create_profiles() {
    let profiles = [];
    try {
        let profileIdsStr = localStorage.getItem("profiles");
        if (profileIdsStr) {
            profiles = (JSON.parse(profileIdsStr) as string[]).map(x => loadProfile(x));
        }
    } catch {
        console.error("couldn't load profiles")
    }

    let { set,  subscribe } = writable<Profile[]>(profiles);
    return {
        subscribe,
        create: (name: string, color: string) => {
            let profile = {
                id: String(Date.now()),
                name,
                color, 
                status: [],
                lastResults: []
            }
            storeProfile(profile);
            profiles = profiles.concat(profile);
            storeProfiles(profiles.map(p => p.id))
            set(profiles);
            return profile;
        },
        remove: (profile: Profile) => {
            profiles = profiles.filter(p => p.id != profile.id);
            storeProfiles(profiles.map(p => p.id));
            set(profiles);
        },
        update: (profile: Profile) => {
            profiles = profiles.filter(p => p.id != profile.id).concat(profile);
            storeProfile(profile);
            set(profiles)
        }
    }
}

const profiles = create_profiles();




export { profile, profiles }



