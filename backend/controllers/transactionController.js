import Transaction from '../models/Transaction.js';

export const getTransactions = async (req, res) => {
  try {
    // Fetch all transactions for all users
    const transactions = await Transaction.find({}).sort({ date: -1 }).populate('user', 'name email');
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addTransaction = async (req, res) => {
  const { type, amount, category, date, note, paymentMethod } = req.body;
  try {
    const transaction = new Transaction({ user: req.user._id, type, amount, category, date, note, paymentMethod });
    const createdTransaction = await transaction.save();
    // Populate user before sending back
    await createdTransaction.populate('user', 'name email');
    res.status(201).json(createdTransaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (transaction) {
      // Allow any user to delete any transaction as requested (shared ledger)
      await transaction.deleteOne();
      res.json({ message: 'Transaction removed' });
    } else {
      res.status(404).json({ message: 'Transaction not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
