import React, { useState } from 'react';
import { Bug, BugFormData, BugFilters as BugFiltersType } from '@/types/bug';
import { useBugs } from '@/hooks/useBugs';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { BugForm } from '@/components/BugForm';
import { BugCard } from '@/components/BugCard';
import { BugFilters } from '@/components/BugFilters';
import { BugStats } from '@/components/BugStats';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Bug as BugIcon, Plus, Search, Filter, BarChart3 } from 'lucide-react';

const Index = () => {
  const { bugs, loading, createBug, updateBug, deleteBug, filterBugs } = useBugs();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<BugFiltersType>({});
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBug, setEditingBug] = useState<Bug | null>(null);

  // Filter bugs based on search term and filters
  const filteredBugs = React.useMemo(() => {
    let result = filterBugs(filters);

    if (searchTerm) {
      result = result.filter(bug =>
        bug.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bug.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bug.assignee.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bug.reporter.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bug.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    return result;
  }, [bugs, searchTerm, filters, filterBugs]);

  const handleCreateBug = async (data: BugFormData) => {
    await createBug(data);
    setIsFormOpen(false);
  };

  const handleUpdateBug = async (data: BugFormData) => {
    if (editingBug) {
      await updateBug(editingBug.id, data);
      setEditingBug(null);
    }
  };

  const handleStatusChange = async (id: string, status: Bug['status']) => {
    await updateBug(id, { status });
  };

  const handleEditBug = (bug: Bug) => {
    setEditingBug(bug);
  };

  const handleDeleteBug = async (id: string) => {
    await deleteBug(id);
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-primary rounded-lg">
                  <BugIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Bug Tracker</h1>
                  <p className="text-muted-foreground">
                    Track and manage bugs with comprehensive testing and debugging
                  </p>
                </div>
              </div>
              <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-primary border-0" data-testid="new-bug-button">
                    <Plus className="mr-2 h-4 w-4" />
                    Report Bug
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Report New Bug</DialogTitle>
                  </DialogHeader>
                  <BugForm onSubmit={handleCreateBug} loading={loading} />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <Tabs defaultValue="bugs" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="bugs" className="flex items-center gap-2">
                <BugIcon className="h-4 w-4" />
                Bug List
              </TabsTrigger>
              <TabsTrigger value="filters" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </TabsTrigger>
              <TabsTrigger value="stats" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Statistics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="bugs" className="space-y-6">
              {/* Search Bar */}
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search bugs by title, description, assignee..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                    data-testid="search-input"
                  />
                </div>
                {(searchTerm || Object.keys(filters).some(key => filters[key as keyof BugFiltersType])) && (
                  <Button variant="outline" onClick={clearFilters} data-testid="clear-search-button">
                    Clear
                  </Button>
                )}
              </div>

              {/* Bug List */}
              {loading ? (
                <div className="grid gap-6">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-64 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredBugs.length === 0 ? (
                    <div className="text-center py-12">
                      <BugIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium text-muted-foreground mb-2">
                        {bugs.length === 0 ? 'No bugs reported yet' : 'No bugs match your search'}
                      </h3>
                      <p className="text-muted-foreground">
                        {bugs.length === 0
                          ? 'Get started by reporting your first bug'
                          : 'Try adjusting your search terms or filters'
                        }
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-6">
                      {filteredBugs.map((bug) => (
                        <BugCard
                          key={bug.id}
                          bug={bug}
                          onStatusChange={handleStatusChange}
                          onEdit={handleEditBug}
                          onDelete={handleDeleteBug}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="filters">
              <BugFilters
                filters={filters}
                onFiltersChange={setFilters}
                onClearFilters={clearFilters}
              />
            </TabsContent>

            <TabsContent value="stats">
              <BugStats bugs={bugs} />
            </TabsContent>
          </Tabs>
        </main>

        {/* Edit Bug Dialog */}
        <Dialog open={!!editingBug} onOpenChange={() => setEditingBug(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Bug</DialogTitle>
            </DialogHeader>
            {editingBug && (
              <BugForm
                onSubmit={handleUpdateBug}
                loading={loading}
                initialData={editingBug}
                isEditing={true}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </ErrorBoundary>
  );
};

export default Index;

