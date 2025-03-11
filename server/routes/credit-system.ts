
import { Router } from "express";
import { z } from "zod";

const router = Router();

// Credit transaction schema
const creditTransactionSchema = z.object({
  userId: z.string(),
  amount: z.number(),
  transactionType: z.enum(["purchase", "usage", "reward", "referral"]),
  description: z.string(),
  entityId: z.string().optional(), // ID of related entity (agent, resource, etc.)
  entityType: z.string().optional() // Type of related entity
});

// Mock credit balance data store
// In a real implementation, this would be in a database
const userCreditBalances: Record<string, number> = {};
const creditTransactions: any[] = [];

// Get user credit balance
router.get("/:userId/balance", (req, res) => {
  const { userId } = req.params;
  
  // Initialize balance if not exists
  if (!userCreditBalances[userId]) {
    userCreditBalances[userId] = 100; // Default starting credits
  }
  
  res.json({
    userId,
    balance: userCreditBalances[userId]
  });
});

// Get user credit transactions history
router.get("/:userId/transactions", (req, res) => {
  const { userId } = req.params;
  
  const userTransactions = creditTransactions.filter(
    transaction => transaction.userId === userId
  );
  
  res.json(userTransactions);
});

// Add credits to user (purchase, reward, etc.)
router.post("/:userId/add", (req, res) => {
  try {
    const { userId } = req.params;
    const data = creditTransactionSchema.parse({
      userId,
      ...req.body
    });
    
    // Initialize balance if not exists
    if (!userCreditBalances[userId]) {
      userCreditBalances[userId] = 0;
    }
    
    // Add credits
    userCreditBalances[userId] += data.amount;
    
    // Record transaction
    const transaction = {
      id: creditTransactions.length + 1,
      ...data,
      timestamp: new Date().toISOString()
    };
    
    creditTransactions.push(transaction);
    
    res.status(201).json({
      transaction,
      newBalance: userCreditBalances[userId]
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: "Invalid transaction data", errors: error.errors });
    } else {
      res.status(500).json({ message: "Error processing credit transaction" });
    }
  }
});

// Use credits for a service
router.post("/:userId/use", (req, res) => {
  try {
    const { userId } = req.params;
    const data = creditTransactionSchema.parse({
      userId,
      ...req.body
    });
    
    // Check if user has enough credits
    if (!userCreditBalances[userId] || userCreditBalances[userId] < data.amount) {
      return res.status(400).json({ 
        message: "Insufficient credits",
        currentBalance: userCreditBalances[userId] || 0,
        requiredAmount: data.amount
      });
    }
    
    // Deduct credits
    userCreditBalances[userId] -= data.amount;
    
    // Record transaction
    const transaction = {
      id: creditTransactions.length + 1,
      ...data,
      timestamp: new Date().toISOString()
    };
    
    creditTransactions.push(transaction);
    
    res.status(201).json({
      transaction,
      newBalance: userCreditBalances[userId]
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: "Invalid transaction data", errors: error.errors });
    } else {
      res.status(500).json({ message: "Error processing credit transaction" });
    }
  }
});

// List ways to earn credits
router.get("/earning-opportunities", (req, res) => {
  res.json([
    {
      id: "assessment",
      name: "Complete AI Maturity Assessment",
      description: "Earn credits by completing a comprehensive assessment of your organization's AI readiness",
      creditAmount: 25,
      requirements: "Complete all sections of the assessment questionnaire"
    },
    {
      id: "referral",
      name: "Refer a Colleague",
      description: "Earn credits when you refer colleagues who sign up and complete their profile",
      creditAmount: 100,
      requirements: "New user must sign up using your referral link and complete onboarding"
    },
    {
      id: "casestudy",
      name: "Submit a Case Study",
      description: "Share your AI implementation success story to earn credits",
      creditAmount: 50,
      requirements: "Case study must be approved by our editorial team"
    },
    {
      id: "sharing",
      name: "Share Resources",
      description: "Earn credits by sharing FrankX.AI resources with your team",
      creditAmount: 2,
      requirements: "Per unique user who accesses a shared resource"
    },
    {
      id: "feedback",
      name: "Provide Detailed Feedback",
      description: "Help us improve by providing detailed feedback on AI agents or tools",
      creditAmount: 10,
      requirements: "Feedback must include specific improvements or suggestions"
    }
  ]);
});

// Purchase credits
router.post("/purchase", (req, res) => {
  try {
    const { userId, packageId, paymentMethod, amount } = req.body;
    
    // In a real implementation, this would integrate with a payment processor
    // For now, we'll just simulate a successful purchase
    
    // Credit packages
    const creditPackages = {
      "basic": { credits: 100, price: 9.99 },
      "standard": { credits: 500, price: 39.99 },
      "premium": { credits: 1200, price: 79.99 },
      "enterprise": { credits: 5000, price: 299.99 }
    };
    
    const selectedPackage = creditPackages[packageId as keyof typeof creditPackages];
    
    if (!selectedPackage) {
      return res.status(400).json({ message: "Invalid package ID" });
    }
    
    // Initialize balance if not exists
    if (!userCreditBalances[userId]) {
      userCreditBalances[userId] = 0;
    }
    
    // Add credits
    userCreditBalances[userId] += selectedPackage.credits;
    
    // Record transaction
    const transaction = {
      id: creditTransactions.length + 1,
      userId,
      amount: selectedPackage.credits,
      transactionType: "purchase",
      description: `Purchased ${selectedPackage.credits} credits (${packageId} package)`,
      paymentAmount: selectedPackage.price,
      paymentMethod,
      timestamp: new Date().toISOString()
    };
    
    creditTransactions.push(transaction);
    
    res.status(201).json({
      transaction,
      newBalance: userCreditBalances[userId]
    });
  } catch (error) {
    res.status(500).json({ message: "Error processing purchase" });
  }
});

export default router;
