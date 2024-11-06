// db.ts - Helper for IndexedDB

export interface StoredKey {
    id: string;
    encryptedKey: string; // Stored as JSON string
    nickname?: string;    // Optional nickname
}

export async function storeEncryptedPrivateKey(id: string, encryptedKey: string, nickname: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        const request = indexedDB.open("nostrKeys", 1);
        request.onupgradeneeded = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains("keys")) {
                db.createObjectStore("keys", { keyPath: "id" });
            }
        };
        request.onsuccess = () => {
            const db = request.result;
            const transaction = db.transaction("keys", "readwrite");
            const store = transaction.objectStore("keys");
            store.put({ id, encryptedKey, nickname });
            transaction.oncomplete = () => resolve();
            transaction.onerror = () => reject(transaction.error);
        };
        request.onerror = () => reject(request.error);
    });
}

export async function retrieveEncryptedPrivateKey(id: string): Promise<{ encryptedKey: string; nickname: string } | null> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("nostrKeys", 1);
        request.onsuccess = () => {
            const db = request.result;
            const transaction = db.transaction("keys", "readonly");
            const store = transaction.objectStore("keys");
            const getRequest = store.get(id);
            getRequest.onsuccess = () => {
                const result = getRequest.result;
                if (result?.encryptedKey) {
                    resolve({ encryptedKey: result.encryptedKey, nickname: result.nickname || '' });
                } else {
                    resolve(null);
                }
            };
            getRequest.onerror = () => reject(getRequest.error);
        };
        request.onerror = () => reject(request.error);
    });
}