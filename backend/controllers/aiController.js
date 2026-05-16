import Transaction from '../models/Transaction.js';
import User from '../models/User.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
const getGenAI = () => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is missing in backend/.env');
  }
  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
};

export const getInsights = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id });
    const user = await User.findById(req.user._id);

    // Fallback if no transactions
    if (!transactions || transactions.length === 0) {
      return res.json({ insights: ["You haven't added any transactions yet. Add some to get personalized AI insights!"] });
    }

    let totalSpent = 0;
    const categoryTotals = {};
    const expenses = transactions.filter(t => t.type === 'expense');
    
    expenses.forEach(t => {
      totalSpent += t.amount;
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });

    const contextStr = `
User Profile:
- Monthly Budget: ₹${user?.monthlyBudget || 0}
- Total Spent This Month: ₹${totalSpent}
- Spending by Category: ${JSON.stringify(categoryTotals)}

Task: Provide exactly 3 short, punchy, actionable financial insights (1 sentence each) for this user based on their data. Format as a simple array of strings, one per line, without numbering, bullets, or hyphens at the start of the line.
    `;

    try {
      const genAI = getGenAI();
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      
      const result = await model.generateContent(contextStr);
      const response = await result.response;
      const text = response.text();
      
      // Parse the response into an array of strings
      const insights = text.split('\n').filter(line => line.trim().length > 0).map(line => line.replace(/^[\-\*\d\.]+\s*/, '').trim()).slice(0, 3);
      
      res.json({ insights: insights.length > 0 ? insights : ["Great job managing your finances! Keep tracking your expenses."] });
    } catch (aiError) {
      console.error("Gemini AI Error:", aiError);
      // Fallback to basic insights if AI fails (e.g. no API key)
      const insights = [];
      if (user && totalSpent > user.monthlyBudget) {
        insights.push(`⚠️ You have exceeded your monthly budget of ₹${user.monthlyBudget}!`);
      } else {
         insights.push("You are tracking your expenses well. Add a valid GEMINI_API_KEY in backend/.env for advanced AI insights.");
      }
      res.json({ insights });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const chatWithAssistant = async (req, res) => {
  const { message } = req.body;
  try {
    const transactions = await Transaction.find({ user: req.user._id });
    const user = await User.findById(req.user._id);
    
    let totalSpent = 0;
    const categoryTotals = {};
    const expenses = transactions.filter(t => t.type === 'expense');
    
    expenses.forEach(t => {
      totalSpent += t.amount;
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });

    const systemPrompt = `
You are a helpful, professional AI financial assistant for a personal finance dashboard.
The user you are speaking to has the following financial profile:
- Monthly Budget: ₹${user?.monthlyBudget || 0}
- Total Spent This Month: ₹${totalSpent}
- Spending by Category: ${JSON.stringify(categoryTotals)}

Answer their financial queries based on this real data. Be concise, friendly, and practical. Do not format with heavy markdown. Keep it readable in a simple chat UI.
    `;

    try {
      const genAI = getGenAI();
      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        systemInstruction: systemPrompt 
      });
      
      const result = await model.generateContent(message);
      const response = await result.response;
      
      res.json({ reply: response.text() });
    } catch (aiError) {
      console.error("Gemini AI Chat Error:", aiError);
      let reply = "Sorry, I am having trouble connecting to the AI service. Please ensure GEMINI_API_KEY is correctly set in your backend .env file.";
      res.json({ reply });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
