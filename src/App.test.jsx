import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import App from './App'

describe('Carnet de contacts', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('affiche un message quand la liste est vide', () => {
    render(<App />)
    expect(screen.getByText(/aucun contact/i)).toBeInTheDocument()
  })

  it('ajoute un contact via le formulaire', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByPlaceholderText('Nom'), 'Ada Lovelace')
    await user.type(screen.getByPlaceholderText('Email'), 'ada@example.com')
    await user.type(screen.getByPlaceholderText('Téléphone'), '0600000000')
    await user.click(screen.getByRole('button', { name: /ajouter/i }))

    expect(screen.getByText('Ada Lovelace')).toBeInTheDocument()
    expect(screen.getByText('ada@example.com')).toBeInTheDocument()
    expect(screen.queryByText(/aucun contact/i)).not.toBeInTheDocument()
  })

  it("n'ajoute pas de contact sans nom", async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByPlaceholderText('Email'), 'sans-nom@example.com')
    await user.click(screen.getByRole('button', { name: /ajouter/i }))

    expect(screen.getByText(/aucun contact/i)).toBeInTheDocument()
  })

  it('modifie un contact existant', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByPlaceholderText('Nom'), 'Grace Hopper')
    await user.click(screen.getByRole('button', { name: /ajouter/i }))

    await user.click(screen.getByRole('button', { name: /éditer/i }))
    const nameInput = screen.getByPlaceholderText('Nom')
    await user.clear(nameInput)
    await user.type(nameInput, 'Grace Murray Hopper')
    await user.click(screen.getByRole('button', { name: /modifier/i }))

    expect(screen.getByText('Grace Murray Hopper')).toBeInTheDocument()
    expect(screen.queryByText('Grace Hopper')).not.toBeInTheDocument()
  })

  it('supprime un contact', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByPlaceholderText('Nom'), 'Alan Turing')
    await user.click(screen.getByRole('button', { name: /ajouter/i }))
    expect(screen.getByText('Alan Turing')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /supprimer/i }))

    expect(screen.queryByText('Alan Turing')).not.toBeInTheDocument()
    expect(screen.getByText(/aucun contact/i)).toBeInTheDocument()
  })

  it('persiste les contacts dans le localStorage', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByPlaceholderText('Nom'), 'Margaret Hamilton')
    await user.click(screen.getByRole('button', { name: /ajouter/i }))

    const stored = JSON.parse(localStorage.getItem('contacts'))
    expect(stored).toHaveLength(1)
    expect(stored[0].name).toBe('Margaret Hamilton')
  })
})
