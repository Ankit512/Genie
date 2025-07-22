import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { professionalDb } from './firebase-professional';

// Job Interface
export interface Job {
  id?: string;
  title: string;
  description: string;
  category: string;
  location: string;
  budget: {
    min: number;
    max: number;
    currency: string;
  };
  timeframe: string;
  customerId: string;
  customerName: string;
  customerRating: number;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  urgency: 'low' | 'medium' | 'high';
  requirements?: string[];
  images?: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  bidsCount: number;
  selectedProfessionalId?: string;
}

// Bid Interface
export interface Bid {
  id?: string;
  jobId: string;
  professionalId: string;
  professionalName: string;
  professionalRating: number;
  bidAmount: number;
  proposedTimeframe: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Job Management Functions

export const createJob = async (jobData: Omit<Job, 'id' | 'createdAt' | 'updatedAt' | 'bidsCount'>): Promise<string> => {
  try {
    const jobsRef = collection(professionalDb, 'jobs');
    const docRef = await addDoc(jobsRef, {
      ...jobData,
      bidsCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error: any) {
    console.error('Create job error:', error);
    throw new Error('Failed to create job posting');
  }
};

export const getAvailableJobs = async (filters?: {
  category?: string;
  location?: string;
  maxBudget?: number;
  urgency?: string;
}): Promise<Job[]> => {
  try {
    const jobsRef = collection(professionalDb, 'jobs');
    let q = query(
      jobsRef, 
      where('status', '==', 'open'),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    if (filters?.category && filters.category !== 'all') {
      q = query(q, where('category', '==', filters.category));
    }

    const querySnapshot = await getDocs(q);
    const jobs: Job[] = [];
    
    querySnapshot.forEach((doc) => {
      jobs.push({ id: doc.id, ...doc.data() } as Job);
    });

    return jobs;
  } catch (error: any) {
    console.error('Get jobs error:', error);
    throw new Error('Failed to fetch job listings');
  }
};

export const getJobById = async (jobId: string): Promise<Job | null> => {
  try {
    const jobRef = doc(professionalDb, 'jobs', jobId);
    const jobSnap = await getDoc(jobRef);
    
    if (jobSnap.exists()) {
      return { id: jobSnap.id, ...jobSnap.data() } as Job;
    }
    return null;
  } catch (error: any) {
    console.error('Get job by ID error:', error);
    return null;
  }
};

export const updateJobStatus = async (jobId: string, status: Job['status']): Promise<void> => {
  try {
    const jobRef = doc(professionalDb, 'jobs', jobId);
    await updateDoc(jobRef, {
      status,
      updatedAt: serverTimestamp()
    });
  } catch (error: any) {
    console.error('Update job status error:', error);
    throw new Error('Failed to update job status');
  }
};

// Bid Management Functions

export const createBid = async (bidData: Omit<Bid, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<string> => {
  try {
    // Create the bid
    const bidsRef = collection(professionalDb, 'bids');
    const docRef = await addDoc(bidsRef, {
      ...bidData,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    // Update job bid count
    const jobRef = doc(professionalDb, 'jobs', bidData.jobId);
    const jobSnap = await getDoc(jobRef);
    if (jobSnap.exists()) {
      const currentBidsCount = jobSnap.data().bidsCount || 0;
      await updateDoc(jobRef, {
        bidsCount: currentBidsCount + 1,
        updatedAt: serverTimestamp()
      });
    }

    return docRef.id;
  } catch (error: any) {
    console.error('Create bid error:', error);
    throw new Error('Failed to submit bid');
  }
};

export const getBidsForJob = async (jobId: string): Promise<Bid[]> => {
  try {
    const bidsRef = collection(professionalDb, 'bids');
    const q = query(
      bidsRef,
      where('jobId', '==', jobId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const bids: Bid[] = [];
    
    querySnapshot.forEach((doc) => {
      bids.push({ id: doc.id, ...doc.data() } as Bid);
    });

    return bids;
  } catch (error: any) {
    console.error('Get bids for job error:', error);
    throw new Error('Failed to fetch bids');
  }
};

export const getBidsForProfessional = async (professionalId: string): Promise<Bid[]> => {
  try {
    const bidsRef = collection(professionalDb, 'bids');
    const q = query(
      bidsRef,
      where('professionalId', '==', professionalId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const bids: Bid[] = [];
    
    querySnapshot.forEach((doc) => {
      bids.push({ id: doc.id, ...doc.data() } as Bid);
    });

    return bids;
  } catch (error: any) {
    console.error('Get bids for professional error:', error);
    throw new Error('Failed to fetch your bids');
  }
};

export const updateBidStatus = async (bidId: string, status: Bid['status']): Promise<void> => {
  try {
    const bidRef = doc(professionalDb, 'bids', bidId);
    await updateDoc(bidRef, {
      status,
      updatedAt: serverTimestamp()
    });

    // If bid is accepted, update job status and selected professional
    if (status === 'accepted') {
      const bidSnap = await getDoc(bidRef);
      if (bidSnap.exists()) {
        const bidData = bidSnap.data() as Bid;
        const jobRef = doc(professionalDb, 'jobs', bidData.jobId);
        await updateDoc(jobRef, {
          status: 'in_progress',
          selectedProfessionalId: bidData.professionalId,
          updatedAt: serverTimestamp()
        });

        // Reject all other bids for this job
        const bidsRef = collection(professionalDb, 'bids');
        const otherBidsQuery = query(
          bidsRef,
          where('jobId', '==', bidData.jobId),
          where('status', '==', 'pending')
        );
        
        const otherBidsSnapshot = await getDocs(otherBidsQuery);
        const updatePromises = otherBidsSnapshot.docs
          .filter(doc => doc.id !== bidId)
          .map(doc => updateDoc(doc.ref, { 
            status: 'rejected', 
            updatedAt: serverTimestamp() 
          }));
        
        await Promise.all(updatePromises);
      }
    }
  } catch (error: any) {
    console.error('Update bid status error:', error);
    throw new Error('Failed to update bid status');
  }
};

export const withdrawBid = async (bidId: string): Promise<void> => {
  try {
    await updateBidStatus(bidId, 'withdrawn');
  } catch (error: any) {
    console.error('Withdraw bid error:', error);
    throw new Error('Failed to withdraw bid');
  }
};

// Search and Filter Functions

export const searchJobs = async (searchTerm: string, filters?: {
  category?: string;
  location?: string;
  maxBudget?: number;
}): Promise<Job[]> => {
  try {
    // For now, get all jobs and filter client-side
    // In production, you'd want to use Algolia or similar for full-text search
    const jobs = await getAvailableJobs(filters);
    
    if (!searchTerm.trim()) {
      return jobs;
    }

    const searchTermLower = searchTerm.toLowerCase();
    return jobs.filter(job => 
      job.title.toLowerCase().includes(searchTermLower) ||
      job.description.toLowerCase().includes(searchTermLower) ||
      job.location.toLowerCase().includes(searchTermLower) ||
      job.category.toLowerCase().includes(searchTermLower)
    );
  } catch (error: any) {
    console.error('Search jobs error:', error);
    throw new Error('Failed to search jobs');
  }
};

// Notification Functions (placeholder for future implementation)

export const createJobNotification = async (
  professionalId: string, 
  jobId: string, 
  type: 'new_job' | 'bid_accepted' | 'bid_rejected'
): Promise<void> => {
  try {
    const notificationsRef = collection(professionalDb, 'notifications');
    await addDoc(notificationsRef, {
      professionalId,
      jobId,
      type,
      read: false,
      createdAt: serverTimestamp()
    });
  } catch (error: any) {
    console.error('Create notification error:', error);
    // Don't throw error for notifications - they're not critical
  }
};
