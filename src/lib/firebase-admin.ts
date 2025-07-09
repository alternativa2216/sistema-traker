import 'server-only';

// Firebase Admin functionality has been temporarily disabled to diagnose a persistent build error.
const firebaseAdminDisabledError = "Firebase Admin SDK has not been initialized. Functionality is disabled for diagnostics.";

const unconfiguredAction = () => {
    throw new Error(firebaseAdminDisabledError);
};

const adminProxy = new Proxy({}, {
    get() {
        // Instead of throwing an error which can crash the app, 
        // we can return a function that does nothing or returns a mock response.
        // For this diagnostic step, returning a function that logs a warning is safer.
        return () => {
            console.warn(firebaseAdminDisabledError);
            return Promise.resolve();
        };
    }
})

export const adminAuth = adminProxy as any;
export const adminDb = adminProxy as any;
