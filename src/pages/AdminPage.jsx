import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/lib/auth-context'
import { apiFetch } from '@/lib/api'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, Database, HelpCircle, FileText } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('website-data')

  const [websiteData, setWebsiteData] = useState([])
  const [loadingWebsiteData, setLoadingWebsiteData] = useState(true)
  const [websiteDataDialog, setWebsiteDataDialog] = useState(false)
  const [editingWebsiteData, setEditingWebsiteData] = useState(null)
  const [websiteDataForm, setWebsiteDataForm] = useState({
    title: '',
    content: '',
    category: '',
    url: '',
  })
  const [savingWebsiteData, setSavingWebsiteData] = useState(false)

  const [faqs, setFaqs] = useState([])
  const [loadingFaqs, setLoadingFaqs] = useState(true)
  const [faqDialog, setFaqDialog] = useState(false)
  const [editingFaq, setEditingFaq] = useState(null)
  const [faqForm, setFaqForm] = useState({
    question: '',
    answer: '',
    category: '',
    order: 0,
    isActive: true,
  })
  const [savingFaq, setSavingFaq] = useState(false)

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      navigate('/')
    }
  }, [user, authLoading, navigate])

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchWebsiteData()
      fetchFaqs()
    }
  }, [user])

  const fetchWebsiteData = async () => {
    try {
      const res = await apiFetch('/api/admin/website-data')
      const data = await res.json()
      setWebsiteData(data.data || [])
    } catch (error) {
      console.error('Failed to fetch website data:', error)
      toast.error('Failed to fetch website data')
    } finally {
      setLoadingWebsiteData(false)
    }
  }

  const fetchFaqs = async () => {
    try {
      const res = await apiFetch('/api/admin/faqs')
      const data = await res.json()
      setFaqs(data.faqs || [])
    } catch (error) {
      console.error('Failed to fetch FAQs:', error)
      toast.error('Failed to fetch FAQs')
    } finally {
      setLoadingFaqs(false)
    }
  }

  const handleSaveWebsiteData = async () => {
    if (!websiteDataForm.title || !websiteDataForm.content || !websiteDataForm.category) {
      toast.error('Please fill in all required fields')
      return
    }

    setSavingWebsiteData(true)
    try {
      const url = editingWebsiteData
        ? `/api/admin/website-data/${editingWebsiteData.id}`
        : '/api/admin/website-data'
      const method = editingWebsiteData ? 'PUT' : 'POST'

      const res = await apiFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(websiteDataForm),
      })

      if (!res.ok) throw new Error('Failed to save')

      toast.success(editingWebsiteData ? 'Updated successfully' : 'Created successfully')
      setWebsiteDataDialog(false)
      setEditingWebsiteData(null)
      setWebsiteDataForm({ title: '', content: '', category: '', url: '' })
      fetchWebsiteData()
    } catch (error) {
      console.error('Save error:', error)
      toast.error('Failed to save')
    } finally {
      setSavingWebsiteData(false)
    }
  }

  const handleDeleteWebsiteData = async (id) => {
    if (!confirm('Are you sure you want to delete this item?')) return

    try {
      const res = await apiFetch(`/api/admin/website-data/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      toast.success('Deleted successfully')
      fetchWebsiteData()
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Failed to delete')
    }
  }

  const handleSaveFaq = async () => {
    if (!faqForm.question || !faqForm.answer || !faqForm.category) {
      toast.error('Please fill in all required fields')
      return
    }

    setSavingFaq(true)
    try {
      const url = editingFaq ? `/api/admin/faqs/${editingFaq.id}` : '/api/admin/faqs'
      const method = editingFaq ? 'PUT' : 'POST'

      const res = await apiFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(faqForm),
      })

      if (!res.ok) throw new Error('Failed to save')

      toast.success(editingFaq ? 'Updated successfully' : 'Created successfully')
      setFaqDialog(false)
      setEditingFaq(null)
      setFaqForm({ question: '', answer: '', category: '', order: 0, isActive: true })
      fetchFaqs()
    } catch (error) {
      console.error('Save error:', error)
      toast.error('Failed to save')
    } finally {
      setSavingFaq(false)
    }
  }

  const handleDeleteFaq = async (id) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return

    try {
      const res = await apiFetch(`/api/admin/faqs/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      toast.success('Deleted successfully')
      fetchFaqs()
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Failed to delete')
    }
  }

  if (authLoading || !user || user.role !== 'admin') {
    return (
      <div className="flex h-dvh items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="flex h-dvh flex-col">
      <Header showMenuButton={false} />

      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mx-auto max-w-6xl space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage www.sit.edu.au content and FAQs for the SIT Assistant
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Website Data</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{websiteData.length}</div>
                <p className="text-xs text-muted-foreground">Content entries</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">FAQs</CardTitle>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{faqs.length}</div>
                <p className="text-xs text-muted-foreground">
                  {faqs.filter((f) => f.isActive).length} active
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Categories</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {
                    new Set([
                      ...websiteData.map((d) => d.category),
                      ...faqs.map((f) => f.category),
                    ]).size
                  }
                </div>
                <p className="text-xs text-muted-foreground">Unique categories</p>
              </CardContent>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="website-data">Website Data</TabsTrigger>
              <TabsTrigger value="faqs">FAQs</TabsTrigger>
            </TabsList>

            <TabsContent value="website-data" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Website Content</h2>
                <Button
                  onClick={() => {
                    setEditingWebsiteData(null)
                    setWebsiteDataForm({ title: '', content: '', category: '', url: '' })
                    setWebsiteDataDialog(true)
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Content
                </Button>
              </div>

              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Updated</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loadingWebsiteData ? (
                      [...Array(3)].map((_, i) => (
                        <TableRow key={i}>
                          <TableCell>
                            <Skeleton className="h-4 w-40" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-20" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-24" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-16" />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : websiteData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground">
                          No content yet. Add your first entry.
                        </TableCell>
                      </TableRow>
                    ) : (
                      websiteData.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.title}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{item.category}</Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatDistanceToNow(new Date(item.updatedAt), { addSuffix: true })}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setEditingWebsiteData(item)
                                  setWebsiteDataForm({
                                    title: item.title,
                                    content: item.content,
                                    category: item.category,
                                    url: item.url || '',
                                  })
                                  setWebsiteDataDialog(true)
                                }}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteWebsiteData(item.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>

            <TabsContent value="faqs" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Frequently Asked Questions</h2>
                <Button
                  onClick={() => {
                    setEditingFaq(null)
                    setFaqForm({ question: '', answer: '', category: '', order: 0, isActive: true })
                    setFaqDialog(true)
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add FAQ
                </Button>
              </div>

              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Question</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Updated</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loadingFaqs ? (
                      [...Array(3)].map((_, i) => (
                        <TableRow key={i}>
                          <TableCell>
                            <Skeleton className="h-4 w-48" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-20" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-16" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-24" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-16" />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : faqs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground">
                          No FAQs yet. Add your first FAQ.
                        </TableCell>
                      </TableRow>
                    ) : (
                      faqs.map((faq) => (
                        <TableRow key={faq.id}>
                          <TableCell className="max-w-xs truncate font-medium">
                            {faq.question}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{faq.category}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={faq.isActive ? 'default' : 'outline'}>
                              {faq.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatDistanceToNow(new Date(faq.updatedAt), { addSuffix: true })}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setEditingFaq(faq)
                                  setFaqForm({
                                    question: faq.question,
                                    answer: faq.answer,
                                    category: faq.category,
                                    order: faq.order,
                                    isActive: faq.isActive,
                                  })
                                  setFaqDialog(true)
                                }}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteFaq(faq.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Dialog open={websiteDataDialog} onOpenChange={setWebsiteDataDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingWebsiteData ? 'Edit Content' : 'Add Content'}</DialogTitle>
            <DialogDescription>
              Add or edit website content for the AI assistant to use.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="wd-title">Title *</Label>
                <Input
                  id="wd-title"
                  value={websiteDataForm.title}
                  onChange={(e) => setWebsiteDataForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="e.g., Admission Requirements"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="wd-category">Category *</Label>
                <Input
                  id="wd-category"
                  value={websiteDataForm.category}
                  onChange={(e) => setWebsiteDataForm((f) => ({ ...f, category: e.target.value }))}
                  placeholder="e.g., Admissions"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="wd-url">URL (optional)</Label>
              <Input
                id="wd-url"
                value={websiteDataForm.url}
                onChange={(e) => setWebsiteDataForm((f) => ({ ...f, url: e.target.value }))}
                placeholder="https://www.sit.edu.au/..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="wd-content">Content *</Label>
              <Textarea
                id="wd-content"
                value={websiteDataForm.content}
                onChange={(e) => setWebsiteDataForm((f) => ({ ...f, content: e.target.value }))}
                placeholder="Enter the content..."
                className="min-h-[200px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setWebsiteDataDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveWebsiteData} disabled={savingWebsiteData}>
              {savingWebsiteData ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={faqDialog} onOpenChange={setFaqDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingFaq ? 'Edit FAQ' : 'Add FAQ'}</DialogTitle>
            <DialogDescription>Add or edit a frequently asked question.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="faq-category">Category *</Label>
                <Input
                  id="faq-category"
                  value={faqForm.category}
                  onChange={(e) => setFaqForm((f) => ({ ...f, category: e.target.value }))}
                  placeholder="e.g., Enrollment"
                />
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <Switch
                  id="faq-active"
                  checked={faqForm.isActive}
                  onCheckedChange={(checked) => setFaqForm((f) => ({ ...f, isActive: checked }))}
                />
                <Label htmlFor="faq-active">Active</Label>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="faq-question">Question *</Label>
              <Input
                id="faq-question"
                value={faqForm.question}
                onChange={(e) => setFaqForm((f) => ({ ...f, question: e.target.value }))}
                placeholder="e.g., How do I apply for admission?"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="faq-answer">Answer *</Label>
              <Textarea
                id="faq-answer"
                value={faqForm.answer}
                onChange={(e) => setFaqForm((f) => ({ ...f, answer: e.target.value }))}
                placeholder="Enter the answer..."
                className="min-h-[150px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFaqDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveFaq} disabled={savingFaq}>
              {savingFaq ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
