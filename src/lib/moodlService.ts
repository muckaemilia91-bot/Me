import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  Timestamp,
  serverTimestamp,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { auth, db } from './firebase';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const syncUser = async (user: any) => {
  const userRef = doc(db, 'users', user.uid);
  try {
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        streak: 0,
        lastEntryDate: null,
        createdAt: serverTimestamp()
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
  }
};

export const addEntry = async (userId: string, entry: { mood: string; content: string; challengeId?: string; date: string }) => {
  const entriesRef = collection(db, 'users', userId, 'entries');
  const entryId = entry.date; // One entry per day
  const entryDoc = doc(entriesRef, entryId);
  
  try {
    await setDoc(entryDoc, {
      ...entry,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    // Update streak (simplified)
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const userData = userSnap.data();
      const lastDate = userData.lastEntryDate;
      let newStreak = userData.streak || 0;
      
      const today = new Date().toISOString().split('T')[0];
      if (lastDate !== today) {
        // Logic for streak increment: if last was yesterday, streak++, else 1
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        
        if (lastDate === yesterdayStr) {
          newStreak += 1;
        } else if (!lastDate || lastDate < yesterdayStr) {
          newStreak = 1;
        }
        
        await updateDoc(userRef, {
          streak: newStreak,
          lastEntryDate: today
        });
      }
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `users/${userId}/entries/${entryId}`);
  }
};

export const subscribeToEntries = (userId: string, callback: (entries: any[]) => void) => {
  const entriesRef = collection(db, 'users', userId, 'entries');
  const q = query(entriesRef, orderBy('createdAt', 'desc'));
  
  return onSnapshot(q, (snapshot) => {
    const entries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(entries);
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, `users/${userId}/entries`);
  });
};

export const getChallenges = async () => {
  const challengesRef = collection(db, 'challenges');
  try {
    const snap = await getDocs(challengesRef);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'challenges');
    return [];
  }
};
