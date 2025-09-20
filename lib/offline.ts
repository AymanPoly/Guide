'use client'

// Offline data storage using IndexedDB
const DB_NAME = 'LocalExpDB'
const DB_VERSION = 1
const STORE_EXPERIENCES = 'experiences'
const STORE_BOOKINGS = 'bookings'

export class OfflineManager {
  private db: IDBDatabase | null = null

  async init() {
    return new Promise<void>((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // Create experiences store
        if (!db.objectStoreNames.contains(STORE_EXPERIENCES)) {
          const experienceStore = db.createObjectStore(STORE_EXPERIENCES, { keyPath: 'id' })
          experienceStore.createIndex('city', 'city', { unique: false })
          experienceStore.createIndex('published', 'published', { unique: false })
        }

        // Create bookings store
        if (!db.objectStoreNames.contains(STORE_BOOKINGS)) {
          const bookingStore = db.createObjectStore(STORE_BOOKINGS, { keyPath: 'id' })
          bookingStore.createIndex('guest_id', 'guest_id', { unique: false })
          bookingStore.createIndex('experience_id', 'experience_id', { unique: false })
          bookingStore.createIndex('status', 'status', { unique: false })
        }
      }
    })
  }

  async saveExperiences(experiences: any[]) {
    if (!this.db) await this.init()

    const transaction = this.db!.transaction([STORE_EXPERIENCES], 'readwrite')
    const store = transaction.objectStore(STORE_EXPERIENCES)

    for (const experience of experiences) {
      store.put(experience)
    }

    return new Promise<void>((resolve, reject) => {
      transaction.oncomplete = () => resolve()
      transaction.onerror = () => reject(transaction.error)
    })
  }

  async getExperiences(): Promise<any[]> {
    if (!this.db) await this.init()

    const transaction = this.db!.transaction([STORE_EXPERIENCES], 'readonly')
    const store = transaction.objectStore(STORE_EXPERIENCES)

    return new Promise((resolve, reject) => {
      const request = store.getAll()
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async saveOfflineBooking(booking: any) {
    if (!this.db) await this.init()

    const transaction = this.db!.transaction([STORE_BOOKINGS], 'readwrite')
    const store = transaction.objectStore(STORE_BOOKINGS)

    // Mark as offline
    const offlineBooking = { ...booking, offline: true, synced: false }

    return new Promise<void>((resolve, reject) => {
      const request = store.add(offlineBooking)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async getOfflineBookings(): Promise<any[]> {
    if (!this.db) await this.init()

    const transaction = this.db!.transaction([STORE_BOOKINGS], 'readonly')
    const store = transaction.objectStore(STORE_BOOKINGS)

    return new Promise((resolve, reject) => {
      const request = store.getAll()
      request.onsuccess = () => {
        const offlineBookings = request.result.filter((booking: any) => booking.offline && !booking.synced)
        resolve(offlineBookings)
      }
      request.onerror = () => reject(request.error)
    })
  }

  async markBookingAsSynced(bookingId: string) {
    if (!this.db) await this.init()

    const transaction = this.db!.transaction([STORE_BOOKINGS], 'readwrite')
    const store = transaction.objectStore(STORE_BOOKINGS)

    return new Promise<void>((resolve, reject) => {
      const getRequest = store.get(bookingId)
      getRequest.onsuccess = () => {
        const booking = getRequest.result
        if (booking) {
          booking.synced = true
          const putRequest = store.put(booking)
          putRequest.onsuccess = () => resolve()
          putRequest.onerror = () => reject(putRequest.error)
        } else {
          resolve()
        }
      }
      getRequest.onerror = () => reject(getRequest.error)
    })
  }
}

export const offlineManager = new OfflineManager()

// Network status detection
export function isOnline(): boolean {
  return typeof navigator !== 'undefined' ? navigator.onLine : true
}

export function onNetworkChange(callback: (online: boolean) => void) {
  if (typeof window !== 'undefined') {
    window.addEventListener('online', () => callback(true))
    window.addEventListener('offline', () => callback(false))
  }
}

