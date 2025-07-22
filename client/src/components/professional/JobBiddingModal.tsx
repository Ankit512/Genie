import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  DollarSign, 
  Clock, 
  MessageSquare, 
  X, 
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

interface Job {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  budget: string;
  timeframe: string;
  customerRating: number;
}

interface JobBiddingModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitBid: (bidData: BidData) => void;
}

interface BidData {
  jobId: string;
  bidAmount: number;
  proposedTimeframe: string;
  message: string;
  professionalId: string;
}

export function JobBiddingModal({ job, isOpen, onClose, onSubmitBid }: JobBiddingModalProps) {
  const [bidAmount, setBidAmount] = useState('');
  const [proposedTimeframe, setProposedTimeframe] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !job) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!bidAmount || !proposedTimeframe || !message) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    const amount = parseFloat(bidAmount);
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid bid amount');
      setLoading(false);
      return;
    }

    try {
      const bidData: BidData = {
        jobId: job.id,
        bidAmount: amount,
        proposedTimeframe,
        message,
        professionalId: 'current-user-id' // In real app, get from auth context
      };

      await onSubmitBid(bidData);
      
      // Reset form
      setBidAmount('');
      setProposedTimeframe('');
      setMessage('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to submit bid');
    } finally {
      setLoading(false);
    }
  };

  const extractBudgetRange = (budget: string) => {
    const matches = budget.match(/€(\d+)-(\d+)/);
    if (matches) {
      return {
        min: parseInt(matches[1]),
        max: parseInt(matches[2])
      };
    }
    return null;
  };

  const budgetRange = extractBudgetRange(job.budget);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-bold">Place Your Bid</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Job Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">{job.title}</h3>
            <p className="text-gray-600 text-sm mb-3">{job.description}</p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              <span>📍 {job.location}</span>
              <span>💰 {job.budget}</span>
              <span>⏰ {job.timeframe}</span>
              <span>⭐ {job.customerRating} rating</span>
            </div>
          </div>

          {error && (
            <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-md">
              <AlertTriangle className="h-4 w-4 text-red-600 mr-2" />
              <span className="text-red-800 text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Bid Amount */}
            <div className="space-y-2">
              <Label htmlFor="bidAmount">Your Bid Amount (€)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="bidAmount"
                  type="number"
                  placeholder="Enter your bid amount"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  className="pl-10"
                  min="1"
                  step="0.01"
                  required
                />
              </div>
              {budgetRange && (
                <p className="text-sm text-gray-500">
                  Customer's budget range: €{budgetRange.min} - €{budgetRange.max}
                </p>
              )}
            </div>

            {/* Proposed Timeframe */}
            <div className="space-y-2">
              <Label htmlFor="timeframe">Proposed Timeframe</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="timeframe"
                  placeholder="e.g., 2-3 days, This weekend, Next week"
                  value={proposedTimeframe}
                  onChange={(e) => setProposedTimeframe(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
              <p className="text-sm text-gray-500">
                Customer's preferred timeframe: {job.timeframe}
              </p>
            </div>

            {/* Bid Message */}
            <div className="space-y-2">
              <Label htmlFor="message">Your Proposal</Label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
                <Textarea
                  id="message"
                  placeholder="Explain why you're the right professional for this job. Include your experience, approach, and any questions..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="pl-10 min-h-[120px]"
                  required
                />
              </div>
              <p className="text-sm text-gray-500">
                Tip: Personalized messages get 3x more responses
              </p>
            </div>

            {/* Bidding Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-2">Bidding Tips</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Be competitive but fair with your pricing</li>
                    <li>• Highlight your relevant experience and skills</li>
                    <li>• Ask clarifying questions if needed</li>
                    <li>• Be realistic with your timeframe</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-3">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </div>
                ) : (
                  'Submit Bid'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
