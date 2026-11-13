import { useEffect, useState } from 'react';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../constants.js';

const today = () => new Date().toISOString().slice(0, 10);
const empty = { title: '', amount: '', type: 'expense', category: 'Food', date: today(), note: '' };

export default function TransactionForm({ editing, onSave, onCancel }) {
  const [form, setForm] = useState(empty);

  useEffect(() => {
    if (editing) {
      setForm({
        title: editing.title,
        amount: editing.amount,
        type: editing.type,
        category: editing.category,
        date: editing.date.slice(0, 10),
        note: editing.note || '',
      });
    } else {
      setForm(empty);
    }
  }, [editing]);

  const categories = form.type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'type') {
      setForm({ ...form, type: value, category: value === 'expense' ? EXPENSE_CATEGORIES[0] : INCOME_CATEGORIES[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await onSave({ ...form, amount: Number(form.amount) });
    if (ok && !editing) setForm({ ...empty, date: today() });
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h3>{editing ? '✏️ Edit Transaction' : '➕ Add Transaction'}</h3>
      <div className="grid-2">
        <select name="type" value={form.type} onChange={handleChange}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <select name="category" value={form.category} onChange={handleChange}>
          {categories.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>
      <input name="title" placeholder="Title (e.g. Lunch)" value={form.title} onChange={handleChange} required />
      <div className="grid-2">
        <input name="amount" type="number" min="0.01" step="0.01" placeholder="Amount (₹)" value={form.amount} onChange={handleChange} required />
        <input name="date" type="date" value={form.date} onChange={handleChange} required />
      </div>
      <input name="note" placeholder="Note (optional)" value={form.note} onChange={handleChange} />
      <div className="row">
        <button className="btn primary">{editing ? 'Update' : 'Add'}</button>
        {editing && <button type="button" className="btn" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}
