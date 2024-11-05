// db.ts - Helper for IndexedDB
export async function storeEncryptedPrivateKey(id: string, encryptedKey: ArrayBuffer) {
    return new Promise<void>((resolve, reject) => {
        const request = indexedDB.open("nostrKeys", 1);
        request.onupgradeneeded = () => {
            const db = request.result;
            db.createObjectStore("keys", { keyPath: "id" });
        };
        request.onsuccess = () => {
            const db = request.result;
            const transaction = db.transaction("keys", "readwrite");
            const store = transaction.objectStore("keys");
            store.put({ id, encryptedKey });
            transaction.oncomplete = () => resolve();
            transaction.onerror = () => reject(transaction.error);
        };
        request.onerror = () => reject(request.error);
    });
}

export async function retrieveEncryptedPrivateKey(id: string): Promise<ArrayBuffer | null> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("nostrKeys", 1);
        request.onsuccess = () => {
            const db = request.result;
            const transaction = db.transaction("keys", "readonly");
            const store = transaction.objectStore("keys");
            const getRequest = store.get(id);
            getRequest.onsuccess = () => resolve(getRequest.result?.encryptedKey || null);
            getRequest.onerror = () => reject(getRequest.error);
        };
        request.onerror = () => reject(request.error);
    });
}
