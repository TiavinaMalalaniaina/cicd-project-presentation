import { useEffect, useState } from 'react'
import './App.css'

const STORAGE_KEY = 'contacts'

function loadContacts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

const emptyForm = { name: '', email: '', phone: '' }

function App() {
  const [contacts, setContacts] = useState(loadContacts)
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts))
  }, [contacts])

  function handleChange(e) {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim()) return

    if (editingId) {
      setContacts((cs) =>
        cs.map((c) => (c.id === editingId ? { ...c, ...form } : c)),
      )
      setEditingId(null)
    } else {
      setContacts((cs) => [...cs, { id: crypto.randomUUID(), ...form }])
    }
    setForm(emptyForm)
  }

  function handleEdit(contact) {
    setEditingId(contact.id)
    setForm({ name: contact.name, email: contact.email, phone: contact.phone })
  }

  function handleDelete(id) {
    setContacts((cs) => cs.filter((c) => c.id !== id))
    if (editingId === id) {
      setEditingId(null)
      setForm(emptyForm)
    }
  }

  function handleCancel() {
    setEditingId(null)
    setForm(emptyForm)
  }

  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(search.trim().toLowerCase()),
  )

  return (
    <div className="app">
      <h1>Carnet de contacts</h1>

      <form onSubmit={handleSubmit} className="contact-form">
        <input
          name="name"
          placeholder="Nom"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        <input
          name="phone"
          placeholder="Téléphone"
          value={form.phone}
          onChange={handleChange}
        />
        <div className="form-actions">
          <button type="submit">{editingId ? 'Modifier' : 'Ajouter'}</button>
          {editingId && (
            <button type="button" onClick={handleCancel}>
              Annuler
            </button>
          )}
        </div>
      </form>

      {contacts.length > 0 && (
        <input
          type="search"
          className="search-input"
          placeholder="Rechercher un contact"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      )}

      {contacts.length === 0 ? (
        <p className="empty">Aucun contact pour le moment.</p>
      ) : filteredContacts.length === 0 ? (
        <p className="empty">Aucun contact ne correspond à la recherche.</p>
      ) : (
        <ul className="contact-list">
          {filteredContacts.map((c) => (
            <li key={c.id} className="contact-item">
              <div>
                <strong>{c.name}</strong>
                <div className="contact-details">
                  {c.email && <span>{c.email}</span>}
                  {c.phone && <span>{c.phone}</span>}
                </div>
              </div>
              <div className="contact-actions">
                <button type="button" onClick={() => handleEdit(c)}>
                  Éditer
                </button>
                <button type="button" onClick={() => handleDelete(c.id)}>
                  Supprimer
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default App
