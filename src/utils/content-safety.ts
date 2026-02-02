export interface ContentSafetyResult {
  isSafe: boolean;
  reason?: string;
}

// Mock function simulating an AI content safety check (e.g., AWS Rekognition)
// This function simulates flagging the second item (id: 2) for demonstration.
export const validateContentSafety = (contentId: number): ContentSafetyResult => {
  if (contentId === 2) {
    return {
      isSafe: false,
      reason: "Inappropriate content detected (NSFW/Pornography)",
    };
  }
  return {
    isSafe: true,
  };
};