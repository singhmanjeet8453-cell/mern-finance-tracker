import Transaction from '../models/Transaction.js';
import User from '../models/User.js';

export const getInsights = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id });
    
    // Simple Rule-Based AI Mock
    const expenses = transactions.filter(t => t.type === 'expense');
    
    let totalSpent = 0;
    const categoryTotals = {};
    expenses.forEach(t => {
      totalSpent += t.amount;
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });

    const insights = [];
    
    // Insight 1: Highest spending category
    if (Object.keys(categoryTotals).length > 0) {
      const highestCategory = Object.keys(categoryTotals).reduce((a, b) => categoryTotals[a] > categoryTotals[b] ? a : b);
      insights.push(`Your highest expense this month is ${highestCategory} at ₹${categoryTotals[highestCategory]}.`);
      
      if (highestCategory === 'Food' || highestCategory === 'Entertainment') {
        insights.push(`You can save around ₹${Math.floor(categoryTotals[highestCategory] * 0.2)} by reducing ${highestCategory} expenses by 20%.`);
      }
    }

    // Insight 2: Overspending prediction
    const user = await User.findById(req.user._id);
    if (user && user.monthlyBudget > 0) {
      if (totalSpent > user.monthlyBudget) {
        insights.push(`⚠️ You have exceeded your monthly budget of ₹${user.monthlyBudget}!`);
      } else if (totalSpent > user.monthlyBudget * 0.8) {
        insights.push(`⚠️ You are nearing your monthly budget limit (80%+ reached).`);
      }
    }

    if (insights.length === 0) {
      insights.push("Great job managing your finances! Keep tracking your expenses to get more insights.");
    }

    res.json({ insights });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const chatWithAssistant = async (req, res) => {
  const { message } = req.body;
  try {
    // A very basic mock chatbot logic
    let reply = "I am your AI financial assistant. Can you specify your question?";
    const msg = message.toLowerCase();
    
    if (msg.includes('save') || msg.includes('tips')) {
      reply = "To save more, try the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings.";
    } else if (msg.includes('budget')) {
      reply = "A good budget tracks every rupee. Make sure you categorize your expenses properly in the dashboard.";
    } else if (msg.includes('hello') || msg.includes('hi')) {
      reply = "Hello! How can I help you manage your finances today?";
    }

    res.json({ reply });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
