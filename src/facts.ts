
export type Fact = {
    first: number,
    second: number
}

export type StatusEntry = {
    attempts: number,
    last_attempt_times: number[]
}

export type FactStatus = {
    fact: Fact,
    status: StatusEntry
}

export type StatusCollection = FactStatus[]


export function percentFromTime(time_sec: number) {
    //our range is 3sec - 10sec
    let p = Math.max(3, time_sec);
    p = Math.min(10, p);

    return (7 - (p - 3)) / 7 * 100
}


export function percentFromStatus(statusEntry: StatusEntry) {
    //take average of last 3;
    let last3 = statusEntry.last_attempt_times.slice(-3);
    if (last3.length == 0) return 0;
    let sum = last3.reduce((p, c) => p + percentFromTime(c), 0);
    let avg = sum / last3.length;
    return avg
}

export const allFacts: Fact[] = []

for (let first = 0; first < 12; first++) {
    for (let second = 0; second <= first; second++) {
        allFacts.push({ first: first + 1, second: second + 1 });
    }
}

export function factFor(a: number, b: number) {
    return allFacts.find(f => (f.first == a && f.second == b) || (f.second == a && f.first == b));
}

export function newStatus(): StatusEntry {
    return { attempts: 0, last_attempt_times: [] } as StatusEntry
}

export function addAttemptToStatus(status: StatusEntry, time_sec: number) {
    status.attempts = status.attempts + 1;
    status.last_attempt_times.push(time_sec);
    status.last_attempt_times = status.last_attempt_times.slice(-3);
}

export function getStatus(fact: Fact, collection: StatusCollection): FactStatus {
    let factStatus = collection.find(f => f.fact.first == fact.first && f.fact.second == fact.second);
    return factStatus ? factStatus : { fact, status: newStatus() };
}

export function updateStatus(factStatus: FactStatus, collection: StatusCollection) {
    let existing = collection.find(f => f.fact.first == factStatus.fact.first && f.fact.second == factStatus.fact.second);
    if (existing) {
        existing.status = factStatus.status;
    } else {
        collection.push(factStatus)
    }
}