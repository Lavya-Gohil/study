'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { FiArrowLeft, FiPlus, FiSearch, FiStar, FiTrash2, FiEdit2 } from 'react-icons/fi'
import toast, { Toaster } from 'react-hot-toast'
import { Button, Card, CardContent, IconButton, MenuItem, Select, TextField, Typography } from '@mui/material'

export default function NotesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [notes, setNotes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingNote, setEditingNote] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('All')
  
  const [formData, setFormData] = useState({
    subject: '',
    title: '',
    content: '',
    tags: '',
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (status === 'authenticated') {
      fetchNotes()
    }
  }, [status, router])

  const fetchNotes = async () => {
    try {
      const res = await fetch('/api/notes')
      if (res.ok) {
        const data = await res.json()
        setNotes(data.notes)
      }
    } catch (error) {
      console.error('Fetch notes error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = editingNote ? `/api/notes?id=${editingNote.id}` : '/api/notes'
      const method = editingNote ? 'PATCH' : 'POST'
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
        }),
      })

      if (res.ok) {
        toast.success(editingNote ? 'Note updated!' : 'Note created!')
        setShowModal(false)
        setEditingNote(null)
        setFormData({ subject: '', title: '', content: '', tags: '' })
        fetchNotes()
      }
    } catch (error) {
      toast.error('Failed to save note')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this note?')) return

    try {
      const res = await fetch(`/api/notes?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Note deleted!')
        fetchNotes()
      }
    } catch (error) {
      toast.error('Failed to delete note')
    }
  }

  const handlePin = async (note: any) => {
    try {
      const res = await fetch(`/api/notes?id=${note.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPinned: !note.isPinned }),
      })
      if (res.ok) {
        toast.success(note.isPinned ? 'Unpinned!' : 'Pinned!')
        fetchNotes()
      }
    } catch (error) {
      toast.error('Failed to update note')
    }
  }

  const filteredNotes = notes.filter((note) => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSubject = selectedSubject === 'All' || note.subject === selectedSubject
    return matchesSearch && matchesSubject
  })

  const subjects = ['All', ...Array.from(new Set(notes.map((n) => n.subject)))]
  const hasFilters = searchQuery.trim().length > 0 || selectedSubject !== 'All'

  return (
    <div className="app-shell">
      <Toaster position="top-right" />
      
      <nav className="glass-nav">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <IconButton
                onClick={() => router.push('/dashboard')}
                className="glass-pill"
                sx={{ width: 44, height: 44 }}
              >
                <FiArrowLeft className="w-6 h-6" />
              </IconButton>
              <Typography variant="h5" className="text-slate-900 font-bold">
                My Notes
              </Typography>
            </div>
            <Button
              onClick={() => setShowModal(true)}
              className="glass-button glass-button-primary rounded-xl transition"
              sx={{ px: 2.5, py: 1.2, textTransform: 'none' }}
              startIcon={<FiPlus />}
            >
              New Note
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <TextField
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes..."
              size="small"
              fullWidth
              InputProps={{ className: 'glass-input pl-10' }}
            />
          </div>
          <Select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value as string)}
            size="small"
            className="glass-select"
            sx={{ minWidth: 180 }}
          >
            {subjects.map((subject) => (
              <MenuItem key={subject} value={subject}>{subject}</MenuItem>
            ))}
          </Select>
          {hasFilters && (
            <Button
              onClick={() => {
                setSearchQuery('')
                setSelectedSubject('All')
              }}
              className="glass-pill text-slate-700"
              sx={{ textTransform: 'none' }}
            >
              Clear
            </Button>
          )}
        </div>

        {/* Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => (
            <Card
              key={note.id}
              className={`glass-card rounded-2xl ${note.isPinned ? 'ring-2 ring-yellow-400' : ''}`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
                      {note.subject}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-2">{note.title}</h3>
                  </div>
                  <IconButton
                    onClick={() => handlePin(note)}
                    className={note.isPinned ? 'text-yellow-500' : 'text-gray-400'}
                    size="small"
                  >
                    <FiStar className="w-5 h-5" />
                  </IconButton>
                </div>
                
                <p className="text-slate-600 text-sm mb-4 line-clamp-3">{note.content}</p>
                
                {note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {note.tags.map((tag: string, i: number) => (
                      <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      setEditingNote(note)
                      setFormData({
                        subject: note.subject,
                        title: note.title,
                        content: note.content,
                        tags: note.tags.join(', '),
                      })
                      setShowModal(true)
                    }}
                    className="glass-pill text-blue-600 hover:shadow-md transition flex-1"
                    startIcon={<FiEdit2 className="w-4 h-4" />}
                    sx={{ textTransform: 'none' }}
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(note.id)}
                    className="glass-pill text-red-600 hover:shadow-md transition flex-1"
                    startIcon={<FiTrash2 className="w-4 h-4" />}
                    sx={{ textTransform: 'none' }}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredNotes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-600 mb-4">
              {notes.length === 0 ? 'No notes yet.' : 'No matches for your filters.'}
            </p>
            {notes.length === 0 && (
              <Button
                onClick={() => setShowModal(true)}
                className="glass-button glass-button-primary rounded-full"
                sx={{ textTransform: 'none', px: 3 }}
              >
                Create a note
              </Button>
            )}
          </div>
        )}
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center p-4 z-50">
          <div className="glass-card glass-shimmer rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              {editingNote ? 'Edit Note' : 'Create New Note'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Subject</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                  className="w-full p-3 rounded-xl glass-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full p-3 rounded-xl glass-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Content</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  required
                  rows={10}
                  className="w-full p-3 rounded-xl glass-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="important, revision, formula"
                  className="w-full p-3 rounded-xl glass-input"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setEditingNote(null)
                    setFormData({ subject: '', title: '', content: '', tags: '' })
                  }}
                  className="flex-1 px-4 py-3 glass-pill hover:shadow-md transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-3 glass-button glass-button-primary rounded-xl transition disabled:opacity-50"
                >
                  {loading ? 'Saving...' : editingNote ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
